import IKeywordExtractor from '../../../domain/IKeywordExtractor.js'
import { GoogleGenAI, Schema } from '@google/genai'

export default class GeminiKeywordExtractor implements IKeywordExtractor {
    constructor(
        private readonly instructions: string,
        private readonly schema: Schema,
        private readonly client: GoogleGenAI,
        private readonly model: string
    ) { }
    public async extractKeywords(content: string): Promise<string[]> {
        try {
            const response = await this.client.models.generateContent({
                model: this.model,
                contents: content,
                config: {
                    systemInstruction: this.instructions,
                    responseSchema: this.schema
                }
            })

            if (!response.text)
                throw new Error('Gemini returned an empty response')

            const parsedData = JSON.parse(response.text)
            if (
                parsedData &&
                typeof parsedData === 'object' &&
                Array.isArray(parsedData.keywords) &&
                parsedData.keywords.every((item: any) => typeof item === 'string')
            ) {
                return parsedData.keywords
            }

            throw new SyntaxError('The returned JSON does not match with the expected format')
        } catch (error) {
            if (error instanceof Error)
                throw new Error(error.message)
            throw error
        }
    }
}