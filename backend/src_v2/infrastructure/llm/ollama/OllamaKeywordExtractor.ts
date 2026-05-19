import IKeywordExtractor from '../../../domain/IKeywordExtractor.js'
import ollama from 'ollama'

export default class OllamaKeywordExtractor implements IKeywordExtractor {
    constructor(private readonly model: string) { }

    extractKeywords(content: string): Promise<string[]> {
        throw new Error("Method not implemented.");
    }

}