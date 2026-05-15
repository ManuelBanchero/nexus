import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { useEffect, useState } from 'react'
import { SearchController } from '../../../../backend/src/controller/SearchController'
import ResultsScreen from './ResultsScreen'
import { QAController } from '../../../../backend/src/controller/QAController'

type SearchScreenProps = {
    searchController: SearchController | null,
    qaController: QAController | null
}

export default function SearchScreen({
    searchController,
    qaController
}: SearchScreenProps) {
    const [searchText, setSearchText] = useState<string>('')
    const [prefixes, setPrefixes] = useState<string[]>([])

    useEffect(() => {
        if (!searchText || !searchController) {
            setPrefixes([])
            return
        }

        const response = searchController.completePrefix(searchText)
        setPrefixes(response.slice(0, 50)) // list with no more than 50 elements
    }, [searchText, searchController])

    return (
        <List
            searchText={searchText}
            onSearchTextChange={setSearchText}
            navigationTitle='Nexus - Engine'
            searchBarPlaceholder='Type to search on trie'
            isLoading={!searchController}
        >
            { prefixes.map(prefix => 
                <List.Item 
                    key={prefix}
                    title={`${prefix.slice(0, 1).toUpperCase()}${prefix.slice(1)}`}
                    icon={Icon.MagnifyingGlass}
                    actions={
                        <ActionPanel>
                            <Action.Push 
                                title='Search Pages'
                                target={<ResultsScreen 
                                    searchController={searchController}
                                    qaController={qaController}
                                    word={prefix}
                                />}
                            />
                        </ActionPanel>
                    }
                />
            )}
        </List>
    )
}