import { Button, CloseButton, Dialog, Portal, Fieldset, Field, Input } from "@chakra-ui/react"
import { useState } from 'react'

export default function Sell(props: any) {

    const [ticker, setTicker] = useState('')
    const [amount, setAmount] = useState('')

    const sellStock = async (id: any) => {
        const response = await fetch(`/api/portfolio/order`, {
          method: 'Post',
          credentials: "include",
          body: JSON.stringify({
            ticker: ticker,
            type: 'Sell',
            amount: amount,
            portfolio_id: id
          })
        });
    
        if (response.ok) {
          // Handle successful buy
          console.log('Stock has been sold!');
          props.updateState(true)
        } else {
          // Handle error
          console.error('Failed to sell stock');
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button colorPalette="red" size="sm" className="max-w-40">
                    Sell Stock
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Sell Stock</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Fieldset.Root size="lg" maxW="md">
                                <Fieldset.Content>

                                    <Field.Root>
                                        <Field.Label>Ticker</Field.Label>
                                        <Input name="ticker" type="text" onChange={event => setTicker(event.target.value)}/>
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Number of Shares</Field.Label>
                                        <Input name="numShares" type="number" onChange={event => setAmount(event.target.value)}/>
                                    </Field.Root>
                                </Fieldset.Content>

                            </Fieldset.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                                <Button onClick={() => sellStock(props.id)}>Submit</Button>
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