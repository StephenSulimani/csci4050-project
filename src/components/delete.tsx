import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"

export default function Delete() {
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
              <Button>Yes</Button>
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