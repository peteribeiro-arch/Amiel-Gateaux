import { Product } from './types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Torta de Limão Siciliano',
    category: 'doces',
    price: 89.90,
    ingredients: ['Limão Siciliano', 'Leite Condensado', 'Merengue Italiano', 'Massa de Biscoito Amanteigado'],
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1464305795204-6f5bdf7aff7d?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1628115843023-6496005bb9be?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca9cf4991941?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1622896784083-cc051313dbab?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    description: 'Para os amantes de chocolate de verdade: massa úmida escura e recheio cremoso trufado de cacau nobre.',
    sizes: [
      { id: 'size-9-p', name: 'Pequeno (1kg)', price: 70.00 },
      { id: 'size-9-m', name: 'Médio (2kg)', price: 115.00 },
      { id: 'size-9-g', name: 'Grande (3kg)', price: 165.00 }
    ]
  }
];
