import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import axios from "axios";
import Home from "./Home";

vi.mock("axios");

vi.mock("../components/MovieCard", () => ({
  default: ({ movie }) => (
    <div data-testid="movie-card">{movie.title}</div>
  ),
}));

describe("<Home />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('mostra "Carregando..." e depois renderiza os filmes', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          { id: 1, title: "Filme A" },
          { id: 2, title: "Filme B" },
        ],
      },
    });

    render(<Home />);

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
    expect(screen.getByText(/Melhores Filmes:/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getAllByTestId("movie-card")).toHaveLength(2)
    );
    expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    expect(screen.getByText("Filme A")).toBeInTheDocument();
    expect(screen.getByText("Filme B")).toBeInTheDocument();

    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("trata erro na busca sem quebrar a tela", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    render(<Home />);

    expect(screen.getByText(/Melhores Filmes:/i)).toBeInTheDocument();
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    consoleSpy.mockRestore();
  });
});
