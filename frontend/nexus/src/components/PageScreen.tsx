import { Action, ActionPanel, Detail, useNavigation } from "@raycast/api"
import { Page } from "../../../../backend/src/model/types/Page"
import { QAController } from "../../../../backend/src/controller/QAController"
import LLMResponseScreen from "./LLMResponseScreen"
import PromptFormScreen from "./PromptFormScreen"

type PageScreenProps = {
    page: Page,
    qaController: QAController | null
}

export default function PageScreen({
   page,
   qaController
}: PageScreenProps) {
    const { push } = useNavigation()

    return (
        <Detail 
            markdown={page.content}
            actions={
                <ActionPanel>
                    <Action.CopyToClipboard content={page.content} />
                    <Action.OpenInBrowser url={page.url} />
                    <Action 
                        title="Summarize Page"
                        shortcut={{ modifiers: ['cmd'], key: 's' }}
                        onAction={() => push(<LLMResponseScreen 
                            qaController={qaController}
                            pageContent={page.content}
                            userPrompt='summarize'
                        />)}
                    />
                    <Action 
                        title="Ask AI About This Content"
                        shortcut={{ modifiers: ['shift'], key: 'enter' }}
                        onAction={() => push(<PromptFormScreen 
                            qaController={qaController}
                            pageContent={page.content}
                        />)}
                    />
                </ActionPanel>
            }
        />
    )
}