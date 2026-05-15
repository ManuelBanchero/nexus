import { LLM, LLMConfig } from '../LLM/LLM.js'
import { Response } from '../../types/Response.js'
import OpenAISdk from 'openai'


class OpenAI extends LLM {
    private client: OpenAISdk

    constructor(config: LLMConfig, apiKey: string) {
        super(config)
        this.client = new OpenAISdk({ apiKey, maxRetries: 0, timeout: 15000 })
    }

    public async getResponse(prompt: string): Promise<string | any> {
        const { systemPrompt, text, ...config } = this.config

        const clientConfig = {
            ...config,
            instructions: systemPrompt,
            input: prompt
        }
        try {
            const response = await this.client.responses.create(clientConfig)

            return response.output_text
        } catch (error) {
            console.error(error)
        }

    }

    public async getSchemaResponse(prompt: string): Promise<Response> {
        const { systemPrompt, ...config } = this.config

        const clientConfig = {
            ...config,
            instructions: systemPrompt,
            input: prompt
        }

        try {
            const response = await this.client.responses.create(clientConfig)
            return {
                success: true,
                data: JSON.parse(response.output_text)
            }
        } catch (error) {
            console.error(error)
            return {
                success: false,
                error: `${error}`
            }
        }
    }

    public async *getResponseStream(prompt: string): AsyncGenerator<string, void, void> {
        console.log('Getting answer w/ OpenAI')
        const { systemPrompt, model } = this.config

        try {
            const stream = await this.client.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                stream: true
            })

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content
                if (!content) continue

                yield content
            }
        } catch (error) {
            console.error(error)
        }
    }
}

export { OpenAI }