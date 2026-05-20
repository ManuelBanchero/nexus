import Page from './Page.js'

export default interface IParser {
    parse(filename: string, content: string): Page | null
}