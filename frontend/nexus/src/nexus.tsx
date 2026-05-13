import SearchScreen from './components/SearchScreen'
import { SearchController } from '../../../backend/src/controller/SearchController'
import { bootstrap } from '../../../backend/src/bootstrap'
import { useEffect, useState } from 'react'
import { List, getPreferenceValues } from '@raycast/api'

export default function Command() {
    const preferences = getPreferenceValues<Preferences>()
    const apiKey = preferences.OPEN_AI_API_KEY
    const workspacePath = preferences.WORKSPACE_PATH

    const [controller, setController] = useState<SearchController | null>(null)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function initSearchEngine() {
            try {
                const ctrl = await bootstrap({ apiKey, workspacePath })
                setController(ctrl)
            } catch (e) {
                setError(e instanceof Error ? e : new Error('Something went wrong'))
            }
        }
        initSearchEngine()
    }, [])

    if (error) return (
        <List><List.EmptyView title='Error' description={error.message} /></List>
    )

    return <SearchScreen controller={controller} />
    
}