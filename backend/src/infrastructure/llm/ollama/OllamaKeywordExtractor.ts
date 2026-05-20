import { FormatConfig } from '../../../config/ExtractKeywordsConfig.js';
import IKeywordExtractor from '../../../domain/IKeywordExtractor.js'
import ollama, { Message } from 'ollama'

export default class OllamaKeywordExtractor implements IKeywordExtractor {
    private _messages: Message[] = []
    constructor(
        private readonly model: string,
        private readonly systemPrompt: string,
        private readonly format: FormatConfig
    ) {
        this.initMessages()
    }

    public async extractKeywords(content: string): Promise<string[]> {
        try {
            const response = await ollama.chat({
                model: this.model,
                messages: [...this._messages, { role: 'user', content }],
                format: this.format
            })

            const parsedData = JSON.parse(response.message.content)
            // Verify the data structured of the response
            if (
                parsedData &&
                typeof parsedData === 'object' &&
                Array.isArray(parsedData.keywords) &&
                parsedData.keywords.every((item: any) => typeof item === 'string')
            ) {
                // Data estructure is correct -> return content
                return parsedData.keywords
            }

            throw new SyntaxError('The returned JSON does not match with the format')
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new Error(e.message)
            }
            throw e
        }
    }

    private initMessages() {
        this._messages = [{
            role: 'system',
            content: this.systemPrompt
        }]
    }

}