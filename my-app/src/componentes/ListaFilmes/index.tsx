import { useEffect, useState } from "react";
import type IFilmes from "../../interfaces/IFilmes";
import axios from "axios";
import { Box } from "@mui/material";
import Cards from "../Cards/Cards";


export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export interface MovieApiResponse {
  results: Movie[];
}
const ListaFilmes = () => {

  const informacoes = [
    {
      id: 1,
      title: "Harry Potter",
      gender: "Filme",
      imageUrl: "assets/harry-potter.jpg",
    },
    {
      id: 2,
      title: "Demon Slayer",
      gender: "Anime",
      imageUrl: "assets/demon.jpg",
    },
    {
      id: 3,
      title: "Naruto",
      gender: "Anime",
      imageUrl: "assets/naruto.jpg",
    },
    {
      id: 4,
      title: "Coração de Ferro",
      gender: "Série",
      imageUrl: "assets/naruto.jpg",
    },
  ];

  const [filmes, setFilmes] = useState<IFilmes[]>()


    useEffect(() => {
        //obter os filmes e series

        axios.get('')
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



       <div className="container-fluid">
      <Box sx={{ flexDirection: "column" }}>
        <Cards
          title={informacoes[0].title}
          gender={informacoes[0].gender}
          imageUrl={informacoes[0].imageUrl}
        />

        <Cards
          title={informacoes[1].title}
          gender={informacoes[1].gender}
          imageUrl={informacoes[1].imageUrl}
        />

        <Cards
          title={informacoes[2].title}
          gender={informacoes[2].gender}
          imageUrl={informacoes[2].imageUrl}
        />


         <Cards
          title={informacoes[3].title}
          gender={informacoes[3].gender}
          imageUrl={informacoes[3].imageUrl}
        />
        
      </Box>
      </div>
    </section>
    
  );
};

export default ListaFilmes;
