import path from 'node:path'
import { systemPrompt, formatConfig } from './LLMConfig.js'

type FormatConfig = {
    [key: string]: string | number | boolean | string[] | FormatConfig
}

type LLMConfig = {
    model: string,
    systemPrompt: string,
    text?: Record<'format', FormatConfig>,
    format?: FormatConfig
}

type Config = {
    abspath: string,
    workspacePath: string,
    llmConfig: LLMConfig
}

//const __dirname = '/Users/manuelbanchero/dev/projects/nexus/backend/src/config'
//const abspath = path.join(__dirname, '..')
const abspath = '/Users/manuelbanchero/dev/projects/nexus/backend/src'
const workspacePath = path.join(abspath, '..', 'data', 'workspace')

const llmConfig: LLMConfig = {
    model: 'gpt-4o-mini',
    systemPrompt,
    text: {
        format: formatConfig
    }
}

export const config: Config = {
    abspath,
    workspacePath,
    llmConfig
}
