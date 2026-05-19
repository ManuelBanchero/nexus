import IAnswerGenerator from '../domain/IAnswerGenerator.js'

export default class OpenAIAnswerGenerator implements IAnswerGenerator {
    constructor(
        private readonly apiKey: string,
    ) { }

    getAnswer(prompt: string): AsyncGenerator<string, void, void> {
        throw new Error('Method not implemented.');
    }
}