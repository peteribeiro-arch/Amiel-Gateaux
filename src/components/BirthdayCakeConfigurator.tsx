import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info, Sparkles, Plus, AlertCircle, ShoppingBag } from 'lucide-react';
import { CustomCakeConfig, Product } from '../types';

interface BirthdayCakeConfiguratorProps {
  onAddToCart: (product: Product, selectedSize: any, observation: string, config: CustomCakeConfig) => void;
}

// Data matching the uploaded image menu exactly
const SIZES = [
  { id: 'cake-bento', name: 'BENTO CAKE', range: '10 a 15 cm', description: 'Serve até 4 fatias', price: 50.00, iconSize: 'w-8 h-8' },
  { id: 'cake-15-20', name: '15 A 20 CM', range: 'Diâmetro médio', description: 'Serve de 10 a 15 fatias', price: 100.00, iconSize: 'w-10 h-10' },
  { id: 'cake-20-25', name: '20 A 25 CM', range: 'Diâmetro médio-grande', description: 'Serve de 20 a 25 fatias', price: 150.00, iconSize: 'w-12 h-12' },
  { id: 'cake-25-30', name: '25 A 30 CM', range: 'Diâmetro grande', description: 'Serve de 30 a 35 fatias', price: 200.00, iconSize: 'w-14 h-14' },
  { id: 'cake-30-35', name: '30 A 35 CM', range: 'Diâmetro extra grande', description: 'Serve de 45 a 50 fatias', price: 280.00, iconSize: 'w-16 h-16' },
];

const MASSAS = [
  { id: 'massa-branca', name: 'BRANCA', color: 'bg-[#FFFDF6]' },
  { id: 'massa-chocolate', name: 'CHOCOLATE', color: 'bg-[#3D2314]' },
  { id: 'massa-limao', name: 'LIMÃO', color: 'bg-[#EBF7E3]' },
  { id: 'massa-coco', name: 'COCO', color: 'bg-[#FAFBF9]' },
];

const RECHEIOS = [
  'Brigadeiro de chocolate 50%',
  'Brigadeiro de chocolate branco',
  'Doce de leite',
  'Ninho',
  'Oreo',
  'Paçoca',
  'Kinder Bueno',
  'Coco',
  'Sensação',
  'Parmesão',
  'Limão',
  'Creme três leites',
  'Mousse de chocolate 50%',
  'Mousse de chocolate branco',
  'Mousse de ninho',
];

const ADICIONAIS_CATEGORIES = [
  {
    title: '🍓 GELEIAS E COMPOTAS',
    items: ['Geleia de morango', 'Geleia de frutas vermelhas', 'Compota de abacaxi', 'Geleia de goiaba'],
  },
  {
    title: '🍫 CREMES ESPECIAIS',
    items: ['Creme de Nutella', 'Creme de KitKat', 'Creme de Ovomaltine'],
  },
  {
    title: '🍇 FRUTAS',
    items: ['Morango', 'Uva', 'Abacaxi natural', 'Cereja', 'Pêssego'],
  },
  {
    title: '🌰 EXTRAS',
    items: ['Ameixa', 'Castanhas', 'Amendoim'],
  },
];

const COBERTURAS = [
  { name: 'CHANTILLY', badge: 'SEM ACRÉSCIMO' },
  { name: 'BUTTERCREAM', badge: 'CONSULTAR VALOR' },
  { name: 'GANACHE', badge: 'VALOR SOB CONSULTA' },
  { name: 'CHANTINACHE / CHANTININHO', badge: 'VALOR SOB CONSULTA' },
  { name: 'MERENGUE', badge: 'VALOR SOB CONSULTA' },
  { name: 'MARSHMALLOW', badge: 'VALOR SOB CONSULTA' },
];

export function BirthdayCakeConfigurator({ onAddToCart }: BirthdayCakeConfiguratorProps) {
  // Config state
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // Default to 15-20cm (R$100)
  const [selectedMassa, setSelectedMassa] = useState(MASSAS[0].name);
  const [selectedRecheios, setSelectedRecheios] = useState<string[]>([]);
  const [selectedAdicionais, setSelectedAdicionais] = useState<string[]>([]);
  const [selectedCobertura, setSelectedCobertura] = useState(COBERTURAS[0].name);
  const [cakeText, setCakeText] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleRecheio = (name: string) => {
    setError(null);
    if (selectedRecheios.includes(name)) {
      setSelectedRecheios(selectedRecheios.filter((r) => r !== name));
    } else {
      if (selectedRecheios.length >= 2) {
        setError('Você pode selecionar até 2 opções de recheio sem acréscimo!');
        return;
      }
      setSelectedRecheios([...selectedRecheios, name]);
    }
  };

  const handleToggleAdicional = (name: string) => {
    setError(null);
    if (selectedAdicionais.includes(name)) {
      setSelectedAdicionais(selectedAdicionais.filter((a) => a !== name));
    } else {
      setSelectedAdicionais([...selectedAdicionais, name]);
    }
  };

  const handleAddToCartClick = () => {
    setError(null);
    if (selectedRecheios.length === 0) {
      setError('Por favor, selecione pelo menos 1 sabor de recheio para o seu bolo.');
      return;
    }

    // Prepare virtual product
    const product: Product = {
      id: 'custom-birthday-cake-' + Date.now(),
      name: `Bolo de Aniversário (${selectedSize.name})`,
      category: 'aniversario',
      price: selectedSize.price,
      ingredients: [],
      imageUrl: '/src/assets/images/birthday_cake_1782778653144.jpg',
      description: `Bolo personalizado montado com massa ${selectedMassa}, recheio: ${selectedRecheios.join(' e ')} e cobertura: ${selectedCobertura}.`,
    };

    const config: CustomCakeConfig = {
      size: {
        id: selectedSize.id,
        name: selectedSize.name,
        description: `${selectedSize.range} - ${selectedSize.description}`,
        price: selectedSize.price,
      },
      massa: selectedMassa,
      recheios: selectedRecheios,
      adicionais: selectedAdicionais,
      cobertura: selectedCobertura,
      cakeNameText: cakeText.trim() !== '' ? cakeText.trim() : undefined,
    };

    // Format observations summary to fit nicely into general cart view
    let obsSummary = `Massa: ${selectedMassa} | Recheio: ${selectedRecheios.join(' / ')} | Cobertura: ${selectedCobertura}`;
    if (selectedAdicionais.length > 0) {
      obsSummary += ` | Adicionais: ${selectedAdicionais.join(', ')}`;
    }
    if (cakeText.trim() !== '') {
      obsSummary += ` | Escrever no bolo: "${cakeText.trim()}"`;
    }

    onAddToCart(product, { id: selectedSize.id, name: selectedSize.name, price: selectedSize.price }, obsSummary, config);
    
    // Trigger animated feedback
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
      // Reset some fields (optional, but keep text field clean)
      setCakeText('');
    }, 2000);
  };

  return (
    <div className="w-full">
      {/* Decorative Title Card styled like the main banner */}
      <div className="relative rounded-[32px] overflow-hidden bg-bento-dark text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-bento-border/10 mb-8">
        <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-bento-amber-light/10 rounded-full border border-bento-amber-bright/20 text-xs font-bold text-bento-amber-bright">
            <Sparkles className="w-3.5 h-3.5 fill-bento-amber-bright stroke-bento-amber-bright" />
            Amiel Gâteaux — Especialidades
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-serif leading-tight text-white">
            Cardápio <span className="text-bento-amber-bright italic font-normal">Bolos</span> de Aniversário
          </h2>
          
          <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed font-light">
            Feitos para transformar seu momento em algo inesquecível! Escolha as opções abaixo para montar seu bolo personalizado do seu jeito.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-bento-amber-bright/90 font-semibold">
            <span className="flex items-center gap-1.5 bg-[#4D392B] px-3 py-1 rounded-full">
              🎂 100% Personalizado
            </span>
            <span className="flex items-center gap-1.5 bg-[#4D392B] px-3 py-1 rounded-full">
              ✨ Ingredientes nobres
            </span>
          </div>
        </div>

        {/* Quick promotional visual graphic */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex-shrink-0 hidden md:block z-10">
          <img
            src="/src/assets/images/birthday_cake_1782778653144.jpg"
            alt="Bolo de Aniversário"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-[24px] shadow-2xl rotate-3 border-4 border-white/10"
          />
          <div className="absolute -bottom-2 -left-2 bg-bento-amber text-bento-amber-deep px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg shadow-md -rotate-3">
            Artesanal
          </div>
        </div>

        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-bento-amber rounded-full blur-3xl opacity-25"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left/Middle Column: Steps Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STEP 1: SIZE */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70 hover:border-bento-amber/20 transition-colors relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 bg-bento-amber text-white text-xs font-black rounded-full flex items-center justify-center border border-bento-amber shadow-xs">
                1
              </span>
              <h3 className="text-sm font-black text-bento-dark uppercase tracking-wider">
                Escolha o tamanho e fatias
              </h3>
            </div>

            <div className="space-y-3">
              {SIZES.map((size) => {
                const isSelected = selectedSize.id === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => {
                      setError(null);
                      setSelectedSize(size);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FEF3C7]/40 border-bento-amber ring-1 ring-bento-amber shadow-xs'
                        : 'bg-[#FAF7F2]/40 border-bento-border/60 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Stylized cake sizes visuals */}
                      <div className={`flex items-center justify-center bg-stone-100 rounded-xl p-2 text-stone-500 ${isSelected ? 'bg-amber-100 text-amber-700' : ''}`}>
                        <div className={`${size.iconSize} rounded-md border-2 border-current flex items-center justify-center text-xs font-bold font-serif opacity-75`}>
                          🎂
                        </div>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-bento-dark">{size.name}</h4>
                        <div className="flex gap-2 items-center mt-0.5">
                          <span className="text-[10px] text-bento-dark/60 font-semibold">{size.range}</span>
                          <span className="text-[10px] text-bento-dark/30">•</span>
                          <span className="text-[10px] text-bento-amber-dark font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                            {size.description}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-400 font-semibold block leading-none">Preço Base</span>
                      <span className="text-base font-black font-mono text-bento-dark">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(size.price)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: MASSA */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70 hover:border-bento-amber/20 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 bg-bento-amber text-white text-xs font-black rounded-full flex items-center justify-center border border-bento-amber shadow-xs">
                2
              </span>
              <h3 className="text-sm font-black text-bento-dark uppercase tracking-wider">
                Escolha sua massa
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MASSAS.map((massa) => {
                const isSelected = selectedMassa === massa.name;
                return (
                  <button
                    key={massa.id}
                    onClick={() => {
                      setError(null);
                      setSelectedMassa(massa.name);
                    }}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 transition-all cursor-pointer min-h-[100px] ${
                      isSelected
                        ? 'bg-[#FEF3C7]/40 border-bento-amber ring-1 ring-bento-amber'
                        : 'bg-[#FAF7F2]/40 border-bento-border/60 hover:bg-stone-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${massa.color} border border-stone-300 shadow-inner`} />
                    <span className="text-xs font-extrabold text-bento-dark uppercase tracking-wider">
                      {massa.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: RECHEIOS */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70 hover:border-bento-amber/20 transition-colors">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 bg-bento-amber text-white text-xs font-black rounded-full flex items-center justify-center border border-bento-amber shadow-xs">
                  3
                </span>
                <h3 className="text-sm font-black text-bento-dark uppercase tracking-wider">
                  Escolha seus recheios
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Até 2 opções sem acréscimo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RECHEIOS.map((item) => {
                const isSelected = selectedRecheios.includes(item);
                const disabled = !isSelected && selectedRecheios.length >= 2;
                return (
                  <button
                    key={item}
                    disabled={disabled}
                    onClick={() => handleToggleRecheio(item)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer'
                    } ${
                      isSelected
                        ? 'bg-[#FEF3C7]/30 border-bento-amber text-bento-amber-dark font-bold'
                        : 'bg-white border-bento-border/60 hover:bg-stone-50 text-bento-dark'
                    }`}
                  >
                    <span className="text-xs font-semibold">{item}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-bento-amber border-bento-amber text-white' : 'border-stone-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: ADICIONAIS ESPECIAIS */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70 hover:border-bento-amber/20 transition-colors">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 bg-bento-amber text-white text-xs font-black rounded-full flex items-center justify-center border border-bento-amber shadow-xs">
                  4
                </span>
                <h3 className="text-sm font-black text-bento-dark uppercase tracking-wider">
                  Adicionais especiais
                </h3>
              </div>
              <span className="text-[10px] bg-stone-100 text-stone-600 font-extrabold px-2 py-0.5 rounded-full">
                Opcional • Sob consulta
              </span>
            </div>
            <p className="text-[11px] text-bento-dark/50 font-semibold mb-4 leading-relaxed">
              Deseja incrementar seu bolo com algum ingrediente premium? Selecione abaixo (sujeito a consulta de valores).
            </p>

            <div className="space-y-6">
              {ADICIONAIS_CATEGORIES.map((cat) => (
                <div key={cat.title} className="space-y-2">
                  <h4 className="text-[10px] font-black tracking-widest text-bento-dark/45 uppercase">
                    {cat.title}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {cat.items.map((item) => {
                      const isSelected = selectedAdicionais.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => handleToggleAdicional(item)}
                          className={`p-2 py-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'bg-bento-amber border-bento-amber text-white font-extrabold'
                              : 'bg-[#FAF7F2]/30 border-bento-border/50 text-bento-dark hover:bg-stone-50'
                          }`}
                        >
                          <span className="text-[10px] leading-tight font-semibold">{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 5: COBERTURA */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70 hover:border-bento-amber/20 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 bg-bento-amber text-white text-xs font-black rounded-full flex items-center justify-center border border-bento-amber shadow-xs">
                5
              </span>
              <h3 className="text-sm font-black text-bento-dark uppercase tracking-wider">
                Coberturas
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COBERTURAS.map((cobertura) => {
                const isSelected = selectedCobertura === cobertura.name;
                return (
                  <button
                    key={cobertura.name}
                    onClick={() => {
                      setError(null);
                      setSelectedCobertura(cobertura.name);
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FEF3C7]/30 border-bento-amber text-bento-amber-dark font-extrabold'
                        : 'bg-white border-bento-border/60 hover:bg-stone-50 text-bento-dark'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider font-extrabold">{cobertura.name}</span>
                      <span className="text-[9px] text-stone-400 font-bold mt-0.5">{cobertura.badge}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-bento-amber border-bento-amber text-white' : 'border-stone-300'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* WRITING TEXT ON CAKE */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-bento-border/70 hover:border-bento-amber/20 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 bg-bento-amber/10 text-bento-amber text-xs font-black rounded-full flex items-center justify-center border border-bento-amber/20">
                ✍️
              </span>
              <h3 className="text-sm font-black text-bento-dark uppercase tracking-wider">
                Escrita no bolo (Opcional)
              </h3>
            </div>
            <p className="text-[11px] text-bento-dark/50 font-semibold mb-3 leading-relaxed">
              O Bento Cake ou bolos tradicionais podem ter uma frase ou nome personalizado escrito por cima.
            </p>
            <input
              type="text"
              value={cakeText}
              onChange={(e) => {
                setError(null);
                setCakeText(e.target.value);
              }}
              placeholder="Ex: Feliz Aniversário, Ana! (Ou frase do meme pro Bento Cake)"
              className="w-full px-4 py-3 rounded-xl border border-bento-border/70 focus:outline-none focus:ring-2 focus:ring-bento-amber/15 focus:border-bento-amber text-xs text-bento-dark placeholder-bento-dark/30 bg-stone-50"
            />
          </div>

        </div>

        {/* Right/Sidebar Column: Live Preview & Checkout card */}
        <div className="space-y-6 lg:sticky lg:top-24">
          
          {/* Cake Config Review Box */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-sm border border-bento-border overflow-hidden">
            <div className="bg-bento-dark text-white p-4 font-serif text-center font-extrabold text-sm uppercase tracking-wider">
              🧁 Resumo da Criação
            </div>
            
            <div className="p-5 space-y-4">
              {/* Product Visual Mockup based on configuration */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-bento-border/40 text-center space-y-2">
                <div className="text-4xl animate-bounce duration-1000">🎂</div>
                <h4 className="text-xs font-black text-bento-dark uppercase tracking-wider font-serif">
                  {selectedSize.name} Personalizado
                </h4>
                <p className="text-[10px] text-stone-400 font-bold leading-none">
                  Massa: {selectedMassa}
                </p>
                {selectedRecheios.length > 0 && (
                  <p className="text-[10px] text-stone-500 font-semibold leading-relaxed">
                    Recheio: <span className="text-bento-amber-dark font-bold">{selectedRecheios.join(' e ')}</span>
                  </p>
                )}
                <p className="text-[10px] text-stone-500 font-semibold">
                  Cobertura: <span className="font-bold text-bento-amber-dark">{selectedCobertura}</span>
                </p>
                {cakeText.trim() !== '' && (
                  <div className="mt-2 bg-white px-2 py-1 rounded-lg border border-pink-100 border-dashed inline-block">
                    <p className="text-[9px] text-pink-600 font-bold uppercase tracking-widest leading-none">Escrita:</p>
                    <p className="text-[11px] font-black text-stone-700 italic">"{cakeText}"</p>
                  </div>
                )}
              </div>

              {/* Items Detail List */}
              <div className="space-y-2.5 text-xs text-bento-dark pt-1">
                <div className="flex justify-between border-b border-bento-border/40 pb-1.5">
                  <span className="font-semibold text-stone-500">Tamanho selecionado</span>
                  <span className="font-extrabold text-right">{selectedSize.name}</span>
                </div>
                <div className="flex justify-between border-b border-bento-border/40 pb-1.5">
                  <span className="font-semibold text-stone-500">Tipo de massa</span>
                  <span className="font-extrabold text-right">{selectedMassa}</span>
                </div>
                <div className="flex justify-between border-b border-bento-border/40 pb-1.5">
                  <span className="font-semibold text-stone-500">Sabores de recheio</span>
                  <span className="font-extrabold text-right max-w-[140px] truncate">
                    {selectedRecheios.length > 0 ? selectedRecheios.join(', ') : 'Pendente...'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-bento-border/40 pb-1.5">
                  <span className="font-semibold text-stone-500">Cobertura/Icing</span>
                  <span className="font-extrabold text-right">{selectedCobertura}</span>
                </div>
                {selectedAdicionais.length > 0 && (
                  <div className="flex justify-between border-b border-bento-border/40 pb-1.5">
                    <span className="font-semibold text-stone-500">Adicionais extras</span>
                    <span className="font-extrabold text-right max-w-[140px] truncate">
                      {selectedAdicionais.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Warnings and Rules from Cardápio */}
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-bento-border/50 text-[10px] font-semibold text-bento-dark/60 space-y-1.5">
                <div className="flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-bento-amber flex-shrink-0 mt-0.5" />
                  <p>Até 2 recheios já estão inclusos sem nenhum acréscimo!</p>
                </div>
                <div className="flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-bento-amber flex-shrink-0 mt-0.5" />
                  <p>Adicionais especiais e coberturas como Buttercream/Ganache podem alterar o valor final sob consulta.</p>
                </div>
              </div>

              {/* Dynamic Error Message Block */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-[11px] font-semibold text-rose-700 flex items-start gap-1.5"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pricing section */}
              <div className="pt-2 border-t border-bento-border flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-bento-dark/50">Preço Estimado</span>
                <span className="text-2xl font-black font-mono text-bento-dark">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedSize.price)}
                </span>
              </div>

              {/* CTA Action button */}
              <button
                type="button"
                onClick={handleAddToCartClick}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 cursor-pointer text-white shadow-md ${
                  successAnimation
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-bento-dark hover:bg-bento-amber hover:shadow-lg'
                }`}
              >
                {successAnimation ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3px] animate-bounce" />
                    Adicionado ao Carrinho!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Adicionar ao Carrinho
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Delivery banner/card details */}
          <div className="bg-[#FFFDF6] p-4 rounded-2xl border border-bento-amber/40 text-center text-xs">
            <p className="font-serif font-bold text-bento-amber-dark">🛵 FAÇA SEU PEDIDO COM ANTECEDÊNCIA!</p>
            <p className="text-[10px] text-[#3D2B1F]/60 font-semibold mt-1">
              Todos os bolos são feitos de forma totalmente artesanal com muito carinho para deixar seu dia inesquecível!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
