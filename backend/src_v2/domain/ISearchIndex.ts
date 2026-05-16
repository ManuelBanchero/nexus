export default interface ISearchIndex {
    addWord<T>(word: string, value: T): void
    wordExists(word: string): boolean
    getWordValues<T>(word: string): Set<T> | null
    wordsWithPrefix(prefix: string): string[]
}