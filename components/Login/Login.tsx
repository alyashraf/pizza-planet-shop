// import { Title, Text, Anchor } from '@mantine/core';
import useStyles from './Login.styles';

import {
	TextInput,
	PasswordInput,
	Checkbox,
	Anchor,
	Paper,
	Title,
	Text,
	Container,
	Group,
	Button,
	Alert,
	LoadingOverlay,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { setCookies } from 'cookies-next';
import { AlertCircle } from 'tabler-icons-react';
import { error } from 'console';

export function Login() {
	const { classes } = useStyles();

	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [message, setMessage] = useState<string>('You are not logged in');
	const [loginFailed, setLoginFailed] = useState<boolean>(false);
	const [loginLoading, setLoginLoading] = useState<boolean>(false);

	// useEffect(() => {
	// 	// Perform localStorage action
	// 	if (sessionStorage.getItem('jwt')) {
	// 		setMessage('You are already logged in!');
	// 		Router.push('./orders');
	// 	}
	// }, []);

	async function submitLogin() {
		const res = await axios
			.post('https://order-pizza-api.herokuapp.com/api/auth', {
				password: password,
				username: username,
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
						console.log('msg' + response.data.msg);
						setLoginFailed(true);
					}
				},
				(error) => {
					console.log('Errored Out!');
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

		// await fetch(
		// 	'https://order-pizza-api.herokuapp.com/api/auth',
		// 	{
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			Accept: 'application/json',
		// 			// 'Access-Control-Allow-Origin': '*'
		// 		},
		// 		body: JSON.stringify({
		// 			password: password,
		// 			username: username,
		// 		}),
		// 	}
		// )
		// 	.then((t) => t.json()).
		// 	.catch((e) => {
		// 		console.log(e);
		// 		setMessage(e.message);
		// 		setLoginFailed(true);
		// 		return;
		// 	}).finally(storeToken(res))
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
				mt={'xl'}
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

			{/* <Text color="dimmed" size="sm" align="center" mt={5}>
				Do not have an account yet?{' '}
				<Anchor<'a'> href="#" size="sm" onClick={(event) => event.preventDefault()}>
					Create account
				</Anchor>
			</Text> */}

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
				{/* <Group position="apart" mt="md">
					<Checkbox label="Remember me" />
					<Anchor<'a'> onClick={(event) => event.preventDefault()} href="#" size="sm">
						Forgot password?
					</Anchor>
				</Group> */}
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
