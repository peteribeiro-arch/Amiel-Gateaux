import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, Plus, AlertCircle, ShoppingBag, Info, Heart, ArrowRight } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface PoteConfiguratorProps {
  onAddToCart: (product: Product, selectedSize: ProductSize, observation: string) => void;
  isAdminMode?: boolean;
}

// Data for pre-defined recipes
const PRESETS = {
  bolos: [
    { id: '10', name: 'Bolo no Pote - Paçoca', price: 12.00, ingredients: ['Amendoim Moído', 'Doce de Leite', 'Creme de Paçoca'], description: 'Camadas de bolo fofinho, creme de paçoca bem cremosa com um toque crocante no topo.', imageUrl: 'https://images.unsplash.com/photo-1534080391025-a7db5eedb828?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '11', name: 'Bolo no Pote - Ninho com Nutella', price: 12.00, ingredients: ['Leite Ninho', 'Nutella', 'Creme de Leite Condensado', 'Massa de Chocolate'], description: 'Bolo de chocolate molhadinho intercalado com creme de Leite Ninho e Nutella pura.', imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '12', name: 'Bolo no Pote - Chocolate Tradicional', price: 12.00, ingredients: ['Cacau 50%', 'Brigadeiro Cremoso Caseiro', 'Massa de Chocolate'], description: 'Bolo fofinho e molhado com calda especial e muito brigadeiro cremoso.', imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '13', name: 'Bolo no Pote - Prestígio', price: 12.00, ingredients: ['Coco Ralado Fresco', 'Leite Condensado', 'Massa de Chocolate', 'Ganache Meio Amargo'], description: 'Massa úmida de chocolate com recheio cremoso de coco ralado doce (beijinho) e ganache.', imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '14', name: 'Bolo no Pote - Limão', price: 12.00, ingredients: ['Mousse de Limão', 'Massa de Baunilha', 'Raspas de Limão', 'Merengue'], description: 'Bolo branco bem fofinho e molhado intercalado com um creme refrescante de mousse de limão.', imageUrl: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '15', name: 'Bolo no Pote - Morango Especial', price: 12.00, ingredients: ['Morangos Frescos', 'Creme de Nata Leve', 'Pão de Ló de Baunilha', 'Geleia'], description: 'Bolo branco fofinho embebido em calda leve, com pedacinhos frescos de morango e creme de nata.', imageUrl: 'https://images.unsplash.com/photo-1570786544006-4444a1708325?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '16', name: 'Bolo no Pote - Dois Amores', price: 12.00, ingredients: ['Brigadeiro de Chocolate Preto', 'Brigadeiro Branco', 'Massa Duo'], description: 'O melhor dos dois mundos: camadas de brigadeiro preto tradicional e brigadeiro branco suave.', imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '17', name: 'Bolo no Pote - Chocolate Branco e Ninho', price: 12.00, ingredients: ['Ganache de Chocolate Branco', 'Creme de Leite Ninho', 'Bolo de Baunilha'], description: 'Massa branca úmida recheada com ganache suave de chocolate branco e o autêntico creme de Ninho.', imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '18', name: 'Bolo no Pote - Ninho com Morango', price: 12.00, ingredients: ['Morangos Picados', 'Creme de Leite Ninho', 'Bolo Branco Suave'], description: 'A clássica combinação do delicioso creme de Leite Ninho com o frescor do morango suculento.', imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '19', name: 'Bolo no Pote - Cappuccino', price: 12.00, ingredients: ['Creme de Café Expresso', 'Cacau 100%', 'Toque de Canela', 'Bolo de Chocolate'], description: 'Bolo de chocolate molhado com calda de café, creme trufado de cappuccino e canela.', imageUrl: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '20', name: 'Bolo no Pote - Churros', price: 12.00, ingredients: ['Doce de Leite', 'Massa de Canela', 'Açúcar e Canela'], description: 'Deliciosa massa leve e perfumada com canela, recheada com muito doce de leite cremoso artesanal.', imageUrl: 'https://images.unsplash.com/photo-1624371414361-e6e8ea04f112?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '21', name: 'Bolo no Pote - Morango com Nutella', price: 12.00, ingredients: ['Nutella Legítima', 'Morangos Selecionados', 'Creme de Leite Ninho', 'Bolo Branco'], description: 'Bolo fofinho combinado com o azedinho do morango fresco e a cremosidade da Nutella.', imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 },
    { id: '22', name: 'Bolo no Pote - Chocolate com Nutella', price: 12.00, ingredients: ['Nutella', 'Ganache de Chocolate Belga', 'Massa de Cacau Úmida'], description: 'Bolo de chocolate úmido recheado com brigadeiro trufado e coberto com Nutella original.', imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80', familyPrice: 60.00 }
  ],
  bombons: [
    { id: '23', name: 'Bombom no Pote - Morango', price: 12.00, ingredients: ['Morangos Inteiros', 'Creme Branco Nobre', 'Ganache de Chocolate'], description: 'Morangos inteiros suculentos envoltos em um sedoso creme de leite condensado, cobertos com calda generosa de chocolate.', imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 },
    { id: '24', name: 'Bombom no Pote - Uva', price: 12.00, ingredients: ['Uvas Thompson', 'Creme Belga de Baunilha', 'Ganache de Chocolate'], description: 'Uvas verdes frescas e crocantes sem semente em creme de baunilha cremoso com ganache meio amargo no topo.', imageUrl: 'https://images.unsplash.com/photo-1504382262782-5b4cf10fb0b2?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 },
    { id: '25', name: 'Bombom no Pote - Sonho de Valsa', price: 12.00, ingredients: ['Bombom Sonho de Valsa', 'Creme de Amendoim Trufado', 'Brigadeiro'], description: 'Combinação perfeita de bombons Sonho de Valsa crocantes com creme de amendoim suave e cobertura de chocolate.', imageUrl: 'https://images.unsplash.com/photo-1582293001056-e32952ac6d25?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 },
    { id: '26', name: 'Bombom no Pote - Ouro Branco', price: 12.00, ingredients: ['Bombom Ouro Branco', 'Creme Branco de Laka', 'Ganache Branco'], description: 'Delicioso creme de chocolate branco trufado intercalado com pedacinhos crocantes de bombom Ouro Branco.', imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 }
  ],
  tortinhas: [
    { id: '27', name: 'Tortinha no Pote - Morango', price: 10.00, ingredients: ['Morangos', 'Geleia de Morango Caseira', 'Creme de Confeiteiro', 'Biscoito'], description: 'Farofinha crocante amanteigada de biscoito, creme de confeiteiro aveludado com geleia de morango por cima.', imageUrl: 'https://images.unsplash.com/photo-1570786544006-4444a1708325?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 },
    { id: '28', name: 'Tortinha no Pote - Limão', price: 10.00, ingredients: ['Creme de Limão', 'Farofinha de Biscoito Amanteigado', 'Raspas de Limão'], description: 'Releitura da clássica torta de limão no potinho com creme cítrico e doce no ponto certo e farofa de biscoito.', imageUrl: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 },
    { id: '29', name: 'Tortinha no Pote - Banoffee', price: 10.00, ingredients: ['Doce de Leite', 'Banana Nanica', 'Chantilly', 'Canela', 'Biscoito'], description: 'Camadas de doce de leite cremoso, bananas fatiadas fresquinhas, chantilly leve, canela e base de biscoito.', imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 },
    { id: '30', name: 'Tortinha no Pote - Cheesecake de Frutas Vermelhas', price: 10.00, ingredients: ['Cream Cheese Real', 'Calda de Frutas Vermelhas', 'Biscoito'], description: 'Cheesecake super leve e aerado montado no pote com biscoito triturado e uma fantástica calda vermelha.', imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 },
    { id: '31', name: 'Tortinha no Pote - Oreo', price: 10.00, ingredients: ['Biscoito Oreo', 'Creme de Laka', 'Creme de Oreo', 'Ganache'], description: 'Tortinha no pote super crocante e saborosa com biscoito Oreo picadinho misturado com creme especial.', imageUrl: 'https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 },
    { id: '32', name: 'Tortinha no Pote - Romeu e Julieta', price: 10.00, ingredients: ['Cream Cheese', 'Goiabada Cascão', 'Biscoito Amanteigado'], description: 'A clássica sobremesa brasileira reinventada em camadas de creme de queijo levemente salgadinho e goiabada cremosa.', imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 },
    { id: '33', name: 'Tortinha no Pote - Holandesa', price: 10.00, ingredients: ['Creme Holandês', 'Ganache Meio Amargo', 'Biscoito Amanteigado'], description: 'Delicado creme holandês preparado com creme de leite fresco, base crocante de biscoito amanteigado e ganache meio amargo.', imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', familyPrice: 70.00 }
  ]
};

// Custom builder ingredients
const MASSAS_POTE = [
  { id: 'm-chocolate', name: 'Bolo de Chocolate', color: 'bg-[#3D2314]', desc: 'Massa de cacau 50% super úmida e fofinha' },
  { id: 'm-baunilha', name: 'Bolo de Baunilha / Pão de Ló', color: 'bg-[#FFFDF6]', desc: 'Massa amanteigada de baunilha leve e aerada' },
  { id: 'm-canela', name: 'Bolo de Canela (Churros)', color: 'bg-[#D1B28C]', desc: 'Massa aromática de canela e especiarias' },
  { id: 'm-biscoito', name: 'Base de Biscoito Amanteigado', color: 'bg-[#E5C290]', desc: 'Base crocante triturada perfeita para tortinhas' }
];

const RECHEIOS_POTE = [
  { name: 'Creme de Leite Ninho', desc: 'Creme aveludado feito com leite Ninho integral legítimo' },
  { name: 'Brigadeiro de Chocolate Gourmet', desc: 'Brigadeiro tradicional artesanal bem cremoso' },
  { name: 'Doce de Leite Cozido', desc: 'O clássico doce de leite cremoso nobre de Minas Gerais' },
  { name: 'Creme de Paçoca', desc: 'Mistura cremosa de amendoim moído e leite condensado' },
  { name: 'Mousse de Limão Cítrico', desc: 'Mousse refrescante de limão taiti, doce e azedinho na medida' },
  { name: 'Creme de Cream Cheese', desc: 'Base aerada e suave de queijo cremoso levemente salgado' },
  { name: 'Creme Belga de Baunilha', desc: 'Creme suave de confeiteiro aromatizado com fava de baunilha' },
  { name: 'Ganache de Chocolate Belga', desc: 'Creme nobre de chocolate meio amargo e creme de leite' }
];

const ADICIONAIS_POTE = [
  { name: 'Morango Fresco', price: 2.00, desc: 'Pedaços de morango selecionados e fresquinhos' },
  { name: 'Nutella Pura', price: 3.00, desc: 'A autêntica Nutella cremosa como camada extra' },
  { name: 'Uvas Thompson', price: 2.00, desc: 'Uvas verdes sem semente cortadas ao meio' },
  { name: 'Banana Picada', price: 1.00, desc: 'Bananas picadinhas caramelizadas' },
  { name: 'Bombom Sonho de Valsa', price: 2.50, desc: 'Bombom crocante picado e misturado' },
  { name: 'Bombom Ouro Branco', price: 2.50, desc: 'O bombom branco queridinho triturado' },
  { name: 'Biscoito Oreo Triturado', price: 2.00, desc: 'Pedaços crocantes de Oreo original' },
  { name: 'Coco Ralado Úmido', price: 1.50, desc: 'Flocos de coco fresco para um toque tropical' },
  { name: 'Amendoim Crocante', price: 1.50, desc: 'Xerém de amendoim torrado e crocante' },
  { name: 'Chantilly Leve', price: 1.00, desc: 'Cobertura clássica e aerada para finalizar' }
];

export function PoteConfigurator({ onAddToCart, isAdminMode = false }: PoteConfiguratorProps) {
  // Navigation between Tabs: "clássicos" vs "personalizado"
  const [activeTab, setActiveTab] = useState<'classicos' | 'personalizado'>('classicos');
  
  // States for pre-defined (Clássico) tab
  const [selectedCategory, setSelectedCategory] = useState<'bolos' | 'bombons' | 'tortinhas'>('bolos');
  const [selectedPreset, setSelectedPreset] = useState<any>(PRESETS.bolos[1]); // Default to Ninho com Nutella
  const [presetSize, setPresetSize] = useState<'individual' | 'familia'>('individual');

  // States for customizable (Monte seu Pote) tab
  const [customBase, setCustomBase] = useState<'bolos' | 'bombons' | 'tortinhas'>('bolos');
  const [customSize, setCustomSize] = useState<'individual' | 'familia'>('individual');
  const [selectedMassa, setSelectedMassa] = useState<string | null>(null);
  const [selectedRecheios, setSelectedRecheios] = useState<string[]>([]);
  const [selectedAdicionais, setSelectedAdicionais] = useState<string[]>([]);
  const [customObservation, setCustomObservation] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Helper for toggle fillings (max 2)
  const handleToggleRecheio = (name: string) => {
    setError(null);
    if (selectedRecheios.includes(name)) {
      setSelectedRecheios(selectedRecheios.filter((r) => r !== name));
    } else {
      if (selectedRecheios.length >= 2) {
        setError('Você pode selecionar no máximo 2 recheios para o seu pote!');
        return;
      }
      setSelectedRecheios([...selectedRecheios, name]);
    }
  };

  // Helper for toggle extras
  const handleToggleAdicional = (name: string) => {
    setError(null);
    if (selectedAdicionais.includes(name)) {
      setSelectedAdicionais(selectedAdicionais.filter((a) => a !== name));
    } else {
      setSelectedAdicionais([...selectedAdicionais, name]);
    }
  };

  // Preset Add to Cart
  const handlePresetAddToCart = () => {
    setError(null);
    if (!selectedPreset) {
      setError('Por favor, selecione um sabor.');
      return;
    }

    const price = presetSize === 'individual' ? selectedPreset.price : selectedPreset.familyPrice;
    const sizeName = presetSize === 'individual' ? 'Individual (250ml)' : 'Família (1,2L)';
    
    const virtualProduct: Product = {
      id: `preset-pote-${selectedPreset.id}-${presetSize}`,
      name: `${selectedPreset.name} - ${presetSize === 'individual' ? 'Individual' : 'Família'}`,
      category: 'potes',
      price: price,
      ingredients: selectedPreset.ingredients,
      imageUrl: selectedPreset.imageUrl,
      description: selectedPreset.description
    };

    const selectedSizeObj: ProductSize = {
      id: `pote-size-${presetSize}`,
      name: sizeName,
      price: price
    };

    const observation = `Tamanho: ${sizeName} | Ingredientes base: ${selectedPreset.ingredients.join(', ')}`;

    onAddToCart(virtualProduct, selectedSizeObj, observation);

    setSuccessAnimation(true);
    setTimeout(() => setSuccessAnimation(false), 2000);
  };

  // Custom Add to Cart
  const handleCustomAddToCart = () => {
    setError(null);
    if (!selectedMassa) {
      setError('Por favor, escolha uma massa ou base crocante.');
      return;
    }
    if (selectedRecheios.length === 0) {
      setError('Por favor, selecione pelo menos 1 recheio.');
      return;
    }

    // Determine prices
    let basePrice = 12.00; // default for cake/bombom individual
    let familyPrice = 60.00;
    if (customBase === 'tortinhas') {
      basePrice = 10.00;
      familyPrice = 70.00;
    } else if (customBase === 'bombons') {
      basePrice = 12.00;
      familyPrice = 70.00;
    }

    let calculatedPrice = customSize === 'individual' ? basePrice : familyPrice;
    
    // Add additional prices if individual
    if (customSize === 'individual') {
      selectedAdicionais.forEach(name => {
        const item = ADICIONAIS_POTE.find(a => a.name === name);
        if (item) calculatedPrice += item.price;
      });
    } else {
      // For family size, scale extra cost proportionally or fixed
      selectedAdicionais.forEach(name => {
        const item = ADICIONAIS_POTE.find(a => a.name === name);
        if (item) calculatedPrice += item.price * 3; // family size multiplier
      });
    }

    const categoryLabel = customBase === 'bolos' 
      ? 'Bolo no Pote' 
      : customBase === 'bombons' 
      ? 'Bombom no Pote' 
      : 'Tortinha no Pote';

    const sizeName = customSize === 'individual' ? 'Individual (250ml)' : 'Família (1,2L)';

    const customName = `${categoryLabel} Personalizado - ${customSize === 'individual' ? 'Individual' : 'Família'}`;
    
    const virtualProduct: Product = {
      id: `custom-pote-${Date.now()}`,
      name: customName,
      category: 'potes',
      price: calculatedPrice,
      ingredients: [selectedMassa, ...selectedRecheios, ...selectedAdicionais],
      imageUrl: customBase === 'bolos' 
        ? 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80'
        : customBase === 'bombons'
        ? 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80',
      description: `Seu pote customizado montado com ${selectedMassa}, recheios de ${selectedRecheios.join(' e ')}${selectedAdicionais.length > 0 ? ', adicionais: ' + selectedAdicionais.join(', ') : ''}.`
    };

    const selectedSizeObj: ProductSize = {
      id: `pote-custom-${customSize}`,
      name: sizeName,
      price: calculatedPrice
    };

    let observation = `Base: ${selectedMassa} | Recheios: ${selectedRecheios.join(' & ')}`;
    if (selectedAdicionais.length > 0) {
      observation += ` | Adicionais: ${selectedAdicionais.join(', ')}`;
    }
    if (customObservation.trim()) {
      observation += ` | Observação: ${customObservation.trim()}`;
    }

    onAddToCart(virtualProduct, selectedSizeObj, observation);

    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
      // Reset builder options
      setSelectedMassa(null);
      setSelectedRecheios([]);
      setSelectedAdicionais([]);
      setCustomObservation('');
    }, 2000);
  };

  return (
    <div className="w-full">
      {/* Promo banner styled like the main App banner */}
      <div className="relative rounded-[32px] overflow-hidden bg-bento-dark text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-bento-border/10 mb-8">
        <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-bento-amber-light/10 rounded-full border border-bento-amber-bright/20 text-xs font-bold text-bento-amber-bright">
            <Sparkles className="w-3.5 h-3.5 fill-bento-amber-bright stroke-bento-amber-bright" />
            Amiel Gâteaux — Delícias Cremosas
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-serif leading-tight text-white">
            Delícias no <span className="text-bento-amber-bright italic font-normal">Pote</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed font-light">
            Monte sua sobremesa no potinho dos sonhos ou escolha entre os nossos sabores clássicos de extremo sucesso! Perfeitos para devorar sozinho ou presentear quem você ama.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-bento-amber-bright/90 font-semibold">
            <span className="flex items-center gap-1.5 bg-[#4D392B] px-3 py-1 rounded-full">
              🥄 Tamanho Individual & Família
            </span>
            <span className="flex items-center gap-1.5 bg-[#4D392B] px-3 py-1 rounded-full">
              🍓 Ingredientes de Alta Qualidade
            </span>
          </div>
        </div>

        {/* Dynamic Image Preview */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex-shrink-0 hidden md:block z-10">
          <img
            src={activeTab === 'classicos' ? selectedPreset?.imageUrl : 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80'}
            alt="Delícia no Pote"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-[24px] shadow-2xl rotate-3 border-4 border-white/10 transition-all duration-300"
          />
          <div className="absolute -bottom-2 -left-2 bg-bento-amber text-bento-amber-deep px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg shadow-md -rotate-3">
            Cremoso
          </div>
        </div>

        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-bento-amber rounded-full blur-3xl opacity-25"></div>
      </div>

      {/* Selector between Clássicos (Preset) and Monte Seu Pote (Custom Builder) */}
      <div className="flex justify-center mb-8 p-1.5 bg-stone-100 rounded-2xl max-w-md mx-auto border border-stone-200 shadow-xs">
        <button
          onClick={() => {
            setError(null);
            setActiveTab('classicos');
          }}
          className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'classicos'
              ? 'bg-white text-bento-dark shadow-xs border border-stone-200'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          🍰 Sabores Clássicos
        </button>
        <button
          onClick={() => {
            setError(null);
            setActiveTab('personalizado');
          }}
          className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'personalizado'
              ? 'bg-white text-bento-dark shadow-xs border border-stone-200'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          👩‍🍳 Monte seu Pote
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'classicos' ? (
          <motion.div
            key="classicos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {/* Classicos Filter & Selector */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70">
                <h3 className="text-xs font-black text-bento-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>✨</span> Escolha a Categoria
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'bolos', label: 'Bolos no Pote', icon: '🍰' },
                    { id: 'bombons', label: 'Bombons no Pote', icon: '🍬' },
                    { id: 'tortinhas', label: 'Tortinhas no Pote', icon: '🥧' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id as any);
                        setSelectedPreset(PRESETS[cat.id as 'bolos' | 'bombons' | 'tortinhas'][0]);
                      }}
                      className={`py-3.5 px-2 rounded-xl border text-center font-extrabold text-xs transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-bento-amber border-bento-amber text-white'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100/70'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="truncate w-full">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor Selector */}
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70">
                <h3 className="text-xs font-black text-bento-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>🍧</span> Selecione o Sabor
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                  {PRESETS[selectedCategory].map((preset) => {
                    const isSelected = selectedPreset?.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedPreset(preset)}
                        className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FEF3C7]/40 border-bento-amber ring-1 ring-bento-amber shadow-xs'
                            : 'bg-white border-bento-border/50 hover:bg-stone-50'
                        }`}
                      >
                        <img
                          src={preset.imageUrl}
                          alt={preset.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-xs text-bento-dark truncate">{preset.name}</h4>
                          <p className="text-[10px] text-bento-dark/50 leading-relaxed mt-0.5 line-clamp-2">
                            {preset.description}
                          </p>
                          <div className="flex gap-1.5 flex-wrap mt-1">
                            {preset.ingredients.slice(0, 3).map((ing: string) => (
                              <span key={ing} className="bg-stone-100 text-[8px] text-stone-500 font-bold px-1 rounded-sm">
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side: Size & Cart for Clássicos */}
            <div className="space-y-6">
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70">
                <h3 className="text-xs font-black text-bento-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>📏</span> Escolha o Tamanho
                </h3>

                <div className="space-y-3">
                  {[
                    { id: 'individual', label: 'Individual (250ml)', price: selectedPreset?.price || 12.00, icon: '🥄', desc: 'Sobremesa pessoal na medida ideal.' },
                    { id: 'familia', label: 'Família (1,2L)', price: selectedPreset?.familyPrice || 60.00, icon: '👪', desc: 'Embalagem grande ideal para compartilhar.' }
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setPresetSize(size.id as any)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        presetSize === size.id
                          ? 'bg-[#FEF3C7]/40 border-bento-amber ring-1 ring-bento-amber'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{size.icon}</span>
                        <div>
                          <h4 className="text-xs font-extrabold text-bento-dark">{size.label}</h4>
                          <p className="text-[10px] text-stone-400 font-semibold">{size.desc}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-bento-dark font-mono">
                        R$ {size.price.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary / Order Actions */}
              <div className="bg-bento-dark text-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-xl relative overflow-hidden border border-bento-border/10">
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-bento-amber-bright/70 font-black tracking-widest uppercase">Item Selecionado</span>
                      <h4 className="text-sm font-black text-white mt-1">{selectedPreset?.name}</h4>
                      <p className="text-[10px] text-white/50 leading-relaxed mt-1 font-semibold">
                        Tamanho: {presetSize === 'individual' ? 'Individual (250ml)' : 'Família (1,2L)'}
                      </p>
                    </div>
                    <Heart className="w-5 h-5 text-bento-amber-bright fill-bento-amber-bright" />
                  </div>

                  <hr className="border-white/10" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-white/60">Total</span>
                    <span className="text-2xl font-black text-bento-amber-bright font-mono">
                      R$ {(presetSize === 'individual' ? selectedPreset?.price : selectedPreset?.familyPrice)?.toFixed(2)}
                    </span>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handlePresetAddToCart}
                    className="w-full py-4 rounded-xl bg-bento-amber hover:bg-bento-amber-light text-bento-amber-deep font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="personalizado"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {/* Custom Builder steps */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* STEP 1: Select Custom Type */}
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-6 h-6 bg-bento-amber text-white text-xs font-black rounded-full flex items-center justify-center shadow-xs">1</span>
                  <h3 className="text-xs font-black text-bento-dark uppercase tracking-wider">Tipo de Sobremesa</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'bolos', label: 'Bolo no Pote', icon: '🍰', desc: 'Camadas de bolo e cremes' },
                    { id: 'bombons', label: 'Bombom no Pote', icon: '🍬', desc: 'Frutas, creme e ganache' },
                    { id: 'tortinhas', label: 'Tortinha no Pote', icon: '🥧', desc: 'Base crocante de biscoito' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setCustomBase(type.id as any);
                        setSelectedMassa(null);
                        setSelectedRecheios([]);
                        setError(null);
                      }}
                      className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        customBase === type.id
                          ? 'bg-[#FEF3C7]/40 border-bento-amber ring-1 ring-bento-amber'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100/50'
                      }`}
                    >
                      <span className="text-xl">{type.icon}</span>
                      <span className="text-xs font-extrabold text-bento-dark">{type.label}</span>
                      <span className="text-[8px] text-stone-400 font-medium leading-tight">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: Choose Base / Crust */}
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-6 h-6 bg-bento-amber text-white text-xs font-black rounded-full flex items-center justify-center shadow-xs">2</span>
                  <h3 className="text-xs font-black text-bento-dark uppercase tracking-wider">Massa ou Base</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MASSAS_POTE.map((massa) => {
                    const isSelected = selectedMassa === massa.name;
                    return (
                      <button
                        key={massa.id}
                        onClick={() => setSelectedMassa(massa.name)}
                        className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FEF3C7]/40 border-bento-amber ring-1 ring-bento-amber'
                            : 'bg-stone-50 border-stone-200 hover:bg-stone-100/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full ${massa.color} border border-stone-300 shadow-inner flex-shrink-0`} />
                        <div>
                          <h4 className="text-xs font-extrabold text-bento-dark">{massa.name}</h4>
                          <p className="text-[9px] text-stone-400 font-semibold">{massa.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: Choose Cremes / Recheios */}
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 bg-bento-amber text-white text-xs font-black rounded-full flex items-center justify-center shadow-xs">3</span>
                    <h3 className="text-xs font-black text-bento-dark uppercase tracking-wider">Recheios Cremosos (Escolha até 2)</h3>
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Sem acréscimo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {RECHEIOS_POTE.map((recheio) => {
                    const isSelected = selectedRecheios.includes(recheio.name);
                    const disabled = !isSelected && selectedRecheios.length >= 2;
                    return (
                      <button
                        key={recheio.name}
                        disabled={disabled}
                        onClick={() => handleToggleRecheio(recheio.name)}
                        className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                        } ${
                          isSelected
                            ? 'bg-[#FEF3C7]/30 border-bento-amber text-bento-amber-dark font-extrabold'
                            : 'bg-white border-bento-border/50 hover:bg-stone-50 text-bento-dark'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center ${
                          isSelected ? 'bg-bento-amber border-bento-amber text-white' : 'border-stone-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold">{recheio.name}</h4>
                          <p className="text-[9px] text-stone-400 font-semibold mt-0.5 leading-tight">{recheio.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 4: Choose Toppings / Extras */}
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 bg-bento-amber text-white text-xs font-black rounded-full flex items-center justify-center shadow-xs">4</span>
                    <h3 className="text-xs font-black text-bento-dark uppercase tracking-wider">Adicionais & Crocantes</h3>
                  </div>
                  <span className="text-[9px] bg-amber-50 text-bento-amber-dark font-black px-2 py-0.5 rounded-full">Opcionais</span>
                </div>
                <p className="text-[10px] text-stone-400 font-semibold mb-4">Adicione texturas, frutas frescas ou chocolates nobres ao seu potinho.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ADICIONAIS_POTE.map((adicional) => {
                    const isSelected = selectedAdicionais.includes(adicional.name);
                    const additionalPriceStr = `+ R$ ${adicional.price.toFixed(2)}`;
                    return (
                      <button
                        key={adicional.name}
                        onClick={() => handleToggleAdicional(adicional.name)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FEF3C7]/30 border-bento-amber text-bento-amber-dark font-extrabold'
                            : 'bg-white border-bento-border/50 hover:bg-stone-50 text-bento-dark'
                        }`}
                      >
                        <div className="flex items-center gap-3 pr-2">
                          <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                            isSelected ? 'bg-bento-amber border-bento-amber text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold">{adicional.name}</h4>
                            <p className="text-[9px] text-stone-400 font-semibold mt-0.5 leading-tight">{adicional.desc}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black font-mono text-bento-amber-dark shrink-0">
                          {additionalPriceStr}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-lg">✍️</span>
                  <h3 className="text-xs font-black text-bento-dark uppercase tracking-wider">Observações do Pedido</h3>
                </div>
                <input
                  type="text"
                  value={customObservation}
                  onChange={(e) => setCustomObservation(e.target.value)}
                  placeholder="Ex: Mandar colher extra, sem canela, etc."
                  className="w-full px-4 py-3 rounded-xl border border-bento-border/70 focus:outline-none focus:ring-2 focus:ring-bento-amber/15 focus:border-bento-amber text-xs text-bento-dark placeholder-bento-dark/30 bg-stone-50"
                />
              </div>

            </div>

            {/* Custom Builder Size & Action sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70">
                <h3 className="text-xs font-black text-bento-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>📏</span> Escolha o Tamanho
                </h3>

                <div className="space-y-3">
                  {[
                    { id: 'individual', label: 'Individual (250ml)', price: customBase === 'tortinhas' ? 10.00 : 12.00, icon: '🥄', desc: 'Sua porção ideal de felicidade.' },
                    { id: 'familia', label: 'Família (1,2L)', price: customBase === 'bolos' ? 60.00 : 70.00, icon: '👪', desc: 'Perfeito para servir a família.' }
                  ].map((size) => {
                    // Calculate preview total price
                    let computedPrice = size.price;
                    selectedAdicionais.forEach(name => {
                      const item = ADICIONAIS_POTE.find(a => a.name === name);
                      if (item) {
                        computedPrice += size.id === 'individual' ? item.price : item.price * 3;
                      }
                    });
                    return (
                      <button
                        key={size.id}
                        onClick={() => setCustomSize(size.id as any)}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          customSize === size.id
                            ? 'bg-[#FEF3C7]/40 border-bento-amber ring-1 ring-bento-amber'
                            : 'bg-stone-50 border-stone-200 hover:bg-stone-100/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{size.icon}</span>
                          <div>
                            <h4 className="text-xs font-extrabold text-bento-dark">{size.label}</h4>
                            <p className="text-[10px] text-stone-400 font-semibold">{size.desc}</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-bento-dark font-mono">
                          R$ {computedPrice.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Summary Card */}
              <div className="bg-bento-dark text-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-xl border border-bento-border/10">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-bento-amber-bright/70 font-black tracking-widest uppercase">Pote Personalizado</span>
                      <h4 className="text-sm font-black text-white mt-1">
                        {customBase === 'bolos' ? '🍰 Bolo no Pote' : customBase === 'bombons' ? '🍬 Bombom no Pote' : '🥧 Tortinha no Pote'}
                      </h4>
                    </div>
                    <span className="text-xs bg-[#4D392B] px-2.5 py-1 rounded-full text-bento-amber-bright font-black">
                      MONTE SEU POTE
                    </span>
                  </div>

                  <hr className="border-white/10" />

                  <div className="space-y-2 text-[11px] leading-relaxed">
                    <div className="flex justify-between">
                      <span className="text-white/50 font-semibold">Tamanho:</span>
                      <span className="text-white/90 font-bold">{customSize === 'individual' ? 'Individual (250ml)' : 'Família (1,2L)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50 font-semibold">Massa/Base:</span>
                      <span className="text-white/90 font-bold max-w-[150px] truncate text-right">{selectedMassa || 'Não selecionada'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50 font-semibold">Recheios:</span>
                      <span className="text-white/90 font-bold max-w-[150px] truncate text-right">{selectedRecheios.join(' & ') || 'Nenhum'}</span>
                    </div>
                    {selectedAdicionais.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/50 font-semibold">Adicionais:</span>
                        <span className="text-white/90 font-bold max-w-[150px] truncate text-right">{selectedAdicionais.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <hr className="border-white/10" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-white/60">Total</span>
                    <span className="text-2xl font-black text-bento-amber-bright font-mono">
                      R$ {(() => {
                        let total = customSize === 'individual' 
                          ? (customBase === 'tortinhas' ? 10.00 : 12.00) 
                          : (customBase === 'bolos' ? 60.00 : 70.00);
                        
                        selectedAdicionais.forEach(name => {
                          const item = ADICIONAIS_POTE.find(a => a.name === name);
                          if (item) {
                            total += customSize === 'individual' ? item.price : item.price * 3;
                          }
                        });
                        return total;
                      })().toFixed(2)}
                    </span>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleCustomAddToCart}
                    className="w-full py-4 rounded-xl bg-bento-amber hover:bg-bento-amber-light text-bento-amber-deep font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Success Alert Toast */}
      <AnimatePresence>
        {successAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-emerald-500 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
              🎉
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider">Adicionado com Sucesso!</h4>
              <p className="text-[10px] text-white/80 mt-0.5 leading-tight">Sua delícia no pote foi inserida no carrinho de compras.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
