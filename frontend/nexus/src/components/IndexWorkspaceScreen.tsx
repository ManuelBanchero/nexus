import { Action, ActionPanel, Icon, List, useNavigation, confirmAlert, Alert, Toast, showToast } from '@raycast/api'
import { SearchController } from '../../../../backend/src/controller/SearchController'
import { useState } from 'react'
import { Response } from '../../../../backend/src/model/types/Response'
import IndexSucceedScreen from './IndexSucceedScreen'

type IndexWorkspaceScreenProps = {
    searchController: SearchController | null
}

export default function IndexWorkspaceScreen({
   searchController 
}: IndexWorkspaceScreenProps) {
    const { push } = useNavigation()

    const [title, setTitle] = useState<string>('Non-Indexed workspace')
    const [description, setDescription] = useState<string>('Nexus requires building an initial index of your pages to enable the search engine.')
    const [isIndexing, setIsIndexing] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const alertSettings = {
        title: 'Are you sure?', 
        message: 'This process will consume OpenAI API Credits.',
        primaryAction: {
            title: 'Confirm',
            style: Alert.ActionStyle.Default
        }
    }

    const completeIndexAlertSettings = {
        message: 'Do you want to index the missing pages? This process will consume OpenAI API Credits.',
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
        if (!searchController)
            return
        indexWorkspace(() => searchController.indexWorkspace())
    }

    async function indexWorkspace(indexCallback: () => Promise<Response>) {
        const toast = await showToast({
            style: Toast.Style.Animated,
            title: "Indexing workspace...",
            message: "Analyzing pages and extracting keywords",
        })
        try {
            const response = await indexCallback()

            if (!response?.success) {
                const error = new Error("An error occurred while indexing the workspace")
                setError(error)

                toast.style = Toast.Style.Failure
                toast.title = "Error indexing workspace"

                setIsIndexing(false)
                return
            }

            searchController?.setIsIndexed(true)


            setIsIndexing(false)
            toast.message = ''

            if (searchController) {
                const amountOfPagesUnindexed = searchController.getNumberOfUnindexedPages()
                if (amountOfPagesUnindexed > 0) {
                    toast.style = Toast.Style.Failure
                    toast.title = 'Not all pages has been indexed successfully'
                    if (await confirmAlert({ 
                        title: `It's looks like ${amountOfPagesUnindexed} pages has not been indexed`, 
                        ...completeIndexAlertSettings})
                    ) {
                        // recursivelly runs indexWorkspace until: 1- All pages are indexed. Or 2- The user decides to not index the missing pages
                        return indexWorkspace(() => searchController.indexMissingPages())
                    }
                } else {
                    toast.style = Toast.Style.Success
                    toast.title = "Workspace indexed successfully"
                }
            }

            setTimeout(() => {
                push(<IndexSucceedScreen />)
            }, 800)
        } catch (e) {
            toast.style = Toast.Style.Failure
            toast.title = "Error indexing workspace"
            toast.message = ''

            setIsIndexing(false)
            setError(
                e instanceof Error
                    ? e
                    : new Error('Unexpected error ocurred')
            )
        }
    }

    if (error) {
        console.error(error)
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