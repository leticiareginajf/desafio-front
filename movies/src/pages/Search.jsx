import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "../components/MovieCard";
import Snackbar from "../components/Snackbar";
import "./MoviesGrid.css";

const searchURL = import.meta.env.VITE_SEARCH;  
const apiKey   = import.meta.env.VITE_API_KEY;

async function fetchMovies(query, signal) {
  const url = `${searchURL}?${apiKey}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal });

  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = data?.status_message || data?.message || "";
    } catch {}
    throw new Error(detail || `Erro HTTP ${res.status}`);
  }

  const data = await res.json();
  return data?.results ?? [];
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const {
    data: movies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["search-movies", query],
    enabled: Boolean(query),
    queryFn: ({ signal }) => fetchMovies(query, signal),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: 1,
    keepPreviousData: true,
  });


 const noResults = query && !isLoading && !isError && movies.length === 0;


  return (
    <div className="container">
      <h2 className="title">
        Resultados para: <span className="query-text">{query || "..."}</span>
      </h2>

      <div className="movies-container">
        {!query && <p>Digite um termo para buscar.</p>}
        {query && isLoading && <p>Carregando...</p>}

        {query && !isLoading && !isError && movies.length > 0 &&
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        }

        {query && !isLoading && !isError && movies.length === 0 &&
          <p>Nenhum resultado encontrado para "{query}".</p>
        }
      </div>

      <Snackbar
        show={isError || noResults}
        message={
          isError
            ? (error?.message || "Ocorreu uma falha ao buscar os resultados.")
            : `Nenhum resultado encontrado para "${query}".`
        }
        onClose={() => {}}
      />
    </div>
  );
}
