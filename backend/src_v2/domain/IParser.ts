import Page from './Page'

export default interface IParser {
    parse(id: string, title: string, content: string): Page
}