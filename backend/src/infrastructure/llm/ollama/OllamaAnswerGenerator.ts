import IAnswerGenerator from '../../../domain/IAnswerGenerator.js'
import ollama from 'ollama'
import { Message } from 'ollama'

export default class OllamaAnswerGenerator implements IAnswerGenerator {
    private _messages: Message[] = []
    constructor(
        private readonly model: string,
        private readonly systemPrompt: string
    ) {
        this.initMessages()
    }

    public async *getAnswer(prompt: string): AsyncGenerator<string, void, void> {
        let stream

        try {
            stream = await ollama.chat({
                model: this.model,
                messages: [...this._messages, { role: 'user', content: prompt }],
                stream: true
            })

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to initialice ollama client'
            throw new Error(`[LLM Initialization Error] ${message}`)
        }
        try {
            for await (const chunk of stream)
                yield chunk.message.content
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Connection interrupted during streaming'
            throw new Error(`[LLM Stream Error] ${message}`)
        }
    }

    private initMessages() {
        this._messages = [{
            role: 'system',
            content: this.systemPrompt
        }]
    }
}