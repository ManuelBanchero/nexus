import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api"
import Command from "../nexus"

export default function IndexSucceedScreen() {
    const { push } = useNavigation()

    return (
        <List>
            <List.EmptyView 
                title='Workspace Indexed Successfully'
                description='All pages from your Notion workspace have been processed and cached locally. Nexus is now fully operational.'
                icon={Icon.Quicklink}
                actions={
                    <ActionPanel>
                        <Action 
                            title='Launch Nexus'
                            onAction={() => push(<Command />)}
                        />
                    </ActionPanel>
                }
            />
        </List>
    )
}