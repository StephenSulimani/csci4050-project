'use client'

import { Button, Card, Field, Input, Stack, Fieldset, Spinner, Box } from "@chakra-ui/react"

import { useRouter } from 'next/navigation'
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({subsets: ['latin']});
export default function Login() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [registerPage, setRegisterPage] = useState(true);

    const router = useRouter();
    const auth = useAuth();

    useEffect(() => {
        if (auth.loggedIn) {
            router.push('/');
        }
    }, [auth.loggedIn, router])

    if (registerPage) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bgImage="url('Stockpic.png')"
                bgSize="cover"
                bgPos="center"
                bgRepeat="no-repeat"
                fontFamily={spaceGrotesk.style.fontFamily}
            >
            <Box
            position = "absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            backgroundColor="rgba(0, 0, 0, 0.2)"
            />
            <div className="grid place-items-center h-screen">
                <div className="w-full max-w-md">
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
                            <Button variant="outline" type="button" alignSelf="flex-end" onClick={() => setRegisterPage(false)} disabled={auth.loading}>
                                Login
                            </Button>
                        </Card.Footer>
                    </Card.Root>
                </div>
            </div>
            </Box>
        )
    }


    return (
        <div className="grid place-items-center h-screen">
            <div className="w-full max-w-md">
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
                        <Button variant="outline" type="button" alignSelf="flex-end" onClick={() => setRegisterPage(true)} disabled={auth.loading}>
                            Register
                        </Button>
                    </Card.Footer>
                </Card.Root>

            </div>

        </div>
    )
}
