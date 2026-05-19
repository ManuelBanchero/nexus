import { extractKeywordsConfig, FormatConfig } from './ExtractKeywordsConfig.js'
import { qaConfig } from './QAConfig.js'

export type OpenAIQAConfig = {
    instructions: string
}

export type OpenAIExtractKeysConfig = {
    instructions: string,
    response_format: FormatConfig
}

export const openAIQAConfig: OpenAIQAConfig = {
    instructions: qaConfig.systemPrompt
}

export const openAIExtractKeysConfig: OpenAIExtractKeysConfig = {
    instructions: extractKeywordsConfig.systemPrompt,
    response_format: extractKeywordsConfig.formatConfig
}