import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Calendar, Clock, HelpCircle, Heart, Plus } from 'lucide-react';
import { Product, CustomCakeConfig, Category } from '../types';

const festivalBannerImg = '/assets/images/festival_banner_1782950436829.jpg';

interface FestivalDeFatiasProps {
  onAddToCart: (product: Product, selectedSize?: any, observation?: string, config?: CustomCakeConfig) => void;
  isAdminMode?: boolean;
}

// 3º Festival de Fatias - Fatias Especiais (R$ 10,00)
const FATIAS_ESPECIAIS = [
  {
    id: 'churros',
    name: 'Fatia Especial - Churros',
    description: 'Massa fofinha com recheio cremoso de doce de leite e um toque de canela. Pura tentação!',
    imageUrl: '/assets/images/apple_cream_tart_1782866932900.jpg',
    price: 10.00
  },
  {
    id: 'pacoca',
    name: 'Fatia Especial - Paçoca',
    description: 'O sabor marcante da paçoca com recheio irresistível que derrete na boca! Simplesmente apaixonante!',
    imageUrl: '/assets/images/banoffee_pie_1782777894833.jpg',
    price: 10.00
  },
  {
    id: 'nozes',
    name: 'Fatia Especial - Nozes',
    description: 'Camadas de sabor com recheio cremoso e nozes crocantes que deixam tudo ainda mais especial!',
    imageUrl: '/assets/images/carrot_volcano_cake_1782777939819.jpg',
    price: 10.00
  },
  {
    id: 'prestigio',
    name: 'Fatia Especial - Prestígio',
    description: 'Muito chocolate e o melhor coco em uma combinação clássica que todo mundo ama!',
    imageUrl: '/assets/images/choc_caramel_tart_1782866858185.jpg',
    price: 10.00
  }
];

// 3º Festival de Fatias - Fatias Premium (R$ 15,00)
const FATIAS_PREMIUM = [
  {
    id: 'matilda',
    name: 'Fatia Premium - Matilda',
    description: 'Camadas intensas de chocolate que são puro exagero no sabor! Para chocólatras de plantão!',
    imageUrl: '/assets/images/chocolate_truffle_cake_1782777950230.jpg',
    price: 15.00
  },
  {
    id: 'pudim',
    name: 'Fatia Premium - Pudim',
    description: 'O tradicional pudim em forma de fatia! Cremoso, aveludado e com calda perfeita. Irresistível!',
    imageUrl: '/assets/images/dutch_pie_torta_holandesa_1782867172497.jpg',
    price: 15.00
  },
  {
    id: 'bombom-morango',
    name: 'Fatia Premium - Bombom de Morango',
    description: 'Recheio cremoso com morangos suculentos e cobertura deliciosa de chocolate. É um bombom mesmo!',
    imageUrl: '/assets/images/strawberry_tart_1782777704003.jpg',
    price: 15.00
  },
  {
    id: 'bombom-uva',
    name: 'Fatia Premium - Bombom de Uva',
    description: 'Uvas doces envolvidas in brigadeiro branco e chocolate. Refrescante, leve e maravilhoso!',
    imageUrl: '/assets/images/cheesecake_red_fruits_1782867099114.jpg',
    price: 15.00
  },
  {
    id: 'carmen-miranda',
    name: 'Fatia Premium - Carmen Miranda',
    description: 'A explosão tropical de sabores! Abacaxi, creme e muito sabor em cada camada. Refrescante e única!',
    imageUrl: '/assets/images/lemon_meringue_tart_1782777880427.jpg',
    price: 15.00
  },
  {
    id: 'ninho-trufado',
    name: 'Fatia Premium - Ninho Trufado',
    description: 'Massa fofinha com recheio cremoso de Ninho e finalização trufada que derrete na boca!',
    imageUrl: '/assets/images/red_velvet_cake_1782777930122.jpg',
    price: 15.00
  },
  {
    id: 'kinder-bueno',
    name: 'Fatia Premium - Kinder Bueno',
    description: 'Para os fãs de chocolate: creme aveludado com pedacinhos de Kinder Bueno! Um luxo só!',
    imageUrl: '/assets/images/birthday_cake_1782778653144.jpg',
    price: 15.00
  }
];

export function FestivalDeFatias({ onAddToCart, isAdminMode = false }: FestivalDeFatiasProps) {
  // Navigation inside the festival
  const [activeTab, setActiveTab] = useState<'individual' | 'info'>('individual');

  // Individual Slice Order state
  const [successSliceId, setSuccessSliceId] = useState<string | null>(null);

  // Action: Add Individual Slice to Cart
  const handleAddIndividualSlice = (slice: { id: string; name: string; description: string; imageUrl: string; price: number }, category: Category) => {
    const product: Product = {
      id: `fest-slice-${slice.id}`,
      name: slice.name,
      category: category,
      price: slice.price,
      imageUrl: slice.imageUrl,
      ingredients: [],
      description: `Fatia participante do 3º Festival de Fatias de 04/07. ${slice.description}`,
    };

    onAddToCart(
      product,
      { id: `slice-${slice.id}-ind`, name: 'Fatia Individual', price: slice.price },
      '3º Festival de Fatias - Retirada/Entrega 04/07 a partir das 11h'
    );
    
    setSuccessSliceId(slice.id);
    setTimeout(() => setSuccessSliceId(null), 1500);
  };

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* 3º Festival de Fatias Custom flyer-like Header Banner */}
      <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-[#4D281C] via-[#2F150D] to-[#1E0904] text-white shadow-md border border-bento-border/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column - Information */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left relative z-10">
            {/* Top Info Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500/20 rounded-full border border-rose-400/30 text-[10px] sm:text-xs font-bold text-rose-300">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
                3º Festival de Fatias Amiel
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/30 text-[10px] sm:text-xs font-bold text-amber-300">
                Feitas com Amor!
              </div>
            </div>
            
            {/* Main Title Styled beautifully like the flyer */}
            <div className="space-y-2">
              <h2 className="text-3.5xl sm:text-5xl font-serif font-black tracking-tight leading-tight text-white">
                Festival de <span className="text-[#EAA6B5] italic font-normal">Fatias</span>
              </h2>
              <p className="text-xs sm:text-sm text-rose-100/85 font-serif tracking-wide italic font-medium">
                "Mais sabor, mais momentos, mais felicidade!"
              </p>
            </div>
            
            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              No dia <strong>04 de Julho (Sábado)</strong>, preparamos uma seleção exclusiva com as nossas fatias mais amadas. Reserve suas fatias com antecedência e garanta doçura em dobro para o seu dia!
            </p>

            {/* Date & Time layout */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-[11px] sm:text-xs font-bold">
              <span className="flex items-center gap-1.5 bg-[#5D3225] px-4 py-2 rounded-full border border-rose-400/20 text-rose-200">
                <Calendar className="w-3.5 h-3.5 text-rose-300" /> Sábado, 04 de Julho
              </span>
              <span className="flex items-center gap-1.5 bg-[#5D3225] px-4 py-2 rounded-full border border-rose-400/20 text-rose-200">
                <Clock className="w-3.5 h-3.5 text-rose-300" /> A partir das 11:00h
              </span>
            </div>
          </div>

          {/* Right Column - Highlighted Photo */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img 
              src={festivalBannerImg} 
              alt="Festival de Fatias Amiel Banner" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Gradient shadow overlay for blending seamlessly */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#2F150D] via-transparent to-transparent lg:w-1/3"></div>
          </div>
        </div>
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#C95B72] rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      </div>

      {/* Navigation Sub-menu Tabs */}
      <div className="flex items-center justify-center border-b border-bento-border pb-1 max-w-sm mx-auto gap-1">
        {[
          { id: 'individual', label: '🍰 Fatias para Reserva' },
          { id: 'info', label: 'ℹ️ Sobre o Festival' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-t-2xl transition-all border-b-2 cursor-pointer text-center ${
              activeTab === tab.id
                ? 'border-[#C95B72] text-[#C95B72] bg-[#FDF6F7]'
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
          {/* How to reserve */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-bento-border shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-xl border border-rose-100">
              💖
            </div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-bento-dark leading-tight">Como reservar as fatias?</h3>
            <p className="text-xs text-bento-dark/80 leading-relaxed font-semibold">
              O festival acontece no dia <strong>04 de Julho (sábado)</strong>. Devido à produção artesanal limitada e à alta procura, faça sua reserva antecipada!
            </p>
            <p className="text-xs text-bento-dark/60 leading-relaxed">
              Basta selecionar os seus sabores favoritos de Fatias Especiais (R$ 10,00) e Fatias Premium (R$ 15,00), adicioná-las ao carrinho e finalizar o envio do seu pedido pelo WhatsApp.
            </p>
          </div>

          {/* Delivery & Pickup */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-bento-border shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF6F7] flex items-center justify-center text-xl border border-rose-100">
              🛵
            </div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-bento-dark leading-tight">Retiradas e Entregas</h3>
            <p className="text-xs text-bento-dark/80 leading-relaxed font-semibold">
              Você pode retirar suas fatias fresquinhas no balcão da loja ou optar pelo nosso delivery seguro diretamente para o seu endereço.
            </p>
            <p className="text-xs text-bento-dark/60 leading-relaxed">
              Ambos os serviços de entrega e retirada terão início no dia <strong>04/07 (Sábado) pontualmente a partir das 11:00h</strong>.
            </p>
            <button
              onClick={() => setActiveTab('individual')}
              className="mt-2 w-full py-2.5 bg-[#C95B72] hover:bg-[#B2485E] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-200"
            >
              Ver Sabores de Fatias
            </button>
          </div>

          {/* Location & Guidelines */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-bento-border shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-xl border border-rose-100">
              📍
            </div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-bento-dark leading-tight">Local e Horários</h3>
            <p className="text-xs text-bento-dark/80 leading-relaxed font-semibold">
              Estamos localizados no coração da cidade com atendimento dedicado a deixar o seu sábado muito mais especial.
            </p>
            <div className="text-xs text-bento-dark/60 space-y-2.5">
              <p>📍 <strong>Local:</strong> Amiel Gâteaux - Confeitaria Artesanal</p>
              <p>🕙 <strong>Início:</strong> Sábado (04/07) a partir das 11h</p>
              <p className="text-rose-700 font-bold bg-rose-50/80 p-3 rounded-xl border border-rose-100">
                ⚠️ Nota: Reservas antecipadas pelo site garantem a disponibilidade de seus sabores preferidos no dia.
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
          className="space-y-12 sm:space-y-16 max-w-5xl mx-auto"
        >
          {/* Header Description */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-bento-dark tracking-tight">Nosso Cardápio do Festival</h3>
            <p className="text-xs sm:text-sm text-bento-dark/60 max-w-lg mx-auto leading-relaxed font-semibold">
              Escolha entre as <strong>Fatias Especiais (R$ 10,00)</strong> ou as prestigiadas <strong>Fatias Premium (R$ 15,00)</strong> para fazer sua reserva.
            </p>
          </div>

          {/* CATEGORY 1: FATIAS ESPECIAIS (R$ 10,00) */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-bento-border pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-bento-dark tracking-tight">
                  🧁 Fatias Especiais
                </h4>
              </div>
              <span className="inline-flex bg-rose-50 border border-rose-200 text-[#C95B72] font-black font-mono text-xs sm:text-sm px-3.5 py-1.5 rounded-full">
                R$ 10,00 / cada
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FATIAS_ESPECIAIS.map((slice) => {
                const isSuccess = successSliceId === slice.id;
                return (
                  <div key={slice.id} className="bg-white border border-bento-border rounded-3xl p-6 shadow-xs hover:border-[#EAA6B5]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative min-h-[220px]">
                    <div className="space-y-3 flex-grow flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="bg-rose-50 text-[#C95B72] border border-rose-100 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
                            Especial
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base sm:text-lg text-bento-dark group-hover:text-[#C95B72] transition-colors duration-200 leading-snug">
                          {slice.name.replace('Fatia Especial - ', '')}
                        </h4>
                        <p className="text-xs text-bento-dark/60 leading-relaxed font-semibold">
                          {slice.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-bento-border/50 mt-4">
                        <span className="text-lg font-extrabold font-mono text-bento-dark">R$ 10,00</span>
                        <button
                          type="button"
                          onClick={() => handleAddIndividualSlice(slice, 'festival')}
                          className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 cursor-pointer active:scale-95 ${
                            isSuccess
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-bento-dark text-white hover:bg-[#C95B72] hover:shadow-sm'
                          }`}
                        >
                          {isSuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3px]" />
                              Reservado
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              Reservar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CATEGORY 2: FATIAS PREMIUM (R$ 15,00) */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-bento-border pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C95B72]"></span>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-bento-dark tracking-tight">
                  👑 Fatias Premium
                </h4>
              </div>
              <span className="inline-flex bg-[#FDF6F7] border border-[#EAA6B5]/30 text-[#C95B72] font-black font-mono text-xs sm:text-sm px-3.5 py-1.5 rounded-full">
                R$ 15,00 / cada
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FATIAS_PREMIUM.map((slice) => {
                const isSuccess = successSliceId === slice.id;
                return (
                  <div key={slice.id} className="bg-white border border-bento-border rounded-3xl p-6 shadow-xs hover:border-[#EAA6B5]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative min-h-[220px]">
                    <div className="space-y-3 flex-grow flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="bg-[#FAF7F2] text-[#4D281C] border border-[#EAA6B5]/20 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
                            Premium
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base sm:text-lg text-bento-dark group-hover:text-[#C95B72] transition-colors duration-200 leading-snug">
                          {slice.name.replace('Fatia Premium - ', '')}
                        </h4>
                        <p className="text-xs text-bento-dark/60 leading-relaxed font-semibold">
                          {slice.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-bento-border/50 mt-4">
                        <span className="text-lg font-extrabold font-mono text-bento-dark">R$ 15,00</span>
                        <button
                          type="button"
                          onClick={() => handleAddIndividualSlice(slice, 'festival')}
                          className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 cursor-pointer active:scale-95 ${
                            isSuccess
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-bento-dark text-white hover:bg-[#C95B72] hover:shadow-sm'
                          }`}
                        >
                          {isSuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3px]" />
                              Reservado
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              Reservar
                            </>
                          )}
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

      {/* Helper FAQ Footer */}
      <div className="max-w-xl mx-auto p-5 sm:p-6 bg-[#FDF6F7] rounded-[24px] sm:rounded-[32px] border border-[#EAA6B5]/30 text-center flex items-center justify-center gap-3">
        <HelpCircle className="w-5 h-5 text-[#C95B72] shrink-0" />
        <span className="text-xs text-[#4D281C] font-semibold leading-relaxed">
          Ficou com alguma dúvida sobre o festival? Entre em contato via WhatsApp para receber atendimento personalizado!
        </span>
      </div>
    </div>
  );
}
