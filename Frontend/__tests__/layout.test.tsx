import RootLayout from "../app/layout";

describe("RootLayout", () => {
  // TESTE 1: SEM MOCK (Positivo)
  it("deve renderizar o conteúdo da página passado na propriedade children", () => {
    // Chamamos o componente como uma função pura para contornar a limitação do JSDOM com a tag <html>
    const filhoDeTeste = <div data-testid="conteudo-filho">Conteúdo da Home</div>;
    const layout = RootLayout({ children: filhoDeTeste, params: Promise.resolve({}) });
    
    // O layout retorna a tag <html>. O filho do <html> é o <body>
    const body = layout.props.children;
    
    // O body tem dois filhos no seu código: o array tem o <Header /> na posição 0 e o {children} na posição 1
    const childrenPassado = body.props.children[1];
    
    // Validamos se a estrutura manteve o conteúdo exatamente como enviamos
    expect(childrenPassado).toEqual(filhoDeTeste);
  });

  // TESTE 2: SEM MOCK (Positivo)
  it("deve aplicar as classes CSS base do Tailwind no elemento body", () => {
    const layout = RootLayout({ children: <div>Teste</div>, params: Promise.resolve({}) });
    const body = layout.props.children;
    
    // Inspecionamos a string de classes diretamente nas propriedades do objeto React retornado
    expect(body.props.className).toContain("bg-[#0a0b0d]");
    expect(body.props.className).toContain("text-[#d4d7dd]");
    expect(body.props.className).toContain("flex-col");
  });
});