import SearchScreen from './components/SearchScreen'
import { SearchController } from '../../../backend/src/controller/SearchController'
import { bootstrap } from '../../../backend/src/bootstrap'
import { useEffect, useRef, useState } from 'react'
import { List, getPreferenceValues, environment } from '@raycast/api'
import path from 'node:path'
import IndexWorkspaceScreen from './components/IndexWorkspaceScreen'
import { QAController } from '../../../backend/src/controller/QAController'

export default function Command() {
    const preferences = getPreferenceValues<Preferences>()
    const apiKey = preferences.OPEN_AI_API_KEY
    const workspacePath = preferences.WORKSPACE_PATH
    const getLocalAnswers = preferences.LOCAL_AI_ANSWERS

    const [searchController, setSearchController] = useState<SearchController | null>(null)
    const [qaController, setQaController] = useState<QAController | null>(null)
    const [isIndexed, setIsIndexed] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    const hasRun = useRef(false)

    const cacheFilePath = path.join(environment.supportPath, 'pagesCache.json')

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true
        async function initSearchEngine() {
            try {
                const controllers = await bootstrap({ apiKey, workspacePath, cacheFilePath, getLocalAnswers })

                const searchCtrl = controllers.searchController
                const qaCtrl = controllers.qaController

                setIsIndexed(searchCtrl.isWorkspaceIndexed())
                setSearchController(searchCtrl)
                setQaController(qaCtrl)
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
            searchController={searchController}
        />
    }
    return <SearchScreen 
        searchController={searchController} 
        qaController={qaController}
    />
    
}