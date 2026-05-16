export default interface IAnswerGenerator {
    getAnswer(context: string, question: string): AsyncGenerator<string, void, void>
}