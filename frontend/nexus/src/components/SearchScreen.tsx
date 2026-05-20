import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { useEffect, useState } from 'react'
import ResultsScreen from './ResultsScreen'
import AppController from '../../../../backend/src/interface/AppController'

type SearchScreenProps = {
    controller: AppController
}

export default function SearchScreen({
    controller
}: SearchScreenProps) {
    const [searchText, setSearchText] = useState<string>('')
    const [prefixes, setPrefixes] = useState<string[]>([])

    useEffect(() => {
        if (!searchText) {
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