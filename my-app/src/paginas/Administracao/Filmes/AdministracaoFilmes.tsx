import { useEffect, useState } from "react"
import type IFilmes from "../../../interfaces/IFilmes"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import axios from "axios"

const AdministracaoFilmes = () => {


    const [filmes, setFilmes] = useState<IFilmes[]>()


    useEffect(() =>{

        axios.get<IFilmes[]>('')
        .then(resposta => setFilmes(resposta.data))

    }, [])

return(
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        Nome:
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {filmes?.map(filme => 
                    <TableRow>
                    <TableCell>
                        {filme.nome}
                    </TableCell>
                </TableRow>
                )}
                
            </TableBody>
        </Table>

    </TableContainer>
)

}


export default AdministracaoFilmes