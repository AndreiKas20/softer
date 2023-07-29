import React, {useCallback} from 'react';
import {FileRejection, useDropzone} from "react-dropzone";

interface IDragField {
    setFiles:  React.Dispatch<React.SetStateAction<any[]>>
}

const DragField = ({setFiles}: IDragField) => {

    const onDrop = useCallback((acceptedFiles: File[], rejection: FileRejection[]) => {
        console.log('FILES', acceptedFiles, rejection)
        setFiles(acceptedFiles)
    }, [setFiles])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    );
};

export default DragField;
