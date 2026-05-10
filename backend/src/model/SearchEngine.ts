import { LLM } from './LLM.js'
import { Page } from './types/Page.js'
import { Workspace } from './Workspace.js'
import { Response } from './types/Response.js'

class SearchEngine {
    constructor(
        private readonly llm: LLM,
        private readonly workspace: Workspace
    ) { }

    public async indexPages(): Promise<Response> {
        const pages: Page[] | null = this.workspace.pagesCache
        if (!pages) {
            return {
                success: false,
                error: 'There are not pages on pagesCache'
            }
        }

        const BATCH_SIZE = 10
        const indexedPages = []

        for (let i = 0; i < pages.length; i += BATCH_SIZE) {
            const batch = pages.slice(i, i + BATCH_SIZE)
            console.log(`Processing batch from ${i} to ${i + BATCH_SIZE}`)

            const batchResults = await Promise.all(
                batch.map(async page => {
                    const response = await this.llm.getSchemaResponse(page.content)
                    if (!response.success || !response.data) {
                        console.error('Error getting keys on page: ', page.title)
                        return page
                    }

                    const keywords: string[] = response.data.keywords
                    keywords.push(page.title)

                    page.keywords = keywords

                    return page
                })
            )

            indexedPages.push(...batchResults)

            if (i + BATCH_SIZE < pages.length)
                await new Promise(resolve => setTimeout(resolve, 1000)) // wait for 1 second btw each batch
        }

        this.workspace.updatePagesCache(indexedPages)

        return { success: true }
    }
}

export { SearchEngine }