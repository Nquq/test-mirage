import {useEffect, useState} from "react";
import {createServer, Model} from "miragejs"
import Upload from "rc-upload";
import {string} from "prop-types";
import axios from "axios";

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

export default function Home() {
    const [files, setFiles] = useState<IFile[]>([])

    const props = {
        action: '/api/files'
        },
        customRequest() {
            axios.post(action, file)
        }
        // action: async ({name,size}):any => {
        //     const response = await fetch('/api/files', {method: 'POST', body: JSON.stringify({name, size})})
        //     const json = await response.json()
        //
        //     setFiles([...files, json.files])
        // },
        // onStart: async ({name, size}:any) => {
        //     const response = await fetch('/api/files', {method: 'POST', body: JSON.stringify({name, size})})
        //     const json = await response.json()
        //
        //     setFiles([...files, json.files])
        // },
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
            {files?.length > 0 ?
                <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>size</th>
                </tr>
                </thead>
                <tbody>
                {files?.map(file => (
                    <tr key={file.id}>
                        <td>{file.id}</td>
                        <td>{file.name}</td>
                        <td>{file.size}</td>
                    </tr>
                ))}
                </tbody>
            </table> : <p>Loading...</p>}
            <button>
                {/*@ts-ignore*/}
                <Upload {...props}>
                    <a>Добавить файл</a>
                </Upload>
            </button>
        </>
        // <ul>
        //   {movies?.map((movie) => (
        //       <li key={movie.id}>
        //         {movie.fileName} ({movie.weight})
        //       </li>
        //   ))}
        // </ul>
    )
}

