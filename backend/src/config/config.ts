import path from 'node:path'

type Config = {
    abspath: string,
    workspacePath: string
}

const __dirname = import.meta.dirname
const abspath = path.join(__dirname, '..')
const workspacePath = path.join(abspath, '..', 'data', 'workspace')

export const config: Config = {
    abspath,
    workspacePath
}
