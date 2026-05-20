import { FormatConfig } from "../../../config/ExtractKeywordsConfig.js"
import IKeywordExtractor from "../../../domain/IKeywordExtractor.js"
import type OpenAISDK from 'openai'

export default class OpenAIKeywordExtractor implements IKeywordExtractor {
    constructor(
        private readonly instructions: string,
        private readonly format: FormatConfig,
        private readonly client: OpenAISDK,
        private readonly model: string
    ) { }

    async extractKeywords(content: string): Promise<string[]> {
        try {
            const response = await this.client.responses.create({
                model: this.model,
                instructions: this.instructions,
                input: content,
                text: this.format
            })

            const parsedData = JSON.parse(response.output_text)
            if (
                parsedData &&
                typeof parsedData === 'object' &&
                Array.isArray(parsedData.keywords) &&
                parsedData.keywords.every((item: any) => typeof item === 'string')
            ) {
                // Data structure is correct -> return content
                return parsedData.keywords
            }

            throw new SyntaxError('The returned JSON does not match with the expected format')
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new Error(e.message)
            }
            throw e
        }
    }
}