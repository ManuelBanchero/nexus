import Page from './Page'

export default interface IParser {
    parse(filename: string, content: string): Page | null
}