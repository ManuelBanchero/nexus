import IAnswerGenerator from '../domain/IAnswerGenerator.js'
import LLMFactory from './LLMFactory.js'
import OllamaAnswerGenerator from '../interface/OllamaAnswerGenerator.js'
import IKeywordExtractor from '../domain/IKeywordExtractor.js'
import OllamaKeywordExtractor from '../interface/OllamaKeywordExtractor.js'

export default class OllamaFactory extends LLMFactory {
    constructor(private readonly model: string) {
        super()
    }

    public factoryAnswerGenerator(): IAnswerGenerator {
        return new OllamaAnswerGenerator(this.model)
    }

    public factoryKeywordExtractor(): IKeywordExtractor {
        return new OllamaKeywordExtractor(this.model)
    }
}