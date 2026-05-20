import IAnswerGenerator from '../../../domain/IAnswerGenerator.js'
import LLMFactory from './LLMFactory.js'
import OllamaAnswerGenerator from '../ollama/OllamaAnswerGenerator.js'
import IKeywordExtractor from '../../../domain/IKeywordExtractor.js'
import OllamaKeywordExtractor from '../ollama/OllamaKeywordExtractor.js'
import { FormatConfig } from '../../../config/ExtractKeywordsConfig.js'

export default class OllamaFactory extends LLMFactory {
    constructor(
        private readonly qaSystemPrompt: string,
        private readonly extractKeysSystemPrompt: string,
        private readonly extractKeysFormatConfig: FormatConfig,
        private readonly model: string,
    ) {
        super()
    }

    public createAnswerGenerator(): IAnswerGenerator {
        return new OllamaAnswerGenerator(this.model, this.qaSystemPrompt)
    }

    public createKeywordExtractor(): IKeywordExtractor {
        return new OllamaKeywordExtractor(
            this.model,
            this.extractKeysSystemPrompt,
            this.extractKeysFormatConfig
        )
    }
}