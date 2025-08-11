/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock das envs ANTES de importar o componente
vi.stubEnv("VITE_SEARCH", "https://api.themoviedb.org/3/search/movie");
vi.stubEnv("VITE_API_KEY", "api_key=TEST_KEY");

// Mock do axios
vi.mock("axios", () => ({
  default: { get: vi.fn() },
}));

// Mock do MovieCard para não depender do real
vi.mock("../components/MovieCard", () => ({
  default: ({ movie }) => <div data-testid="movie-card">{movie.title}</div>,
}));

// Mock do Snackbar para simplificar
vi.mock("../components/Snackbar", () => ({
  default: ({ show, message }) => (show ? <div data-testid="snackbar">{message}</div> : null),
}));

import axios from "axios";
import Search from "./Search";

// Helper para renderizar com querystring
const renderWithRouter = (queryString = "?q=test") => {
  return render(
    <MemoryRouter initialEntries={[`/search${queryString}`]}>
      <Routes>
        <Route path="/search" element={<Search />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Search page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir "Carregando..." inicialmente', () => {
    axios.get.mockResolvedValueOnce({ data: { results: [] } });
    renderWithRouter("?q=matrix");
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it("deve buscar e exibir filmes quando há resultados", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          { id: 1, title: "Matrix" },
          { id: 2, title: "Interstellar" },
        ],
      },
    });

    renderWithRouter("?q=matrix");

    const cards = await screen.findAllByTestId("movie-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Matrix");
    expect(cards[1]).toHaveTextContent("Interstellar");

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/search/movie?api_key=ee5932d99ecf2f2bb1852653a19b5049&query=matrix"
      );
    });
  });

  it("deve exibir Snackbar de erro quando a API falha", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    renderWithRouter("?q=erro");

    const snackbar = await screen.findByTestId("snackbar");
    expect(snackbar).toHaveTextContent(
      "Ocorreu uma falha ao buscar os resultados."
    );
  });
});
