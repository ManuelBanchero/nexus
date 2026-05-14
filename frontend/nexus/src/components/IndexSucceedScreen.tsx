import { Action, ActionPanel, Detail } from "@raycast/api"
import { Dispatch, SetStateAction } from "react"

type IndexSucceedScreenProps = {
    setIsIndexed: Dispatch<SetStateAction<boolean>>
}

export default function IndexSucceedScreen({
    setIsIndexed
}: IndexSucceedScreenProps) {
    const markdown = "# Workspace Indexed Successfully ⚡️ All pages from your Notion workspace have been processed and cached locally. Nexus is now fully operational.\n\nPress **Enter** to launch the Search Engine."

    return (
        <Detail 
            markdown={markdown}
            actions={
                <ActionPanel>
                    <Action 
                        title='Launch Search Engine'
                        onAction={() => setIsIndexed(true)}
                    />
                </ActionPanel>
            }
        />
    )
}