import { Action, ActionPanel, Detail, useNavigation } from "@raycast/api"
import LLMResponseScreen from "./LLMResponseScreen"
import PromptFormScreen from "./PromptFormScreen"
import AppController from "../../../../backend/src/interface/AppController"
import Page from "../../../../backend/src/domain/Page"

type PageScreenProps = {
    page: Page,
    controller: AppController
}

export default function PageScreen({
    page,
    controller
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
                            controller={controller}
                            pageContent={page.content}
                            userPrompt='summarize'
                        />)}
                    />
                    <Action 
                        title="Ask AI About This Content"
                        shortcut={{ modifiers: ['shift'], key: 'enter' }}
                        onAction={() => push(<PromptFormScreen 
                            controller={controller}
                            pageContent={page.content}
                        />)}
                    />
                </ActionPanel>
            }
        />
    )
}