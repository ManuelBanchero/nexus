import { useEffect, useRef, useState } from 'react'
import { QAController } from '../../../../backend/src/controller/QAController'
import { Detail, showToast, Toast } from '@raycast/api'

type LLMResponseScreenProps = {
    qaController: QAController | null,
    pageContent: string,
    userPrompt: string
}

export default function LLMResponseScreen({
    qaController,
    pageContent,
    userPrompt
}: LLMResponseScreenProps) {
    const [answer, setAnswer] = useState<string>('')
    const [isAnswering, setIsAnswering] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const hasRun = useRef(false)

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true

        setIsAnswering(true)
        getChatCompletion()
        setIsAnswering(false)
    }, [])

    async function getChatCompletion() {
        const toast = await showToast({
            style: Toast.Style.Animated,
            title: 'Getting AI Answer'
        })
        try {
            console.log('Getting AI response')
            if (!qaController) {
                setError(new Error('QA Controller is null'))
                return
            }

            const stream = qaController?.getChatCompletion(pageContent, userPrompt)
            for await (const chunk of stream) {
                setAnswer(prevAnswer => prevAnswer + chunk)
            }

            toast.style = Toast.Style.Success
            toast.title = 'AI has answered successfully'
        } catch (e) {
            setError(
                e instanceof Error
                    ? e
                    : new Error('Unexpected error')
            )
        }
    }

    return (
        <Detail 
            isLoading={isAnswering}
            markdown={error ? error.message : answer}
        />
    )
}