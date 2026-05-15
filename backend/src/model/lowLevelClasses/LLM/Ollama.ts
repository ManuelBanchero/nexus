import { LLM, LLMConfig, Message } from './LLM.js'
import { Response } from '../../types/Response.js'
import ollama from 'ollama'

class Ollama extends LLM {
    constructor(
        config: LLMConfig,
        private messages: Message[] = []
    ) {
        super(config)
        this.addToLLMMessages('system', config.systemPrompt)
    }

    public async getResponse(prompt: string): Promise<string> {
        return ''
    }

    public async *getResponseStream(prompt: string): AsyncGenerator<string, void, void> {
        const { model } = this.config
        this.addToLLMMessages('user', prompt)

        const response = await ollama.chat({
            model,
            messages: this.messages,
            stream: true
        })

        for await (const chunk of response) {
            yield chunk.message.content
        }
    }

    public async getSchemaResponse(prompt: string): Promise<Response> {
        return { success: false }
    }

    private addToLLMMessages(role: 'system' | 'user', prompt: string) {
        this.messages.push({
            role,
            content: prompt
        })
    }
}

export { Ollama }