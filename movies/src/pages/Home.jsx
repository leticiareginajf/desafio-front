import MovieCard from "../components/MovieCard";
import { useQuery } from "@tanstack/react-query";

import "./MoviesGrid.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;


const getTopRatedMovies = async () => {
  const topRatedUrl = `${moviesURL}top_rated?${apiKey}`;

  const res = await fetch(topRatedUrl);


  if (!res.ok) {
    throw new Error("Ocorreu um erro ao buscar os filmes");
  }


  const data = await res.json();


  return data.results;


};

const Home = () => {

   const {
    data: topMovies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: getTopRatedMovies,
  });


  return (

    <div className="container">
      <h2 className="title">Melhores Filmes:</h2>
      <div className="movies-container">
        {/* Mostra mensagem de carregamento */}
        {isLoading && <p>Carregando...</p>}

        {/* Mostra mensagem de erro */}
        {isError && <p>Ocorreu um erro ao buscar os filmes.</p>}

        {/* Quando os dados chegam, mapeia e mostra os filmes */}
        {topMovies &&
          topMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>

  );
};

export default Home;