import { Page } from './types/Page.js'
import path from 'node:path'
import fs from 'node:fs/promises'
import { config } from '../config/config.js'

class Workspace {
    constructor(
        private readonly fullWorkspacePath: string,
        private pagesCachePath: string | null = null,
        private _pagesCache: Page[] = []
    ) { }

    /*
        GETTERS
    */
    get pagesCache(): Page[] | null {
        return this._pagesCache
    }

    /*
        PUBLIC METHODS    
    */
    public async init() {
        this.pagesCachePath = await this.getPagesCachePath()
        if (!this.pagesCachePath) {
            console.log('Creating file content\n')

            await this.createPagesCache(this.fullWorkspacePath)
            const pagesCachePath = await this.createPagesCacheFile(config.abspath)
            this.pagesCachePath = pagesCachePath
        } else {
            console.log('Getting file content')

            const pagesCacheFileContent = await this.getPagesCacheContent()
            if (pagesCacheFileContent) {
                this._pagesCache = pagesCacheFileContent
            }
        }
    }

    public updatePagesCache(pages: Page[]) {
        this._pagesCache = pages
        this.updatePagesCacheFile(config.abspath)
    }

    public getPageById(id: string): Page | undefined {
        return this._pagesCache.find(page => page.id === id)
    }

    /*
        PRIVATE METHODS
    */
    private async getPagesCachePath() {
        const pagesCacheDir = path.join(config.abspath, '..', 'data', 'pagesCache')
        const dirFiles = await fs.readdir(pagesCacheDir)

        if (dirFiles.includes('pagesCache.json')) {
            return path.join(pagesCacheDir, 'pagesCache.json')
        }
        return null
    }

    private async createPagesCache(actualPath: string) {
        try {
            const fileStats = await fs.stat(actualPath)

            if (fileStats.isDirectory()) {
                const dirFiles = await fs.readdir(actualPath)

                for (const file of dirFiles) {
                    const newFilePath = path.join(actualPath, file)
                    const newFileStats = await fs.stat(newFilePath)

                    if (newFileStats.isDirectory()) {
                        await this.createPagesCache(newFilePath)
                    } else {
                        if (!this.validFile(newFilePath)) {
                            console.error('Trying to read an invalid file: ', newFilePath, '\n')
                            continue
                        }

                        const page: Page | undefined = await this.extractPageData(newFilePath)
                        page && this._pagesCache?.push(page)
                    }
                }

            }

        } catch (error) {
            console.error(error)
        }
    }

    private validFile(filePath: string): boolean {
        return filePath.endsWith('.md')
    }

    private async extractPageData(pagePath: string): Promise<Page | undefined> {
        const id = this.extractIdFromPath(pagePath)
        if (!id) {
            console.error('Trying to read an invalid file')
            return
        }

        const pageContent = await this.extractPageContent(pagePath)
        if (!pageContent) {
            console.error('Could not get a valid cotent from the file')
            return
        }

        const blocks = this.extractPageBlocks(pageContent)
        return {
            id,
            title: this.extractTitle(blocks),
            content: pageContent,
            url: this.getPageUrl(pagePath),
            childrenIds: this.extractChildrenIds(blocks),
            keywords: []
        }
    }

    private extractIdFromPath(path: string): string | undefined {
        return path.split(' ').at(-1)?.split('.')[0].trim()
    }

    private async extractPageContent(path: string) {
        try {
            const content = await fs.readFile(path, 'utf-8')
            return content
        } catch (error) {
            console.log('An error has ocurred trying to access to page content')
        }
    }

    private extractPageBlocks(content: string): string[] {
        return content.split('\n\n')
    }

    private extractTitle(blocks: string[]): string {
        return blocks[0].slice(1).trim()
    }

    private getPageUrl(filePath: string): string {
        const fileName = path.basename(filePath)
        const pageName = fileName
            .split('.md')[0]
            .split(' ')
            .join('%')
        return `https://www.notion.so/${pageName}`
    }

    private extractChildrenIds(blocks: string[]): string[] {
        const linkRegex = /(?<!\!)\[(.*?)\]\((.*?)\)/;

        // The id is an 32 chars hex, and is before the .md
        const idRegex = /([a-f0-9]{32})\.md/i;

        return blocks
            .filter(block => linkRegex.test(block))
            .map(block => {
                const match = block.match(idRegex);
                return match ? match[1] : null;
            })
            .filter((id): id is string => id !== null);
    }

    private async createPagesCacheFile(abspath: string): Promise<string> {
        const filePath = path.join(abspath, '..', 'data', 'pagesCache', 'pagesCache.json')

        const dirPath = path.dirname(filePath)
        await fs.mkdir(dirPath, { recursive: true })

        await fs.writeFile(
            filePath,
            JSON.stringify(this._pagesCache, null, 2),
            'utf-8'
        )
        return filePath
    }

    private async getPagesCacheContent() {
        try {
            if (!this.pagesCachePath)
                throw new Error('Pages Cache path is null and you are trying to read it')
            return JSON.parse(await fs.readFile(this.pagesCachePath, 'utf-8'))
        } catch (error) {
            console.error('An error has ocurred trying to read pages cache')
        }
    }

    private async updatePagesCacheFile(abspath: string) {
        await this.createPagesCacheFile(abspath)
    }
}

export { Workspace }