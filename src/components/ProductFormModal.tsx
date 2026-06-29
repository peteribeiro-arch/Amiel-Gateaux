import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Image as ImageIcon, Plus, Check } from 'lucide-react';
import { Product, Category } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  editingProduct: Product | null;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
}: ProductFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('doces');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [sizes, setSizes] = useState<Array<{ id: string; name: string; price: string }>>([]);

  // When editingProduct changes, populate state
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setPrice(editingProduct.price.toString());
      setDescription(editingProduct.description || '');
      setImageUrl(editingProduct.imageUrl);
      setIngredients(editingProduct.ingredients || []);
      if (editingProduct.sizes && editingProduct.sizes.length > 0) {
        setSizes(editingProduct.sizes.map(s => ({ id: s.id, name: s.name, price: s.price.toString() })));
      } else {
        setSizes([]);
      }
    } else {
      // Clear fields for new product
      setName('');
      setCategory('doces');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setIngredients([]);
      setSizes([]);
    }
    setIngredientInput('');
  }, [editingProduct, isOpen]);

  const handleAddSizeRow = () => {
    if (sizes.length >= 3) return;
    setSizes([...sizes, { id: 'size-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4), name: '', price: '' }]);
  };

  const handleRemoveSizeRow = (index: number) => {
    setSizes(sizes.filter((_, idx) => idx !== index));
  };

  const handleUpdateSizeRow = (index: number, field: 'name' | 'price', value: string) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: value };
    setSizes(updated);
  };

  if (!isOpen) return null;

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setIngredientInput('');
    }
  };

  const handleKeyDownIngredient = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Por favor, informe o nome do produto.');
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return alert('Por favor, informe um valor de preço válido maior que zero.');
    }

    // Validate sizes if any rows were added
    for (let i = 0; i < sizes.length; i++) {
      const sz = sizes[i];
      if (!sz.name.trim()) {
        return alert(`Por favor, preencha o nome para o tamanho #${i + 1}.`);
      }
      if (!sz.price || isNaN(parseFloat(sz.price)) || parseFloat(sz.price) <= 0) {
        return alert(`Por favor, informe um preço válido maior que zero para o tamanho #${i + 1}.`);
      }
    }

    const cleanedSizes = sizes
      .filter(s => s.name.trim() !== '' && s.price.trim() !== '' && !isNaN(parseFloat(s.price)))
      .map(s => ({
        id: s.id || 'size-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        name: s.name.trim(),
        price: parseFloat(s.price)
      }));

    onSave({
      id: editingProduct?.id, // Will be passed if editing
      name: name.trim(),
      category,
      price: parseFloat(price),
      description: description.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      ingredients,
      sizes: cleanedSizes.length > 0 ? cleanedSizes : undefined,
    });
    onClose();
  };

  // Helper presets for beautiful quick images from unsplash if user doesn't have one
  const handleQuickImagePreset = (url: string) => {
    setImageUrl(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-bento-dark/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative bg-white rounded-[32px] shadow-2xl border border-bento-border max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-bento-border flex items-center justify-between bg-[#FAF7F2]/30">
            <div>
              <h2 className="text-xl font-bold text-bento-dark tracking-tight font-serif flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-bento-amber" />
                {editingProduct ? 'Editar Mercadoria' : 'Adicionar Mercadoria'}
              </h2>
              <p className="text-xs text-bento-dark/50 font-semibold mt-1">
                {editingProduct ? 'Modifique os detalhes, preço e ingredientes abaixo.' : 'Crie um novo produto delicioso para o seu catálogo.'}
              </p>
            </div>
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 transition-colors text-bento-dark/40 hover:text-bento-dark cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bento-dark/60 mb-1.5">
                Nome do Doce/Salgado <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Torta Holandesa Divina"
                className="w-full px-4 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-bento-dark placeholder-bento-dark/40 bg-[#FAF7F2]/40 transition-all text-sm font-medium"
              />
            </div>

            {/* Grid for Category and Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bento-dark/60 mb-1.5">
                  Categoria <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-bento-dark bg-[#FAF7F2]/40 transition-all text-sm font-semibold"
                >
                  <option value="doces">🍰 Torta Doce</option>
                  <option value="salgadas">🥧 Torta Salgada</option>
                  <option value="bolos">🎂 Bolo</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bento-dark/60 mb-1.5">
                  Preço (R$) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-bento-dark/40 font-semibold text-sm">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="99,90"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-bento-dark placeholder-bento-dark/40 bg-[#FAF7F2]/40 transition-all text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bento-dark/60 mb-1.5">
                Descrição de Apresentação
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Descreva o sabor, tamanho ou peso estimado da porção de forma apetitosa..."
                className="w-full px-4 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-bento-dark placeholder-bento-dark/40 bg-[#FAF7F2]/40 transition-all text-sm resize-none font-medium"
              />
            </div>

            {/* Sizing options (up to 3 sizes) */}
            <div className="pt-3 border-t border-bento-border/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bento-dark/60">
                    📐 Tamanhos do Produto (Até 3)
                  </label>
                  <p className="text-[10px] text-bento-dark/50 font-semibold">
                    Ofereça diferentes porções (ex: "Individual", "Médio 2kg"). O preço no catálogo mudará de acordo com a seleção.
                  </p>
                </div>
                {sizes.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddSizeRow}
                    className="text-xs font-bold text-bento-amber hover:text-bento-amber-dark hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar tamanho
                  </button>
                )}
              </div>

              {sizes.length > 0 ? (
                <div className="space-y-2.5">
                  {sizes.map((sz, index) => (
                    <div key={sz.id} className="flex gap-2.5 items-center bg-[#FAF7F2]/50 p-3 rounded-2xl border border-bento-border/70 animate-fadeIn">
                      <span className="text-xs font-extrabold text-bento-dark/40 font-mono w-5">#{index + 1}</span>
                      
                      {/* Size Name */}
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          value={sz.name}
                          onChange={(e) => handleUpdateSizeRow(index, 'name', e.target.value)}
                          placeholder="Ex: Fatia / Inteiro (12 fatias)"
                          className="w-full px-3 py-2 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-xs text-bento-dark placeholder-bento-dark/30 bg-white"
                        />
                      </div>

                      {/* Size Price */}
                      <div className="w-28 relative">
                        <span className="absolute left-3 top-2 text-bento-dark/40 font-bold text-xs">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={sz.price}
                          onChange={(e) => handleUpdateSizeRow(index, 'price', e.target.value)}
                          placeholder="0,00"
                          className="w-full pl-8 pr-2 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-xs text-bento-dark placeholder-bento-dark/30 bg-white font-mono"
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSizeRow(index)}
                        className="p-1.5 text-stone-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remover este tamanho"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-[#FAF7F2]/30 rounded-2xl border border-dashed border-bento-border/80 text-xs text-bento-dark/40 font-semibold italic">
                  Nenhum tamanho configurado. O produto usará apenas o preço fixo informado acima.
                </div>
              )}
            </div>

            {/* Ingredients Manager */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bento-dark/60 mb-1">
                Ingredientes Principais
              </label>
              <p className="text-[10px] text-bento-dark/50 font-medium mb-2">
                Digite um ingrediente e aperte a tecla <kbd className="px-1 py-0.5 bg-stone-100 rounded border">Enter</kbd> ou vírgula para cadastrar.
              </p>
              
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={handleKeyDownIngredient}
                  placeholder="Ex: Doce de Leite"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-bento-dark placeholder-bento-dark/40 bg-[#FAF7F2]/40 transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#FEF3C7] transition-colors border border-bento-border text-bento-dark flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Ingredients tag list */}
              <div className="flex flex-wrap gap-1.5 p-2 bg-[#FAF7F2]/50 rounded-2xl border border-bento-border/70 min-h-[44px]">
                {ingredients.length > 0 ? (
                  ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white text-bento-dark font-medium px-2.5 py-1 rounded-lg border border-bento-border flex items-center gap-1 shadow-xs animate-fadeIn"
                    >
                      {ing}
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="p-0.5 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-bento-dark/40 italic m-auto font-medium">Nenhum ingrediente adicionado ainda</span>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bento-dark/60 mb-1.5">
                Link da Imagem (URL)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-3 text-bento-dark/40">
                    <ImageIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-bento-dark placeholder-bento-dark/40 bg-[#FAF7F2]/40 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Preset images recommendation (instant clicks) */}
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase text-bento-dark/40">Sugestões de fotos lindas:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickImagePreset('https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80')}
                    className="text-[10px] bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    🍋 Torta de Limão
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickImagePreset('https://images.unsplash.com/photo-1464305795204-6f5bdf7aff7d?auto=format&fit=crop&w=600&q=80')}
                    className="text-[10px] bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    🍓 Torta de Morango
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickImagePreset('https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=600&q=80')}
                    className="text-[10px] bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    🥧 Torta Salgada (Quiche)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickImagePreset('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80')}
                    className="text-[10px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    🍫 Bolo de Chocolate
                  </button>
                </div>
              </div>

              {/* Instant Image Preview */}
              {imageUrl.trim() && (
                <div className="mt-4 border border-bento-border rounded-2xl overflow-hidden bg-[#FAF7F2]/60 p-2 flex items-center gap-3">
                  <img
                    src={imageUrl.trim()}
                    alt="Prévia"
                    className="w-16 h-12 object-cover rounded-lg bg-stone-200 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div>
                    <span className="text-[10px] font-bold text-bento-amber block">Prévia da imagem carregada</span>
                    <span className="text-xs text-bento-dark/60 truncate block max-w-[280px] font-semibold">{imageUrl}</span>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Footer actions */}
          <div className="p-6 border-t border-bento-border bg-[#FAF7F2]/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl hover:bg-stone-100 text-bento-dark/70 text-sm font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-bento-dark hover:bg-bento-amber text-white text-sm font-bold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 duration-150 cursor-pointer"
            >
              <Check className="w-4 h-4 text-bento-amber-bright" />
              {editingProduct ? 'Salvar Alterações' : 'Adicionar ao Catálogo'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
