import { Action, ActionPanel, Detail } from "@raycast/api"
import { Page } from "../../../../backend/src/model/types/Page"

type PageScreenProps = {
    page: Page
}

export default function PageScreen({
   page 
}: PageScreenProps) {
    return (
        <Detail 
            markdown={page.content}
            actions={
                <ActionPanel>
                    <Action.CopyToClipboard content={page.content} />
                    <Action.OpenInBrowser url={page.url} />
                </ActionPanel>
            }
        />
    )
}