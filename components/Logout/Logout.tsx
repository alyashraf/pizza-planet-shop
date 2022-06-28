// import { Title, Text, Anchor } from '@mantine/core';
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
	Grid,
	Space,
	Center,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { setCookies } from 'cookies-next';
import { AlertCircle } from 'tabler-icons-react';
import { error } from 'console';

function logoutSession() {
	if (sessionStorage.getItem('jwt')) {
		sessionStorage.removeItem('jwt');
		console.log('logged out');
		Router.push('./');
	} else {
		console.log('Not logged in!');
	}
}

export default function Logout() {
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
		<>
			{/* <Space></Space> */}
			<Grid mt={'xs'} mb={'xs'} justify={'flex-end'}>
				<Button
					onClick={() => {
						logoutSession();
					}}
				>
					{' '}
					Logout!{' '}
				</Button>
				<Space w={'md'}></Space>
			</Grid>
		</>
	);
}
