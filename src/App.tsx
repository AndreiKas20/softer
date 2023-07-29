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

const changeArrFunc = (arr: Array<itemConstructArr>, state: stateLoad, item: itemConstructArr) => {
    return arr.map((v) => {
        if (item.id === v.id) {
            v.state = state
            return v
        } else {
            return v
        }
    })
}

function App() {
    const [files, setFiles] = useState<files>([])
    const {token, setToken} = useAuth()
    const [constructFiles, setConstructFiles] = useState<Array<itemConstructArr>>([])
    const [isBtnDisabled, setIsBtnDisabled] = useState(false)


    const link = window.location.href

    const generateArrFiles = (arrFiles: files) => {
        const constructArr: Array<itemConstructArr> = arrFiles.map((v) => {
            return {id: generateRandomString(), file: v, state: 'wait'}
        })
        setConstructFiles([...constructArr])
    }

    const loadFiles = (files: Array<itemConstructArr>) => {
        files.forEach((value) => {
            const arr = changeArrFunc(constructFiles, 'load', value)
            setConstructFiles([...arr])
            postFiles(value)
        })
    }

    const postFiles = (file: any) => {
        const formData = new FormData()
        formData.append('file', file.file)
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
                const arr = changeArrFunc(constructFiles, 'finish', file)
                setConstructFiles([...arr])
            })
            .catch(error => {
                const arr = changeArrFunc(constructFiles, 'err', file)
                setConstructFiles([...arr])
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
        generateArrFiles(files)
    }, [files])

    useEffect(() => {
        if (constructFiles.length === 0 || constructFiles.length >= 100 || !token) {
            setIsBtnDisabled(true)
        } else {
            setIsBtnDisabled(false)
        }
    }, [constructFiles, token])
    return (
        <Box className="App">
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <header>
                    <Login/>
                </header>
                <DragField setFiles={setFiles}/>
                <ListElms listFiles={constructFiles}/>
                <Button disabled={isBtnDisabled} onClick={() => loadFiles(constructFiles)}>
                    Загрузить. Количество
                    выбранных элементов: {constructFiles.length}
                </Button>
            </div>
        </Box>
    );
}

export default App;
