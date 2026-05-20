import { extractKeywordsConfig, FormatConfig } from './ExtractKeywordsConfig.js'
import { qaConfig } from './QAConfig.js'

export type OllamaQAConfig = {
    systemPrompt: string
}

export type OllamaExtractKeysConfig = {
    systemPrompt: string,
    formatConfig: FormatConfig
}

export const ollamaQAConfig: OllamaQAConfig = {
    systemPrompt: qaConfig.systemPrompt
}

export const ollamaExtractKeysConfig: OllamaExtractKeysConfig = {
    systemPrompt: extractKeywordsConfig.systemPrompt,
    formatConfig: {
        type: 'object',
        properties: {
            keywords: {
                type: 'array',
                items: {
                    type: 'string'
                },
                minItems: 20,
                maxItems: 20
            }
        },
        required: ['keywords'],
        additionalProperties: false
    }
}