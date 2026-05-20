import QAEngine from '../application/QAEngine.js'
import SearchEngine from '../application/SearchEngine.js'
import Page from '../domain/Page.js'

export default class AppController {
    constructor(
        private readonly searchEngine: SearchEngine,
        private readonly qaEngine: QAEngine
    ) { }

    /* SEARCH ENGINE METHODS */

    public completePrefix(prefix: string): string[] {
        return this.searchEngine.getWordsWithPrefix(prefix)
    }

    public search(word: string): Page[] {
        return this.searchEngine.search(word)
    }

    public getPageChildren(page: Page): Page[] {
        return this.searchEngine.getPagesById(new Set(page.childrenIds))
    }

    public isWorkspaceIndexed(): boolean {
        return this.searchEngine.isWorkspaceIndexed()
    }

    public async indexWorkspace(): Promise<void> {
        this.searchEngine.indexPages()
    }

    public async createEngine(): Promise<void> {
        this.searchEngine.createEngine()
    }

    public async setIsIndexed(value: boolean) {
        return this.searchEngine.setIsIndexed(value)
    }

    public getNumberOfUnindedexPages(): number {
        return this.searchEngine.getNumberOfUnindexedPages()
    }

    public async indexMissingPages(): Promise<void> {
        this.searchEngine.retryFailedPages()
    }

    /* QA CONTROLLER METHODS */

    public async *getChatCompletion(
        pageContent: string,
        userPrompt: string
    ): AsyncGenerator<string, void, void> {
        yield* this.qaEngine.getAnswer(pageContent, userPrompt)
    }
}