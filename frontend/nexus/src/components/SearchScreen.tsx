import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { useEffect, useState } from 'react'
import { SearchController } from '../../../../backend/src/controller/SearchController'
import ResultsScreen from './ResultsScreen'

type SearchScreenProps = {
    controller: SearchController | null
}

export default function SearchScreen({
    controller
}: SearchScreenProps) {
    const [searchText, setSearchText] = useState<string>('')
    const [prefixes, setPrefixes] = useState<string[]>([])

    useEffect(() => {
        if (!searchText || !controller) {
            setPrefixes([])
            return
        }

        const response = controller.completePrefix(searchText)
        setPrefixes(response.slice(0, 50)) // list with no more than 50 elements
    }, [searchText, controller])

    return (
        <List
            searchText={searchText}
            onSearchTextChange={setSearchText}
            navigationTitle='Nexus - Engine'
            searchBarPlaceholder='Type to search on trie'
            isLoading={!controller}
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
                                    controller={controller}
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