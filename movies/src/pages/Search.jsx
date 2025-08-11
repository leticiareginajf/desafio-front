import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Snackbar from "../components/Snackbar";
import axios from "axios";

import './MoviesGrid.css';

const searchURL = import.meta.env.VITE_SEARCH;
const apiKey = import.meta.env.VITE_API_KEY;

const Search = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const query = searchParams.get("q");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const getSearchedMovies = async (url) => {

    setIsLoading(true);
    setError(true);

    try {
    const res = await axios.get(url);
    setMovies(res.data.results);
  } catch (err) {
    console.error("Erro ao realizar a busca:", err);
    setError("Ocorreu uma falha ao buscar os resultados.");
  } finally {
    setIsLoading(false);
  }
  };
  
  useEffect(() => {
    const searchWithQueryURL = `${searchURL}?${apiKey}&query=${query}`;
    getSearchedMovies(searchWithQueryURL);
  }, [query]);

  return (
    <div className="container">
      <h2 className="title">
        Resultados para: <span className="query-text">{query || "..."}</span>
      </h2>
      <div className="movies-container">
        {isLoading && <p>Carregando...</p>}
        {!isLoading && movies.length > 0 && 
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        {!isLoading && movies.length === 0 && !error && query &&
          <p>Nenhum resultado encontrado para "{query}".</p>}
      </div>
      <Snackbar 
        show={!!error}
        message={error}
        onClose={() => setError(null)}
      />
    </div>
  );
};

export default Search;