import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BsGraphUp,
  BsWallet2,
  BsHourglassSplit,
  BsFillFileEarmarkTextFill,
} from "react-icons/bs";

import "./Movie.css";

const moviesURL = import.meta.env.VITE_API; 
const apiKey = import.meta.env.VITE_API_KEY;  

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='22' fill='%23999'>Sem imagem</text></svg>";

function formatCurrency(number) {
  if (typeof number !== "number" || number <= 0) return "Não informado";
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatRuntime(mins) {
  if (!mins || typeof mins !== "number" || mins <= 0) return "Não informado";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

async function fetchMovie(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = data?.status_message || data?.message || "";
    } catch {}
    throw new Error(detail || `Erro HTTP ${res.status}`);
  }
  return res.json();
}

export default function Movie() {
  const { id } = useParams();

  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movie", id],
    enabled: Boolean(id),
    queryFn: ({ signal }) => {
      const url = `${moviesURL}${id}?${apiKey}`;
      return fetchMovie(url, signal);
    },
    staleTime: 1000 * 60, 
    gcTime: 1000 * 60 * 5, 
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="movie-page">
        <p>Carregando...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="movie-page">
        <p>Não foi possível carregar os dados do filme.</p>
        <small>{error?.message}</small>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-page">
        <p>Filme não encontrado.</p>
      </div>
    );
  }

  const posterSrc = movie.poster_path ? `${IMG_BASE}/${movie.poster_path}` : FALLBACK_POSTER;

  return (
    <div className="movie-page">
      <img
        className="movie-poster-detail"
        src={posterSrc}
        alt={movie.title}
        loading="lazy"
      />

      <h2>{movie.title}</h2>
      {movie.tagline && <p className="tagline">{movie.tagline}</p>}

      <div className="info">
        <h3>
          <BsWallet2 /> Orçamento:
        </h3>
        <p>{formatCurrency(movie.budget)}</p>
      </div>

      <div className="info">
        <h3>
          <BsGraphUp /> Receita:
        </h3>
        <p>{formatCurrency(movie.revenue)}</p>
      </div>

      <div className="info">
        <h3>
          <BsHourglassSplit /> Duração:
        </h3>
        <p>{formatRuntime(movie.runtime)}</p>
      </div>

      <div className="info description">
        <h3>
          <BsFillFileEarmarkTextFill /> Descrição:
        </h3>
        <p>{movie.overview || "Sem descrição disponível."}</p>
      </div>
    </div>
  );
}
