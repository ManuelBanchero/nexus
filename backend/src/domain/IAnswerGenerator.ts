export default interface IAnswerGenerator {
    getAnswer(prompt: string): AsyncGenerator<string, void, void>
}