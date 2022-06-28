import {
	AppShell,
	Aside,
	Button,
	Card,
	CheckboxIcon,
	Drawer,
	Grid,
	Group,
	Header,
	Modal,
	NativeSelect,
	Navbar,
	NumberInput,
	Radio,
	RadioGroup,
	SimpleGrid,
	Stack,
	Table,
	Space,
	Container,
	Skeleton,
	ChevronIcon,
} from '@mantine/core';
import { Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { Cross1Icon } from '@modulz/radix-icons';
import axios from 'axios';
import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Check } from 'tabler-icons-react';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import Logout from '../components/Logout/Logout';
import OrderPage from '../components/Order/order';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { Welcome } from '../components/Welcome/Welcome';
import { IOrder } from '../interfaces/IOrder';

function Orders() {
	useEffect(() => {
		// check if user has a auth token
		if (!sessionStorage.getItem('jwt')) {
			Router.push('./');
		}
	}, []);

	const [deleteOrder, setDeleteOrder] = useState<IOrder>();
	const [editOrder, setEditOrder] = useState<IOrder>();
	const [orders, setOrders] = useState<Array<IOrder>>([]);
	const [query, setQuery] = useState<string>('');
	const [debounced] = useDebouncedValue(query, 200);
	const [openModal, setOpenModal] = useState(false);
	const [openEditMenu, setOpenEditMenu] = useState(false);
	const [dataChanged, setDataChanged] = useState(false);

	const modals = useModals();

	const firstUpdate = useRef(true);
	useEffect(() => {
		if (firstUpdate.current || deleteOrder === undefined) {
			firstUpdate.current = false;
			return;
		} else {
			openDeleteModal();
		}
	}, [deleteOrder]);

	function openDeleteModal() {
		modals.openConfirmModal({
			title: 'Delete order ' + deleteOrder?.Order_ID,
			centered: true,
			children: (
				<Text size="sm">
					Are you sure you want to remove this Order?
				</Text>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			onCancel: () => {
				// setDataChanged(false);
				console.log('Cancel');
			},
			onConfirm: () => {
				sendDeleteOrder(deleteOrder?.Order_ID);
				setDataChanged(!dataChanged);
				console.log('Confirmed');
			},
			onClose: () => {
				setDataChanged(!dataChanged);
			},
		});
	}

	async function sendDeleteOrder(orderID: number | null | undefined) {
		console.log('sendDeleteOrder:' + orderID);

		if (!orderID || orderID === undefined) {
			showNotification({
				id: 'hello-there',
				disallowClose: true,
				onClose: () => console.log('unmounted'),
				onOpen: () => console.log('mounted'),
				autoClose: 5000,
				title: 'Error undefined order',
				message: 'Please try again',
				// color: 'red',
				icon: <Cross1Icon />,
				className: 'my-notification-class',
				// style: { backgroundColor: 'red' },
				// sx: { backgroundColor: 'red' },
				loading: false,
			});
		}

		await axios
			.delete(
				'https://order-pizza-api.herokuapp.com/api/orders/' + orderID,
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem(
							'jwt'
						)}`,
						'Content-Type': 'application/json',
					},
				}
			)
			.then(() => {
				// setDataChanged(!dataChanged);
				console.log('deleted successfully');
				showNotification({
					title: 'Deleted',
					message: 'Pizza Order ' + orderID + ' was removed',
					icon: <Check />,
					color: 'green',
				});
			})
			.catch((err) => {
				console.log(err);
				// setDataChanged(!dataChanged);
				// TODO: failed notif
				showNotification({
					id: '',
					disallowClose: true,
					onClose: () => console.log('unmounted'),
					onOpen: () => console.log('mounted'),
					autoClose: 5000,
					title: 'Server Error',
					message: 'Please try again',
					// color: 'red',
					icon: <Cross1Icon color="red" />,
					className: 'my-notification-class',
					loading: false,
				});
			});
		setDataChanged(!dataChanged);
	}

	function filterSizeHelper(order: Array<IOrder>, query: string) {
		//small
		query = query.toLowerCase();
		if (query === 'small' || query === 'sm' || query === 's') {
			return orders.filter((order) => {
				return order.Size?.includes('S');
			});
		}

		if (
			query === 'medium' ||
			query === 'med' ||
			query === 'md' ||
			query === 'm'
		) {
			return orders.filter((order) => {
				return order.Size?.includes('M');
			});
		}

		if (query === 'large' || query === 'lg' || query === 'l') {
			return orders.filter((order) => {
				return order.Size ? order.Size === 'L' : false;
			});
		}

		if (
			query === 'extralarge' ||
			query === 'xlarge' ||
			query === 'xl' ||
			query === 'm'
		) {
			return orders.filter((order) => {
				return order.Size ? order.Size === 'XL' : false;
			});
		}
	}

	function filterOrders(orders: Array<IOrder>, query: string) {
		if (!query) {
			return orders;
		}

		query = query.toLowerCase();

		let sizeOrder = filterSizeHelper(orders, query);

		return (
			sizeOrder ||
			orders.filter((order) => {
				const crust = order.Crust
					? order.Crust.toLowerCase().includes(query)
					: false;
				const flavor = order.Flavor
					? order.Flavor.toLowerCase().includes(query)
					: false;

				let tableQuery = false;

				if (parseInt(query)) {
					tableQuery = order.Table_No === parseInt(query);
				}
				return crust || flavor || tableQuery;
			})
		);
	}

	useEffect(() => {
		console.log('update table data');
		async function getAllOrders() {
			await axios
				.get('https://order-pizza-api.herokuapp.com/api/orders')
				.then((res) => {
					setOrders(res.data);
				})
				.catch((err) => console.log(err));
		}
		getAllOrders();
	}, [dataChanged, deleteOrder]);

	console.log(orders);
	console.log(query);

	const filteredOrders = filterOrders(orders, debounced);

	return (
		<>
			<AppShell
				padding="md"
				// navbar={
				// 	<Navbar width={{ base: 300 }} height={500} p="xs">
				// 		{/* Navbar content */}
				// 	</Navbar>
				// }
				header={
					<Header height={80} p="xs">
						{
							<Grid>
								<Grid.Col xs={6}>
									<ColorSchemeToggle></ColorSchemeToggle>
								</Grid.Col>
								<Grid.Col xs={6}>
									<Space></Space>
									<Logout></Logout>
								</Grid.Col>
							</Grid>
						}
					</Header>
				}
				// aside={
				// 	<Aside width={{ base: 300 }} height={500} p="xs">
				// 		{/* Aside content */}
				// 	</Aside>
				// }
				styles={(theme) => ({
					main: {
						backgroundColor:
							theme.colorScheme === 'dark'
								? theme.colors.dark[8]
								: theme.colors.gray[0],
					},
				})}
			>
				<Modal
					opened={openModal}
					onClose={() => {
						setDataChanged(!dataChanged), setOpenModal(false);
					}}
					title="Create a new Order"
				>
					{/* Modal content */}
					<OrderPage
						NewOrder={true}
						Order_ID={null}
						Size={'M'}
						Timestamp={null}
						Flavor={'BBQ'}
						Crust={'NORMAL'}
						Table_No={1}
					/>
				</Modal>

				<Drawer
					opened={openEditMenu}
					onClose={() => {
						setOpenEditMenu(false);
						setDataChanged(!dataChanged);
					}}
					title="Edit This Order"
					padding="xl"
					size="xl"
				>
					{/* Drawer content */}
					<Text>Editing order #{editOrder?.Order_ID}</Text>

					<OrderPage
						NewOrder={false}
						Order_ID={editOrder?.Order_ID}
						Size={editOrder?.Size}
						Timestamp={editOrder?.Timestamp}
						Flavor={editOrder?.Flavor}
						Crust={editOrder?.Crust}
						Table_No={editOrder?.Table_No}
					/>
				</Drawer>

				<Welcome />

				<Container my="md">
					<Grid>
						<Grid.Col xs={10}>
							<SearchBar
								value={query}
								onChange={(e) =>
									setQuery(e.currentTarget.value)
								}
								// width={200}
								size={'md'}
							></SearchBar>
						</Grid.Col>
						<Grid.Col xs={2}>
							<Button
								onClick={() => {
									setOpenModal(true);
								}}
							>
								Create Order
							</Button>
						</Grid.Col>
						<Grid.Col xs={12}>
							<Table
								mt={'xl'}
								highlightOnHover
								verticalSpacing={'md'}
							>
								<thead>
									<tr>
										<th>Table Number</th>
										<th>Crust</th>
										<th>Flavor</th>
										<th>Size</th>
										<th></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{filteredOrders.map((order) => (
										<tr key={order.Order_ID}>
											<td>{order.Table_No}</td>
											<td>{order.Crust}</td>
											<td>{order.Flavor}</td>
											<td>{order.Size}</td>
											<td>
												{' '}
												<Button
													onClick={() => {
														setOpenEditMenu(true);
														setEditOrder(order);
													}}
												>
													Edit
												</Button>
											</td>
											<td>
												<Button
													// onClick={() => {
													// 	setDeleteOrder(order);
													// 	openDeleteModal();
													// }}
													onClick={() =>
														setDeleteOrder(order)
													}
													color="red"
												>
													Delete
												</Button>
												{/* <Button
													onClick={() => {
														setOpenModal(true);
														setDeleteOrder(order);
													}}
													color="red"
												>
													{' '}
													Delete
												</Button> */}
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Grid.Col>
					</Grid>
				</Container>

				{/* <Stack
					mt={'xl'}
					align="center"
					sx={(theme) => ({
						backgroundColor:
							theme.colorScheme === 'dark'
								? theme.colors.dark[8]
								: theme.colors.gray[0],
					})}
				>
					{filteredOrders.map((order) => (
						<Card key={order.Order_ID}>
							<Grid>
								<Grid.Col span={4}>{order.Crust}</Grid.Col>
								<Grid.Col span={4}>{order.Flavor}</Grid.Col>
								<Grid.Col span={4}>{order.Size}</Grid.Col>
								<Grid.Col span={4}>{order.Table_No}</Grid.Col>
								<Grid.Col span={4}>{order.Timestamp}</Grid.Col>
							</Grid>
							<Button
								onClick={() => {
									setOpenEditMenu(true);
									setEditOrder(order);
								}}
							>
								Edit
							</Button>
							<Button
								onClick={() => {
									setOpenModal(true);
									setDeleteOrder(order);
								}}
							>
								{' '}
								Delete
							</Button>
						</Card>
					))}
				</Stack> */}

				{/* <Table mt={'xl'} highlightOnHover>
					<thead>
						<tr>
							<th>Table Number</th>
							<th>Crust</th>
							<th>Flavor</th>
							<th>Size</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{filteredOrders.map((order) => (
							<tr key={order.Order_ID}>
								<td>{order.Table_No}</td>
								<td>{order.Crust}</td>
								<td>{order.Flavor}</td>
								<td>{order.Size}</td>
								<td>
									{' '}
									<Button
										onClick={() => {
											setOpenEditMenu(true);
											setEditOrder(order);
										}}
									>
										Edit
									</Button>
								</td>
								<td>
									{' '}
									<Button
										onClick={() => {
											setOpenModal(true);
											setDeleteOrder(order);
										}}
									>
										{' '}
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table> */}
			</AppShell>
		</>
	);
}

export default Orders;
