import IAnswerGenerator from '../../../domain/IAnswerGenerator.js'
import OpenAISDK from 'openai'

export default class OpenAIAnswerGenerator implements IAnswerGenerator {
    constructor(
        private readonly instructions: string,
        private readonly client: OpenAISDK,
        private readonly model: string
    ) { }

    public async *getAnswer(prompt: string): AsyncGenerator<string, void, void> {
        let stream

        try {
            stream = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: this.instructions },
                    { role: 'user', content: prompt }
                ],
                stream: true
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to initialize OpenAI stream'
            throw new Error(`[LLM Initialization Error] ${message}`)
        }

        try {
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content
                if (!content) continue

                yield content
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Connection interrupted during streaming'
            throw new Error(`[LLM Stream Error] ${message}`)
        }
    }
}