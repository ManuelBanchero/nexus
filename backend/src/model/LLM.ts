import ollama from 'ollama'

type LLMConfig = {
    model: string,
    prompt: string,
    format?: string
}

abstract class LLM {
    constructor(
        protected readonly config: LLMConfig
    ) { }

    public abstract getResponse(content: string): Promise<string>
}

export { LLM, LLMConfig }