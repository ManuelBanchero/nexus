class TrieNode {
    constructor(
        public children: Record<string, TrieNode> = {},
        public pageIds: Set<string> = new Set()
    ) { }
}

class Trie {
    constructor(
        private root: TrieNode = new TrieNode()
    ) { }

    public add(word: string, value: string) {
        let currentLevel = this.root
        const wordLowerCase = word.toLowerCase()

        for (const char of wordLowerCase) {
            if (!currentLevel.children[char]) {
                currentLevel.children[char] = new TrieNode()
            }

            currentLevel = currentLevel.children[char]
        }

        currentLevel.pageIds.add(value)
    }

    public exists(word: string) {
        let currentlevel = this.root
        const wordLowerCase = word.toLowerCase()

        for (const char of wordLowerCase) {
            if (!currentlevel.children[char])
                return false
            currentlevel = currentlevel.children[char]
        }

        return currentlevel.pageIds.size > 0
    }

    public getWordValues(word: string): Set<string> | null {
        let currentLevel = this.root
        const wordLowerCase = word.toLowerCase()

        for (const char of wordLowerCase) {
            if (!currentLevel.children[char])
                return null
            currentLevel = currentLevel.children[char]
        }

        return currentLevel.pageIds.size > 0
            ? currentLevel.pageIds
            : null
    }

    public wordsWithPrefix(prefix: string) {
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
        currentLevel: TrieNode,
        currentPrefix: string,
        words: string[]
    ) {
        if (currentLevel.pageIds.size > 0)
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

export { Trie }