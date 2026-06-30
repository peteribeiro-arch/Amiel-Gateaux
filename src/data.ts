import { Product } from './types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Torta de Limão Siciliano',
    category: 'doces',
    price: 89.90,
    ingredients: ['Limão Siciliano', 'Leite Condensado', 'Merengue Italiano', 'Massa de Biscoito Amanteigado'],
    imageUrl: '/src/assets/images/lemon_meringue_tart_1782777880427.jpg',
    description: 'Nossa famosa torta com creme cítrico aveludado de limão siciliano, coberta com um merengue dourado impecável.',
    sizes: [
      { id: 'size-1-p', name: 'Individual (Fatia)', price: 18.00 },
      { id: 'size-1-m', name: 'Média (8 fatias)', price: 89.90 },
      { id: 'size-1-g', name: 'Grande (14 fatias)', price: 145.00 }
    ]
  },
  {
    id: '2',
    name: 'Torta de Morango Silvestre',
    category: 'doces',
    price: 98.00,
    ingredients: ['Morangos Frescos', 'Creme de Baunilha Real', 'Geleia de Brilho', 'Massa Podre Doce'],
    imageUrl: '/src/assets/images/strawberry_tart_1782777704003.jpg',
    description: 'Massa crocante preenchida com creme de confeiteiro artesanal e decorada com morangos frescos selecionados.',
    sizes: [
      { id: 'size-2-p', name: 'Individual (Fatia)', price: 20.00 },
      { id: 'size-2-m', name: 'Média (8 fatias)', price: 98.00 },
      { id: 'size-2-g', name: 'Grande (14 fatias)', price: 155.00 }
    ]
  },
  {
    id: '3',
    name: 'Torta Banoffee Premium',
    category: 'doces',
    price: 92.50,
    ingredients: ['Banana Nanica', 'Doce de Leite Caseiro', 'Chantilly Leve', 'Toque de Canela', 'Massa de Chocolate'],
    imageUrl: '/src/assets/images/banoffee_pie_1782777894833.jpg',
    description: 'Camadas generosas do melhor doce de leite, bananas frescas fatiadas e chantilly fresco salpicado com canela.',
    sizes: [
      { id: 'size-3-p', name: 'Individual (Fatia)', price: 19.00 },
      { id: 'size-3-m', name: 'Média (8 fatias)', price: 92.50 },
      { id: 'size-3-g', name: 'Grande (14 fatias)', price: 150.00 }
    ]
  },
  {
    id: '4',
    name: 'Quiche Gourmet de Alho-Poró',
    category: 'salgadas',
    price: 79.90,
    ingredients: ['Alho-poró Caramelizado', 'Queijo Gruyère', 'Creme de Leite Fresco', 'Massa Brisée Crocante'],
    imageUrl: '/src/assets/images/leek_quiche_1782777903648.jpg',
    description: 'Quiche clássica francesa com alho-poró suave e creme rico que derrete na boca.',
    sizes: [
      { id: 'size-4-p', name: 'Individual (Mini)', price: 16.00 },
      { id: 'size-4-m', name: 'Média (6 fatias)', price: 79.90 },
      { id: 'size-4-g', name: 'Grande (12 fatias)', price: 135.00 }
    ]
  },
  {
    id: '5',
    name: 'Empadão Cremoso de Frango',
    category: 'salgadas',
    price: 85.00,
    ingredients: ['Peito de Frango Desfiado', 'Catupiry Autêntico', 'Azeitonas Verdes', 'Massa Podre Amanteigada'],
    imageUrl: '/src/assets/images/chicken_pie_1782777913401.jpg',
    description: 'O verdadeiro empadão brasileiro com massa super amanteigada que desmancha na boca e recheio ultra cremoso.',
    sizes: [
      { id: 'size-5-p', name: 'Individual (Mini)', price: 17.50 },
      { id: 'size-5-m', name: 'Médio (4 fatias)', price: 85.00 },
      { id: 'size-5-g', name: 'Grande (10 fatias)', price: 140.00 }
    ]
  },
  {
    id: '6',
    name: 'Torta de Palmito Nobre',
    category: 'salgadas',
    price: 88.00,
    ingredients: ['Palmito Pupunha', 'Ervilhas Frescas', 'Molho Bechamel', 'Queijo Parmesão Gratinado'],
    imageUrl: '/src/assets/images/heart_of_palm_pie_1782777921635.jpg',
    description: 'Uma torta vegetariana sofisticada, recheada com palmito macio e molho branco temperado com ervas finas.',
    sizes: [
      { id: 'size-6-p', name: 'Individual (Mini)', price: 18.00 },
      { id: 'size-6-m', name: 'Média (6 fatias)', price: 88.00 },
      { id: 'size-6-g', name: 'Grande (12 fatias)', price: 145.00 }
    ]
  },
  {
    id: '7',
    name: 'Bolo Velvet Sensation',
    category: 'bolos',
    price: 120.00,
    ingredients: ['Massa Red Velvet', 'Frosting de Cream Cheese', 'Toque de Limão', 'Frutas Vermelhas Decorativas'],
    imageUrl: '/src/assets/images/red_velvet_cake_1782777930122.jpg',
    description: 'Bolo elegante com massa de cacau aveludada de cor vermelha intensa, recheado e coberto com creme suave de cream cheese.',
    sizes: [
      { id: 'size-7-p', name: 'Pequeno (1kg)', price: 75.00 },
      { id: 'size-7-m', name: 'Médio (2kg)', price: 120.00 },
      { id: 'size-7-g', name: 'Grande (3kg)', price: 175.00 }
    ]
  },
  {
    id: '8',
    name: 'Bolo Vulcão de Cenoura',
    category: 'bolos',
    price: 65.00,
    ingredients: ['Cenouras Orgânicas', 'Chocolate Belga 50%', 'Massa Fofinha', 'Granulado Gourmet'],
    imageUrl: '/src/assets/images/carrot_volcano_cake_1782777939819.jpg',
    description: 'Bolo de cenoura ultra fofinho com cobertura super cremosa e brilhante de chocolate belga meio amargo.',
    sizes: [
      { id: 'size-8-p', name: 'Pequeno (1kg)', price: 45.00 },
      { id: 'size-8-m', name: 'Médio (1.5kg)', price: 65.00 },
      { id: 'size-8-g', name: 'Grande (2.5kg)', price: 100.00 }
    ]
  },
  {
    id: '9',
    name: 'Bolo Trufado de Cacau 70%',
    category: 'bolos',
    price: 115.00,
    ingredients: ['Chocolate Callebaut 70%', 'Creme de Trufa', 'Massa Black', 'Raspas de Chocolate'],
    imageUrl: '/src/assets/images/chocolate_truffle_cake_1782777950230.jpg',
    description: 'Para os amantes de chocolate de verdade: massa úmida escura e recheio cremoso trufado de cacau nobre.',
    sizes: [
      { id: 'size-9-p', name: 'Pequeno (1kg)', price: 70.00 },
      { id: 'size-9-m', name: 'Médio (2kg)', price: 115.00 },
      { id: 'size-9-g', name: 'Grande (3kg)', price: 165.00 }
    ]
  }
];
