import { ShoppingBag, Search, Sparkles, Sliders, Check, User } from 'lucide-react';
import { Category } from '../types';
import Logo from './Logo';

interface NavbarProps {
  activeCategory: Category | 'all';
  setActiveCategory: (cat: Category | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenCustomerArea: () => void;
  onOpenManagerDashboard: () => void;
  hiddenCategories?: Category[];
}

const CATEGORIES_LIST: { id: Category; label: string; icon: string; activeStyle: string; inactiveStyle: string }[] = [
  {
    id: 'festival',
    label: 'Festival de Fatias (04/07)',
    icon: '⭐',
    activeStyle: 'bg-[#B45309] text-white shadow-md border border-[#B45309]',
    inactiveStyle: 'bg-amber-50 text-[#B45309] border border-amber-200 hover:bg-amber-100 font-black animate-pulse'
  },
  {
    id: 'doces',
    label: 'Tortas Doces',
    icon: '🍰',
    activeStyle: 'bg-bento-amber text-white',
    inactiveStyle: 'bg-white text-bento-dark/70 hover:bg-stone-50 border border-bento-border'
  },
  {
    id: 'salgadas',
    label: 'Tortas Salgadas',
    icon: '🥧',
    activeStyle: 'bg-bento-amber text-white',
    inactiveStyle: 'bg-white text-bento-dark/70 hover:bg-stone-50 border border-bento-border'
  },
  {
    id: 'salgados',
    label: 'Salgados',
    icon: '🥪',
    activeStyle: 'bg-bento-amber text-white',
    inactiveStyle: 'bg-white text-bento-dark/70 hover:bg-stone-50 border border-bento-border'
  },
  {
    id: 'bolos',
    label: 'Bolos Especiais',
    icon: '🎂',
    activeStyle: 'bg-bento-amber text-white',
    inactiveStyle: 'bg-white text-bento-dark/70 hover:bg-stone-50 border border-bento-border'
  },
  {
    id: 'aniversario',
    label: 'Bolos de Aniversário',
    icon: '🎈',
    activeStyle: 'bg-bento-amber text-white',
    inactiveStyle: 'bg-white text-bento-dark/70 hover:bg-stone-50 border border-bento-border'
  },
  {
    id: 'potes',
    label: 'Delícias no Pote',
    icon: '🫙',
    activeStyle: 'bg-bento-amber text-white',
    inactiveStyle: 'bg-white text-bento-dark/70 hover:bg-stone-50 border border-bento-border'
  }
];

export function Navbar({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  isAdminMode,
  setIsAdminMode,
  cartCount,
  onOpenCart,
  onOpenCustomerArea,
  onOpenManagerDashboard,
  hiddenCategories = [],
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-bento-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar (Logo & Actions) */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand/Logo */}
          <div className="flex items-center gap-2.5">
            <Logo size={46} />
            <div>
              <h1 className="text-base sm:text-xl font-black text-bento-dark tracking-tight font-serif">
                Amiel <span className="text-bento-amber font-sans font-light">Gâteaux</span>
              </h1>
              <p className="text-[10px] text-bento-dark/60 font-bold uppercase tracking-widest hidden sm:block">
                Confeitaria & Padaria Artesanal
              </p>
            </div>
          </div>

          {/* Search bar - hidden in very small screens, responsive */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-8 relative">
            <span className="absolute left-3.5 text-bento-dark/40">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tortas ou bolos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bento-bg/60 border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/20 focus:border-bento-amber text-xs text-bento-dark placeholder-bento-dark/40 transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Toggle Admin mode button */}
            <button
              id="toggle-admin-btn"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAdminMode
                  ? 'bg-bento-amber text-white shadow-sm hover:bg-bento-amber-dark'
                  : 'bg-white text-bento-dark hover:bg-stone-50 border border-bento-border'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAdminMode ? 'Modo: Gerente' : 'Modo: Visualizar'}
              </span>
              <span className="inline sm:hidden">
                {isAdminMode ? 'Gerente' : 'Visitar'}
              </span>
            </button>

            {/* Manager Orders Dashboard Button (Visible only to authenticated manager) */}
            {isAdminMode && (
              <button
                id="open-manager-dashboard-btn"
                onClick={onOpenManagerDashboard}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-stone-900 text-bento-amber hover:bg-stone-800 border border-stone-800 shadow-sm"
                title="Visualizar encomendas recebidas"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-bento-amber-bright animate-pulse" />
                <span>Painel de Pedidos</span>
              </button>
            )}

            {/* Meus Pedidos Customer Area Button */}
            <button
              id="open-customer-area-btn"
              onClick={onOpenCustomerArea}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white text-bento-dark hover:bg-stone-50 border border-bento-border"
              title="Acompanhar meus pedidos"
            >
              <User className="w-3.5 h-3.5 text-bento-amber" />
              <span className="hidden sm:inline">Meus Pedidos</span>
              <span className="inline sm:hidden">Pedidos</span>
            </button>

            {/* Cart Button */}
            <button
              id="open-cart-btn-header"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-bento-dark text-white hover:bg-bento-amber transition-all duration-200 active:scale-95 flex items-center justify-center shadow-sm cursor-pointer"
              title="Ver meu carrinho"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-bento-amber text-bento-amber-deep text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar for smaller screens */}
        <div className="md:hidden pb-4 pt-1 relative">
          <span className="absolute left-3.5 top-3.5 text-bento-dark/40">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar sabor, torta ou ingrediente..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bento-bg/60 border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/20 focus:border-bento-amber text-xs text-bento-dark placeholder-bento-dark/40 transition-all"
          />
        </div>

        {/* Category Navigation Bar */}
        <div className="flex items-center overflow-x-auto py-3 gap-1.5 scrollbar-none border-t border-bento-border">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-bento-dark text-white'
                : 'bg-white text-bento-dark/70 hover:bg-stone-50 border border-bento-border'
            }`}
          >
            📋 Todos os Sabores
          </button>

          {CATEGORIES_LIST.map((cat) => {
            const isHidden = hiddenCategories.includes(cat.id);
            if (isHidden && !isAdminMode) {
              return null;
            }

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id ? cat.activeStyle : cat.inactiveStyle
                } ${isHidden ? 'opacity-50 border-dashed border-rose-300' : ''}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {isHidden && (
                  <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-0.5 ml-1">
                    Oculto
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
