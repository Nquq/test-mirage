import {useEffect, useState} from "react";
import {createServer, Model} from "miragejs"
import {FileUploader} from "react-drag-drop-files";
import {Table} from "antd";

interface IFile {
    id: number,
    name: string,
    size: number,
    type:string
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

        this.delete('/files/:id', (schema, request) => {
            let id = request.params.id
            //@ts-ignore
            return schema.files.find(id).destroy()
        })

        this.passthrough()
    },

    seeds(server) {
        let key = 0;
        // @ts-ignore
        server.create('file', {key:key++,name: 'photo.png', size: 134, type: 'image/png'})
        // @ts-ignore
        server.create('file', {key:key++,name: 'photo1.png', size: 1344, type: 'image/png'})
        // @ts-ignore
        server.create('file', {key:key++,name: 'photo2.png', size: 1334, type: 'image/png'})
        // @ts-ignore
        server.create('file', {key:key++,name: 'photo3.png', size: 1354, type: 'image/png'})
    },
})

export default function Home() {
    const [files, setFiles] = useState<IFile[]>([])

    const handleChange = async (file:any) => {
        console.log(file)
        const tempData:IFile[] = [];
        for (let i = 0; i < file.length; i++) {
            const {name, size, type} = file[i];

            const response = await fetch('/api/files', {method: 'POST', body: JSON.stringify({key:name,name,size, type})})
            const json = await response.json()
            tempData.push(json.files)
        }
        setFiles([...files,...tempData])

    }

    const handleDelete = async (id:number) => {
        const response = await fetch(`/api/files/${id}`, {method: 'DELETE'})

        setFiles(files.filter((file)=> file.id !== id))
    }

    useEffect(() => {
        const fetchingMovies = async () => {
            const response = await fetch('/api/files')
            const {files} = await response.json()

            setFiles(files)
        }
        fetchingMovies();
    },[])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (_:any,record:IFile) => <button onClick={()=>handleDelete(record.id)}>Delete</button>
        }
    ];

    return (
        <>
            <Table dataSource={files} columns={columns}/>
            <FileUploader handleChange={handleChange} multiple label="Upload or drop a file right here" name='file'/>
        </>
    )
}

