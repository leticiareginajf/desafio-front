import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Movie from "./Movie";

beforeEach(() => {
  vi.resetAllMocks();
});

function renderWithProviders(ui, route = "/movie/123") {
  const queryClient = new QueryClient();
  window.history.pushState({}, "Test page", route);

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/movie/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Movie page", () => {
  it("deve exibir estado de carregamento e depois os dados do filme", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 123,
        title: "Filme Teste",
        poster_path: "/poster.jpg",
        tagline: "Uma tagline",
        budget: 1000000,
        revenue: 5000000,
        runtime: 120,
        overview: "Descrição do filme",
      }),
    });

    renderWithProviders(<Movie />);

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Filme Teste")).toBeInTheDocument();
    });
    expect(screen.getByText(/Uma tagline/)).toBeInTheDocument();
    expect(screen.getByText(/Descrição do filme/)).toBeInTheDocument();
  });

  it("deve mostrar mensagem de erro quando a requisição falhar", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ status_message: "Erro no servidor" }),
    });

    renderWithProviders(<Movie />);
  });
});
