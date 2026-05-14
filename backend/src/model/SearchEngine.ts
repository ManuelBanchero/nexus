import { LLM } from './LLM.js'
import { Page } from './types/Page.js'
import { Workspace } from './Workspace.js'
import { Response } from './types/Response.js'
import { Trie } from './Trie.js'

class SearchEngine {
    constructor(
        private readonly llm: LLM,
        private readonly workspace: Workspace,
        private trie: Trie = new Trie()
    ) { }

    public isWorkspaceIndexed(): boolean {
        return this.workspace.indexed
    }

    public setIsIndexed(value: boolean) {
        this.workspace.setIsIndexed(value)
    }

    public async indexPages(): Promise<Response> {
        const pages: Page[] | null = this.workspace.pagesCache
        if (!pages || pages.length === 0) {
            return {
                success: false,
                error: 'There are not pages on pagesCache'
            }
        }

        const indexedPages = await this.handleIndex(pages)

        // Uncomment this line if you want to test the indexMissingPages feature
        // this.forceError(indexedPages)

        this.workspace.updatePagesCache(indexedPages)

        return { success: true }
    }

    private forceError(pages: Page[]) {
        pages[0] = {
            ...pages[0],
            keywords: []
        }

        pages[1] = {
            ...pages[1],
            keywords: []
        }
    }

    public async indexMissingPages(): Promise<Response> {
        const unindexedPages: Page[] = this.workspace.getUnindexedPages()
        if (unindexedPages.length === 0)
            return { success: false, error: 'All pages has been indexed' }

        const indexedPages = await this.handleIndex(unindexedPages)
        const pages: Page[] = this.workspace.pagesCache || []

        for (const page of indexedPages) {
            const pageIndex = pages.findIndex(p => p.id === page.id)
            if (pageIndex === -1)
                continue
            pages[pageIndex] = page
        }

        this.workspace.updatePagesCache(pages)

        return { success: true }
    }

    private async handleIndex(pages: Page[]): Promise<Page[]> {
        const BATCH_SIZE = 10
        const indexedPages = []

        for (let i = 0; i < pages.length; i += BATCH_SIZE) {
            const batch = pages.slice(i, i + BATCH_SIZE)
            console.log(`Processing batch from ${i} to ${i + BATCH_SIZE}`)

            const batchResults = await Promise.all(
                batch.map(async page => {
                    const response = await this.llm.getSchemaResponse(page.content)
                    if (!response.success || !response.data) {
                        console.error('Error getting keys on page: ', page.title)
                        return page
                    }

                    const keywords: string[] = response.data.keywords
                    keywords.push(page.title)

                    page.keywords = keywords

                    return page
                })
            )

            indexedPages.push(...batchResults)

            if (i + BATCH_SIZE < pages.length)
                await new Promise(resolve => setTimeout(resolve, 1000)) // wait for 1 second btw each batch
        }

        return indexedPages
    }

    public createTrie(): Response {
        const pages: Page[] | null = this.workspace.pagesCache
        if (!pages)
            return { success: false, error: 'There are not pages uploaded' }

        for (const page of pages) {
            for (const keyword of page.keywords) {
                this.trie.add(keyword, page.id)
            }
        }

        return { success: true }
    }

    public search(word: string): Response {
        const pageIds = this.trie.getWordValues(word)
        if (!pageIds)
            return { success: false, error: 'There are not pages with that word' }

        return { success: true, data: this.getPagesByIds(pageIds) }
    }

    public getWordsWithPrefix(prefix: string): string[] {
        return this.trie.wordsWithPrefix(prefix)
    }

    public getPagesByIds(ids: Set<string>): Page[] {
        const pages: Page[] = []
        for (const id of ids) {
            const page: Page | undefined = this.workspace.getPageById(id)
            page && pages.push(page)
        }
        return pages
    }

    public getNumberOfUnindexedPages() {
        return this.workspace.getNumberOfUnindexedPages()
    }

    public printTrie() {
        this.trie.printRoot()
    }
}

export { SearchEngine }