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
        const stream = await ollama.chat({
            model: this.model,
            messages: [...this._messages, { role: 'user', content: prompt }],
            stream: true
        })

        for await (const chunk of stream) {
            yield chunk.message.content
        }
    }

    private initMessages() {
        this._messages = [{
            role: 'system',
            content: this.systemPrompt
        }]
    }
}