import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "../components/MovieCard";
import Snackbar from "../components/Snackbar";

import "./MoviesGrid.css";

const searchURL = import.meta.env.VITE_SEARCH; 
const apiKey = import.meta.env.VITE_API_KEY; 

async function fetchMovies(url, signal) {


  setIsLoading(true);
  setError(true);

  const res = await fetch(url, { signal });
  if (!res.ok) {

    let detail = "";
    try {
      const data = await res.json();
      detail = data?.status_message || data?.message || "";
    } catch { /* ignore */ }
    throw new Error(detail || `Erro HTTP ${res.status}`);
  }
  const data = await res.json();
  return data?.results ?? [];
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const {
    data: movies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["search-movies", query],
    queryFn: ({ signal }) => {
      const url = `${searchURL}?${apiKey}&query=${encodeURIComponent(query)}`;
      return fetchMovies(url, signal);
    },
    enabled: Boolean(query),
    staleTime: 1000 * 60,      
    gcTime: 1000 * 60 * 5,    
    retry: 1,                 
  });

  return (
    <div className="container">
      <h2 className="title">
        Resultados para: <span className="query-text">{query || "..."}</span>
      </h2>

      <div className="movies-container">
        {(!query) && <p>Digite um termo para buscar.</p>}

        {query && isLoading && <p>Carregando...</p>}

        {query && !isLoading && !isError && movies.length > 0 &&
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        }

        {query && !isLoading && !isError && movies.length === 0 &&
          <p>Nenhum resultado encontrado para "{query}".</p>
        }
      </div>

      <Snackbar 
        show={!!error}
        message={error}
        onClose={() => setError(null)}
      />
    </div>
  );
}
