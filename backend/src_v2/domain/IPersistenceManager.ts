export default interface IPersistenceManager {
    getCache<T>(): Promise<T[] | null>
    writeCache<T>(content: T): Promise<void | Error>
}