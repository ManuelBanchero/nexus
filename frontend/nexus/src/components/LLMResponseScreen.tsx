import { useEffect, useRef, useState } from 'react'
import { Detail, showToast, Toast } from '@raycast/api'
import AppController from '../../../../backend/src/interface/AppController'


type LLMResponseScreenProps = {
    controller: AppController
    pageContent: string,
    userPrompt: string
}

export default function LLMResponseScreen({
    controller,
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

            const stream = controller.getChatCompletion(pageContent, userPrompt)
            for await (const chunk of stream) {
                setAnswer(prevAnswer => prevAnswer + chunk)
            }

            toast.style = Toast.Style.Success
            toast.title = 'AI has answered successfully'
        } catch (e) {
            toast.style = Toast.Style.Failure
            toast.title = 'Error getting AI Answer'
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