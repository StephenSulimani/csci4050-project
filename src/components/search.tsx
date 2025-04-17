import { Card, Heading, Input } from '@chakra-ui/react'

export default function Search() {
    return (
        <Card.Root size="sm">
            <Card.Header>
                <Heading size="md">Search for a Stock</Heading>
            </Card.Header>
            <Card.Body color="fg.muted">
                <div>
                    <p>Ticker:</p>
                    <Input name="name" type="text" placeholder="IBM" />
                </div>
                <div>
                    <p>IDK what data we wanna display here or how we wanna do it but this is where we would display data about the stock</p>
                </div>
            </Card.Body>
        </Card.Root>
    );
}