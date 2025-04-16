'use client'

import { Button, Card, Field, Input, Stack, Fieldset, Spinner } from "@chakra-ui/react"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Rogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const auth = useAuth();

    useEffect(() => {
        if (auth.loggedIn) {
            router.push('/');
        }
    }, [auth.loggedIn, router])


    return (
        <Card.Root maxW="sm">
            <Card.Header>
                <Card.Title>Register</Card.Title>
                <Card.Description>
                    Fill in the form below to create an account
                </Card.Description>
            </Card.Header>
            <Card.Body>
                <Fieldset.Root size="lg" maxW="md">
                    <Fieldset.Content>

                        <Field.Root>
                            <Field.Label>Name</Field.Label>
                            <Input name="name" type="text" onChange={(e) => setName(e.target.value)} disabled={auth.loading} />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Email Address</Field.Label>
                            <Input name="email" type="email" onChange={(e) => setEmail(e.target.value)} disabled={auth.loading} />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Password</Field.Label>
                            <Input name="password" type="password" onChange={(e) => setPassword(e.target.value)} disabled={auth.loading} />
                        </Field.Root>
                    </Fieldset.Content>
                    <span style={{ color: 'red' }}>{auth.error}</span>
                </Fieldset.Root>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
                {auth.loading && <Spinner />}
                <Button type="submit" alignSelf="flex-start" onClick={() => auth.register(name, email, password)} disabled={auth.loading}>
                    Register
                </Button>
                <Button variant="outline" type="button" alignSelf="flex-end" onClick={() => router.push('../login')} disabled={auth.loading}>
                    Back to login
                </Button>
            </Card.Footer>
        </Card.Root>
    )
}
