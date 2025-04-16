'use client'

import { Button, Card, Field, Input, Stack, Fieldset, Spinner } from "@chakra-ui/react"

import { useRouter } from 'next/navigation'
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
    const auth = useAuth();

    useEffect(() => {
        if (auth.loggedIn) {
            router.push('/');
        }
    }, [auth.loggedIn, router])


    return (
        <Card.Root maxW="sm">

            <Card.Header>
                <Card.Title>Login</Card.Title>
                <Card.Description>
                    Fill in the form below to log in
                </Card.Description>
            </Card.Header>
            <Card.Body>
                <Fieldset.Root size="lg" maxW="md">
                    <Fieldset.Content>

                        <Field.Root>
                            <Field.Label>Email address</Field.Label>
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
                <Button type="submit" alignSelf="flex-start" onClick={() => auth.login(email, password)} disabled={auth.loading}>
                    Login
                </Button>
                <Button variant="outline" type="button" alignSelf="flex-end" onClick={() => router.push('../register')} disabled={auth.loading}>
                    Register
                </Button>
            </Card.Footer>
        </Card.Root>
    )
}
