import { qaConfig } from './QAConfig.js'
import { extractKeywordsConfig } from './ExtractKeywordsConfig.js'
import { Type, Schema } from "@google/genai"

const schema: Schema = {
    type: Type.OBJECT,
    properties: {
        keywords: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            minItems: "20",
            maxItems: "20",
            description: "Array de exactamente 20 keywords"
        }
    },
    required: ["keywords"]
}

export type GeminiQAConfig = {
    systemPrompt: string
}

export type GeminiExtractKeysConfig = {
    systemPrompt: string,
    formatConfig: Schema
}

export const geminiQAConfig: GeminiQAConfig = {
    systemPrompt: qaConfig.systemPrompt
}

export const geminiExtractKeysConfig: GeminiExtractKeysConfig = {
    systemPrompt: extractKeywordsConfig.systemPrompt,
    formatConfig: schema
}