import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Calendar, Clock, HelpCircle } from 'lucide-react';
import { Product, CustomCakeConfig } from '../types';

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

export function FestivalDeFatias({ onAddToCart, isAdminMode = false }: FestivalDeFatiasProps) {
  // Navigation inside the festival
  const [activeTab, setActiveTab] = useState<'info' | 'individual'>('info');

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

    onAddToCart(product, { id: `slice-${slice.id}-ind`, name: 'Fatia Individual', price: 12.00 }, 'Festival de Fatias - Retirada/Entrega 04/07 a partir das 11h');
    
    setSuccessSliceId(slice.id);
    setTimeout(() => setSuccessSliceId(null), 1500);
  };

  return (
    <div className="w-full space-y-8">
      {/* Dynamic Header Promo Banner */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#2E1A11] via-bento-dark to-stone-900 text-white p-8 sm:p-12 shadow-xl border border-amber-500/10">
        <div className="relative z-10 max-w-2xl space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/30 text-xs font-bold text-bento-amber-bright">
            <Calendar className="w-3.5 h-3.5" />
            Grande Evento Exclusivo — 04 de Julho (Sábado)
          </div>
          
          <h2 className="text-3.5xl sm:text-5.5xl font-black tracking-tight font-serif leading-none text-white">
            Festival de <span className="text-bento-amber-bright italic font-normal">Fatias</span> Amiel
          </h2>
          
          <p className="text-xs sm:text-sm text-stone-200/95 leading-relaxed font-light">
            No dia <strong>04/07 (Sábado)</strong>, abriremos as portas para o nosso festival mais amado! Experimente porções individuais generosas das nossas tortas artesanais doces e salgadas mais consagradas.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-bold">
            <span className="flex items-center gap-1.5 bg-[#4D392B] px-3.5 py-1.5 rounded-full border border-amber-500/15 text-bento-amber-bright">
              <Clock className="w-3.5 h-3.5" /> Retiradas e entregas a partir das 11h
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
      <div className="flex items-center justify-center border-b border-stone-200 pb-1 max-w-sm mx-auto gap-1">
        {[
          { id: 'info', label: 'ℹ️ Sobre o Festival' },
          { id: 'individual', label: '🍰 Fatias para Reserva' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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
              O festival acontece no dia <strong>04 de Julho (sábado)</strong>. Devido à altíssima demanda e produção artesanal limitada, as fatias devem ser reservadas com antecedência por aqui!
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Escolha suas fatias preferidas e adicione ao carrinho. Ao finalizar o pedido via WhatsApp, nós agendamos suas fatias para o dia do evento de forma rápida e segura.
            </p>
          </div>

          {/* Bento Cell 2: Retiradas e Entregas */}
          <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-xl border border-amber-100">
              🛵
            </div>
            <h3 className="font-serif font-black text-lg text-stone-900 leading-tight">Entregas e Retiradas</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-semibold">
              Oferecemos flexibilidade máxima no dia do evento para você saborear suas fatias no conforto de casa ou buscar na loja.
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Tanto o serviço de delivery quanto a retirada no balcão iniciarão pontualmente <strong>a partir das 11:00</strong> no dia 04/07 (sábado). Escolha o que for mais prático para você!
            </p>
            <button
              onClick={() => setActiveTab('individual')}
              className="mt-2 w-full py-2 bg-bento-amber text-bento-amber-deep hover:bg-bento-amber/95 font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              Ver Sabores de Fatias
            </button>
          </div>

          {/* Bento Cell 3: Local e Horário */}
          <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-xl border border-amber-100">
              📍
            </div>
            <h3 className="font-serif font-black text-lg text-stone-900 leading-tight">Local e Horários</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-semibold">
              Retire suas fatias fresquinhas diretamente no balcão de nossa loja ou solicite entrega no seu endereço.
            </p>
            <div className="text-xs text-stone-500 space-y-2">
              <p>📍 <strong>Local:</strong> Amiel Gâteaux - Confeitaria Artesanal</p>
              <p>🕙 <strong>Início dos Serviços:</strong> Sábado (04/07) a partir das 11h</p>
              <p className="text-amber-700 font-bold bg-amber-50 p-2 rounded-lg border border-amber-100">
                ⚠️ Atenção: Apenas reservas antecipadas pelo site estarão garantidas para o dia 04 de Julho.
              </p>
            </div>
          </div>
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
            <h3 className="text-lg font-serif font-black text-stone-900 uppercase">Fatias para Reserva</h3>
            <p className="text-xs text-stone-500 max-w-lg mx-auto leading-relaxed">
              Selecione as fatias de sua preferência para reserva. Todas as fatias participantes do festival saem por apenas <strong>R$ 12,00</strong> cada!
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
