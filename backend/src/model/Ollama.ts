import { LLM, LLMConfig } from "./LLM.js"
import ollama from 'ollama'

type Message = {
    role: string,
    content: string
}

class Ollama extends LLM {
    constructor(config: LLMConfig) {
        super(config)
    }

    public async getResponse<T>(content: string): Promise<string> {
        const response = await ollama.chat({
            ...this.config,
            messages: this.createMessageArray(content)
        })

        return ''
    }

    private createMessageArray(content: string): Message[] {
        return [{
            role: 'user',
            content
        }]
    }
}

export { Ollama } 