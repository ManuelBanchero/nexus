import { Controller } from '../controller/SearchController.js'
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

class MainView {
    constructor(
        private readonly controller: Controller,
        private rl: readline.Interface = readline.createInterface({ input, output })
    ) { }

    public async chooseOption() {
        const option = await this.rl.question('Choose an option: ')

        if (option == '1')
            this.completeInput()
        else if (option == '2')
            this.search()
    }

    public async completeInput() {
        const answer = await this.rl.question('Write your input: ')
        this.rl.close()

        const results: string[] = this.controller.completePrefix(answer)
        console.log(results)
    }

    public async search() {
        const answer = await this.rl.question('Write your input: ')
        this.rl.close()

        const response = this.controller.search(answer)
        if (!response.success)
            console.error('⚠️ The word does not exist')
        else
            console.log(response.data)
    }

}

export { MainView }