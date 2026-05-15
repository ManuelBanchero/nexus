import { Action, ActionPanel, Form, useNavigation } from '@raycast/api'
import { QAController } from '../../../../backend/src/controller/QAController'
import { FormValidation, useForm } from '@raycast/utils'
import LLMResponseScreen from './LLMResponseScreen'

type PromptFormScreenProps = {
    qaController: QAController | null,
    pageContent: string
}

interface PromptFormValues {
    prompt: string
}

export default function PromptFormScreen({
    qaController,
    pageContent
}: PromptFormScreenProps) {
    const { push } = useNavigation()
    const { handleSubmit, itemProps } = useForm<PromptFormValues>({
        onSubmit(values) {
            push(<LLMResponseScreen 
                qaController={qaController} 
                userPrompt={values.prompt}
                pageContent={pageContent}
            />)
        },
        validation: {
            prompt: FormValidation.Required,
        }
    })

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm 
                        title='Answer to AI'
                        onSubmit={handleSubmit}
                    />
                </ActionPanel>
            }
        >
            <Form.TextArea 
                title='Prompt'
                placeholder='Write your question here...'
                { ...itemProps.prompt }
            />
        </Form>
    )
}