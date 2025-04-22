import { Button, CloseButton, Dialog, Portal, Fieldset, Field, Input, Spinner } from "@chakra-ui/react"
import { propagateServerField } from "next/dist/server/lib/render-server";
import { useState } from 'react'

export default function Order(props: { id: string, orderType: 'BUY' | 'SELL', updateState: (setChosen: boolean) => void }) {

    const [ticker, setTicker] = useState('')
    const [amount, setAmount] = useState<number>(0)
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false)

    const OrderStock = async (id: any) => {
        setLoading(true);
        setErrorMsg('');
        const response = await fetch(`/api/portfolio/order`, {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                ticker: ticker,
                type: props.orderType,
                amount: parseInt(amount),
                portfolio_id: id
            })
        });

        const data = await response.json();

        setLoading(false);

        if (data.status == 1) {
            // Handle successful buy
            console.log('Stock has been purchased!');
            setOpen(false);
            props.updateState(true);
        } else {
            // Handle error
            console.error('Failed to place order');
            setErrorMsg(data.message)
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button colorPalette={props.orderType === "BUY" ? "green" : "red"} size="sm" className="max-w-40">
                    {props.orderType} Stock
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{props.orderType} Stock</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Fieldset.Root size="lg" maxW="md">
                                <Fieldset.Content>

                                    <Field.Root>
                                        <Field.Label>Ticker</Field.Label>
                                        <Input name="ticker" type="text" onChange={event => setTicker(event.target.value)} />
                                    </Field.Root>

                                    <Field.Root>
                                        <Field.Label>Number of Shares</Field.Label>
                                        <Input name="numShares" type="number" onChange={event => setAmount(event.target.value)} />
                                    </Field.Root>
                                </Fieldset.Content>

                            </Fieldset.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <span style={{ color: 'red' }}>{errorMsg}</span>
                            {loading && <Spinner />}
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button onClick={() => OrderStock(props.id)}>Submit</Button>
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
