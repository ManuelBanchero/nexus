import ISearchIndex from "./ISearchIndex.js"

class TrieNode<T> {
    constructor(
        public children: Record<string, TrieNode<T>> = {},
        public values: Set<T> = new Set<T>()
    ) { }
}

export default class Trie<T> implements ISearchIndex<T> {
    constructor(
        private root: TrieNode<T> = new TrieNode<T>()
    ) { }

    public addWord(word: string, value: T): void {
        let currentLevel = this.root
        const wordLowerCase = word.toLowerCase()

        for (const char of wordLowerCase) {
            if (!currentLevel.children[char]) {
                currentLevel.children[char] = new TrieNode<T>()
            }

            currentLevel = currentLevel.children[char]
        }

        currentLevel.values.add(value)
    }

    public wordExists(word: string): boolean {
        let currentlevel = this.root
        const wordLowerCase = word.toLowerCase()

        for (const char of wordLowerCase) {
            if (!currentlevel.children[char])
                return false
            currentlevel = currentlevel.children[char]
        }

        return currentlevel.values.size > 0
    }

    public getWordValues(word: string): Set<T> | null {
        let currentLevel = this.root
        const wordLowerCase = word.toLowerCase()

        for (const char of wordLowerCase) {
            if (!currentLevel.children[char])
                return null
            currentLevel = currentLevel.children[char]
        }

        return currentLevel.values.size > 0
            ? currentLevel.values
            : null
    }

    public wordsWithPrefix(prefix: string): string[] {
        const prefixLowerCase = prefix.toLowerCase()
        const words: string[] = []
        let currentLevel = this.root

        for (const char of prefixLowerCase) {
            if (!currentLevel.children[char])
                return []
            currentLevel = currentLevel.children[char]
        }
        return this.searchLevel(currentLevel, prefixLowerCase, words)
    }

    private searchLevel(
        currentLevel: TrieNode<T>,
        currentPrefix: string,
        words: string[]
    ) {
        if (currentLevel.values.size > 0)
            words.push(currentPrefix)

        const chars = Object.keys(currentLevel.children).sort()
        for (const char of chars) {
            this.searchLevel(currentLevel.children[char], currentPrefix + char, words)
        }

        return words
    }

    public printRoot() {
        console.dir(this.root, { depth: null })
    }
}