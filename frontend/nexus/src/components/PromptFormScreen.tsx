import { Action, ActionPanel, Form, useNavigation } from '@raycast/api'
import { FormValidation, useForm } from '@raycast/utils'
import LLMResponseScreen from './LLMResponseScreen'
import AppController from '../../../../backend/src/interface/AppController'

type PromptFormScreenProps = {
    controller: AppController
    pageContent: string
}

interface PromptFormValues {
    prompt: string
}

export default function PromptFormScreen({
    controller,
    pageContent
}: PromptFormScreenProps) {
    const { push } = useNavigation()
    const { handleSubmit, itemProps } = useForm<PromptFormValues>({
        onSubmit(values) {
            push(<LLMResponseScreen 
                controller={controller}
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