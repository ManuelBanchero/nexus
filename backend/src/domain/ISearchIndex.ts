export default interface ISearchIndex<T> {
    addWord(word: string, value: T): void
    wordExists(word: string): boolean
    getWordValues(word: string): Set<T> | null
    wordsWithPrefix(prefix: string): string[]
}