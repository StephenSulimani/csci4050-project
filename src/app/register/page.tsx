'use client'

import { Button, Card, Field, Input, Stack, Fieldset } from "@chakra-ui/react"

import { useRouter } from 'next/navigation'
  
    export default function login() {
        const router = useRouter();

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
                                        <Input name="name" type="text" />
                                    </Field.Root>
                            
                                    <Field.Root>
                                        <Field.Label>Email Address</Field.Label>
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
                                    Register
                                </Button>
                                <Button variant="outline" type="button" alignSelf="flex-end" onClick={() => router.push('../login')}>
                                    Back to login
                                </Button>
                            </Card.Footer>
                        </Card.Root>
        )
  }