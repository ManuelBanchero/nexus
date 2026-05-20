import SearchScreen from './components/SearchScreen'
import { useEffect, useRef, useState } from 'react'
import { List, getPreferenceValues, environment } from '@raycast/api'
import path from 'node:path'
import IndexWorkspaceScreen from './components/IndexWorkspaceScreen'
import bootstrap from '../../../backend/src/infrastructure/main'
import AppController from '../../../backend/src/interface/AppController'

export default function Command() {
    const preferences = getPreferenceValues<Preferences>()
    const apiKey = preferences.API_KEY
    const workspacePath = preferences.WORKSPACE_PATH
    const provider = preferences.PROVIDER
    const openAIKeywordGeneratorModel = preferences.OPENAI_KEYWORD_GENERATOR_MODEL
    const openAIChatModel = preferences.OPENAI_CHAT_MODEL
    const ollamaKeywordGeneratorModel = preferences.OLLAMA_KEYWORD_GENERATOR_MODEL
    const ollamaChatModel = preferences.OLLAMA_CHAT_MODEL

    const [controller, setController] = useState<AppController | null>(null)
    const [isIndexed, setIsIndexed] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    const hasRun = useRef(false)

    const cacheFilePath = path.join(environment.supportPath, 'pagesCache.json')

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true
        async function initSearchEngine() {
            try {
                const controller: AppController = await bootstrap({ 
                    apiKey, 
                    workspacePath, 
                    cacheFilePath,
                    provider,
                    openAIKeywordGeneratorModel,
                    openAIChatModel,
                    ollamaKeywordGeneratorModel,
                    ollamaChatModel
            })

            setIsIndexed(controller.isWorkspaceIndexed())
            setController(controller)
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

    if (!controller) {
        return (
            <List><List.EmptyView title='Error uploading the controller' description='' /></List>
        )
    }

    if (!isIndexed) {
        return <IndexWorkspaceScreen 
            controller={controller}
        />
    }
    return <SearchScreen 
        controller={controller}
    />

    
}