import IKeywordExtractor from '../domain/IKeywordExtractor'
import IPageRepository from '../domain/IPageRepository'
import ISearchIndex from '../domain/ISearchIndex'
import IPersistenceManager from '../domain/IPersistenceManager'
import Page from '../domain/Page'

export default class SearchEngine {
    private _pagesCache: Map<string, Page>
    constructor(
        private readonly searchIndex: ISearchIndex,
        private readonly keywordExtractor: IKeywordExtractor,
        private readonly pageRepository: IPageRepository,
        private readonly persistenceManager: IPersistenceManager,
    ) {
        this._pagesCache = new Map()
    }


    public async indexPages(): Promise<void | Error> {
        return
    }

    public async indexMissingPages(): Promise<void | Error> {
        return
    }

    public isWorkspaceIndexed(): boolean {
        return true
    }

    public setIsIndexed(value: boolean) {
        return
    }

    public createEngine(): void | Error {
        return
    }

    public search(word: string): Page[] {
        return []
    }

    public getWordsWithPrefix(prefix: string): string[] {
        return []
    }

    public getPagesById(ids: Set<string>): Page[] {
        return []
    }
}