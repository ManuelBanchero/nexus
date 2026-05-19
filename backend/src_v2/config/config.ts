import { ollamaExtractKeysConfig, OllamaExtractKeysConfig, ollamaQAConfig, OllamaQAConfig } from './OllamaConfig.js'
import { openAIExtractKeysConfig, OpenAIExtractKeysConfig, openAIQAConfig, OpenAIQAConfig } from './OpenAIConfig.js'

export type LLMsConfig = {
    openAI: {
        qa: OpenAIQAConfig,
        extractKeywords: OpenAIExtractKeysConfig
    },
    ollama: {
        qa: OllamaQAConfig,
        extractKeywrods: OllamaExtractKeysConfig
    }
}

export const llmsConfig: LLMsConfig = {
    openAI: {
        qa: openAIQAConfig,
        extractKeywords: openAIExtractKeysConfig
    },
    ollama: {
        qa: ollamaQAConfig,
        extractKeywrods: ollamaExtractKeysConfig
    }
}