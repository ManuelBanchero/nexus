import { systemPrompt, formatConfig } from './LLMConfig.js'

type FormatConfig = {
    [key: string]: string | number | boolean | string[] | FormatConfig
}

type LLMConfig = {
    model: string,
    systemPrompt: string,
    text?: Record<'format', FormatConfig>,
    format?: FormatConfig
}

type Config = {
    llmConfig: LLMConfig
}


const llmConfig: LLMConfig = {
    model: 'gpt-4o-mini',
    systemPrompt,
    text: {
        format: formatConfig
    }
}

export const config: Config = {
    llmConfig
}
