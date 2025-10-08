import { styled } from '@mui/material/styles'
import { TableCell, TableRow } from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderColor: theme.palette.grey[900] + 25,
    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'inherit',

    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.mode === 'dark' ? '#00ff88' : theme.palette.grey[900],
        fontWeight: 600,
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        height: 64,
        color: theme.palette.mode === 'dark' ? '#d0d0d0' : 'inherit'
    }
}))

export const StyledTableRow = styled(TableRow)(() => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}))
