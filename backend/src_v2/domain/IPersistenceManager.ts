export default interface IPersistenceManager {
    getCache<T>(): Promise<T>
    writeCache<T>(content: T): void
    updateCache<T>(content: T): void
}