import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import cors from 'cors'

const app = express()
const upload = multer()

// const accessToken = ''
app.use(cors())
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        res.status(400).json({error: 'Файл не найден.'})
        return;
    }

    const accessToken = req.headers.authorization.replace('Bearer ', '');
    const apiUrl = 'https://cloud-api.yandex.net/v1/disk/resources/upload'
    const uploadUrl = `${apiUrl}?path=${encodeURIComponent(file.originalname)}&overwrite=true`

    fetch(uploadUrl, {
        method: 'GET',
        headers: {
            'Authorization': `OAuth ${accessToken}`,
        },
    })
        .then(response => response.json())
        .then(uploadData => {
            const uploadHref = uploadData.href

            const formData = new FormData()
            formData.append('file', file.buffer, {filename: file.originalname})

            fetch(uploadHref, {
                method: 'PUT',
                headers: {
                    'Authorization': `OAuth ${accessToken}`,
                },
                body: formData,
            })
                .then(() => {
                    res.json({message: 'Файл успешно загружен на Яндекс.Диск.'})
                })
                .catch(error => {
                    console.error('Ошибка при загрузке файла на Яндекс.Диск:', error)
                    res.status(500).json({error: 'Ошибка при загрузке файла на Яндекс.Диск.'})
                })
        })
        .catch(error => {
            console.error('Ошибка при запросе к API Яндекс.Диска:', error);
            res.status(500).json({error: 'Ошибка при загрузке файла на Яндекс.Диск.'})
        });
});

const port = 3001
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}.`)
})