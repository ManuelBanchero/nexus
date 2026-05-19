import IAnswerGenerator from '../../../domain/IAnswerGenerator.js'
import LLMFactory from './LLMFactory.js'
import OllamaAnswerGenerator from '../ollama/OllamaAnswerGenerator.js'
import IKeywordExtractor from '../../../domain/IKeywordExtractor.js'
import OllamaKeywordExtractor from '../ollama/OllamaKeywordExtractor.js'

export default class OllamaFactory extends LLMFactory {
    constructor(private readonly model: string) {
        super()
    }

    public createAnswerGenerator(): IAnswerGenerator {
        return new OllamaAnswerGenerator(this.model)
    }

    public createKeywordExtractor(): IKeywordExtractor {
        return new OllamaKeywordExtractor(this.model)
    }
}