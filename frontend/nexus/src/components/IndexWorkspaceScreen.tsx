import { Action, ActionPanel, Icon, List, useNavigation, confirmAlert, Alert, Toast, showToast } from '@raycast/api'
import { SearchController } from '../../../../backend/src/controller/SearchController'
import { useState } from 'react'
import Command from '../nexus'

type IndexWorkspaceScreenProps = {
    controller: SearchController | null
}

export default function IndexWorkspaceScreen({
    controller
}: IndexWorkspaceScreenProps) {
    const { push } = useNavigation()

    const [title, setTitle] = useState<string>('Non-Indexed workspace')
    const [description, setDescription] = useState<string>('Nexus requires building an initial index of your pages to enable the search engine.')
    const [isIndexing, setIsIndexing] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const alertSettings = {
        title: 'Are you sure?', 
        message: 'This process will consume OpenAI API Credits. Do you want to continue?',
        primaryAction: {
            title: 'Confirm',
            style: Alert.ActionStyle.Default
        }
    }
    
    async function handleIndexWorkspaceToBegin() {
        if (!await confirmAlert(alertSettings)) {
            return
        }
        setTitle('Indexing pages...')
        setDescription('Please keep this window open')
        setIsIndexing(true)
        
        await new Promise(resolve => setTimeout(resolve, 0))
        indexWorkspace()
    }

    async function indexWorkspace() {
        try {
            const toast = await showToast({
                    style: Toast.Style.Animated,
                    title: "Indexing workspace...",
                    message: "Analyzing pages and extracting keywords",
                })

            const response = await controller?.indexWorkspace()

            if (!response?.success) {
                const error = new Error("An error occurred while indexing the workspace")
                setError(error)

                toast.style = Toast.Style.Failure
                toast.title = "Error indexing workspace"

                setIsIndexing(false)
                return
            }

            controller?.setIsIndexed(true)

            toast.style = Toast.Style.Success
            toast.title = "Workspace indexed successfully"

            setIsIndexing(false)

            setTimeout(() => {
                push(<Command />)
            }, 800)
        } catch (e) {
            setError(
                e instanceof Error
                    ? e
                    : new Error('Unexpected error ocurred')
            )
        }
    }

    if (error) {
        return (
            <List>
                <List.EmptyView
                    icon={Icon.XMarkCircle}
                    title="Indexing Failed"
                    description={error.message}
                />
            </List>
        )
    }

    return (
        <List isLoading={isIndexing} >
            <List.EmptyView
                title={title}
                description={description}
                icon={isIndexing ? Icon.Hourglass : Icon.Gear}
                actions={
                    <ActionPanel>
                        <Action 
                            title="Index Workspace to Begin"
                            onAction={() => handleIndexWorkspaceToBegin()}
                        />
                    </ActionPanel>
                }
            />
        </List>
    )
}