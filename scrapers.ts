import axios from 'axios';
import * as cheerio from 'cheerio';

// Tipagem para os resultados da busca
export interface ResultadoBusca {
  id: string;
  nome: string;
  preco: string;
  loja: string;
  url: string;
  descricao?: string;
  imagem?: string;
}

// Função para verificar se o termo é um EAN (código de barras)
export function isEAN(termo: string): boolean {
  // EANs geralmente têm 8, 12, 13 ou 14 dígitos
  const eanRegex = /^[0-9]{8,14}$/;
  return eanRegex.test(termo);
}

// Função para limpar e formatar o preço
export function formatarPreco(precoStr: string): string {
  // Remove caracteres não numéricos, exceto vírgula e ponto
  const precoLimpo = precoStr.replace(/[^\d,.]/g, '');
  
  // Converte para número e formata como moeda brasileira
  const precoNum = parseFloat(precoLimpo.replace('.', '').replace(',', '.'));
  if (isNaN(precoNum)) return 'Preço indisponível';
  
  return `R$ ${precoNum.toFixed(2).replace('.', ',')}`;
}

// Função para gerar um ID único para o resultado
export function gerarId(loja: string, nome: string): string {
  return `${loja}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Funções de scraping para lojas de varejo
export async function scrapeMercadoLivre(termo: string): Promise<ResultadoBusca[]> {
  try {
    const isCodigoEAN = isEAN(termo);
    const url = isCodigoEAN 
      ? `https://lista.mercadolivre.com.br/${termo}` 
      : `https://lista.mercadolivre.com.br/${termo.replace(/\s+/g, '-')}`;
    
    // Simulação de resultados para demonstração
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: gerarId('mercadolivre', termo),
        nome: `${termo} - Produto Mercado Livre`,
        preco: formatarPreco(`R$ ${(Math.random() * 150 + 50).toFixed(2)}`),
        loja: 'Mercado Livre',
        url: url,
        descricao: `Produto ${termo} com entrega rápida e garantia.`,
        imagem: 'https://http2.mlstatic.com/storage/developers-site-cms-admin/CDV_ML/279643196832-210621-mla-logo-1.jpg'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar no Mercado Livre:', error);
    return [];
  }
}

export async function scrapeAmazon(termo: string): Promise<ResultadoBusca[]> {
  try {
    const isCodigoEAN = isEAN(termo);
    const url = isCodigoEAN 
      ? `https://www.amazon.com.br/s?k=${termo}` 
      : `https://www.amazon.com.br/s?k=${encodeURIComponent(termo)}`;
    
    // Simulação de resultados para demonstração
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: gerarId('amazon', termo),
        nome: `${termo} - Amazon Prime`,
        preco: formatarPreco(`R$ ${(Math.random() * 180 + 45).toFixed(2)}`),
        loja: 'Amazon BR',
        url: url,
        descricao: `Produto ${termo} com entrega Amazon Prime.`,
        imagem: 'https://m.media-amazon.com/images/G/32/social_share/amazon_logo._CB633267191_.png'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar na Amazon:', error);
    return [];
  }
}

export async function scrapeMagalu(termo: string): Promise<ResultadoBusca[]> {
  try {
    const url = `https://www.magazineluiza.com.br/busca/${encodeURIComponent(termo)}`;
    
    // Simulação de resultados para demonstração
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      {
        id: gerarId('magalu', termo),
        nome: `${termo} - Magazine Luiza`,
        preco: formatarPreco(`R$ ${(Math.random() * 160 + 55).toFixed(2)}`),
        loja: 'Magazine Luiza',
        url: url,
        descricao: `Produto ${termo} com entrega rápida.`,
        imagem: 'https://logodownload.org/wp-content/uploads/2014/07/magazine-luiza-logo-1.png'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar na Magazine Luiza:', error);
    return [];
  }
}

export async function scrapeAmericanas(termo: string): Promise<ResultadoBusca[]> {
  try {
    const url = `https://www.americanas.com.br/busca/${encodeURIComponent(termo)}`;
    
    // Simulação de resultados para demonstração
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return [
      {
        id: gerarId('americanas', termo),
        nome: `${termo} - Americanas`,
        preco: formatarPreco(`R$ ${(Math.random() * 170 + 40).toFixed(2)}`),
        loja: 'Americanas',
        url: url,
        descricao: `Produto ${termo} com entrega expressa.`,
        imagem: 'https://logodownload.org/wp-content/uploads/2018/01/americanas-logo-4.png'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar na Americanas:', error);
    return [];
  }
}

export async function scrapeCasasBahia(termo: string): Promise<ResultadoBusca[]> {
  try {
    const url = `https://www.casasbahia.com.br/${encodeURIComponent(termo)}`;
    
    // Simulação de resultados para demonstração
    await new Promise(resolve => setTimeout(resolve, 850));
    
    return [
      {
        id: gerarId('casasbahia', termo),
        nome: `${termo} - Casas Bahia`,
        preco: formatarPreco(`R$ ${(Math.random() * 140 + 60).toFixed(2)}`),
        loja: 'Casas Bahia',
        url: url,
        descricao: `Produto ${termo} com garantia estendida.`,
        imagem: 'https://logodownload.org/wp-content/uploads/2014/12/casas-bahia-logo-1.png'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar na Casas Bahia:', error);
    return [];
  }
}

// Funções de scraping para farmácias
export async function scrapeDrogasil(termo: string): Promise<ResultadoBusca[]> {
  try {
    const url = `https://www.drogasil.com.br/search?w=${encodeURIComponent(termo)}`;
    
    // Simulação de resultados para demonstração
    await new Promise(resolve => setTimeout(resolve, 750));
    
    return [
      {
        id: gerarId('drogasil', termo),
        nome: `${termo} - Drogasil`,
        preco: formatarPreco(`R$ ${(Math.random() * 120 + 30).toFixed(2)}`),
        loja: 'Drogasil',
        url: url,
        descricao: `Produto ${termo} com entrega rápida.`,
        imagem: 'https://www.drogasil.com.br/static/images/logo-drogasil.svg'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar na Drogasil:', error);
    return [];
  }
}

export async function scrapeDrogaRaia(termo: string): Promise<ResultadoBusca[]> {
  try {
    const url = `https://www.drogaraia.com.br/search?q=${encodeURIComponent(termo)}`;
    
    // Simulação de resultados para demonstração
    await new Promise(resolve => setTimeout(resolve, 780));
    
    return [
      {
        id: gerarId('drogaraia', termo),
        nome: `${termo} - Droga Raia`,
        preco: formatarPreco(`R$ ${(Math.random() * 110 + 35).toFixed(2)}`),
        loja: 'Droga Raia',
        url: url,
        descricao: `Produto ${termo} com entrega em até 24h.`,
        imagem: 'https://www.drogaraia.com.br/static/version1681752693/frontend/Raia/default/pt_BR/images/logo.svg'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar na Droga Raia:', error);
    return [];
  }
}

export async function scrapePagueMenos(termo: string): Promise<ResultadoBusca[]> {
  try {
    const url = `https://www.paguemenos.com.br/busca?q=${encodeURIComponent(termo)}`;
    
    // Simulação de resultados para demonstração
    await new Promise(resolve => setTimeout(resolve, 820));
    
    return [
      {
        id: gerarId('paguemenos', termo),
        nome: `${termo} - Pague Menos`,
        preco: formatarPreco(`R$ ${(Math.random() * 100 + 25).toFixed(2)}`),
        loja: 'Pague Menos',
        url: url,
        descricao: `Produto ${termo} com desconto Sempre Bem.`,
        imagem: 'https://static.paguemenos.com.br/img/logo-pague-menos.svg'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar na Pague Menos:', error);
    return [];
  }
}

export async function scrapeUltrafarma(termo: string): Promise<ResultadoBusca[]> {
  try {
    const url = `https://www.ultrafarma.com.br/busca?q=${encodeURIComponent(termo)}`;
    
    // Simulação de resultados para demonstração
    await new Promise(resolve => setTimeout(resolve, 730));
    
    return [
      {
        id: gerarId('ultrafarma', termo),
        nome: `${termo} - Ultrafarma`,
        preco: formatarPreco(`R$ ${(Math.random() * 90 + 20).toFixed(2)}`),
        loja: 'Ultrafarma',
        url: url,
        descricao: `Produto ${termo} com preço baixo.`,
        imagem: 'https://www.ultrafarma.com.br/static/img/logo-ultrafarma.svg'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar na Ultrafarma:', error);
    return [];
  }
}

export async function scrapeDrogariaSP(termo: string): Promise<ResultadoBusca[]> {
  try {
    const url = `https://www.drogariasaopaulo.com.br/search?q=${encodeURIComponent(termo)}`;
    
    // Simulação de resultados para demonstração
    await new Promise(resolve => setTimeout(resolve, 760));
    
    return [
      {
        id: gerarId('drogariasp', termo),
        nome: `${termo} - Drogaria SP`,
        preco: formatarPreco(`R$ ${(Math.random() * 115 + 28).toFixed(2)}`),
        loja: 'Drogaria SP',
        url: url,
        descricao: `Produto ${termo} com entrega rápida.`,
        imagem: 'https://www.drogariasaopaulo.com.br/static/version1681752693/frontend/DSP/default/pt_BR/images/logo.svg'
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar na Drogaria SP:', error);
    return [];
  }
}

// Mapeamento de IDs de lojas para funções de scraping
export const scrapers: Record<string, (termo: string) => Promise<ResultadoBusca[]>> = {
  // Lojas de varejo
  'mercadolivre': scrapeMercadoLivre,
  'amazon': scrapeAmazon,
  'magalu': scrapeMagalu,
  'americanas': scrapeAmericanas,
  'casasbahia': scrapeCasasBahia,
  // Farmácias
  'drogasil': scrapeDrogasil,
  'drogaraia': scrapeDrogaRaia,
  'paguemenos': scrapePagueMenos,
  'ultrafarma': scrapeUltrafarma,
  'drogariasp': scrapeDrogariaSP,
};
