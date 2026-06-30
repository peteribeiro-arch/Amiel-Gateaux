import { Product } from './types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Torta de Limão Siciliano',
    category: 'doces',
    price: 89.90,
    ingredients: ['Limão Siciliano', 'Leite Condensado', 'Merengue Italiano', 'Massa de Biscoito Amanteigado'],
    imageUrl: '/assets/images/lemon_meringue_tart_1782777880427.jpg',
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
    imageUrl: '/assets/images/strawberry_tart_1782777704003.jpg',
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
    imageUrl: '/assets/images/banoffee_pie_1782777894833.jpg',
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
    imageUrl: '/assets/images/leek_quiche_1782777903648.jpg',
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
    imageUrl: '/assets/images/chicken_pie_1782777913401.jpg',
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
    imageUrl: '/assets/images/heart_of_palm_pie_1782777921635.jpg',
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
    imageUrl: '/assets/images/red_velvet_cake_1782777930122.jpg',
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
    imageUrl: '/assets/images/carrot_volcano_cake_1782777939819.jpg',
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
    imageUrl: '/assets/images/chocolate_truffle_cake_1782777950230.jpg',
    description: 'Para os amantes de chocolate de verdade: massa úmida escura e recheio cremoso trufado de cacau nobre.',
    sizes: [
      { id: 'size-9-p', name: 'Pequeno (1kg)', price: 70.00 },
      { id: 'size-9-m', name: 'Médio (2kg)', price: 115.00 },
      { id: 'size-9-g', name: 'Grande (3kg)', price: 165.00 }
    ]
  },
  {
    id: '10',
    name: 'Bolo no Pote - Paçoca',
    category: 'potes',
    price: 12.00,
    ingredients: ['Amendoim Moído', 'Doce de Leite', 'Creme de Paçoca Especial', 'Pão de Ló de Baunilha'],
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80',
    description: 'Camadas generosas de bolo fofinho e um creme artesanal de paçoca bem cremosa com um toque crocante no topo.',
    sizes: [
      { id: 'size-10-ind', name: 'Individual', price: 12.00 },
      { id: 'size-10-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '11',
    name: 'Bolo no Pote - Ninho com Nutella',
    category: 'potes',
    price: 12.00,
    ingredients: ['Leite Ninho original', 'Nutella de Verdade', 'Creme de Leite Condensado', 'Massa de Chocolate Belga'],
    imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80',
    description: 'O sabor mais amado de todos: bolo de chocolate molhadinho intercalado com creme de Leite Ninho e Nutella pura.',
    sizes: [
      { id: 'size-11-ind', name: 'Individual', price: 12.00 },
      { id: 'size-11-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '12',
    name: 'Bolo no Pote - Chocolate Tradicional',
    category: 'potes',
    price: 12.00,
    ingredients: ['Cacau 50%', 'Brigadeiro Cremoso Caseiro', 'Massa de Chocolate Super Úmida', 'Granulado Belga'],
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
    description: 'Para os apaixonados por chocolate: bolo fofinho e molhado com calda especial e muito brigadeiro cremoso.',
    sizes: [
      { id: 'size-12-ind', name: 'Individual', price: 12.00 },
      { id: 'size-12-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '13',
    name: 'Bolo no Pote - Prestígio',
    category: 'potes',
    price: 12.00,
    ingredients: ['Coco Ralado Fresco', 'Leite Condensado', 'Massa de Chocolate', 'Ganache Meio Amargo'],
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    description: 'A clássica união da massa úmida de chocolate com o tradicional recheio cremoso de coco ralado doce (beijinho) e ganache.',
    sizes: [
      { id: 'size-13-ind', name: 'Individual', price: 12.00 },
      { id: 'size-13-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '14',
    name: 'Bolo no Pote - Limão',
    category: 'potes',
    price: 12.00,
    ingredients: ['Mousse Cítrica de Limão', 'Massa Branca de Baunilha', 'Raspas de Limão Taiti', 'Merengue Maçaricado'],
    imageUrl: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=600&q=80',
    description: 'Bolo branco bem fofinho e molhado intercalado com um creme aveludado e refrescante de mousse de limão.',
    sizes: [
      { id: 'size-14-ind', name: 'Individual', price: 12.00 },
      { id: 'size-14-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '15',
    name: 'Bolo no Pote - Morango Especial',
    category: 'potes',
    price: 12.00,
    ingredients: ['Morangos Frescos', 'Creme de Nata Leve', 'Pão de Ló de Baunilha', 'Geleia Brilhante'],
    imageUrl: 'https://images.unsplash.com/photo-1570786544006-4444a1708325?auto=format&fit=crop&w=600&q=80',
    description: 'Bolo branco fofinho embebido em calda leve, com pedacinhos frescos de morango e creme de nata suave.',
    sizes: [
      { id: 'size-15-ind', name: 'Individual', price: 12.00 },
      { id: 'size-15-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '16',
    name: 'Bolo no Pote - Dois Amores',
    category: 'potes',
    price: 12.00,
    ingredients: ['Brigadeiro de Chocolate Preto', 'Brigadeiro de Chocolate Branco', 'Massa Duo de Bolo'],
    imageUrl: 'https://images.unsplash.com/photo-1511911313333-ac57457d89df?auto=format&fit=crop&w=600&q=80',
    description: 'O melhor dos dois mundos: camadas de brigadeiro preto tradicional e brigadeiro branco suave com bolo fofinho.',
    sizes: [
      { id: 'size-16-ind', name: 'Individual', price: 12.00 },
      { id: 'size-16-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '17',
    name: 'Bolo no Pote - Chocolate Branco e Ninho',
    category: 'potes',
    price: 12.00,
    ingredients: ['Ganache de Chocolate Branco', 'Creme de Leite Ninho', 'Bolo de Baunilha Fofinho'],
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
    description: 'Massa branca úmida recheada com ganache suave de chocolate branco premium e o autêntico creme de Ninho.',
    sizes: [
      { id: 'size-17-ind', name: 'Individual', price: 12.00 },
      { id: 'size-17-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '18',
    name: 'Bolo no Pote - Ninho com Morango',
    category: 'potes',
    price: 12.00,
    ingredients: ['Morangos Picados', 'Creme de Leite Ninho', 'Calda de Leite condensado', 'Bolo Branco Suave'],
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
    description: 'A clássica combinação do delicioso creme de Leite Ninho com o frescor do morango suculento fatiado.',
    sizes: [
      { id: 'size-18-ind', name: 'Individual', price: 12.00 },
      { id: 'size-18-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '19',
    name: 'Bolo no Pote - Cappuccino',
    category: 'potes',
    price: 12.00,
    ingredients: ['Creme de Café Expresso', 'Cacau 100%', 'Toque de Canela', 'Bolo de Chocolate'],
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    description: 'Para quem adora café: bolo de chocolate molhado com calda de café, creme trufado de cappuccino e canela polvilhada.',
    sizes: [
      { id: 'size-19-ind', name: 'Individual', price: 12.00 },
      { id: 'size-19-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '20',
    name: 'Bolo no Pote - Churros',
    category: 'potes',
    price: 12.00,
    ingredients: ['Doce de Leite Cozido de Minas', 'Massa Especial de Canela', 'Açúcar e Canela para Polvilhar'],
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80',
    description: 'Deliciosa massa leve e perfumada com canela, recheada com muito doce de leite cremoso artesanal mineiro.',
    sizes: [
      { id: 'size-20-ind', name: 'Individual', price: 12.00 },
      { id: 'size-20-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '21',
    name: 'Bolo no Pote - Morango com Nutella',
    category: 'potes',
    price: 12.00,
    ingredients: ['Nutella Legítima', 'Morangos Selecionados Frescos', 'Creme de Leite Ninho', 'Bolo Branco'],
    imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80',
    description: 'Uma tentação: bolo fofinho combinado com o azedinho do morango fresco e a cremosidade da Nutella.',
    sizes: [
      { id: 'size-21-ind', name: 'Individual', price: 12.00 },
      { id: 'size-21-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '22',
    name: 'Bolo no Pote - Chocolate com Nutella',
    category: 'potes',
    price: 12.00,
    ingredients: ['Nutella', 'Ganache de Chocolate Belga', 'Massa de Cacau Úmida'],
    imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80',
    description: 'Bolo de chocolate úmido recheado com brigadeiro trufado e coberto com Nutella original cremosa.',
    sizes: [
      { id: 'size-22-ind', name: 'Individual', price: 12.00 },
      { id: 'size-22-fam', name: 'Família', price: 60.00 }
    ]
  },
  {
    id: '23',
    name: 'Bombom no Pote - Morango',
    category: 'potes',
    price: 12.00,
    ingredients: ['Morangos Inteiros', 'Creme Branco Nobre', 'Cobertura de Ganache de Chocolate'],
    imageUrl: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=600&q=80',
    description: 'Morangos inteiros suculentos envoltos em um sedoso creme de leite condensado, cobertos com calda generosa de chocolate.',
    sizes: [
      { id: 'size-23-ind', name: 'Individual', price: 12.00 },
      { id: 'size-23-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: '24',
    name: 'Bombom no Pote - Uva',
    category: 'potes',
    price: 12.00,
    ingredients: ['Uvas Verdes Thompson', 'Creme Belga de Baunilha', 'Ganache de Chocolate'],
    imageUrl: 'https://images.unsplash.com/photo-1504382262782-5b4cf10fb0b2?auto=format&fit=crop&w=600&q=80',
    description: 'Uvas verdes frescas e crocantes sem semente em creme de baunilha cremoso com ganache meio amargo no topo.',
    sizes: [
      { id: 'size-24-ind', name: 'Individual', price: 12.00 },
      { id: 'size-24-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: '25',
    name: 'Bombom no Pote - Sonho de Valsa',
    category: 'potes',
    price: 12.00,
    ingredients: ['Bombom Sonho de Valsa Picado', 'Creme de Amendoim Trufado', 'Brigadeiro Tradicional'],
    imageUrl: 'https://images.unsplash.com/photo-1582293001056-e32952ac6d25?auto=format&fit=crop&w=600&q=80',
    description: 'Combinação perfeita de bombons Sonho de Valsa crocantes com creme de amendoim suave e cobertura de chocolate.',
    sizes: [
      { id: 'size-25-ind', name: 'Individual', price: 12.00 },
      { id: 'size-25-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: '26',
    name: 'Bombom no Pote - Ouro Branco',
    category: 'potes',
    price: 12.00,
    ingredients: ['Bombom Ouro Branco Picado', 'Creme Branco de Laka', 'Ganache de Chocolate Branco'],
    imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80',
    description: 'Delicioso creme de chocolate branco trufado intercalado com pedacinhos crocantes de bombom Ouro Branco original.',
    sizes: [
      { id: 'size-26-ind', name: 'Individual', price: 12.00 },
      { id: 'size-26-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: '27',
    name: 'Tortinha no Pote - Morango',
    category: 'potes',
    price: 10.00,
    ingredients: ['Morangos', 'Geleia de Morango Caseira', 'Creme de Confeiteiro', 'Farofa Crocante de Biscoito'],
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    description: 'Farofinha crocante amanteigada de biscoito, creme de confeiteiro aveludado com geleia de morango de verdade por cima.',
    sizes: [
      { id: 'size-27-ind', name: 'Individual', price: 10.00 },
      { id: 'size-27-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: '28',
    name: 'Tortinha no Pote - Limão',
    category: 'potes',
    price: 10.00,
    ingredients: ['Creme de Limão Refrescante', 'Farofinha de Biscoito Amanteigado', 'Raspas de Limão'],
    imageUrl: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&w=600&q=80',
    description: 'Releitura da clássica torta de limão no potinho com creme cítrico e doce no ponto certo e farofa de biscoito.',
    sizes: [
      { id: 'size-28-ind', name: 'Individual', price: 10.00 },
      { id: 'size-28-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: '29',
    name: 'Tortinha no Pote - Banoffee',
    category: 'potes',
    price: 10.00,
    ingredients: ['Doce de Leite', 'Banana Nanica Fresca', 'Chantilly', 'Canela', 'Biscoito Moído'],
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80',
    description: 'Camadas de doce de leite cremoso, bananas fatiadas fresquinhas, chantilly leve, canela e base de biscoito.',
    sizes: [
      { id: 'size-29-ind', name: 'Individual', price: 10.00 },
      { id: 'size-29-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: '30',
    name: 'Tortinha no Pote - Cheesecake de Frutas Vermelhas',
    category: 'potes',
    price: 10.00,
    ingredients: ['Cream Cheese Real', 'Calda Caseira de Amora, Framboesa e Morango', 'Farofa Crocante de Biscoito'],
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80',
    description: 'Cheesecake super leve e aerado montado no pote com biscoito triturado e uma fantástica calda vermelha rústica.',
    sizes: [
      { id: 'size-30-ind', name: 'Individual', price: 10.00 },
      { id: 'size-30-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: '31',
    name: 'Tortinha no Pote - Oreo',
    category: 'potes',
    price: 10.00,
    ingredients: ['Biscoito Oreo Picado', 'Creme de Laka Aerado', 'Creme de Oreo', 'Ganache de Chocolate'],
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
    description: 'Tortinha no pote super crocante e saborosa com biscoito Oreo picadinho misturado com creme de leite condensado especial.',
    sizes: [
      { id: 'size-31-ind', name: 'Individual', price: 10.00 },
      { id: 'size-31-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: '32',
    name: 'Tortinha no Pote - Romeu e Julieta',
    category: 'potes',
    price: 10.00,
    ingredients: ['Queijo Cream Cheese Suave', 'Calda Quente de Goiabada Cascão', 'Farofa Doce de Biscoito'],
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
    description: 'A clássica sobremesa brasileira reinventada em camadas de creme de queijo levemente salgadinho e goiabada cremosa.',
    sizes: [
      { id: 'size-32-ind', name: 'Individual', price: 10.00 },
      { id: 'size-32-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: '33',
    name: 'Tortinha no Pote - Holandesa',
    category: 'potes',
    price: 10.00,
    ingredients: ['Creme Holandês Nobre', 'Ganache de Chocolate Meio Amargo', 'Biscoito Calypso / Amanteigado'],
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    description: 'Delicado creme holandês preparado com creme de leite fresco, base crocante de biscoito amanteigado e ganache meio amargo.',
    sizes: [
      { id: 'size-33-ind', name: 'Individual', price: 10.00 },
      { id: 'size-33-fam', name: 'Família', price: 70.00 }
    ]
  }
];
