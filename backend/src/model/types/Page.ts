type Page = {
    id: string,
    title: string,
    content: string,
    url: string,
    childrenIds: string[] | null,
    keywords: string[]
}

export { Page }