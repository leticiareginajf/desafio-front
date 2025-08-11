import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("axios", () => ({ default: { get: vi.fn() } }));
vi.mock("../components/MovieCard", () => ({
  default: ({ movie }) => <div data-testid="movie-card">{movie.title}</div>,
}));

import axios from "axios";
import Home from "./Home";

describe("Home", () => {
  beforeEach(() => vi.clearAllMocks());

  it('mostra "Carregando..." inicialmente e faz a requisição', async () => {
    axios.get.mockResolvedValueOnce({ data: { results: [] } });

    render(<Home />);


    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/top_rated\?/));
    });
  });

  it("renderiza MovieCards quando a API responde com resultados", async () => {
    axios.get.mockResolvedValueOnce({
      data: { results: [{ id: 1, title: "Matrix" }, { id: 2, title: "Interstellar" }] },
    });

    render(<Home />);

    const cards = await screen.findAllByTestId("movie-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Matrix");
    expect(cards[1]).toHaveTextContent("Interstellar");
  });

  it('lida com erro mantendo "Carregando..." (lista vazia)', async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(<Home />);
    await waitFor(() => {
      expect(errSpy).toHaveBeenCalled();
    });

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    errSpy.mockRestore();
  });
});
