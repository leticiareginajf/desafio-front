import { useEffect, useState } from "react";
import type IFilmes from "../../interfaces/IFilmes";
import axios from "axios";
import { Box} from "@mui/material";
import MediaLista from "./MediaLista";


const ListaFilmes = () => {

  const [filmes, setFilmes] = useState<IFilmes[]>()

    useEffect(() => {

        axios.get('/filme/{id}')
        .then(resposta => {
            setFilmes(resposta.data.results)
        })
        .catch(erro => {
            console.log(erro)
        })
    }, [])

  return (
    <section>
      <h1 align="center">Os Filmes e Séries mais sensacionais!</h1>

      <Box sx={{ flexDirection: "column", padding: 14 }}>

      <MediaLista />
        
      </Box>
      </section>

    
  );
};

export default ListaFilmes;
