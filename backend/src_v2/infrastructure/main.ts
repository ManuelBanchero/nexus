import Trie from '../domain/Trie.js'
import LLMFactory from './llm/factories/LLMFactory.js'
import OllamaFactory from './llm/factories/OllamaFactory.js'
import OpenAIFactory from './llm/factories/OpenAIFactory.js'
import FileSystemRepository from './filesytem/FileSystemRepository.js'
import FileSystemCacheManager from './filesytem/FileSystemCacheManager.js'
import { ollamaQAConfig } from '../config/OllamaConfig.js'
import { ollamaExtractKeysConfig } from '../config/OllamaConfig.js'
import { openAIQAConfig } from '../config/OpenAIConfig.js'
import { openAIExtractKeysConfig } from '../config/OpenAIConfig.js'
import ISearchIndex from '../domain/ISearchIndex.js'
import IKeywordExtractor from '../domain/IKeywordExtractor.js'
import IPageRepository from '../domain/IPageRepository.js'
import IParser from '../domain/IParser.js'
import NotionParser from '../interface/NotionParser.js'
import IPersistenceManager from '../domain/IPersistenceManager.js'
import SearchEngine from '../application/SearchEngine.js'
import IAnswerGenerator from '../domain/IAnswerGenerator.js'
import QAEngine from '../application/QAEngine.js'

type MainParams = {
    apiKey: string,
    workspacePath: string,
    cacheFilePath: string,
    provider: string,
    model: string
}

export default async function main({
    apiKey,
    workspacePath,
    cacheFilePath,
    provider,
    model
}: MainParams) {
    /* LLM PROVIDER FACTORY */
    let llmFactory: LLMFactory
    switch (provider) {
        case 'ollama':
            llmFactory = new OllamaFactory(
                ollamaQAConfig.systemPrompt,
                ollamaExtractKeysConfig.systemPrompt,
                ollamaExtractKeysConfig.formatConfig,
                model
            )
            break

        case 'openai':
            llmFactory = new OpenAIFactory(
                openAIQAConfig.instructions,
                openAIExtractKeysConfig.instructions,
                openAIExtractKeysConfig.response_format,
                model,
                apiKey
            )
            break

        default:
            throw new Error(`The provider "${provider}" is not supported `)
    }

    /* Instances for SearchEngine */
    const trie: ISearchIndex<string> = new Trie<string>()
    const keywordExtractor: IKeywordExtractor = llmFactory.createKeywordExtractor()
    const notionParser: IParser = new NotionParser()
    const fileSystemRepository: IPageRepository = new FileSystemRepository(
        workspacePath,
        notionParser
    )
    const cacheManager: IPersistenceManager = new FileSystemCacheManager(cacheFilePath)

    /* Instances for QAEngine */
    const answerGenerator: IAnswerGenerator = llmFactory.createAnswerGenerator()

    /* Application instances */
    const searchEngine: SearchEngine = new SearchEngine(
        trie,
        keywordExtractor,
        fileSystemRepository,
        cacheManager
    )
    const qaEngine: QAEngine = new QAEngine(answerGenerator)

}