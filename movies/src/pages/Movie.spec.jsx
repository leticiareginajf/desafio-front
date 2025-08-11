import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import Movie from "./Movie";
import '@testing-library/jest-dom'


vi.mock("axios");
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "123" }), 
}));


const mockMovie = {
  id: 123,
  poster_path: "/fake_poster.jpg",
  title: "Filme de Teste",
  tagline: "Uma tagline de teste.",
  budget: 100000000,
  revenue: 500000000,
  runtime: 120,
  overview: "Esta é uma descrição de teste para o filme.",
};

describe("Movie Component", () => {
  it("deve exibir a mensagem 'Carregando...' inicialmente", () => {

    render(<Movie />);
    

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve buscar os dados do filme e exibi-los corretamente", async () => {

    axios.get.mockResolvedValueOnce({ data: mockMovie });

    render(<Movie />);

    
    await waitFor(() => {

      expect(screen.getByText("Filme de Teste")).toBeInTheDocument();
    });

    expect(screen.getByText("Uma tagline de teste.")).toBeInTheDocument();
    expect(screen.getByAltText("Filme de Teste")).toBeInTheDocument(); 
    expect(screen.getByText("$100,000,000.00")).toBeInTheDocument(); 
    expect(screen.getByText("$500,000,000.00")).toBeInTheDocument(); 
    expect(screen.getByText("120 minutos")).toBeInTheDocument(); 
    expect(screen.getByText("Esta é uma descrição de teste para o filme.")).toBeInTheDocument();
  });

  it("deve lidar com o caso em que o orçamento ou a receita são zero", async () => {
    const movieWithoutFinancials = { ...mockMovie, budget: 0, revenue: 0 };
    axios.get.mockResolvedValueOnce({ data: movieWithoutFinancials });
  
    render(<Movie />);
  
    await waitFor(() => {

      const notInformedElements = screen.getAllByText("Não informado");
      expect(notInformedElements).toHaveLength(2); 
    });
  });

  it("deve exibir a mensagem de carregamento se a chamada da API falhar", async () => {

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});


    axios.get.mockRejectedValueOnce(new Error("Erro na API"));

    render(<Movie />);


    await waitFor(() => {

      expect(consoleSpy).toHaveBeenCalledWith(
        "Houve um erro ao buscar os dados do filme:",
        expect.any(Error)
      );
    });


    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(screen.queryByText("Filme de Teste")).not.toBeInTheDocument();


    consoleSpy.mockRestore();
  });
});