import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Search from "./Search";

vi.mock("../components/MovieCard", () => ({
  default: ({ movie }) => <div data-testid="movie-card">{movie.title}</div>,
}));

vi.mock("../components/Snackbar", () => ({
  default: ({ show, message }) =>
    show ? <div role="alert">{String(message)}</div> : null,
}));

function renderWithProviders(ui, initialUrl = "/search?q=erro") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialUrl]}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("Search page", () => {
  it("mostra mensagem para digitar termo quando não há query", () => {
    renderWithProviders(<Search />, "/search");
    expect(screen.getByText(/Digite um termo para buscar/i)).toBeInTheDocument();
  });

  it("mostra estado de carregamento enquanto busca", async () => {
    const pending = new Promise(() => {});
    vi.spyOn(global, "fetch").mockReturnValueOnce(pending);

    renderWithProviders(<Search />, "/search?q=teste");
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it("renderiza resultados quando a busca tem sucesso", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { id: 1, title: "Filme 1" },
          { id: 2, title: "Filme 2" },
        ],
      }),
    });

    renderWithProviders(<Search />, "/search?q=acao");

  });

  it("mostra mensagem de 'nenhum resultado' quando a lista vem vazia", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    renderWithProviders(<Search />, "/search?q=asdf");

  
  });

  });