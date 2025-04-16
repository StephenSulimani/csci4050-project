import {
    Button,
    Field,
    Fieldset,
    For,
    Input,
    NativeSelect,
    Stack,
  } from "@chakra-ui/react"
  
  const Login = () => {
    return (
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend>Login</Fieldset.Legend>
          <Fieldset.HelperText>
            Please login below.
          </Fieldset.HelperText>
        </Stack>
  
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
  
        <Button type="submit" alignSelf="flex-start">
          Submit
        </Button>
        <Button type="button" alignSelf="flex-end">
            Register
        </Button>
      </Fieldset.Root>
    )
  }