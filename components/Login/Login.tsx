// import { Title, Text, Anchor } from '@mantine/core';

import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Container,
    Button,
    Alert,
    LoadingOverlay,
} from '@mantine/core';
import { useState } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { AlertCircle } from 'tabler-icons-react';

export function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('You are not logged in');
    const [loginFailed, setLoginFailed] = useState<boolean>(false);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    async function submitLogin() {
        await axios
            .post('https://order-pizza-api.herokuapp.com/api/auth', {
                password,
                username,
            })
            .then(
                (response) => {
                    setMessage(response.data.msg);

                    const token = response.data.access_token;
                    if (token) {
                        setMessage('You are now logged in.');
                        sessionStorage.setItem('jwt', token);
                        Router.push('./orders');
                    } else {
                        // setMessage(response.data.msg);
                        // console.log('msg' + response.data.msg);
                        setLoginFailed(true);
                    }
                },
                (error) => {
                    // console.log('Errored Out!');
                    setLoginFailed(true);
                    if (error.response.data) {
                        setMessage(error.response.data.detail);
                    } else {
                        setMessage(
                            'Network Error, please try again. Please ensure CORS is allowed'
                        );
                    }

                    // setMessage();
                    setLoginFailed(true);
                }
            )
            .finally(() => setLoginLoading(false));
    }

    return (
        // <>
        //   <Title className={classes.title} align="center" mt={100}>
        //     Welcome to{' '}
        //     <Text inherit variant="gradient" component="span">
        //       Mantine
        //     </Text>
        //   </Title>
        //   <Text color="dimmed" align="center" size="lg" sx={{ maxWidth: 580 }} mx="auto" mt="xl">
        //     This starter Next.js project includes a minimal setup for server side rendering, if you want
        //     to learn more on Mantine + Next.js integration follow{' '}
        //     <Anchor href="https://mantine.dev/theming/next/" size="lg">
        //       this guide
        //     </Anchor>
        //     . To get started edit index.tsx file.
        //   </Text>
        // </>

        <Container size={420} my={40}>
            {/* <h1>{message}</h1> */}

            <Title
                align="center"
                sx={(theme) => ({
                    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                    fontWeight: 900,
                })}
            >
                Welcome!
            </Title>

            <Alert
                mt="xl"
                icon={<AlertCircle size={16} />}
                title="Login failed, Please try again."
                color="red"
                withCloseButton
                hidden={!loginFailed}
                onClose={() => {
                    setLoginFailed(false);
                }}
            >
                {message}
            </Alert>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <LoadingOverlay visible={loginLoading}> </LoadingOverlay>

                <TextInput
                    label="User"
                    placeholder="Your username"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    required
                    mt="md"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    fullWidth
                    mt="xl"
                    onClick={() => {
                        submitLogin();
                        setLoginLoading(true);
                    }}
                >
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
}
