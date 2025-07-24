import { Box, Button } from "@mui/material";


const TMDB = () => {


    return(
        <>
        <Box sx={{display: 'flex', padding: '50px', margin: '10px', columnGap: '10px'}}>
        <Button variant="contained">Cadastro de Filmes</Button>
        <Button variant="contained">Consulta de Filmes</Button>
        </Box>
        
        </>
      
    )
}

export default TMDB;