import SearchScreen from './components/SearchScreen'
import { SearchController } from '../../../backend/src/controller/SearchController'
import { bootstrap } from '../../../backend/src/bootstrap'
import { useEffect, useState } from 'react'
import { List, getPreferenceValues, environment } from '@raycast/api'
import path from 'node:path'
import IndexWorkspaceScreen from './components/IndexWorkspaceScreen'

export default function Command() {
    const preferences = getPreferenceValues<Preferences>()
    const apiKey = preferences.OPEN_AI_API_KEY
    const workspacePath = preferences.WORKSPACE_PATH

    const [controller, setController] = useState<SearchController | null>(null)
    const [isIndexed, setIsIndexed] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    const cacheFilePath = path.join(environment.supportPath, 'pagesCache.json')

    useEffect(() => {
        async function initSearchEngine() {
            try {
                const ctrl = await bootstrap({ apiKey, workspacePath, cacheFilePath })
                setIsIndexed(ctrl.isWorkspaceIndexed())
                setController(ctrl)
            } catch (e) {
                setError(e instanceof Error ? e : new Error('Something went wrong'))
            }
        }
        initSearchEngine()
    }, [apiKey, workspacePath, cacheFilePath])

    if (error) {
        console.log(error)
        return (
            <List><List.EmptyView title='Error' description={error.message} /></List>
        )
    }

    if (!isIndexed) {
        return <IndexWorkspaceScreen 
            controller={controller}
        />
    }
    return <SearchScreen controller={controller} />
    
}