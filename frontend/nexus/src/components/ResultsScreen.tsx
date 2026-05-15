import { useEffect, useState } from 'react'
import { Page } from '../../../../backend/src/model/types/Page'
import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { SearchController } from '../../../../backend/src/controller/SearchController'
import PageScreen from './PageScreen'
import { QAController } from '../../../../backend/src/controller/QAController'

type ResultsScreenProps = {
    searchController: SearchController | null,
    qaController: QAController | null
    word?: string,
    page?: Page
}

export default function ResultsScreen({
    searchController,
    qaController,
    word,
    page
}: ResultsScreenProps) {
    const [pages, setPages] = useState<Page[]>([])
    const [searchText, setSearchText] = useState<string>('')
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if ((!word && !page)) {
            setError(new Error('Results Screen must include a word or a page on props'))
            return
        }
        if (!searchController) {
            setError(new Error('Controller is undefined'))
            return
        }

        if (word) {
           const response = searchController?.search(word)
            if (response?.success)
                setPages(response.data.slice(0, 50))
        } else if (page) {
            const pageChildren = searchController?.getPageChildren(page)
            setPages(pageChildren)
        }

        setError(null)
        
    }, [searchController, word])

    if (error) return (
        <List><List.EmptyView title='Error' description={error.message} /></List>
    )

    const title = `Nexus - Results for ${
        word ? `"${word}"` : `"${page?.title}" children`
    }`

    return (
        <List 
            throttle
            searchText={searchText}
            onSearchTextChange={setSearchText}
            navigationTitle={title}
            searchBarPlaceholder='Filter pages by title'
        >
            { pages
                .filter(page => page.title.toLowerCase().includes(searchText.toLowerCase()))
                .map(page => 
                    <List.Item 
                        key={page.id}
                        title={page.title}
                        icon={Icon.Document}
                        accessories={[{
                            text: { value: page.childrenIds && page.childrenIds.length > 0
                                ? `${page.childrenIds?.length} sub-pages` 
                                : `Non sub-pages`
                            },
                        }]}
                        actions={
                            <ActionPanel>
                                <Action.OpenInBrowser url={page.url} />
                                <Action.Push 
                                    title="View Content"
                                    target={<PageScreen 
                                        page={page} 
                                        qaController={qaController}
                                    />}
                                    icon={Icon.Book}
                                />
                                <Action.Push 
                                    title="View Page Children"
                                    target={<ResultsScreen 
                                        searchController={searchController}
                                        qaController={qaController}
                                        page={page}
                                    />}
                                    shortcut={{ modifiers: ['cmd'], key: '.' }}
                                    icon={Icon.ChevronDown}
                                />
                            </ActionPanel>
                        }
                    />
                )
            }
        </List>
    )
}