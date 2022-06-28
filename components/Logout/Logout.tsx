// import { Title, Text, Anchor } from '@mantine/core';
import { Button, Grid, Space } from '@mantine/core';
import Router from 'next/router';

function logoutSession() {
    if (sessionStorage.getItem('jwt')) {
        sessionStorage.removeItem('jwt');
        // console.log('logged out');
        Router.push('./');
    } else {
        // console.log('Not logged in!');
    }
}

export default function Logout() {
    return (
        <>
            {/* <Space></Space> */}
            <Grid mt="xs" mb="xs" justify="flex-end">
                <Button
                    onClick={() => {
                        logoutSession();
                    }}
                >
                    {' '}
                    Logout!{' '}
                </Button>
                <Space w="md" />
            </Grid>
        </>
    );
}
