import { Button, CloseButton, Dialog, Portal, Fieldset, Field, Input } from "@chakra-ui/react"

export default function Create() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button size="sm" className="max-w-40">
                    Create Portfolio
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Create Portfolio</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Fieldset.Root size="lg" maxW="md">
                                <Fieldset.Content>

                                    <Field.Root>
                                        <Field.Label>Portfolio Name</Field.Label>
                                        <Input name="portfolioName" type="text" />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Starting Capital</Field.Label>
                                        <Input name="startingCapital" type="number" />
                                    </Field.Root>
                                </Fieldset.Content>

                            </Fieldset.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button>Submit</Button>
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