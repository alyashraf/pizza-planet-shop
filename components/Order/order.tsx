import {
    Button,
    Group,
    LoadingOverlay,
    NativeSelect,
    NumberInput,
    Radio,
    RadioGroup,
    Space,
    Container,
} from '@mantine/core';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Check, X } from 'tabler-icons-react';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { IOrder } from '../../interfaces/IOrder';

function OrderPage(order: IOrder) {
    useEffect(() => {
        // Perform localStorage action
        if (!sessionStorage.getItem('jwt')) {
            Router.push('./');
        }
    }, []);

    const [size, setSize] = useState<string>(order.Size ? order.Size : 'M');
    const [table, setTable] = useState<number>(
        order.Table_No ? order.Table_No : 0
    );
    const [flavor, setFlavor] = useState<string>(
        order.Flavor ? order.Flavor : 'Cheese'
    );
    const [crust, setCrust] = useState<string>(
        order.Crust ? order.Crust : 'Normal'
    );

    const [loading, setLoading] = useState(false);

    const [createNew] = useState<boolean>(
        order.NewOrder ? order.NewOrder : false
    );

    // console.log('Size: ' + size);
    // console.log(table);
    // console.log(flavor);
    // console.log(crust);

    async function createNewPizza() {
        await axios
            .post(
                'https://order-pizza-api.herokuapp.com/api/orders',
                {
                    Crust: crust,
                    Flavor: flavor,
                    Size: size,
                    Table_No: table,
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(
                            'jwt'
                        )}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(
                (response) => {
                    // console.log('found response');
                    showNotification({
                        title: 'Created new Order',
                        message: `Successfully created new Order with OrderID ${response.data.Order_ID}`,
                        icon: <Check />,
                        color: 'green',
                    });
                },
                (error) => {
                    if (error.response) {
                        if (error.response.status === 401) {
                            // console.log('401 error');
                            showNotification({
                                title: 'User is signed out.',
                                message: 'Please sign in to continue.',
                                icon: <X />,
                                color: 'red',
                            });
                            Router.push('./');
                        } else {
                            showNotification({
                                title: 'Failed to Create New Order',
                                message:
                                    'This order already exists for this table. Please try again with a different table',
                                icon: <X />,
                                color: 'red',
                            });
                        }
                    } else {
                        showNotification({
                            title: 'Failed to Create New Order',
                            message: 'Internal Server error',
                            icon: <X />,
                            color: 'red',
                        });
                    }
                }
            )
            .finally(() => {
                setLoading(false);
            });
    }

    async function editCurrentPizza() {
        await axios
            .post(
                'https://order-pizza-api.herokuapp.com/api/orders',
                {
                    Order_ID: order.Order_ID,
                    Crust: crust,
                    Flavor: flavor,
                    Size: size,
                    Table_No: table,
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(
                            'jwt'
                        )}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(
                (response) => {
                    showNotification({
                        title: 'Updated this Order',
                        message: `Successfully updated this Order with OrderID ${response.data.Order_ID}`,
                        icon: <Check />,
                        color: 'green',
                    });
                },
                (error) => {
                    if (error.response) {
                        // console.log(error.response);

                        showNotification({
                            title: 'Failed to update order',
                            message:
                                'This order already exists for this table. Please try again with a new Table',
                            icon: <X />,
                            color: 'red',
                        });
                    } else {
                        showNotification({
                            title: 'Failed to update order',
                            message: 'Internal Server error, please try again.',
                            icon: <X />,
                            color: 'red',
                        });
                    }
                }
            )
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            <LoadingOverlay visible={loading} />
            {/* <Welcome /> */}

            <Group position="center" mt="xl">
                <RadioGroup
                    value={size}
                    onChange={setSize}
                    label="Choose the pizza size."
                    description="Size of the pizza"
                    required
                >
                    <Radio value="S" label="Small" />
                    <Radio value="M" label="Medium" />
                    <Radio value="L" label="Large" />
                    <Radio value="XL" label="Extra-Large" />
                </RadioGroup>
            </Group>

            <Group position="center" mt="xl">
                <NumberInput
                    label="Choose the Table"
                    stepHoldDelay={500}
                    stepHoldInterval={100}
                    value={table}
                    min={0}
                    max={50}
                    required
                    onChange={(t) => setTable(t === undefined ? 0 : t)}
                />
            </Group>

            <Group position="center" mt="xl">
                <NativeSelect
                    data={[
                        'Cheese',
                        'Pepperoni',
                        'BBQ',
                        'Veggie',
                        'BEEF-NORMAL',
                        'CHICKEN-FAJITA',
                    ]}
                    placeholder="Pick one"
                    label="Choose a flavor"
                    defaultValue={flavor}
                    required
                    onChange={(e) => setFlavor(e.currentTarget.value)}
                />
            </Group>

            <Group position="center" mt="xl">
                <NativeSelect
                    data={[
                        'Thin',
                        'NORMAL',
                        'Thick',
                        'Pan-Pizza',
                        'Hand-Tossed',
                        'Garlic',
                        'Cheese-Stuffed',
                    ]}
                    placeholder="Pick one"
                    label="Choose a crust"
                    defaultValue={crust}
                    required
                    onChange={(e) => setCrust(e.currentTarget.value)}
                />
            </Group>

            <Group position="center">
                <Container>
                    <Button
                        mt="xl"
                        onClick={() => {
                            createNewPizza();
                            setLoading(true);
                        }}
                        hidden={!createNew}
                    >
                        Submit Order!
                    </Button>

                    <Container />
                    <Button
                        mt="xl"
                        onClick={() => {
                            editCurrentPizza();
                            setLoading(true);
                        }}
                        hidden={createNew}
                    >
                        Update Order!
                    </Button>
                </Container>
                <Space />
            </Group>

            {/* <Group mt={'xl'} position="bottom"> */}

            {/* </Group> */}
        </>
    );
}

export default OrderPage;
