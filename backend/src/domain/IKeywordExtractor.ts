export default interface IKeywordExtractor {
    extractKeywords(content: string): Promise<string[]>
}