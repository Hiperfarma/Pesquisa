import { NextRequest, NextResponse } from 'next/server';
import { ResultadoBusca, scrapers } from '@/lib/scrapers'; // Importa a interface e os scrapers

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { termoBusca, lojasSelecionadas } = body;

    if (!termoBusca || !lojasSelecionadas || !Array.isArray(lojasSelecionadas) || lojasSelecionadas.length === 0) {
      return NextResponse.json({ error: 'Termo de busca e pelo menos uma loja selecionada são obrigatórios.' }, { status: 400 });
    }

    console.log(`API Recebeu busca por: '${termoBusca}' nas lojas: ${lojasSelecionadas.join(', ')}`);

    // Filtra os scrapers disponíveis com base nas lojas selecionadas
    const promessasScraping = lojasSelecionadas
      .filter(lojaId => scrapers[lojaId]) // Garante que temos um scraper para a loja
      .map(lojaId => scrapers[lojaId](termoBusca)); // Chama a função de scrape correspondente

    if (promessasScraping.length === 0) {
      return NextResponse.json({ error: 'Nenhuma loja válida selecionada para busca.' }, { status: 400 });
    }

    const resultadosPorLoja = await Promise.allSettled(promessasScraping);

    const todosResultados: ResultadoBusca[] = [];
    resultadosPorLoja.forEach((resultado, index) => {
      // Encontra o lojaId correspondente (considerando apenas os que tinham scraper)
      const lojaIdCorrespondente = lojasSelecionadas.filter(id => scrapers[id])[index];
      if (resultado.status === 'fulfilled') {
        todosResultados.push(...resultado.value);
      } else {
        console.error(`Erro ao buscar na loja ${lojaIdCorrespondente}:`, resultado.reason);
        // Opcional: Adicionar um log ou notificação de erro para a loja específica
      }
    });

    // Ordena por preço (do menor para o maior) - A função formatarPreco já está no scrapers.ts
    todosResultados.sort((a, b) => {
      // Extrai o valor numérico do preço formatado
      const precoA = parseFloat(a.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
      const precoB = parseFloat(b.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
      // Trata casos onde o preço pode não ser um número válido (ex: 'Preço indisponível')
      if (isNaN(precoA) && isNaN(precoB)) return 0;
      if (isNaN(precoA)) return 1; // Coloca preços inválidos no final
      if (isNaN(precoB)) return -1; // Coloca preços inválidos no final
      return precoA - precoB;
    });

    console.log(`Retornando ${todosResultados.length} resultados.`);

    return NextResponse.json({ resultados: todosResultados });

  } catch (error) {
    console.error('Erro na API de busca:', error);
    // Verifica se o erro é de parsing do JSON
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Formato de requisição inválido.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro interno no servidor ao processar a busca.' }, { status: 500 });
  }
}

// Adicionar GET apenas para verificar se a rota está ativa (opcional)
export async function GET() {
  return NextResponse.json({ message: 'API de busca está ativa. Use POST para buscar.' });
}

