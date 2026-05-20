import { extractKeywordsConfig } from './ExtractKeywordsConfig.js'
import { qaConfig } from './QAConfig.js'
import { ResponseFormatTextJSONSchemaConfig } from 'openai/resources/responses/responses.mjs'

export type OpenAIQAConfig = {
    instructions: string
}

export type OpenAIExtractKeysConfig = {
    instructions: string,
    response_format: ResponseFormatTextJSONSchemaConfig
}

export const openAIQAConfig: OpenAIQAConfig = {
    instructions: qaConfig.systemPrompt
}

export const openAIExtractKeysConfig: OpenAIExtractKeysConfig = {
    instructions: extractKeywordsConfig.systemPrompt,
    response_format: {
        type: 'json_schema',
        name: 'keywords_schema',
        strict: true,
        schema: {
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
}