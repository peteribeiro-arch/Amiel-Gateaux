import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, Plus, AlertCircle, ShoppingBag, Calendar, Gift, Clock, Star, HelpCircle } from 'lucide-react';
import { Product, Category, CustomCakeConfig } from '../types';

interface FestivalDeFatiasProps {
  onAddToCart: (product: Product, selectedSize?: any, observation?: string, config?: CustomCakeConfig) => void;
  isAdminMode?: boolean;
}

// Slices available in the festival
const FESTIVAL_SWEET_SLICES = [
  { id: 'fest-morango', name: 'Fatia - Torta de Morango', description: 'Recheio cremoso e cobertura brilhante de morangos.', imageUrl: '/assets/images/strawberry_tart_1782777704003.jpg' },
  { id: 'fest-limao', name: 'Fatia - Torta de Limão', description: 'Creme cítrico aveludado com merengue tostado.', imageUrl: '/assets/images/lemon_meringue_tart_1782777880427.jpg' },
  { id: 'fest-cheesecake', name: 'Fatia - Torta Cheesecake', description: 'Textura leve com calda de frutas silvestres.', imageUrl: '/assets/images/cheesecake_red_fruits_1782867099114.jpg' },
  { id: 'fest-holandesa', name: 'Fatia - Torta Holandesa', description: 'Creme de baunilha com ganache de chocolate e biscoitos.', imageUrl: '/assets/images/dutch_pie_torta_holandesa_1782867172497.jpg' },
  { id: 'fest-chocolate', name: 'Fatia - Chocolate e Caramelo', description: 'Chocolate belga com caramelo toffee artesanal.', imageUrl: '/assets/images/choc_caramel_tart_1782866858185.jpg' },
  { id: 'fest-maca', name: 'Fatia - Torta de Maçã e Creme', description: 'Maçãs caramelizadas com creme e canela.', imageUrl: '/assets/images/apple_cream_tart_1782866932900.jpg' },
];

const FESTIVAL_SAVORY_SLICES = [
  { id: 'fest-frango-req', name: 'Fatia - Torta de Frango e Requeijão', description: 'Empadão suculento com requeijão cremoso.', imageUrl: '/assets/images/chicken_pie_1782777913401.jpg' },
  { id: 'fest-frango', name: 'Fatia - Torta de Frango', description: 'Recheio tradicional generoso e muito bem temperado.', imageUrl: '/assets/images/chicken_pie_hearts_1782867324822.jpg' },
  { id: 'fest-calabresa', name: 'Fatia - Torta de Calabresa com Cebola', description: 'Calabresa defumada com cebolas caramelizadas e catupiry.', imageUrl: '/assets/images/calabresa_onion_pie_1782867411691.jpg' },
  { id: 'fest-atum', name: 'Fatia - Torta de Atum e Tomate', description: 'Atum sólido saboroso com tomates frescos e ervas.', imageUrl: '/assets/images/tuna_tomato_pie_1782867496784.jpg' },
];

const BEVERAGES = [
  { id: 'bev-coca', name: 'Coca-Cola Lata 350ml' },
  { id: 'bev-guarana', name: 'Guaraná Antarctica Lata 350ml' },
  { id: 'bev-suco', name: 'Suco Del Valle Uva Lata 290ml' },
  { id: 'bev-agua', name: 'Água Mineral sem Gás 500ml' },
];

export function FestivalDeFatias({ onAddToCart, isAdminMode = false }: FestivalDeFatiasProps) {
  // Navigation inside the festival
  const [activeTab, setActiveTab] = useState<'info' | 'combos' | 'individual'>('info');

  // Combo Creator States
  const [selectedComboType, setSelectedComboType] = useState<'doce-desejo' | 'par-perfeito' | 'banquete' | null>(null);
  const [comboSweetSelections, setComboSweetSelections] = useState<string[]>([]);
  const [comboSavorySelections, setComboSavorySelections] = useState<string[]>([]);
  const [comboBeverage, setComboBeverage] = useState<string>('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Individual Slice Order state
  const [successSliceId, setSuccessSliceId] = useState<string | null>(null);

  // Action: Add Individual Slice to Cart
  const handleAddIndividualSlice = (slice: typeof FESTIVAL_SWEET_SLICES[0], category: 'doces' | 'salgadas') => {
    const product: Product = {
      id: `fest-slice-${slice.id}`,
      name: slice.name,
      category: category,
      price: 12.00,
      imageUrl: slice.imageUrl,
      ingredients: [],
      description: `Fatia individual participante do Festival de Fatias de 04/07. ${slice.description}`,
    };

    onAddToCart(product, { id: `slice-${slice.id}-ind`, name: 'Fatia Individual', price: 12.00 }, 'Festival de Fatias - Retirada 04/07');
    
    setSuccessSliceId(slice.id);
    setTimeout(() => setSuccessSliceId(null), 1500);
  };

  // Setup Combo Builder
  const startComboBuilder = (type: 'doce-desejo' | 'par-perfeito' | 'banquete') => {
    setSelectedComboType(type);
    setComboSweetSelections([]);
    setComboSavorySelections([]);
    setComboBeverage('');
    setError(null);
    setSuccessMessage(null);
  };

  const handleSelectSweetForCombo = (sliceName: string, max: number) => {
    setError(null);
    if (comboSweetSelections.includes(sliceName)) {
      // Allow multiple clicks if they want multiple of the same slice
      const index = comboSweetSelections.indexOf(sliceName);
      const updated = [...comboSweetSelections];
      updated.splice(index, 1);
      setComboSweetSelections(updated);
    } else {
      if (comboSweetSelections.length >= max) {
        setError(`Você já selecionou o limite de ${max} fatias doces para este combo!`);
        return;
      }
      setComboSweetSelections([...comboSweetSelections, sliceName]);
    }
  };

  const handleSelectSavoryForCombo = (sliceName: string, max: number) => {
    setError(null);
    if (comboSavorySelections.includes(sliceName)) {
      const index = comboSavorySelections.indexOf(sliceName);
      const updated = [...comboSavorySelections];
      updated.splice(index, 1);
      setComboSavorySelections(updated);
    } else {
      if (comboSavorySelections.length >= max) {
        setError(`Você já selecionou o limite de ${max} fatias salgadas para este combo!`);
        return;
      }
      setComboSavorySelections([...comboSavorySelections, sliceName]);
    }
  };

  // Add Complete Combo to Cart
  const handleAddComboToCart = () => {
    setError(null);
    if (!selectedComboType) return;

    if (selectedComboType === 'doce-desejo') {
      if (comboSweetSelections.length < 3) {
        setError('Por favor, escolha exatamente 3 fatias doces para completar o combo!');
        return;
      }

      const product: Product = {
        id: `fest-combo-doce-desejo-${Date.now()}`,
        name: 'Combo Doce Desejo - 3 Fatias',
        category: 'doces',
        price: 29.90,
        imageUrl: '/assets/images/cheesecake_red_fruits_1782867099114.jpg',
        ingredients: [],
        description: `Festival de Fatias combo promocional com 3 fatias doces: ${comboSweetSelections.join(', ')}.`,
      };

      onAddToCart(
        product,
        { id: 'combo-doce-desejo-size', name: 'Combo 3 Fatias', price: 29.90 },
        `Itens: ${comboSweetSelections.join(' + ')} | Festival de Fatias - Retirada 04/07`
      );
    } 
    else if (selectedComboType === 'par-perfeito') {
      if (comboSavorySelections.length < 1) {
        setError('Por favor, escolha 1 fatia salgada!');
        return;
      }
      if (comboSweetSelections.length < 1) {
        setError('Por favor, escolha 1 fatia doce!');
        return;
      }
      if (!comboBeverage) {
        setError('Por favor, escolha 1 bebida!');
        return;
      }

      const product: Product = {
        id: `fest-combo-par-perfeito-${Date.now()}`,
        name: 'Combo Par Perfeito - Salgada + Doce + Bebida',
        category: 'doces',
        price: 22.90,
        imageUrl: '/assets/images/lemon_meringue_tart_1782777880427.jpg',
        ingredients: [],
        description: `Combo promocional: Fatia Salgada (${comboSavorySelections[0]}) + Fatia Doce (${comboSweetSelections[0]}) + Bebida (${comboBeverage}).`,
      };

      onAddToCart(
        product,
        { id: 'combo-par-perfeito-size', name: 'Combo Completo', price: 22.90 },
        `Salgada: ${comboSavorySelections[0]} | Doce: ${comboSweetSelections[0]} | Bebida: ${comboBeverage} | Festival de Fatias - Retirada 04/07`
      );
    } 
    else if (selectedComboType === 'banquete') {
      if (comboSavorySelections.length < 2) {
        setError('Por favor, escolha exatamente 2 fatias salgadas!');
        return;
      }
      if (comboSweetSelections.length < 2) {
        setError('Por favor, escolha exatamente 2 fatias doces!');
        return;
      }

      const product: Product = {
        id: `fest-combo-banquete-${Date.now()}`,
        name: 'Combo Banquete Individual - 4 Fatias',
        category: 'doces',
        price: 39.90,
        imageUrl: '/assets/images/apple_cream_tart_1782866932900.jpg',
        ingredients: [],
        description: `Combo Festival: 2 Salgadas (${comboSavorySelections.join(', ')}) + 2 Doces (${comboSweetSelections.join(', ')}).`,
      };

      onAddToCart(
        product,
        { id: 'combo-banquete-size', name: 'Combo 4 Fatias', price: 39.90 },
        `Salgadas: ${comboSavorySelections.join(' + ')} | Doces: ${comboSweetSelections.join(' + ')} | Festival de Fatias - Retirada 04/07`
      );
    }

    setSuccessMessage('Combo adicionado ao carrinho com sucesso!');
    setTimeout(() => {
      setSelectedComboType(null);
      setSuccessMessage(null);
    }, 1800);
  };

  return (
    <div className="w-full space-y-8">
      {/* Dynamic Header Promo Banner */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#2E1A11] via-bento-dark to-stone-900 text-white p-8 sm:p-12 shadow-xl border border-amber-500/10">
        <div className="relative z-10 max-w-2xl space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/30 text-xs font-bold text-bento-amber-bright">
            <Calendar className="w-3.5 h-3.5" />
            Grande Evento Exclusivo — 04 de Julho (Quinta-Feira)
          </div>
          
          <h2 className="text-3.5xl sm:text-5.5xl font-black tracking-tight font-serif leading-none text-white">
            Festival de <span className="text-bento-amber-bright italic font-normal">Fatias</span> Amiel
          </h2>
          
          <p className="text-xs sm:text-sm text-stone-200/95 leading-relaxed font-light">
            No dia <strong>04/07</strong>, abriremos as portas para o nosso festival mais amado! Experimente porções individuais generosas das nossas tortas artesanais mais consagradas ou monte combos promocionais irresistíveis. 
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-bold">
            <span className="flex items-center gap-1.5 bg-[#4D392B] px-3.5 py-1.5 rounded-full border border-amber-500/15 text-bento-amber-bright">
              <Clock className="w-3.5 h-3.5" /> Retiradas das 10h às 19h
            </span>
            <span className="flex items-center gap-1.5 bg-[#4D392B] px-3.5 py-1.5 rounded-full border border-amber-500/15 text-bento-amber-bright">
              <Gift className="w-3.5 h-3.5" /> Compre combos e ganhe desconto!
            </span>
          </div>
        </div>

        {/* Promotional Floating Images */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex gap-4 z-10 rotate-3">
          <div className="relative w-36 h-48 rounded-[20px] overflow-hidden border-4 border-white shadow-lg -rotate-6">
            <img src="/assets/images/cheesecake_red_fruits_1782867099114.jpg" className="w-full h-full object-cover" alt="Cheesecake" />
          </div>
          <div className="relative w-36 h-48 rounded-[20px] overflow-hidden border-4 border-white shadow-lg translate-y-6 rotate-6">
            <img src="/assets/images/calabresa_onion_pie_1782867411691.jpg" className="w-full h-full object-cover" alt="Torta de Calabresa" />
          </div>
        </div>

        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-bento-amber rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Navigation Sub-menu Tabs */}
      <div className="flex items-center justify-center border-b border-stone-200 pb-1 max-w-md mx-auto gap-1">
        {[
          { id: 'info', label: 'ℹ️ Sobre o Festival' },
          { id: 'combos', label: '🎁 Combos Especiais' },
          { id: 'individual', label: '🍰 Fatias Avulsas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSelectedComboType(null);
            }}
            className={`flex-1 py-3 text-xs font-extrabold rounded-t-xl transition-all border-b-2 cursor-pointer text-center ${
              activeTab === tab.id
                ? 'border-bento-amber text-bento-amber-deep bg-amber-50/50'
                : 'border-transparent text-bento-dark/60 hover:text-bento-dark hover:bg-stone-50/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: ABOUT/INFO */}
      {activeTab === 'info' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {/* Bento Cell 1: Como Funciona */}
          <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-xl border border-amber-100">
              📅
            </div>
            <h3 className="font-serif font-black text-lg text-stone-900 leading-tight">Como reservar as fatias?</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-semibold">
              O festival acontece no dia <strong>04 de Julho (quinta-feira)</strong>. Devido à altíssima demanda e produção artesanal limitada, as fatias devem ser reservadas com antecedência por aqui!
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Adicione suas fatias ou combos preferidos ao carrinho e finalize seu pedido enviando no WhatsApp. Prontinho! Suas fatias estarão reservadas e prontas para retirada no dia do festival.
            </p>
          </div>

          {/* Bento Cell 2: combos */}
          <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-xl border border-amber-100">
              🎁
            </div>
            <h3 className="font-serif font-black text-lg text-stone-900 leading-tight">Vantagens dos Combos</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-semibold">
              Quer experimentar mais de um sabor? Nossos combos oferecem descontos incríveis para você provar diversas opções!
            </p>
            <ul className="text-xs text-stone-500 space-y-1.5 list-disc list-inside">
              <li><strong>Combo 3 Doces</strong>: De R$ 36,00 por apenas R$ 29,90</li>
              <li><strong>Combo Par Perfeito</strong>: Salgada + Doce + Refrigerante por R$ 22,90</li>
              <li><strong>Banquete Família</strong>: 2 salgadas + 2 doces por R$ 39,90</li>
            </ul>
            <button
              onClick={() => setActiveTab('combos')}
              className="mt-2 w-full py-2 bg-bento-amber text-bento-amber-deep hover:bg-bento-amber/95 font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              Ver Combos Promocionais
            </button>
          </div>

          {/* Bento Cell 3: Local e Horário */}
          <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-xl border border-amber-100">
              📍
            </div>
            <h3 className="font-serif font-black text-lg text-stone-900 leading-tight">Retirada no Balcão</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-semibold">
              Retire suas fatias fresquinhas diretamente no balcão de nossa loja no dia 04 de Julho.
            </p>
            <div className="text-xs text-stone-500 space-y-2">
              <p>📍 <strong>Local:</strong> Amiel Gâteaux - Confeitaria Artesanal</p>
              <p>🕙 <strong>Horário de Retirada:</strong> Das 10:00 às 19:00</p>
              <p className="text-amber-700 font-bold bg-amber-50 p-2 rounded-lg border border-amber-100">
                ⚠️ Atenção: Apenas reservas confirmadas pelo site estarão disponíveis. Garanta já a sua!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT: COMBOS */}
      {activeTab === 'combos' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* If No Combo is being customized, show cards */}
          {!selectedComboType ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              
              {/* Combo Card 1 */}
              <div className="bg-white rounded-[24px] border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-bento-amber/40 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-amber-500 text-white font-extrabold text-[9px] uppercase tracking-widest px-4 py-1 rounded-bl-xl group-hover:scale-105 transition-all">
                  Mais Popular
                </div>
                <div className="space-y-4">
                  <span className="text-3xl">🍰🍰🍰</span>
                  <h3 className="font-serif font-black text-xl text-stone-900 leading-tight mt-2">Combo Doce Desejo</h3>
                  <p className="text-xs text-stone-500">
                    O favorito das formiguinhas! Escolha 3 fatias doces generosas quaisquer das nossas tortas assadas nobres.
                  </p>
                  <div className="pt-2">
                    <span className="text-xs text-stone-400 block font-semibold leading-none">Preço do Combo</span>
                    <span className="text-2.5xl font-black font-mono text-stone-900">R$ 29,90</span>
                    <span className="text-[10px] text-stone-400 font-semibold block mt-0.5">Economize R$ 6,10</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => startComboBuilder('doce-desejo')}
                  className="mt-6 w-full py-3 bg-stone-900 text-bento-amber hover:bg-stone-800 hover:text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  ✨ Personalizar Combo
                </button>
              </div>

              {/* Combo Card 2 */}
              <div className="bg-white rounded-[24px] border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-bento-amber/40 transition-all relative overflow-hidden">
                <div className="space-y-4">
                  <span className="text-3xl">🥧🍰🥤</span>
                  <h3 className="font-serif font-black text-xl text-stone-900 leading-tight mt-2">Combo Par Perfeito</h3>
                  <p className="text-xs text-stone-500">
                    A refeição completa perfeita! Escolha 1 fatia salgada de sua preferência, 1 fatia doce deliciosa e 1 bebida geladinha.
                  </p>
                  <div className="pt-2">
                    <span className="text-xs text-stone-400 block font-semibold leading-none">Preço do Combo</span>
                    <span className="text-2.5xl font-black font-mono text-stone-900">R$ 22,90</span>
                    <span className="text-[10px] text-stone-400 font-semibold block mt-0.5">Economize R$ 5,10</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => startComboBuilder('par-perfeito')}
                  className="mt-6 w-full py-3 bg-stone-900 text-bento-amber hover:bg-stone-800 hover:text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  ✨ Personalizar Combo
                </button>
              </div>

              {/* Combo Card 3 */}
              <div className="bg-white rounded-[24px] border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-bento-amber/40 transition-all relative overflow-hidden">
                <div className="space-y-4">
                  <span className="text-3xl">🥧🥧🍰🍰</span>
                  <h3 className="font-serif font-black text-xl text-stone-900 leading-tight mt-2">Banquete Individual</h3>
                  <p className="text-xs text-stone-500">
                    Para quem quer fazer a festa! Escolha 2 fatias salgadas super recheadas e 2 fatias doces espetaculares.
                  </p>
                  <div className="pt-2">
                    <span className="text-xs text-stone-400 block font-semibold leading-none">Preço do Combo</span>
                    <span className="text-2.5xl font-black font-mono text-stone-900">R$ 39,90</span>
                    <span className="text-[10px] text-stone-400 font-semibold block mt-0.5">Economize R$ 8,10</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => startComboBuilder('banquete')}
                  className="mt-6 w-full py-3 bg-stone-900 text-bento-amber hover:bg-stone-800 hover:text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  ✨ Personalizar Combo
                </button>
              </div>

            </div>
          ) : (
            /* Combo Customizer Builder Frame */
            <div className="max-w-4xl mx-auto bg-white border border-stone-200 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-black text-stone-950 uppercase tracking-tight font-serif flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-bento-amber" />
                    Personalizando seu Combo: {
                      selectedComboType === 'doce-desejo' ? 'Doce Desejo (3 fatias doces)' :
                      selectedComboType === 'par-perfeito' ? 'Par Perfeito (1 Salgada + 1 Doce + 1 Bebida)' :
                      'Banquete Individual (2 Salgadas + 2 Doces)'
                    }
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">Selecione suas opções abaixo clicando nas fatias desejadas.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedComboType(null)}
                  className="text-xs font-bold text-stone-500 hover:text-rose-600 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                >
                  Cancelar
                </button>
              </div>

              {/* SAVORY SLICES SELECTOR (If applicable to combo) */}
              {(selectedComboType === 'par-perfeito' || selectedComboType === 'banquete') && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider flex items-center justify-between">
                    <span>🥧 Escolha as Fatias Salgadas:</span>
                    <span className="text-[10px] font-bold text-stone-500 font-mono">
                      {comboSavorySelections.length} de {selectedComboType === 'par-perfeito' ? 1 : 2} selecionadas
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {FESTIVAL_SAVORY_SLICES.map((slice) => {
                      const count = comboSavorySelections.filter((name) => name === slice.name).length;
                      const isSelected = count > 0;
                      return (
                        <button
                          key={slice.id}
                          onClick={() => handleSelectSavoryForCombo(slice.name, selectedComboType === 'par-perfeito' ? 1 : 2)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FEF3C7]/20 border-bento-amber text-bento-amber-dark font-extrabold ring-1 ring-bento-amber/30'
                              : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={slice.imageUrl} alt={slice.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <span className="text-xs font-bold block leading-tight">{slice.name.replace('Fatia - ', '')}</span>
                              <span className="text-[9.5px] text-stone-400 font-semibold block truncate max-w-[200px] mt-0.5">{slice.description}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {count > 0 && (
                              <span className="bg-bento-amber text-bento-amber-deep text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                                {count}
                              </span>
                            )}
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected ? 'bg-bento-amber border-bento-amber text-white' : 'border-stone-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SWEET SLICES SELECTOR */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider flex items-center justify-between">
                  <span>🍰 Escolha as Fatias Doces:</span>
                  <span className="text-[10px] font-bold text-stone-500 font-mono">
                    {comboSweetSelections.length} de {
                      selectedComboType === 'doce-desejo' ? 3 :
                      selectedComboType === 'par-perfeito' ? 1 : 2
                    } selecionadas
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FESTIVAL_SWEET_SLICES.map((slice) => {
                    const count = comboSweetSelections.filter((name) => name === slice.name).length;
                    const isSelected = count > 0;
                    return (
                      <button
                        key={slice.id}
                        onClick={() => handleSelectSweetForCombo(slice.name, selectedComboType === 'doce-desejo' ? 3 : selectedComboType === 'par-perfeito' ? 1 : 2)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FEF3C7]/20 border-bento-amber text-bento-amber-dark font-extrabold ring-1 ring-bento-amber/30'
                            : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={slice.imageUrl} alt={slice.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <span className="text-xs font-bold block leading-tight">{slice.name.replace('Fatia - ', '')}</span>
                            <span className="text-[9.5px] text-stone-400 font-semibold block truncate max-w-[200px] mt-0.5">{slice.description}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {count > 0 && (
                            <span className="bg-bento-amber text-bento-amber-deep text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                              {count}
                            </span>
                          )}
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-bento-amber border-bento-amber text-white' : 'border-stone-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BEVERAGES SELECTOR (If applicable to combo) */}
              {selectedComboType === 'par-perfeito' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider block">
                    🥤 Escolha 1 Bebida Geladinha:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BEVERAGES.map((bev) => {
                      const isSelected = comboBeverage === bev.name;
                      return (
                        <button
                          key={bev.id}
                          onClick={() => setComboBeverage(bev.name)}
                          className={`p-3 rounded-xl border text-center text-xs font-bold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#FEF3C7]/30 border-bento-amber text-bento-amber-dark ring-1 ring-bento-amber/30'
                              : 'bg-[#FAF7F2]/40 border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          {bev.name.replace(' Lata 350ml', '').replace(' Lata 290ml', '')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Error or Success notification block */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2">
                  🎉 {successMessage}
                </div>
              )}

              {/* Final Confirm Add to Cart Action */}
              <div className="border-t pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50 -mx-6 -mb-6 p-6 rounded-b-[28px]">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-stone-400 block font-black uppercase tracking-wider">Valor total do combo</span>
                  <span className="text-2xl font-black font-mono text-stone-900">
                    {
                      selectedComboType === 'doce-desejo' ? 'R$ 29,90' :
                      selectedComboType === 'par-perfeito' ? 'R$ 22,90' :
                      'R$ 39,90'
                    }
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddComboToCart}
                  disabled={!!successMessage}
                  className="w-full sm:w-auto px-6 py-3.5 bg-bento-dark text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-bento-amber transition-colors shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-bento-amber-bright" />
                  Adicionar Combo ao Carrinho
                </button>
              </div>

            </div>
          )}
        </motion.div>
      )}

      {/* TAB CONTENT: INDIVIDUAL SLICES */}
      {activeTab === 'individual' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 max-w-5xl mx-auto"
        >
          <div className="text-center space-y-2">
            <h3 className="text-lg font-serif font-black text-stone-900 uppercase">Fatias Individuais Avulsas</h3>
            <p className="text-xs text-stone-500 max-w-lg mx-auto leading-relaxed">
              Deseja apenas saborear uma única fatia de sua torta favorita? Todas as fatias participantes do festival saem por apenas <strong>R$ 12,00</strong> cada!
            </p>
          </div>

          {/* Sweet Slices */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">
              🧁 Slices Doces (R$ 12,00 / un)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FESTIVAL_SWEET_SLICES.map((slice) => {
                const isSuccess = successSliceId === slice.id;
                return (
                  <div key={slice.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:border-bento-amber/30 transition-all flex flex-col justify-between">
                    <div className="relative h-44 w-full">
                      <img src={slice.imageUrl} className="w-full h-full object-cover" alt={slice.name} />
                      <span className="absolute top-2.5 left-2.5 bg-bento-dark/85 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                        Doce Assada
                      </span>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-sm text-stone-950 leading-tight">
                          {slice.name.replace('Fatia - ', '')}
                        </h4>
                        <p className="text-[11px] text-stone-500 leading-normal font-medium">{slice.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-base font-black font-mono text-stone-900">R$ 12,00</span>
                        <button
                          type="button"
                          onClick={() => handleAddIndividualSlice(slice, 'doces')}
                          className={`px-3 py-2 rounded-lg font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-all ${
                            isSuccess
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 hover:bg-bento-amber hover:text-bento-amber-deep text-stone-700'
                          }`}
                        >
                          {isSuccess ? '✓ Reservado' : '+ Reservar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Savory Slices */}
          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">
              🥧 Slices Salgados (R$ 12,00 / un)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FESTIVAL_SAVORY_SLICES.map((slice) => {
                const isSuccess = successSliceId === slice.id;
                return (
                  <div key={slice.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:border-bento-amber/30 transition-all flex flex-col justify-between">
                    <div className="relative h-44 w-full">
                      <img src={slice.imageUrl} className="w-full h-full object-cover" alt={slice.name} />
                      <span className="absolute top-2.5 left-2.5 bg-bento-dark/85 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                        Salgada Assada
                      </span>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-sm text-stone-950 leading-tight">
                          {slice.name.replace('Fatia - ', '')}
                        </h4>
                        <p className="text-[11px] text-stone-500 leading-normal font-medium">{slice.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-base font-black font-mono text-stone-900">R$ 12,00</span>
                        <button
                          type="button"
                          onClick={() => handleAddIndividualSlice(slice, 'salgadas')}
                          className={`px-3 py-2 rounded-lg font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-all ${
                            isSuccess
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 hover:bg-bento-amber hover:text-bento-amber-deep text-stone-700'
                          }`}
                        >
                          {isSuccess ? '✓ Reservado' : '+ Reservar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Trust Badge and Help Center Info */}
      <div className="max-w-xl mx-auto p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center flex items-center justify-center gap-2.5">
        <HelpCircle className="w-5 h-5 text-[#B45309] shrink-0" />
        <span className="text-[11px] text-[#78350F] font-bold">
          Dúvidas sobre o festival? Fale diretamente com o nosso atendimento no WhatsApp ou ligue (11) 98765-4321.
        </span>
      </div>

    </div>
  );
}
