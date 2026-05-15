import { Workspace } from './model/lowLevelClasses/Workspace.js'
import { config } from './config/config.js'
import { OpenAI } from './model/lowLevelClasses/LLM/OpenAI.js'
import { SearchEngine } from './model/highLevelClasess/SearchEngine.js'
import { SearchController } from './controller/SearchController.js'
import { QAEngine } from './model/highLevelClasess/QAEngine.js'
import { Ollama } from './model/lowLevelClasses/LLM/Ollama.js'
import { QAController } from './controller/QAController.js'

type bootstrapParams = {
    apiKey: string,
    workspacePath: string,
    cacheFilePath: string,
    getLocalAnswers: boolean
}

async function bootstrap({
    apiKey,
    workspacePath,
    cacheFilePath,
    getLocalAnswers
}: bootstrapParams): Promise<{ searchController: SearchController, qaController: QAController }> {
    // Low level instances
    const llm = new OpenAI(config.llmConfig, apiKey)
    const qaLlm = getLocalAnswers ? new Ollama(config.qaLocalLlmConfig) : new OpenAI(config.qaLlmConfig, apiKey)

    const workspace = new Workspace(workspacePath, cacheFilePath)
    await workspace.init()

    // High level instances -> orchestrating class
    const searchEngine = new SearchEngine(llm, workspace)
    searchEngine.createTrie()

    const qaEngine = new QAEngine(qaLlm)

    // Controller -> Got access to high level classes
    const searchController = new SearchController(searchEngine)
    const qaController = new QAController(qaEngine)

    return {
        searchController,
        qaController
    }
}

export { bootstrap }