import IPageRepository from '../../domain/IPageRepository.js'
import IParser from '../../domain/IParser.js'
import Page from '../../domain/Page.js'
import fs from 'node:fs/promises'
import path from 'node:path'

export default class FileSystemRepository implements IPageRepository {
    private _pages: Page[]

    constructor(
        private pagesPath: string,
        private parser: IParser
    ) {
        this._pages = []
    }

    public async getPages(): Promise<Page[]> {
        // In case this method is called twice in the same lifecycle
        this._pages = []
        // Traverse directory, parse pages and adds it to _pages
        try {
            const fileStats = await fs.stat(this.pagesPath)
            if (!fileStats.isDirectory()) {
                console.error('The user workspace path is not a directory')
                return []
            }
            await this.traverseDirectory(this.pagesPath)
        } catch (error) {
            console.error(error)
        }
        return this._pages
    }

    private async traverseDirectory(actualPath: string) {
        try {
            const dirFiles = await fs.readdir(actualPath, { withFileTypes: true })

            for (const file of dirFiles) {
                const newFilePath = path.join(actualPath, file.name)

                if (file.isDirectory()) {
                    await this.traverseDirectory(newFilePath)
                } else {
                    if (!this.validFile(newFilePath)) {
                        console.error('Trying to read an invalid file: ', newFilePath, '\n')
                        continue
                    }

                    const fileContent: string | undefined = await this.extractPageContent(newFilePath)
                    if (!fileContent) continue

                    const page: Page | null = this.parser.parse(file.name, fileContent)
                    page && this._pages.push(page)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    private validFile(filePath: string): boolean {
        return filePath.endsWith('.md')
    }

    private async extractPageContent(filepath: string): Promise<string | undefined> {
        try {
            const content = await fs.readFile(filepath, 'utf-8')
            return content
        } catch (error) {
            console.error(error)
        }
    }
}