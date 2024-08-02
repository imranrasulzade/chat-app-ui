import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onFileUpload = () => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        axios.post("http://localhost:8080/api/upload", formData)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error("There was an error uploading the file!", error);
            });
    };

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>Upload!</button>
        </div>
    );
};

export default FileUpload;
