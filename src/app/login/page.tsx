'use client'

import { Button, Card, Field, Input, Stack, Fieldset } from "@chakra-ui/react"

import { useRouter } from 'next/navigation'
  
    export default function login() {
        const router = useRouter();

        return (
            <Card.Root maxW="sm">
                <Card.Header>
                    <Card.Title>Login</Card.Title>
                    <Card.Description>
                        Fill in the form below to login
                    </Card.Description>
                </Card.Header>
                <Card.Body>
                    <Fieldset.Root size="lg" maxW="md">
                        <Fieldset.Content>
                
                        <Field.Root>
                            <Field.Label>Email address</Field.Label>
                            <Input name="email" type="email" />
                        </Field.Root>
                
                        <Field.Root>
                            <Field.Label>Password</Field.Label>
                            <Input name="password" type="text" />
                        </Field.Root>
                        </Fieldset.Content>
                        
                    </Fieldset.Root>
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                    <Button type="submit" alignSelf="flex-start">
                        Login
                    </Button>
                    <Button variant="outline" type="button" alignSelf="flex-end" onClick={() => router.push('../register')}>
                        Register
                    </Button>
                </Card.Footer>
            </Card.Root>
        )
  }