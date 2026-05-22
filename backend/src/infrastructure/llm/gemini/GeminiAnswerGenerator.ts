import IAnswerGenerator from '../../../domain/IAnswerGenerator.js'
import { GoogleGenAI } from '@google/genai'

export default class GeminiAnswerGenerator implements IAnswerGenerator {
    constructor(
        private readonly instructions: string,
        private readonly client: GoogleGenAI,
        private readonly model: string
    ) { }

    public async *getAnswer(prompt: string): AsyncGenerator<string, void, void> {
        let stream

        try {
            stream = await this.client.models.generateContentStream({
                model: this.model,
                contents: prompt,
                config: {
                    systemInstruction: this.instructions
                }
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to initialize Gemini stream'
            throw new Error(`[LLM Initialization Error] ${message}`)
        }

        try {
            for await (const chunk of stream) {
                const content = chunk.text
                if (!content) continue

                yield content
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Connection interrumpted during streaming'
            throw new Error(`[LLM Stream Error] ${message}`)
        }
    }
}