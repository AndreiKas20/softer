import React, {useEffect, useState} from 'react'
import './App.css'
import axios from "axios"
import {useAuth} from "./Context/ContextProvider"
import DragField from "./components/DragField/DragField";
import Box from "@mui/material/Box";
import Login from "./components/LogIn/Login";
import {Button} from "@mui/material";
import ListElms from "./components/ListElms/ListElms";
import {generateRandomString} from "./utils/getRandomString";

export type file = {
    path: string
    lastModified: number
    lastModifiedDate: object
    name: string
    size: number
    type: string
    webkitRelativePath: string
}

export type itemConstructArr = { id: string, file: file, state: stateLoad }

export type stateLoad = 'wait' | 'load' | 'finish' | 'err'

export type files = file[]

function App() {
    const [files, setFiles] = useState<files>([])
    const {token, setToken} = useAuth()
    const [constructFiles, setConstructFiles] = useState<Array<itemConstructArr>>([])


    const link = window.location.href

    const generateArrFiles = (arrFiles: files) => {
        const constructArr: Array<itemConstructArr> = arrFiles.map((v) => {
            return {id: generateRandomString(), file: v, state: 'wait'}
        })
        setConstructFiles([...constructArr])
    }

    const loadFiles = (files: Array<itemConstructArr>) => {
        files.forEach((value) => {
            postFiles(value.file)
        })
    }

    const postFiles = (file: any) => {
        const formData = new FormData()
        formData.append('file', file)
        console.log('token', token, file)
        const regex = /^(https?:\/\/[^/:]+)/
        const match = window.location.href.match(regex)
        if (!match) return
        axios.post(`${match[1]}:3001/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Успешная отправка на сервер', response.data.message)
                file.state = 'finish'
            })
            .catch(error => {
                console.error('Ошибка при отправке файла на сервер:', error)
            })
    }

    useEffect(() => {
        const regex = /access_token=([^&]+)/
        const match = link.match(regex)
        const token = match ? match[1] : null
        token && setToken(token)
    }, [link])

    useEffect(() => {
        const tokenURL = window.location.href
        const regex = /^(https?:\/\/[^/:]+:\d+)/
        const match = tokenURL.match(regex)
        if (match) {
            window.history.replaceState({}, document.title, match[1])
        }
    }, [])

    useEffect(() => {
        console.log('constr', constructFiles)
    }, [constructFiles])

    useEffect(() => {
        generateArrFiles(files)
    }, [files])
    return (
        <Box className="App">
            <header>
                <Login/>
            </header>
            <DragField setFiles={setFiles}/>
            <ListElms listFiles={constructFiles}/>
            <Button disabled={constructFiles.length === 0} onClick={() => loadFiles(constructFiles)}>
                Загрузить. Количество
                выбранных элементов: {constructFiles.length}
            </Button>
        </Box>
    );
}

export default App;
