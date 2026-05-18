import IParser from '../domain/IParser'
import Page from '../domain/Page'

export default class NotionParser implements IParser {
    public parse(filename: string, content: string): Page | null {
        const id: string | undefined = this.extractIdFromFilename(filename)
        if (!id)
            return null

        const blocks: string[] = this.extractPageBlocks(content)
        return {
            id,
            title: this.extractTitleFromBlocks(blocks),
            content,
            url: this.getPageUrl(id),
            childrenIds: this.extractChildrenIds(blocks),
            keywords: []
        }
    }

    private extractIdFromFilename(path: string): string | undefined {
        return path.split(' ').at(-1)?.split('.')[0].trim()
    }

    private extractPageBlocks(content: string): string[] {
        return content.split('\n\n')
    }

    private extractTitleFromBlocks(blocks: string[]): string {
        return blocks[0].slice(1).trim()
    }

    private getPageUrl(id: string): string {
        return `https://www.notion.so/${id}`
    }

    private extractChildrenIds(blocks: string[]): string[] {
        const linkRegex = /(?<!\!)\[(.*?)\]\((.*?)\)/

        // The id is an 32 chars hex, and is before the .md
        const idRegex = /([a-f0-9]{32})\.md/i

        return blocks
            .filter(block => linkRegex.test(block))
            .map(block => {
                const match = block.match(idRegex)
                return match ? match[1] : null
            })
            .filter((id): id is string => id !== null)
    }
}