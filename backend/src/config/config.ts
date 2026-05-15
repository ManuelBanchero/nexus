import {
    systemPrompt as indexSytemPrompt,
    formatConfig as indexLLMFormatConfig
} from './IndexLLMConfig.js'

import { systemPrompt as qaSystemPrompt } from './QALLMConfig.js'

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
    llmConfig: LLMConfig,
    qaLocalLlmConfig: LLMConfig,
    qaLlmConfig: LLMConfig
}

const llmConfig: LLMConfig = {
    model: 'gpt-4o-mini',
    systemPrompt: indexSytemPrompt,
    text: {
        format: indexLLMFormatConfig
    }
}

const qaLocalLlmConfig: LLMConfig = {
    model: 'qwen3:8b',
    systemPrompt: qaSystemPrompt
}

const qaLlmConfig: LLMConfig = {
    model: 'gpt-4o-mini',
    systemPrompt: qaSystemPrompt
}

export const config: Config = {
    llmConfig,
    qaLocalLlmConfig,
    qaLlmConfig
}
