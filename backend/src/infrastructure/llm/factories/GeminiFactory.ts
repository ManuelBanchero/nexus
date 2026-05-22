import IAnswerGenerator from '../../../domain/IAnswerGenerator.js'
import LLMFactory from './LLMFactory.js'
import IKeywordExtractor from '../../../domain/IKeywordExtractor.js'
import GeminiAnswerGenerator from '../gemini/GeminiAnswerGenerator.js'
import GeminiKeywordExtractor from '../gemini/GeminiAIKeywordExtractor.js'
import { GoogleGenAI, Schema } from '@google/genai'

export default class GeminiFactory extends LLMFactory {
    private client: GoogleGenAI
    constructor(
        private readonly qaSystemPrompt: string,
        private readonly extractKeysSystemPrompt: string,
        private readonly extractKeysSchema: Schema,
        private readonly model: string,
        private readonly apiKey: string
    ) {
        super()
        this.client = new GoogleGenAI({ apiKey: this.apiKey })
    }

    public createAnswerGenerator(): IAnswerGenerator {
        return new GeminiAnswerGenerator(this.qaSystemPrompt, this.client, this.model)
    }
    public createKeywordExtractor(): IKeywordExtractor {
        return new GeminiKeywordExtractor(
            this.extractKeysSystemPrompt,
            this.extractKeysSchema,
            this.client,
            this.model
        )
    }

}