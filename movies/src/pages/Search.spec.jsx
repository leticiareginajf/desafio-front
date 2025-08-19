import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Search from "./Search";

vi.mock("../components/MovieCard", () => ({
  default: ({ movie }) => <div data-testid="movie-card">{movie.title}</div>,
}));
vi.mock("../components/Snackbar", () => ({
  default: ({ show, message }) => (show ? <div role="alert">{String(message)}</div> : null),
}));

function renderWithProviders(ui, initialUrl = "/search?q=matrix") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, 
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
  it("não busca e orienta a digitar quando não há query", async () => {
    const spy = vi.spyOn(global, "fetch");
    renderWithProviders(<Search />, "/search");
    expect(screen.getByText(/Digite um termo para buscar/i)).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
  });

  it("mostra estado de carregamento enquanto busca", async () => {
    vi.spyOn(global, "fetch").mockReturnValueOnce(new Promise(() => {}));
    renderWithProviders(<Search />, "/search?q=teste");
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it("renderiza cards quando a busca tem sucesso", async () => {
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

    const cards = await screen.findAllByTestId("movie-card");
    expect(cards).toHaveLength(2);
    expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(String(global.fetch.mock.calls[0][0])).toMatch(/query=acao/);
  });

  it("mostra Snackbar e mensagem quando não há resultados", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => ({ results: [] }),
  });

  renderWithProviders(<Search />, "/search?q=asdf");

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/Nenhum resultado encontrado para "asdf"/i);

  const msgs = screen.getAllByText(/Nenhum resultado encontrado para "asdf"/i);
  expect(msgs).toHaveLength(2);

  expect(screen.queryAllByTestId("movie-card")).toHaveLength(0);
  });
});