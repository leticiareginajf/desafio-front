import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./Home";

// Stub do MovieCard para não depender do componente real
vi.mock("../components/MovieCard", () => ({
  default: ({ movie }) => <div data-testid="movie-card">{movie.title}</div>,
}));

// Helper para renderizar com React Query
function renderWithClient(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }, // evita atraso em falhas
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("Home page", () => {
  it("mostra estado de carregamento inicialmente", async () => {
    // Deixa o fetch pendente até depois da asserção
    const pending = new Promise(() => {});
    vi.spyOn(global, "fetch").mockReturnValueOnce(pending);

    renderWithClient(<Home />);

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it("renderiza os filmes quando a requisição tem sucesso", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { id: 1, title: "Filme A" },
          { id: 2, title: "Filme B" },
        ],
      }),
    });

    renderWithClient(<Home />);

    // some "Carregando..." appears first; depois os cards
    const cards = await screen.findAllByTestId("movie-card");
    expect(cards).toHaveLength(2);
    expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ocorreu um erro/i)).not.toBeInTheDocument();
  });

  it("mostra mensagem de erro quando a requisição falha", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    renderWithClient(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText(/Ocorreu um erro ao buscar os filmes/i)
      ).toBeInTheDocument();
    });
  });

  it("lida com lista vazia sem quebrar (0 cards)", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    renderWithClient(<Home />);

    await waitFor(() => {
      expect(screen.queryAllByTestId("movie-card")).toHaveLength(0);
    });
    expect(screen.queryByText(/Ocorreu um erro/i)).not.toBeInTheDocument();
  });
});
