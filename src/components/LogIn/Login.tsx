import React from 'react';
import {useAuth} from "../../Context/ContextProvider";
import {Button, Link} from "@mui/material";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const Login = () => {
    const {token, setToken} = useAuth()
    return (
        <Box>
            {
                (!token || token?.length < 5) &&
                <Link href={'https://oauth.yandex.ru/authorize?response_type=token&client_id=66b44391b888425499c760e82fc04d14'}>
                    Выполнить вход
                </Link>
            }
            {
                token && token.length >= 5 &&
                <>
                    <p>Вход выполнен. Можете приступить к передаче файлов</p>
                    <Button onClick={() => setToken('')}>Выход</Button>
                </>
            }
        </Box>
    );
};

export default Login;
