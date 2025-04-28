
"use client"; // Adiciona a diretiva para componente cliente

import { useState } from 'react';

// Tipagem para os resultados da busca (igual à da API)
interface ResultadoBusca {
  id: string;
  nome: string;
  preco: string;
  loja: string;
  url: string;
  descricao?: string;
  imagem?: string;
}

// Lista de lojas e farmácias
const lojasDisponiveis = [
  // Lojas de Varejo
  { id: 'amazon', nome: 'Amazon BR' },
  { id: 'mercadolivre', nome: 'Mercado Livre' },
  { id: 'magalu', nome: 'Magazine Luiza' },
  { id: 'americanas', nome: 'Americanas' },
  { id: 'casasbahia', nome: 'Casas Bahia' },
  // Farmácias
  { id: 'drogasil', nome: 'Drogasil' },
  { id: 'drogaraia', nome: 'Droga Raia' },
  { id: 'paguemenos', nome: 'Pague Menos' },
  { id: 'ultrafarma', nome: 'Ultrafarma' },
  { id: 'drogariasp', nome: 'Drogaria SP' },
];

export default function Home() {
  const [termoBusca, setTermoBusca] = useState('');
  // Inicia com todas as lojas/farmácias selecionadas
  const [lojasSelecionadas, setLojasSelecionadas] = useState<string[]>(lojasDisponiveis.map(l => l.id));
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSelecaoLoja = (event: React.ChangeEvent<HTMLInputElement>) => {
    const lojaId = event.target.value;
    if (event.target.checked) {
      setLojasSelecionadas([...lojasSelecionadas, lojaId]);
    } else {
      setLojasSelecionadas(lojasSelecionadas.filter(id => id !== lojaId));
    }
  };

  const handleBusca = async () => {
    if (!termoBusca.trim() || lojasSelecionadas.length === 0) return;
    setBuscando(true);
    setResultados([]);
    setErro(null);
    console.log(`Buscando por: ${termoBusca} nas lojas: ${lojasSelecionadas.join(', ')}`);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ termoBusca, lojasSelecionadas }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro na API: ${response.statusText}`);
      }

      const data = await response.json();
      setResultados(data.resultados || []);
      if (data.resultados.length === 0) {
        // Se a API retorna array vazio, consideramos como "nenhum resultado"
      }

    } catch (error: any) {
      console.error('Erro ao buscar:', error);
      setErro(error.message || 'Ocorreu um erro ao buscar os preços. Tente novamente.');
      setResultados([]); // Limpa resultados em caso de erro
    } finally {
      setBuscando(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 bg-gray-50">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800 w-full">Comparador de Preços</h1>
      </div>

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md mb-8">
        {/* Barra de Busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Digite o EAN ou nome do produto"
            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleBusca()} // Permite buscar com Enter
          />
          <button
            onClick={handleBusca}
            disabled={buscando || !termoBusca.trim() || lojasSelecionadas.length === 0}
            className={`p-3 px-6 rounded-md text-white font-semibold transition-colors duration-200 ${buscando || !termoBusca.trim() || lojasSelecionadas.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {buscando ? 'Buscando...' : 'Buscar Preços'}
          </button>
        </div>

        {/* Seleção de Lojas */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Pesquisar em:</h2>
          {/* Ajuste no grid para acomodar mais opções */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {lojasDisponiveis.map((loja) => (
              <div key={loja.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`loja-${loja.id}`}
                  value={loja.id}
                  checked={lojasSelecionadas.includes(loja.id)}
                  onChange={handleSelecaoLoja}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor={`loja-${loja.id}`} className="ml-2 text-sm font-medium text-gray-900">{loja.nome}</label>
              </div>
            ))}
          </div>
           {lojasSelecionadas.length === 0 && (
             <p className="text-red-600 text-sm mt-2">Selecione pelo menos uma loja para pesquisar.</p>
           )}
        </div>
      </div>

      {/* Área de Resultados */}
      <div className="w-full max-w-3xl">
        {buscando && (
          <div className="text-center text-gray-600 py-4">Carregando resultados...</div>
        )}
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline"> {erro}</span>
          </div>
        )}
        {!buscando && !erro && resultados.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Resultados da Busca para "{termoBusca}":</h2>
            <div className="space-y-4">
              {/* Resultados já vêm ordenados da API */}
              {resultados.map((resultado) => (
                <div key={resultado.id} className="border border-gray-200 p-4 rounded-md hover:shadow-sm transition-shadow duration-200 flex flex-col sm:flex-row gap-4 items-start">
                  {resultado.imagem && (
                    <img src={resultado.imagem} alt={resultado.nome} className="w-24 h-24 object-contain rounded border border-gray-200 flex-shrink-0" />
                  )}
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{resultado.nome}</h3>
                    <p className="text-2xl font-bold text-green-600 my-1">{resultado.preco}</p>
                    <p className="text-sm text-gray-600 mb-1">Vendido por: <span className="font-semibold">{resultado.loja}</span></p>
                    {resultado.descricao && (
                       <p className="text-sm text-gray-500 mb-2">{resultado.descricao}</p>
                    )}
                    <a href={resultado.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium inline-block mt-1">
                      Ver na loja
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!buscando && !erro && resultados.length === 0 && termoBusca && (
           <div className="text-center text-gray-500 py-4">Nenhum resultado encontrado para "{termoBusca}".</div>
        )}
      </div>

    </main>
  );
}
