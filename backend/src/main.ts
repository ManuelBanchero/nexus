import { Workspace } from './model/Workspace.js'
import { config } from './config/config.js'
import { OpenAI } from './model/OpenAI.js'
import { SearchEngine } from './model/SearchEngine.js'
import { Trie } from './model/Trie.js'

async function main() {
    // Config variables
    const openAIKey = config.openAIKey
    const systemPrompt = config.systemPrompt
    const formatConfig = config.formatConfig

    if (!openAIKey)
        throw new Error('OpenAI API KEY must be included in the config file')
    if (!systemPrompt)
        throw new Error('systemPrompt must be included in the config file')
    if (!formatConfig)
        throw new Error('formatConfig must be included in the config file')

    // Class instances
    const ai = new OpenAI({
        model: 'gpt-4o-mini',
        systemPrompt,
        text: {
            format: formatConfig
        }
    }, openAIKey)

    const workspace = new Workspace(config.workspacePath)
    await workspace.init()

    const trie = new Trie()

    const searchEngine = new SearchEngine(ai, workspace)
    searchEngine.createTrie()
    console.log(searchEngine.search('matriz'))
}

main()