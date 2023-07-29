import React, {useCallback} from 'react';
import {FileRejection, useDropzone} from "react-dropzone";
import styles from './DragField.module.scss'

interface IDragField {
    setFiles: React.Dispatch<React.SetStateAction<any[]>>
}

const DragField = ({setFiles}: IDragField) => {

    const onDrop = useCallback((acceptedFiles: File[], rejection: FileRejection[]) => {
        setFiles(acceptedFiles)
    }, [setFiles])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    return (
        <div className={styles.block} {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Отпустите файл в этом месте...</p> :
                    <p>Перетащите файл в заданную область или нажмите на это сообщение и выберете из списка</p>
            }
        </div>
    );
};

export default DragField;
