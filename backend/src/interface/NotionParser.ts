import IParser from '../domain/IParser.js'
import Page from '../domain/Page.js'

export default class NotionParser implements IParser {
    public parse(filename: string, content: string): Page | null {
        const id: string | null = this.extractIdFromFilename(filename)
        if (!id)
            return null

        const blocks: string[] = this.extractPageBlocks(content)
        return {
            id,
            title: this.extractTitleFromBlocks(blocks, filename),
            content,
            url: this.getPageUrl(id),
            childrenIds: this.extractChildrenIds(blocks),
            keywords: []
        }
    }

    private extractIdFromFilename(filename: string): string | null {
        const idRegex = /([a-f0-9]{32})\.md/i
        const match = filename.match(idRegex)

        if (!match) return null
        return match[1]
    }

    private extractPageBlocks(content: string): string[] {
        return content.split('\n\n')
    }

    private extractTitleFromBlocks(blocks: string[], filename: string): string {
        const titleBlock: string | undefined = blocks.find(block => block.startsWith('# '))

        // If there are not title for any reason in the .md file (it should not happen) -> the app will use the filename and extract the title
        if (!titleBlock) {
            const titleRegex = /^(.*?)\s+\[?([a-f0-9]{32})\]?\.md$/i
            const match = filename.match(titleRegex)

            return match ? match[1] : 'Page with no title' // In case file does not have a title (just in case)
        }

        const titleRegex = /^#\s+(.*)$/
        const match = titleBlock.match(titleRegex)

        return match ? match[1] : 'Page with no title'
    }

    private getPageUrl(id: string): string {
        return `https://www.notion.so/${id}`
    }

    private extractChildrenIds(blocks: string[]): string[] {
        const idRegex = /([a-f0-9]{32})\.md/gi

        const childrenIds = new Set<string>()

        for (const block of blocks) {
            const matches = block.matchAll(idRegex)

            for (const match of matches) {
                if (match[1]) {
                    childrenIds.add(match[1])
                }
            }
        }

        return Array.from(childrenIds)
    }
}