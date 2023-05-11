import { useEffect, useState } from "react";
import { createServer, Model } from "miragejs";
import { Button } from "@fluentui/react-button";
import {
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableCellLayout,
  TableColumnDefinition,
} from "@fluentui/react-table";
import Upload, { UploadProps } from "rc-upload";

interface IFile {
  id: number | string;
  name: string;
  size: number;
  type: string;
}

createServer({
  models: {
    files: Model.extend<Partial<IFile>>({}),
  },

  routes() {
    this.namespace = "api";

    this.get("/files", (schema, request) => {
      // @ts-ignore
      return schema.files.all();
    });

    this.post("/files", (schema, request) => {
      if (!request.requestBody) return;
      let attrs = JSON.parse(request.requestBody);
      // @ts-ignore
      return schema.files.create(attrs);
    });

    this.delete("/files/:id", (schema, request) => {
      let id = request.params.id;
      //@ts-ignore
      return schema.files.find(id).destroy();
    });
  },

  seeds(server) {
    let key = 0;
    // @ts-ignore
    server.create("file", {
      // @ts-ignore
      name: "photo.png",
      size: 134,
      type: "image/png",
    });
    // @ts-ignore
    server.create("file", {
      // @ts-ignore
      name: "photo1.png",
      size: 1344,
      type: "image/png",
    });
    // @ts-ignore
    server.create("file", {
      // @ts-ignore
      name: "photo2.png",
      size: 1334,
      type: "image/png",
    });
    // @ts-ignore
    server.create("file", {
      // @ts-ignore
      name: "photo3.png",
      size: 1354,
      type: "image/png",
    });
  },
});

export default function Fluent() {
  const [files, setFiles] = useState<IFile[]>([]);

  const handleDelete = async (id: number | string) => {
    const response = await fetch(`/api/files/${id}`, { method: "DELETE" });

    setFiles(files.filter((file) => file.id !== id));
  };

  useEffect(() => {
    const fetchingMovies = async () => {
      const response = await fetch("/api/files");
      const { files } = await response.json();

      setFiles(files);
    };
    fetchingMovies();
  }, []);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    type: "drag",
    action: "/api/files",
    async onSuccess(file: Record<string, any>) {
      console.log("Success", file);
      const { name, size, type } = file;

      setFiles((prevState) => [...prevState, { name, size, type, id: name }]);
    },
    customRequest: async function ({ file, onSuccess }) {
      // @ts-ignore
      const { name, size, type } = file;
      console.log(name, size, type);
      const response = await fetch("/api/files", {
        method: "POST",
        body: JSON.stringify({ name, size, type }),
      });
      onSuccess?.(file);
    },
    style: {
      display: "inline-block",
      width: 200,
      height: 200,
      background: "#eee",
      cursor: "pointer",
    },
  };

  const columns: TableColumnDefinition<IFile>[] = [
    createTableColumn<IFile>({
      columnId: "name",
      compare: (a, b) => {
        return a.name.localeCompare(b.name);
      },
      renderHeaderCell: () => {
        return "Name";
      },
      renderCell: (item) => {
        return <TableCellLayout>{item.name}</TableCellLayout>;
      },
    }),
    createTableColumn<IFile>({
      columnId: "size",
      compare: (a, b) => {
        return a.size > b.size ? a.size : b.size;
      },
      renderHeaderCell: () => {
        return "Size";
      },
      renderCell: (item) => {
        return <TableCellLayout>{item.size}</TableCellLayout>;
      },
    }),
    createTableColumn<IFile>({
      columnId: "type",
      compare: (a, b) => {
        return a.type.localeCompare(b.type);
      },
      renderHeaderCell: () => {
        return "Type";
      },
      renderCell: (item) => {
        return <TableCellLayout>{item.type}</TableCellLayout>;
      },
    }),
    createTableColumn<IFile>({
      columnId: "action",
      renderHeaderCell: () => {
        return "Action";
      },
      renderCell: (item) => {
        return (
          <TableCellLayout>
            <Button
              appearance={"primary"}
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </Button>
          </TableCellLayout>
        );
      },
    }),
  ];
  console.log(files);
  return (
    <>
      <DataGrid
        items={files}
        columns={columns}
        sortable
        getRowId={(item) => item.name}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<IFile>>
          {({ item, rowId }) => (
            <DataGridRow<IFile> key={rowId}>
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Upload {...props}>Добавить файл</Upload>
    </>
  );
}
