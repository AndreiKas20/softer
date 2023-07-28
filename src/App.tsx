import React, {useCallback, useEffect, useRef, useState} from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import './App.css';
import axios from "axios";
import {useAuth} from "./Context/ContextProvider";

function App() {
    const [files, setFiles] = useState<any>([])
    const {token, setToken} = useAuth()
    const refIn = useRef(null)
    const onDrop = useCallback((acceptedFiles: File[], rejection: FileRejection[]) => {
        console.log('FILES', acceptedFiles, rejection)
        setFiles(acceptedFiles)
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const link = window.location.href

    const postFiles = () => {
        const formData = new FormData();
        formData.append('file', files);
        console.log('token', token)
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
            })
            .catch(error => {
                console.error('Ошибка при отправке файла на сервер:', error)
            });
    }

    const loadFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return
        const file = e.target.files[0]
        console.log('files', e.target.files)
        setFiles(file)
    }

    useEffect(() => {
        const regex = /access_token=([^&]+)/;
        const match = link.match(regex);
        const token = match ? match[1] : null;
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
    return (
        <div className="App">
            <input onChange={loadFiles} ref={refIn} type={'file'}/>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
            <a href={'https://oauth.yandex.ru/authorize?response_type=token&client_id=66b44391b888425499c760e82fc04d14'}>Link</a>
            <button onClick={postFiles}>Load...</button>
        </div>
    );
}

export default App;
