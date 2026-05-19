import IAnswerGenerator from '../domain/IAnswerGenerator.js'

export default class QAEngine {
    constructor(
        private answerGenerator: IAnswerGenerator
    ) { }

    public async *getAnswer(
        content: string,
        userPrompt: string
    ): AsyncGenerator<string, void, void> {
        const prompt = `
        <NOTION PAGE>
        ${content}
        </NOTION PAGE>

        <USER PROMPT>
        ${userPrompt}
        </USER PROMPT>
        `

        yield* this.answerGenerator.getAnswer(prompt)
    }
}