import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useRouter } from 'next/navigation'

export default function Delete(props: any) {

  const router = useRouter();

  const deletePortfolio = async (id: any) => {
    const response = await fetch(`../api/portfolio/${id}`, {
      method: 'DELETE',
      credentials: "include"
    });

    if (response.ok) {
      // Handle successful deletion
      console.log('Portfolio deleted!');
      router.push('../')
    } else {
      // Handle error
      console.error('Failed to delete portfolio');
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button colorPalette="red" size="sm" className="max-w-40">
          Delete Portfolio
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Are you sure you want to delete this portfolio?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">No</Button>
              </Dialog.ActionTrigger>
              <Button onClick={() => deletePortfolio(props.id)}>Yes</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}