import { Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

const formatRows = (rows: any[]) => rows.map(row => ({
  name: row.name
}))

const SelectedFilesTable = ({ rows, activeIndex, isLoading }: any) => {
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 130 },
    {
      field: 'analyzed',
      headerName: 'Analyzed',
      sortable: false,
      width: 160,
      valueParser: (params: GridValueGetterParams) => {
        console.log(params)
        return ''
      }
    },
  ];
  

  if (isLoading) return <Typography>Loading Data...</Typography>;

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={formatRows(rows)}
        columns={columns}
        density='compact'
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  )
}

export default SelectedFilesTable;