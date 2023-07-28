import React, {useCallback, useState} from 'react'
import {DropzoneOptions, DropzoneState, FileRejection, useDropzone} from 'react-dropzone'
import './App.css';
import axios from "axios";

function App() {
    const [files, setFiles] = useState<any[]>([])
  const onDrop = useCallback((acceptedFiles: File[], rejection: FileRejection[]) => {
    // Do something with the files
      console.log('FILES', acceptedFiles, rejection)
      setFiles(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const postFiles = () => {
      axios.get('https://cloud-api.yandex.net/v1/disk/resources/upload?path=<C:%5CUsers%5CAndrey%5Cbotox_avenue%5Csrc%5Ctypes%5Ccss.d.ts>')
          .then((value) => console.log(value)).catch((err) => console.log('err', err))
    }
  return (
    <div className="App">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
        <button onClick={postFiles} >Load...</button>
    </div>
  );
}

export default App;
