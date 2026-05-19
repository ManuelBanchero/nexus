import IAnswerGenerator from '../domain/IAnswerGenerator.js'
import IKeywordExtractor from '../domain/IKeywordExtractor.js';

export default abstract class LLMFactory {
    public abstract factoryAnswerGenerator(): IAnswerGenerator

    public abstract factoryKeywordExtractor(): IKeywordExtractor
}