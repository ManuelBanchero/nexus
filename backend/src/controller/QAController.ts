import { QAEngine } from "../model/highLevelClasess/QAEngine.js";

class QAController {
    constructor(
        private readonly qaEngine: QAEngine
    ) { }

    public async *getChatCompletion(pageContent: string, userPrompt: string) {
        yield* this.qaEngine.getChatCompletion(pageContent, userPrompt)
    }

}

export { QAController }