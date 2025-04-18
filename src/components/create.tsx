import { Button, CloseButton, Dialog, Portal, Fieldset, Field, Input } from "@chakra-ui/react"
import { useState } from 'react'

export default function Create(props: any) {

    const [name, setName] = useState('')
    const [capital, setCapital] = useState('')

    const createPortfolio = async () => {
        const response = await fetch(`/api/portfolio/`, {
          method: 'PUT',
          credentials: "include",
          body: JSON.stringify({
            name: name,
            starting_Capital: capital
          })
        });
    
        if (response.ok) {
          // Handle successful creation
          console.log('Portfolio created!');
          props.updateState(false)
        } else {
          // Handle error
          console.error('Failed to create portfolio');
        }
    };

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
                                        <Input name="portfolioName" type="text" onChange={event => setName(event.target.value)}/>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Starting Capital</Field.Label>
                                        <Input name="startingCapital" type="number" onChange={event => setCapital(event.target.value)}/>
                                    </Field.Root>
                                </Fieldset.Content>

                            </Fieldset.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                                <Button onClick={() => createPortfolio()}>Submit</Button>
                            </Dialog.ActionTrigger>
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