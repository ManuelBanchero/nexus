import QAEngine from '../../application/QAEngine.js'
import SearchEngine from '../../application/SearchEngine.js'
import Page from '../../domain/Page.js'
import { Result } from '../../shared/Result.js'

export default class AppController {
    constructor(
        private readonly searchEngine: SearchEngine,
        private readonly qaEngine: QAEngine
    ) { }

    /* SEARCH ENGINE METHODS */

    public completePrefix(prefix: string): string[] {
        return this.searchEngine.getWordsWithPrefix(prefix)
    }

    public search(word: string): Result<Page[]> {
        try {
            return { success: true, value: this.searchEngine.search(word) }
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) }
        }
    }

    public getPageChildren(page: Page): Page[] {
        return this.searchEngine.getPagesById(new Set(page.childrenIds))
    }

    public isWorkspaceIndexed(): boolean {
        return this.searchEngine.isWorkspaceIndexed()
    }

    public async indexWorkspace(): Promise<Result<void>> {
        try {
            await this.searchEngine.indexPages()
            return { success: true }
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) }
        }
    }

    public async createEngine(): Promise<Result<void>> {
        try {
            await this.searchEngine.createEngine()
            return { success: true }
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) }
        }
    }

    public async setIsIndexed(value: boolean) {
        return this.searchEngine.setIsIndexed(value)
    }

    public getNumberOfUnindexedPages(): number {
        return this.searchEngine.getNumberOfUnindexedPages()
    }

    public async indexMissingPages(): Promise<Result<void>> {
        try {
            await this.searchEngine.retryFailedPages()
            return { success: true }
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) }
        }
    }

    /* QA CONTROLLER METHODS */

    public async *getChatCompletion(
        pageContent: string,
        userPrompt: string
    ): AsyncGenerator<string, void, void> {
        yield* this.qaEngine.getAnswer(pageContent, userPrompt)
    }

    /* PRIVATE METHODS */

    private getErrorMessage(error: unknown): string {
        return error instanceof Error
            ? error.message
            : 'Unexpected error'
    }
}