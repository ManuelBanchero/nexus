import { Response } from './types/Response.js'

type Message = {
    role: string,
    content: string
}

type FormatType = {
    [key: string]: string | string[] | Boolean | number | FormatType
}

type LLMConfig = {
    model: string,
    systemPrompt: string,
    format?: FormatType,
    reasoning?: { effort: 'low' | 'medium' | 'high' },
    text?: any
}

abstract class LLM {
    constructor(
        protected readonly config: LLMConfig
    ) { }

    public abstract getResponse(prompt: string): Promise<string>
    public abstract getSchemaResponse(prompt: string): Promise<Response>
}

export { LLM, LLMConfig, FormatType, Message }