import IAnswerGenerator from '../../../domain/IAnswerGenerator.js'
import ollama from 'ollama'

export default class OllamaAnswerGenerator implements IAnswerGenerator {
    constructor(private readonly model: string) { }

    getAnswer(prompt: string): AsyncGenerator<string, void, void> {
        throw new Error('Method not implemented.');
    }

}