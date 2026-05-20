import { describe, it, expect, beforeAll, afterAll } from 'vitest' // o jest
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import FileSystemRepository from '../../src_v2/interface/FileSystemRepository'
import IParser from '../../src_v2/domain/IParser'
import Page from '../../src_v2/domain/Page'

describe('FileSystemRepository', () => {
    let tempDirPath: string
    let repository: FileSystemRepository

    // 1. SETUP: Crear un ecosistema real antes de que corran los tests
    beforeAll(async () => {
        // Crea una carpeta temporal única en el OS
        tempDirPath = await fs.mkdtemp(path.join(os.tmpdir(), 'notion-test-'))

        // Crea una estructura de archivos real:
        // /root
        //   ├─ valid-page.md
        //   ├─ image.png (debe ser ignorado)
        //   └─ /subfolder
        //        └─ nested-page.md

        await fs.writeFile(path.join(tempDirPath, 'valid-page.md'), 'Contenido 1')
        await fs.writeFile(path.join(tempDirPath, 'image.png'), 'Fake image data')

        const subfolderPath = path.join(tempDirPath, 'subfolder')
        await fs.mkdir(subfolderPath)
        await fs.writeFile(path.join(subfolderPath, 'nested-page.md'), 'Contenido 2')

        // 2. Mock del Parser: No queremos testear el parser aquí, solo la recursividad
        const mockParser: IParser = {
            parse: (filepath: string, content: string) => {
                return {
                    id: 'fake-id-123',
                    title: 'Fake Title',
                    url: 'https://notion.so/fake',
                    content: content,
                    childrenIds: [],
                    keywords: []
                } as Page
            }
        }

        // Instanciamos el repositorio apuntando a nuestra carpeta temporal real
        repository = new FileSystemRepository(tempDirPath, mockParser)
    })

    // 3. TEARDOWN: Destruir el ecosistema después de los tests para no dejar basura
    afterAll(async () => {
        await fs.rm(tempDirPath, { recursive: true, force: true })
    })

    // 4. LOS TESTS
    it('debe leer recursivamente solo los archivos .md', async () => {
        const pages = await repository.getPages()

        // Evaluamos el resultado
        expect(pages).toHaveLength(2) // Debe haber ignorado el .png

        // Evaluamos la idempotencia (si llamo de nuevo, no debe duplicar a 4)
        const pagesCallTwo = await repository.getPages()
        expect(pagesCallTwo).toHaveLength(2)
    })
})