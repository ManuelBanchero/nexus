import Page from './Page'

export default interface IPageRepository {
    getPages(): Promise<Page[]>
}