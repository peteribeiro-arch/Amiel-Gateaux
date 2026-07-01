import { Product } from './types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'torta-doce-morango',
    name: 'Torta de Morango',
    category: 'doces',
    price: 70.00,
    ingredients: ['Morangos Selecionados', 'Creme de Confeiteiro', 'Massa Doce Assada'],
    imageUrl: '/assets/images/strawberry_tart_1782777704003.jpg',
    description: 'Torta doce assada tradicional de morango, com recheio cremoso e cobertura brilhante de morangos selecionados.',
    sizes: [
      { id: 'td-morango-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-doce-limao',
    name: 'Torta de Limão',
    category: 'doces',
    price: 70.00,
    ingredients: ['Creme de Limão Cítrico', 'Massa Doce Crocante', 'Merengue Dourado'],
    imageUrl: '/assets/images/lemon_meringue_tart_1782777880427.jpg',
    description: 'Clássica torta doce assada de limão, combinando creme cítrico aveludado e merengue tostado.',
    sizes: [
      { id: 'td-limao-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-doce-cheesecake',
    name: 'Torta Cheesecake',
    category: 'doces',
    price: 70.00,
    ingredients: ['Cream Cheese Real', 'Geleia de Frutas Vermelhas', 'Farofa Doce de Biscoito'],
    imageUrl: '/assets/images/cheesecake_red_fruits_1782867099114.jpg',
    description: 'Deliciosa torta cheesecake assada com textura leve, base de biscoito amanteigado e calda de frutas silvestres.',
    sizes: [
      { id: 'td-cheesecake-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-doce-holandesa',
    name: 'Torta Holandesa',
    category: 'doces',
    price: 70.00,
    ingredients: ['Creme Holandês Nobre', 'Ganache de Chocolate', 'Biscoito Calypso'],
    imageUrl: '/assets/images/dutch_pie_torta_holandesa_1782867172497.jpg',
    description: 'A tradicional torta holandesa assada com creme de baunilha aveludado, cobertura espessa de ganache e biscoitos.',
    sizes: [
      { id: 'td-holandesa-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-doce-choc-caramelo',
    name: 'Torta de Chocolate e Caramelo',
    category: 'doces',
    price: 70.00,
    ingredients: ['Chocolate Belga Meio Amargo', 'Caramelo Toffee Artesanal', 'Massa de Cacau'],
    imageUrl: '/assets/images/choc_caramel_tart_1782866858185.jpg',
    description: 'Equilíbrio perfeito entre o amargor do chocolate nobre e a doçura do caramelo toffee artesanal sobre massa crocante.',
    sizes: [
      { id: 'td-choc-caramelo-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-doce-maca-creme',
    name: 'Torta de Maçã e Creme',
    category: 'doces',
    price: 70.00,
    ingredients: ['Maçãs Caramelizadas', 'Creme de Confeiteiro Recheado', 'Toque de Canela'],
    imageUrl: '/assets/images/apple_cream_tart_1782866932900.jpg',
    description: 'Torta rústica assada de maçã com creme de confeiteiro suave e fatias de maçã temperadas com canela.',
    sizes: [
      { id: 'td-maca-creme-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-salgada-frango-req',
    name: 'Torta de Frango e Requeijão',
    category: 'salgadas',
    price: 10.00,
    ingredients: ['Peito de Frango Desfiado', 'Requeijão Cremoso', 'Azeitonas', 'Massa Amanteigada'],
    imageUrl: '/assets/images/chicken_pie_1782777913401.jpg',
    description: 'O clássico empadão assado com frango suculento e bastante requeijão cremoso na massa que derrete na boca.',
    sizes: [
      { id: 'ts-frango-req-ind', name: 'Individual', price: 10.00 },
      { id: 'ts-frango-req-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-salgada-frango',
    name: 'Torta de Frango',
    category: 'salgadas',
    price: 10.00,
    ingredients: ['Peito de Frango Selecionado', 'Milho', 'Temperos Caseiros', 'Massa Crocante'],
    imageUrl: '/assets/images/chicken_pie_hearts_1782867324822.jpg',
    description: 'Torta de frango tradicional assada, com recheio generoso e muito bem temperado.',
    sizes: [
      { id: 'ts-frango-ind', name: 'Individual', price: 10.00 },
      { id: 'ts-frango-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-salgada-palmito-queijo',
    name: 'Torta de Palmito e Queijo',
    category: 'salgadas',
    price: 10.00,
    ingredients: ['Palmito Pupunha Nobre', 'Queijo Muçarela Derretido', 'Molho Branco', 'Massa Brisée'],
    imageUrl: '/assets/images/heart_of_palm_pie_1782777921635.jpg',
    description: 'Torta salgada assada com recheio cremoso de palmito selecionado e uma camada de queijo derretido.',
    sizes: [
      { id: 'ts-palmito-queijo-ind', name: 'Individual', price: 10.00 },
      { id: 'ts-palmito-queijo-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-salgada-alho-bacon',
    name: 'Torta de Alho Poró e Bacon',
    category: 'salgadas',
    price: 10.00,
    ingredients: ['Alho-poró Refogado', 'Bacon Defumado Crocante', 'Queijo Gruyère', 'Creme de Leite'],
    imageUrl: '/assets/images/leek_quiche_1782777903648.jpg',
    description: 'Quiche gourmet com alho-poró macio, creme de ovos rico e pedaços generosos de bacon crocante.',
    sizes: [
      { id: 'ts-alho-bacon-ind', name: 'Individual', price: 10.00 },
      { id: 'ts-alho-bacon-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-salgada-calabresa-cebola',
    name: 'Torta de Calabresa e Cebola',
    category: 'salgadas',
    price: 10.00,
    ingredients: ['Calabresa Moída Defumada', 'Cebolas Caramelizadas', 'Catupiry', 'Massa Amanteigada'],
    imageUrl: '/assets/images/calabresa_onion_pie_1782867411691.jpg',
    description: 'Maravilhosa torta assada recheada com calabresa defumada fatiada e cebolas suavemente refogadas.',
    sizes: [
      { id: 'ts-calabresa-cebola-ind', name: 'Individual', price: 10.00 },
      { id: 'ts-calabresa-cebola-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'torta-salgada-atum-tomate',
    name: 'Torta de Atum e Tomate',
    category: 'salgadas',
    price: 10.00,
    ingredients: ['Atum Sólido Selecionado', 'Tomates Frescos Picados', 'Cebola e Ervas finas', 'Massa Frola'],
    imageUrl: '/assets/images/tuna_tomato_pie_1782867496784.jpg',
    description: 'Recheio super saboroso e suculento de atum com tomates frescos, azeitonas e ervas aromáticas.',
    sizes: [
      { id: 'ts-atum-tomate-ind', name: 'Individual', price: 10.00 },
      { id: 'ts-atum-tomate-fam', name: 'Família', price: 70.00 }
    ]
  },
  {
    id: 'salgado-hamburgao',
    name: 'Hamburgão',
    category: 'salgados',
    price: 8.00,
    ingredients: ['Hambúrguer de Carne', 'Muçarela', 'Presunto fatiado', 'Massa de Pão Doce Assada'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    description: 'Grande e fofinho salgado assado recheado com hambúrguer inteiro, queijo derretido e presunto.',
    sizes: [
      { id: 'salg-hamburgao-ind', name: 'Individual', price: 8.00 }
    ]
  },
  {
    id: 'salgado-mini-pizza',
    name: 'Mini Pizza Tradicional',
    category: 'salgados',
    price: 8.00,
    ingredients: ['Massa Artesanal de Pizza', 'Molho de Tomate Rústico', 'Muçarela', 'Orégano'],
    imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
    description: 'Deliciosa mini pizza individual assada na hora, com queijo muçarela derretido e orégano de qualidade.',
    sizes: [
      { id: 'salg-mini-pizza-ind', name: 'Individual', price: 8.00 }
    ]
  },
  {
    id: 'salgado-sanduiche-frango',
    name: 'Sanduíche Natural de Frango',
    category: 'salgados',
    price: 8.00,
    ingredients: ['Pão de Forma Integral', 'Patê Caseiro de Frango', 'Cenoura Ralada', 'Alface Fresca'],
    imageUrl: 'https://images.unsplash.com/photo-1540713434306-5376c21c9a82?auto=format&fit=crop&w=600&q=80',
    description: 'Sanduíche natural saudável, montado com patê artesanal cremoso de frango desfiado, milho e vegetais.',
    sizes: [
      { id: 'salg-sand-frango-ind', name: 'Individual', price: 8.00 }
    ]
  },
  {
    id: 'salgado-sanduiche-peru',
    name: 'Sanduíche Natural de Peito de Peru',
    category: 'salgados',
    price: 8.00,
    ingredients: ['Pão de Forma Integral', 'Peito de Peru Light', 'Cream Cheese', 'Alface e Tomate'],
    imageUrl: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=600&q=80',
    description: 'Opção equilibrada com fatias finas de peito de peru defumado, creme suave de queijo e folhas verdes.',
    sizes: [
      { id: 'salg-sand-peru-ind', name: 'Individual', price: 8.00 }
    ]
  },
  {
    id: 'salgado-sanduiche-salaminho',
    name: 'Sanduíche Natural de Salaminho',
    category: 'salgados',
    price: 8.00,
    ingredients: ['Pão de Forma Macio', 'Salaminho Italiano', 'Queijo Prato fatiado', 'Maionese Leve'],
    imageUrl: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&w=600&q=80',
    description: 'Saboroso sanduíche frio recheado com fatias selecionadas de salaminho italiano, queijo prato e alface.',
    sizes: [
      { id: 'salg-sand-salame-ind', name: 'Individual', price: 8.00 }
    ]
  },
  {
    id: 'salgado-sanduiche-atum',
    name: 'Sanduíche Natural de Atum',
    category: 'salgados',
    price: 8.00,
    ingredients: ['Pão de Forma Integral', 'Patê de Atum com Ervas', 'Cebolinha', 'Folhas de Alface'],
    imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80',
    description: 'Delicioso sanduíche natural frio com patê cremoso de atum preparado com ervas finas e folhas crocantes.',
    sizes: [
      { id: 'salg-sand-atum-ind', name: 'Individual', price: 8.00 }
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
    imageUrl: 'https://images.unsplash.com/photo-1534080391025-a7db5eedb828?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1624371414361-e6e8ea04f112?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&w=600&q=80',
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
    description: 'Farofinha crocante amanteigada de biscoito, creme de confeiteiro aveludado with geleia de morango de verdade por cima.',
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
    imageUrl: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
    description: 'Delicado creme holandês preparado com creme de leite fresco, base crocante de biscoito amanteigado e ganache meio amargo.',
    sizes: [
      { id: 'size-33-ind', name: 'Individual', price: 10.00 },
      { id: 'size-33-fam', name: 'Família', price: 70.00 }
    ]
  }
];
