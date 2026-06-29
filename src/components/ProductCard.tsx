import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit2, Plus, Check, Trash2, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  isAdminMode: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAddToCart: (product: Product, size?: ProductSize, observation?: string) => void;
  cartQuantity: number;
  onToggleVisibility?: (id: string) => void;
}

export function ProductCard({
  product,
  isAdminMode,
  onEdit,
  onDelete,
  onAddToCart,
  cartQuantity,
  onToggleVisibility,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [observation, setObservation] = useState('');
  const [addedJustNow, setAddedJustNow] = useState(false);

  // Sync selectedSize if product sizes change
  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize(undefined);
    }
  }, [product]);

  const currentPrice = selectedSize ? selectedSize.price : product.price;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(currentPrice);

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-[24px] sm:rounded-[32px] shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group relative ${
        product.hidden
          ? 'border-dashed border-rose-300 opacity-70 bg-rose-50/5'
          : 'border-bento-border hover:border-bento-amber'
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full bg-[#FAF7F2] overflow-hidden">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // Fallback for broken links
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
          }}
        />
        
        {/* Category badge */}
        <span className="absolute top-4 left-4 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md bg-white/90 text-bento-dark shadow-xs border border-bento-border/40">
          {product.category === 'doces' ? '🍰 Doce' : product.category === 'salgadas' ? '🥧 Salgada' : '🎂 Bolo'}
        </span>

        {/* Hidden badge for admin */}
        {product.hidden && (
          <span className="absolute top-4 left-24 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-rose-600 text-white shadow-xs border border-rose-700 flex items-center gap-1">
            <EyeOff className="w-3 h-3 stroke-[2.5px]" /> Oculto
          </span>
        )}

        {/* Admin Overlay Action buttons */}
        {isAdminMode && (
          <div className="absolute top-4 right-4 flex gap-1.5 z-10">
            <button
              id={`btn-toggle-visibility-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleVisibility) {
                  onToggleVisibility(product.id);
                }
              }}
              title={product.hidden ? "Mostrar no catálogo" : "Ocultar do catálogo"}
              className={`p-2 rounded-full transition-colors shadow-md hover:scale-105 active:scale-95 duration-150 cursor-pointer ${
                product.hidden ? 'bg-[#00b894] text-white hover:bg-[#00a884]' : 'bg-stone-600 text-white hover:bg-stone-700'
              }`}
            >
              {product.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              id={`btn-edit-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              title="Editar mercadoria"
              className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-md hover:scale-105 active:scale-95 duration-150 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              id={`btn-delete-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Tem certeza de que deseja excluir "${product.name}" do catálogo?`)) {
                  onDelete(product.id);
                }
              }}
              title="Excluir mercadoria"
              className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-md hover:scale-105 active:scale-95 duration-150 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-bento-dark tracking-tight font-serif group-hover:text-bento-amber transition-colors duration-200 leading-snug">
            {product.name}
          </h3>
          
          <p className="text-bento-dark/60 text-xs leading-relaxed line-clamp-2 font-medium">
            {product.description || 'Uma receita artesanal exclusiva preparada com muito amor e carinho.'}
          </p>

          {/* Ingredients bento pills */}
          <div className="pt-2">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-bento-dark/45 mb-1.5">
              Ingredientes principais:
            </h4>
            <div className="flex flex-wrap gap-1">
              {product.ingredients.length > 0 ? (
                product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-[#FAF7F2] text-bento-dark/80 px-2.5 py-0.5 rounded-lg border border-bento-border/70"
                  >
                    {ing}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-bento-dark/40 italic flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-bento-amber" /> Receita da casa secreta
                </span>
              )}
            </div>
          </div>

          {/* Sizing options (up to 3 sizes) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="pt-3 border-t border-bento-border/40 mt-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-bento-dark/45 mb-2 flex items-center gap-1">
                ⚖️ Escolha o tamanho:
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {product.sizes.slice(0, 3).map((size) => {
                  const isSelected = selectedSize?.id === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-extrabold text-center transition-all cursor-pointer border flex flex-col justify-center items-center min-h-[46px] truncate ${
                        isSelected
                          ? 'bg-[#FEF3C7] text-bento-amber-dark border-[#FDE68A] shadow-xs'
                          : 'bg-[#FAF7F2]/50 text-bento-dark/65 border-bento-border/50 hover:bg-stone-50'
                      }`}
                      title={`${size.name} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(size.price)}`}
                    >
                      <span className="truncate w-full block leading-tight px-1">{size.name}</span>
                      <span className="text-[9px] opacity-80 font-mono mt-0.5 font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(size.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Individual observation note */}
          <div className="pt-3 border-t border-bento-border/40 mt-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-bento-dark/45 mb-1.5 flex items-center gap-1">
              📝 Observações específicas:
            </h4>
            <input
              type="text"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: sem merengue, com canela..."
              className="w-full px-3 py-2 rounded-xl border border-bento-border/70 focus:outline-none focus:ring-2 focus:ring-bento-amber/15 focus:border-bento-amber text-[11px] text-bento-dark placeholder-bento-dark/30 bg-[#FAF7F2]/30"
            />
          </div>
        </div>

        {/* Card Footer: Price & Purchase */}
        <div className="mt-6 pt-4 border-t border-bento-border/60 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-bento-dark/40 font-bold uppercase tracking-wider">Valor total</span>
              {cartQuantity > 0 && (
                <span className="text-[9px] bg-bento-amber text-bento-amber-deep font-extrabold px-1.5 py-0.2 rounded animate-pulse">
                  {cartQuantity} no carrinho
                </span>
              )}
            </div>
            <span className="text-lg sm:text-xl font-extrabold text-bento-dark tracking-tight font-mono">{formattedPrice}</span>
          </div>

          <button
            id={`btn-cart-${product.id}`}
            onClick={() => {
              onAddToCart(product, selectedSize, observation);
              setObservation('');
              setAddedJustNow(true);
              setTimeout(() => setAddedJustNow(false), 1500);
            }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer relative overflow-hidden ${
              addedJustNow
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                : 'bg-bento-dark text-white hover:bg-bento-amber hover:shadow-sm'
            }`}
          >
            {addedJustNow ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                Adicionado!
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
