import Page from './Page.js'

export default interface IPageRepository {
    getPages(): Promise<Page[]>
}