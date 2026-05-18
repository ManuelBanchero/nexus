import Page from './Page'

export default interface IParser {
    parse(id: string, content: string): Page
}