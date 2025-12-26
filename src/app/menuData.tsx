// menuData.ts

// 1. Definição da Interface (Contrato de dados para o TypeScript)
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

// 2. Lista completa de itens do cardápio
export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Burger Artesanal",
    price: 35.90,
    category: "🍔 Lanches",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500",
    description: "Pão brioche, carne 180g, queijo cheddar e maionese da casa."
  },
  {
    id: "2",
    name: "Cheddar Bacon",
    price: 38.50,
    category: "🍔 Lanches",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=500",
    description: "Hambúrguer bovino, muito cheddar cremoso e fatias de bacon crocante."
  },
  {
    id: "3",
    name: "Batata Rústica",
    price: 18.00,
    category: "🍟 Acompanhamentos",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=500",
    description: "Batatas cortadas à mão, temperadas com alecrim e páprica defumada."
  },
  {
    id: "4",
    name: "Nuggets de Frango",
    price: 22.00,
    category: "🍟 Acompanhamentos",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=500",
    description: "10 unidades de nuggets crocantes acompanhados de molho barbecue."
  },
  {
    id: "5",
    name: "Suco de Laranja",
    price: 12.00,
    category: "🥤 Bebidas",
    image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=500",
    description: "Suco natural da fruta, gelado e sem açúcar (500ml)."
  },
  {
    id: "6",
    name: "Refrigerante Lata",
    price: 7.00,
    category: "🥤 Bebidas",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500",
    description: "Lata de 350ml (Coca-Cola, Guaraná ou Fanta)."
  },
  {
    id: "7",
    name: "Milkshake Chocolate",
    price: 24.90,
    category: "🍰 Sobremesas",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=500",
    description: "Batido com sorvete premium e calda de chocolate belga."
  },
  {
    id: "8",
    name: "Petit Gâteau",
    price: 26.00,
    category: "🍰 Sobremesas",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=500",
    description: "Bolinho quente com recheio cremoso e bola de sorvete de baunilha."
  }
];

// 3. Array de categorias para os botões de filtro
export const categories = [
  "Todos",
  "🍔 Lanches",
  "🍟 Acompanhamentos",
  "🥤 Bebidas",
  "🍰 Sobremesas"
];