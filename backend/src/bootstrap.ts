import { Workspace } from './model/Workspace.js'
import { config } from './config/config.js'
import { OpenAI } from './model/OpenAI.js'
import { SearchEngine } from './model/SearchEngine.js'
import { SearchController } from './controller/SearchController.js'

type bootstrapParams = {
    apiKey: string,
    workspacePath: string,
    cacheFilePath: string
}

async function bootstrap({
    apiKey,
    workspacePath,
    cacheFilePath
}: bootstrapParams) {
    // Low level instances
    const llm = new OpenAI(config.llmConfig, apiKey)
    const workspace = new Workspace(workspacePath, cacheFilePath)
    await workspace.init()

    // High level instances -> orchestrating class
    const searchEngine = new SearchEngine(llm, workspace)
    searchEngine.createTrie()

    // Controller -> Got access to high level classes
    const controller = new SearchController(searchEngine)
    return controller
}

export { bootstrap }