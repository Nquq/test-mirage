import {useEffect, useState} from "react";
import {createServer, Model} from "miragejs"
import styles from '../styles/Home.module.css'
import axios from "axios";
import {FileUploader} from "react-drag-drop-files";
import {Table} from "antd";

interface IFile {
    id: number,
    name: string,
    size: number
}

createServer({
    models: {
        files: Model.extend<Partial<IFile>>({}),
    },

    routes() {
        this.namespace = 'api'

        this.get('/files', (schema, request) => {
            // @ts-ignore
            return schema.files.all()
        })

        this.post('/files', (schema, request) => {
            if (!request.requestBody) return
            let attrs = JSON.parse(request.requestBody)
            // @ts-ignore
            return schema.files.create(attrs)
        })

        this.passthrough()
    },

    seeds(server) {
        // @ts-ignore
        server.create('file', {name: 'photo.png', size: 134})
        // @ts-ignore
        server.create('file', {name: 'photo1.png', size: 1344})
        // @ts-ignore
        server.create('file', {name: 'photo2.png', size: 1334})
        // @ts-ignore
        server.create('file', {name: 'photo3.png', size: 1354})
    },
})

const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
    }
];

export default function Home() {
    const [files, setFiles] = useState<IFile[]>([])

    const handleChange = async (file:any) => {
        const tempData:IFile[] = [];
        for (let i = 0; i < file.length; i++) {
            const {name, size} = file[i];

            const response = await fetch('/api/files', {method: 'POST', body: JSON.stringify({name,size})})
            const json = await response.json()
            tempData.push(json.files)
        }
        setFiles([...files,...tempData])

    }

    useEffect(() => {
        const fetchingMovies = async () => {
            const response = await fetch('/api/files')
            const {files} = await response.json()

            setFiles(files)
        }
        fetchingMovies();
    },[])

    return (
        <>
            <Table dataSource={files} columns={columns}/>
            <FileUploader handleChange={handleChange} multiple label="Upload or drop a file right here" name='file'/>
        </>
    )
}

