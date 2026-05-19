import IKeywordExtractor from '../domain/IKeywordExtractor.js'
import IPageRepository from '../domain/IPageRepository.js'
import ISearchIndex from '../domain/ISearchIndex.js'
import IPersistenceManager from '../domain/IPersistenceManager.js'
import Page from '../domain/Page.js'
import Workspace from '../domain/Workspace.js'

export default class SearchEngine {
    private _workspaceCache: Workspace
    private _isIndexed: boolean
    private _failedIndexedPages: string[]

    constructor(
        private readonly searchIndex: ISearchIndex,
        private readonly keywordExtractor: IKeywordExtractor,
        private readonly pageRepository: IPageRepository,
        private readonly persistenceManager: IPersistenceManager,
    ) {
        this._workspaceCache = { pages: new Map<string, Page>() }
        this._isIndexed = false
        this._failedIndexedPages = []
    }

    /* 
        GETTERS
    */

    get failedIndexedPages(): string[] {
        return this._failedIndexedPages
    }

    get isIndexed(): boolean {
        return this._isIndexed
    }

    /* 
        PUBLIC METHODS
    */

    public async indexPages(): Promise<void | Error> {
        try {
            await this.getCache()
            if (this.workspaceIsEmpty())
                throw new Error('There are not pages on workspace cache')

            await this.indexWorkspace()
        } catch (error) {
            console.error(error)
            this.throwError(error)
        }
    }

    public async retryFailedPages(): Promise<void> {
        const pagesIndexed: string[] = []
        for (const id of this._failedIndexedPages) {
            const page: Page | undefined = this.getPageById(id)
            if (!page)
                throw new Error('The page you are trying to access does not exists')

            try {
                await this.indexPage(id, page)
                pagesIndexed.push(id)
            } catch (_error) {
                console.error(`Error trying to index page with id ${id}`)
            }
        }

        await this.updateWorkspaceCache()
        for (const id of pagesIndexed) {
            const index = this._failedIndexedPages.indexOf(id)
            if (index === -1) continue
            this._failedIndexedPages.splice(index, 1) // delete it from the list
        }
    }

    public isWorkspaceIndexed(): boolean {
        for (const page of this._workspaceCache.pages.values())
            if (page.keywords.length > 0) return true
        return false
    }

    public setIsIndexed(value: boolean) {
        this._isIndexed = value
    }

    public async createEngine(): Promise<void> {
        await this.getCache()

        if (this.workspaceIsEmpty())
            throw new Error('Workspace has no pages')

        if (!this.isWorkspaceIndexed())
            throw new Error('Workspace is not indexed')

        for (const page of this._workspaceCache.pages.values())
            for (const keyword of page.keywords)
                this.addWordToEngine(keyword, page.id)
    }

    public search(word: string): Page[] {
        const pageIds = this.searchIndex.getWordValues<string>(word)
        if (!pageIds)
            throw new Error(`No results for word: ${word}`)

        return this.getPagesById(pageIds)
    }

    public getWordsWithPrefix(prefix: string): string[] {
        return this.searchIndex.wordsWithPrefix(prefix)
    }

    /*
        PRIVATE METHODS
    */

    private throwError(error: unknown): never {
        throw error instanceof Error
            ? error
            : new Error('Unexpected error has ocurred')
    }

    private async indexPage(id: string, page: Page): Promise<void> {
        const keywords = await this.extractKeywords(page.content)
        keywords.push(page.title)
        page.keywords = keywords
        this.updatePage(id, page)
    }

    private updatePage(id: string, page: Page): void {
        this._workspaceCache.pages.set(id, page)
    }

    private getPageById(id: string): Page | undefined {
        return this._workspaceCache.pages.get(id)
    }

    private async indexWorkspace() {
        await this.handleIndex()
        await this.updateWorkspaceCache()
        this.setIsIndexed(true)
    }

    private async handleIndex() {
        const BATCH_SIZE = 10

        const keys = Array.from(this._workspaceCache.pages.keys())

        for (let i = 0; i < keys.length; i += BATCH_SIZE) {
            const batch = keys.slice(i, i + BATCH_SIZE)
            console.log(`Processing batch from ${i} to ${i + BATCH_SIZE}`)

            await Promise.all(
                batch.map(async key => {
                    const page: Page | undefined = this._workspaceCache.pages.get(key)
                    if (!page) return

                    try {
                        await this.indexPage(key, page)
                    } catch (error) {
                        console.log(error)
                        this.addToFailedIndexedPages(page.id)
                    }

                })
            )

            if (i + BATCH_SIZE < keys.length)
                await new Promise(resolve => setTimeout(resolve, 1000))
        }

        console.log('Index has finished ✅')
    }

    private addToFailedIndexedPages(id: string) {
        this._failedIndexedPages.push(id)
    }

    private async extractKeywords(content: string): Promise<string[]> {
        return await this.keywordExtractor.extractKeywords(content)
    }

    private workspaceIsEmpty() {
        return this._workspaceCache.pages.size === 0
    }

    private async getCache(): Promise<Workspace> {
        const cache = await this.persistenceManager.getCache<Page[]>()

        if (!cache) await this.createCache()
        else this.addPagesToWorkspace(cache)

        return this._workspaceCache
    }

    private async createCache() {
        const pages: Page[] = await this.pageRepository.getPages()
        this.addPagesToWorkspace(pages)
        await this.persistenceManager.writeCache<Page[]>(pages)
    }

    private async updateWorkspaceCache(): Promise<void> {
        await this.persistenceManager.writeCache<Page[]>(this.PagesMapToArray())
    }

    private addPagesToWorkspace(pages: Page[]): void {
        this._workspaceCache.pages = this.createPagesMap(pages)
    }

    private createPagesMap(pages: Page[]): Map<string, Page> {
        const pagesMap: Map<string, Page> = new Map<string, Page>()
        for (const page of pages) {
            pagesMap.set(page.id, page)
        }

        return pagesMap
    }

    private PagesMapToArray(): Page[] {
        return [...this._workspaceCache.pages.values()]
    }

    private addWordToEngine(word: string, pageId: string) {
        this.searchIndex.addWord(word, pageId)
    }

    private getPagesById(pageIds: Set<string>): Page[] {
        const pages: Page[] = []
        for (const pageId of pageIds) {
            const page: Page | undefined = this._workspaceCache.pages.get(pageId)
            page && pages.push(page)
        }

        return pages
    }
}