import IAnswerGenerator from '../domain/IAnswerGenerator.js'

export default class QAEngine {
    constructor(
        private answerGenerator: IAnswerGenerator
    ) { }

    public async *getAnswer(
        content: string,
        userPrompt: string
    ): AsyncGenerator<string, void, void> {
        try {
            const prompt = `
            <NOTION PAGE>
            ${content}
            </NOTION PAGE>
    
            <USER PROMPT>
            ${userPrompt}
            </USER PROMPT>
            `

            yield* this.answerGenerator.getAnswer(prompt)
        } catch (e) {
            throw e instanceof Error ? e : new Error('An error has ocurred during the getAnswer stream')
        }
    }
}