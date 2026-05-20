export type Result<T, E = string> =
    | { success: true, value?: T }
    | { success: false, error: E }