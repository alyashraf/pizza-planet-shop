import { Welcome } from '../components/Welcome/Welcome';
import { Login } from '../components/Login/Login';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Button, Group } from '@mantine/core';

export default function HomePage() {
	return (
		<>
			{/* <Welcome /> */}
			{/* <ColorSchemeToggle /> */}
			<Login></Login>
		</>
	);
}
