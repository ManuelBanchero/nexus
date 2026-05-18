import IPersistenceManager from '../domain/IPersistenceManager.js'
import fs from 'node:fs/promises'

export default class FileSystemCacheManager implements IPersistenceManager {
    constructor(
        private readonly persistencePath: string
    ) { }

    public async getCache<T>(): Promise<T | null> {
        try {
            const data = JSON.parse(await fs.readFile(this.persistencePath, 'utf-8'))
            return data as T
        } catch (e) {
            const error = e as NodeJS.ErrnoException

            // Escenarios de caché vacía o inexistente (Flujo esperado)
            if (error.code === 'ENOENT') {
                return null
            }
            if (e instanceof SyntaxError) {
                console.error('The cache file is corrupted. Treating as empty.')
                return null
            }

            throw e
        }
    }

    public async writeCache<T>(content: T): Promise<void> {
        try {
            await fs.writeFile(
                this.persistencePath,
                JSON.stringify(content, null, 2),
                'utf-8'
            )
        } catch (e) {
            const error = e as NodeJS.ErrnoException

            if (error.code === 'ENOENT') {
                throw new Error(`The directory path for the cache does not exist: ${this.persistencePath}`)
            } else if (error.code === 'EISDIR') {
                throw new Error(`Cannot write cache. The path is a directory: ${this.persistencePath}`)
            }

            throw new Error(`Unexpected error writing cache: ${error.message}`)
        }
    }
}