import { LLM } from '../lowLevelClasses/LLM/LLM.js'

class QAEngine {
    constructor(
        private llm: LLM
    ) { }

    public async *getChatCompletion(pageContent: string, userPrompt: string): AsyncGenerator<string, void, void> {
        const prompt = `Context: ${pageContent}\n\nUser prompt: ${userPrompt}`
        yield* this.llm.getResponseStream(prompt)
    }
}

export { QAEngine }