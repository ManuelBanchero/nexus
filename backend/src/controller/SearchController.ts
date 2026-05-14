import { SearchEngine } from "../model/SearchEngine.js";
import { Page } from "../model/types/Page.js";
import { Response } from "../model/types/Response.js";

class SearchController {
    constructor(
        private readonly searchEngine: SearchEngine
    ) { }

    public completePrefix(prefix: string): string[] {
        return this.searchEngine.getWordsWithPrefix(prefix)
    }

    public search(word: string): Response {
        return this.searchEngine.search(word)
    }

    public getPageChildren(page: Page): Page[] {
        return this.searchEngine.getPagesByIds(new Set(page.childrenIds))
    }

    public isWorkspaceIndexed(): boolean {
        return this.searchEngine.isWorkspaceIndexed()
    }

    public async indexWorkspace(): Promise<Response> {
        return this.searchEngine.indexPages()
    }

    public async setIsIndexed(value: boolean) {
        return this.searchEngine.setIsIndexed(value)
    }

}

export { SearchController }