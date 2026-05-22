import IAnswerGenerator from '../../../domain/IAnswerGenerator.js'
import IKeywordExtractor from '../../../domain/IKeywordExtractor.js'
import OpenAIAnswerGenerator from '../openai/OpenAIAnswerGenerator.js'
import OpenAIKeywordExtractor from '../openai/OpenAIKeywordExtractor.js'
import LLMFactory from './LLMFactory.js'
import OpenAISDK from 'openai'
import type { ResponseFormatTextJSONSchemaConfig } from 'openai/resources/responses/responses.mjs'

export default class OpenAIFactory extends LLMFactory {
    private client: OpenAISDK

    constructor(
        private readonly qaInstructions: string,
        private readonly extractKeysInstructions: string,
        private readonly formatConfig: ResponseFormatTextJSONSchemaConfig,
        private readonly model: string,
        private readonly apiKey: string
    ) {
        super()
        this.client = new OpenAISDK({ apiKey: this.apiKey, maxRetries: 0, timeout: 15000 })
    }

    public createAnswerGenerator(): IAnswerGenerator {
        return new OpenAIAnswerGenerator(
            this.qaInstructions,
            this.client,
            this.model
        )
    }

    public createKeywordExtractor(): IKeywordExtractor {
        return new OpenAIKeywordExtractor(
            this.extractKeysInstructions,
            this.formatConfig,
            this.client,
            this.model
        )
    }
}