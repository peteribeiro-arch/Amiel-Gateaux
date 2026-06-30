import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, Send, ClipboardCheck, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { isSupabaseConfigured, dbSubmitOrder } from '../lib/supabase';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveFromCart: (cartItemId: string) => void;
  onClearCart: () => void;
}

export function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
}: CartSidebarProps) {
  // Fixed seller phone number for Nepomuceno/MG
  const whatsappNumber = '5535988658397';
  const [customerName, setCustomerName] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
  const [address, setAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'dinheiro' | 'debito' | 'credito' | ''>('');

  // Read saved customer name on mount
  useEffect(() => {
    const savedCustomer = localStorage.getItem('bakery_customer_name');
    if (savedCustomer) {
      setCustomerName(savedCustomer);
    }
  }, []);

  const total = cartItems.reduce((acc, item) => {
    const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(total);

  // Generate beautiful message for WhatsApp
  const generateMessageText = () => {
    let msg = `Olá! Gostaria de fazer um pedido de tortas e bolos:\n\n`;
    msg += `👤 *Cliente:* ${customerName || 'Não informado'}\n`;
    msg += `📍 *Método:* ${deliveryType === 'delivery' ? 'Entrega em domicílio' : 'Retirada no balcão'}\n`;
    
    if (deliveryType === 'delivery' && address.trim()) {
      msg += `🏠 *Endereço:* ${address}\n`;
    }
    
    const paymentLabels: Record<string, string> = {
      pix: 'Pix 📱',
      dinheiro: 'Dinheiro 💵',
      debito: 'Cartão de Débito 💳',
      credito: 'Cartão de Crédito 💳',
    };
    const paymentLabel = paymentLabels[paymentMethod] || 'Não selecionado';
    msg += `💳 *Pagamento:* ${paymentLabel}\n`;
    
    msg += `\n🛒 *Itens do Pedido:*\n`;

    cartItems.forEach((item) => {
      const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
      const itemTotal = itemPrice * item.quantity;
      const formattedItemTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(itemTotal);
      
      let itemLine = `- *${item.quantity}x* ${item.product.name}`;
      if (item.selectedSize) {
        itemLine += ` (${item.selectedSize.name})`;
      }
      itemLine += ` _(${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemPrice)} un.)_ = *${formattedItemTotal}*`;
      
      if (item.customCakeConfig) {
        itemLine += `\n   • Massa: *${item.customCakeConfig.massa}*`;
        itemLine += `\n   • Recheios: *${item.customCakeConfig.recheios.join(' e ')}*`;
        itemLine += `\n   • Cobertura: *${item.customCakeConfig.cobertura}*`;
        if (item.customCakeConfig.adicionais.length > 0) {
          itemLine += `\n   • Adicionais: *${item.customCakeConfig.adicionais.join(', ')}*`;
        }
        if (item.customCakeConfig.cakeNameText) {
          itemLine += `\n   • Escrever no bolo: *"${item.customCakeConfig.cakeNameText}"*`;
        }
      } else if (item.observation && item.observation.trim()) {
        itemLine += `\n   ↳ _Obs: ${item.observation.trim()}_`;
      }
      msg += itemLine + `\n`;
    });

    msg += `\n💵 *Total Geral:* *${formattedTotal}*`;
    return msg;
  };

  const handleWhatsAppCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setError(null);
    if (!customerName.trim()) {
      setError('Por favor, informe o seu nome.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setError('Por favor, informe o endereço de entrega.');
      return;
    }
    if (!paymentMethod) {
      setError('Por favor, selecione a forma de pagamento.');
      return;
    }
    
    // Save customer details
    localStorage.setItem('bakery_customer_name', customerName);

    // Save order details to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await dbSubmitOrder({
          customerName: customerName,
          customerPhone: whatsappNumber,
          deliveryMethod: deliveryType,
          address: deliveryType === 'delivery' ? { info: address } : null,
          paymentMethod: paymentMethod,
          items: cartItems.map((item) => ({
            id: item.id,
            product_name: item.product.name,
            quantity: item.quantity,
            selected_size: item.selectedSize || null,
            observation: item.observation || '',
            custom_cake_config: item.customCakeConfig || null,
          })),
          total: total,
          observation: 'Pedido via WhatsApp',
        });
      } catch (err) {
        console.error('Erro ao registrar pedido no Supabase:', err);
      }
    }

    const text = encodeURIComponent(generateMessageText());
    // Format whatsapp api URL
    const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`;
    window.open(url, '_blank');
  };

  const handleCopyToClipboard = () => {
    if (cartItems.length === 0) return;

    setError(null);
    if (!customerName.trim()) {
      setError('Por favor, informe o seu nome.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setError('Por favor, informe o endereço de entrega.');
      return;
    }
    if (!paymentMethod) {
      setError('Por favor, selecione a forma de pagamento.');
      return;
    }

    navigator.clipboard.writeText(generateMessageText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bento-dark/40 backdrop-blur-xs"
          />

          {/* Slider */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="w-screen max-w-md bg-white border-l border-bento-border rounded-l-[32px] shadow-2xl flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-bento-border flex items-center justify-between bg-bento-bg/30">
                <div className="flex items-center gap-2">
                  <div className="relative p-2.5 rounded-xl bg-bento-amber-light text-bento-amber-dark">
                    <ShoppingBag className="w-5 h-5 text-bento-amber" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-bento-amber text-bento-amber-deep text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-bento-dark tracking-tight font-serif">Seu Carrinho</h3>
                    <p className="text-xs text-bento-dark/50 font-semibold">Faça sua encomenda via WhatsApp</p>
                  </div>
                </div>
                <button
                  id="close-cart-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-stone-100 transition-colors text-bento-dark/40 hover:text-bento-dark cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                    <div className="p-5 rounded-[24px] bg-bento-bg text-bento-dark/30">
                      <ShoppingBag className="w-12 h-12 stroke-1" />
                    </div>
                    <div>
                      <h4 className="font-bold text-bento-dark text-sm">Seu carrinho está vazio</h4>
                      <p className="text-xs text-bento-dark/50 mt-1 max-w-[200px] mx-auto font-medium">
                        Navegue pelo nosso catálogo e adicione suas fatias ou tortas inteiras preferidas!
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-bento-dark/40 uppercase tracking-widest">Itens Escolhidos</span>
                      <button
                        id="clear-cart-btn"
                        onClick={onClearCart}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
                      >
                        Limpar Tudo
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cartItems.map((item) => {
                        const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
                        const itemTotal = itemPrice * item.quantity;
                        const formattedItemTotal = new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(itemTotal);

                        return (
                          <motion.div
                            id={`cart-item-${item.id}`}
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col gap-2 bg-bento-bg/50 p-3.5 rounded-2xl border border-bento-border/60"
                          >
                            <div className="flex gap-3">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                referrerPolicy="no-referrer"
                                className="w-14 h-14 rounded-xl object-cover bg-stone-200 flex-shrink-0"
                              />
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-bento-dark truncate font-serif">{item.product.name}</h4>
                                {item.selectedSize && (
                                  <span className="inline-block bg-bento-amber/15 text-bento-amber-dark text-[9px] px-2 py-0.5 rounded font-extrabold mt-1">
                                    ⚙️ {item.selectedSize.name}
                                  </span>
                                )}
                                <p className="text-[10px] text-bento-dark/50 font-semibold mt-1">
                                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemPrice)} un.
                                </p>
                              </div>

                              <button
                                id={`remove-cart-${item.id}`}
                                onClick={() => onRemoveFromCart(item.id)}
                                className="text-bento-dark/30 hover:text-rose-500 p-1 self-start transition-colors cursor-pointer"
                                title="Remover item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Observation note */}
                            {item.observation && item.observation.trim() && (
                              <div className="px-3 py-1.5 bg-white/70 rounded-xl text-[10px] text-bento-dark/70 font-medium italic border border-bento-border/30">
                                📝 "{item.observation.trim()}"
                              </div>
                            )}

                            {/* Custom Cake Detailed Config */}
                            {item.customCakeConfig && (
                              <div className="mt-1 bg-amber-500/10 border border-amber-200/40 rounded-xl p-2.5 space-y-1 text-[10px] text-bento-amber-dark">
                                <div className="flex justify-between font-bold text-[9px] uppercase tracking-wider text-amber-800 border-b border-amber-200/40 pb-1">
                                  <span>⚙️ Especificações do Bolo</span>
                                  <span>🎈 Personalizado</span>
                                </div>
                                <p><span className="font-extrabold text-bento-dark/70">Massa:</span> {item.customCakeConfig.massa}</p>
                                <p><span className="font-extrabold text-bento-dark/70">Recheio:</span> {item.customCakeConfig.recheios.join(' e ')}</p>
                                <p><span className="font-extrabold text-bento-dark/70">Cobertura:</span> {item.customCakeConfig.cobertura}</p>
                                {item.customCakeConfig.adicionais.length > 0 && (
                                  <p><span className="font-extrabold text-bento-dark/70">Adicionais:</span> {item.customCakeConfig.adicionais.join(', ')}</p>
                                )}
                                {item.customCakeConfig.cakeNameText && (
                                  <div className="mt-1 bg-white/75 px-2 py-0.5 rounded border border-amber-200 inline-block font-bold">
                                    📝 Escrever: <span className="italic text-bento-dark">"{item.customCakeConfig.cakeNameText}"</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Quantity and subtotal footer inside card */}
                            <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-bento-border/40">
                              {/* Quantity controls */}
                              <div className="flex items-center border border-bento-border bg-white rounded-lg overflow-hidden">
                                <button
                                  id={`qty-minus-${item.id}`}
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="p-1 hover:bg-[#FAF7F2] text-bento-dark/60 transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-bold text-bento-dark min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  id={`qty-plus-${item.id}`}
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="p-1 hover:bg-[#FAF7F2] text-bento-dark/60 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-xs font-extrabold text-bento-dark font-mono">{formattedItemTotal}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Customer Details Form */}
                    <div className="pt-4 border-t border-bento-border/60 space-y-3.5">
                      <span className="text-xs font-bold text-bento-dark/40 uppercase tracking-widest block">Dados para Entrega</span>
                      
                      {/* Name input */}
                      <div>
                        <label className="block text-[10px] font-bold text-bento-dark/60 uppercase mb-1">
                          Seu Nome <span className="text-rose-500 font-extrabold">*</span>
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => {
                            setCustomerName(e.target.value);
                            setError(null);
                          }}
                          placeholder="Informe seu nome"
                          className="w-full px-3 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-xs text-bento-dark placeholder-bento-dark/40 bg-[#FAF7F2]/40"
                        />
                      </div>

                      {/* Delivery selector */}
                      <div>
                        <label className="block text-[10px] font-bold text-bento-dark/60 uppercase mb-1">Como prefere receber?</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setDeliveryType('pickup');
                              setError(null);
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                              deliveryType === 'pickup'
                                ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                                : 'bg-white text-bento-dark/60 border-bento-border hover:bg-stone-50'
                            }`}
                          >
                            Retirar na Loja
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeliveryType('delivery');
                              setError(null);
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                              deliveryType === 'delivery'
                                ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                                : 'bg-white text-bento-dark/60 border-bento-border hover:bg-stone-50'
                            }`}
                          >
                            Entrega (Delivery)
                          </button>
                        </div>
                      </div>

                      {/* Address conditional input */}
                      {deliveryType === 'delivery' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className="block text-[10px] font-bold text-bento-dark/60 uppercase mb-1">
                            Endereço de Entrega <span className="text-rose-500 font-extrabold">*</span>
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                              setError(null);
                            }}
                            placeholder="Rua, número, bairro e referência"
                            className="w-full px-3 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-xs text-bento-dark placeholder-bento-dark/40 bg-[#FAF7F2]/40"
                          />
                        </motion.div>
                      )}

                      {/* Forma de Pagamento */}
                      <div>
                        <label className="block text-[10px] font-bold text-bento-dark/60 uppercase mb-1">
                          Forma de Pagamento <span className="text-rose-500 font-extrabold">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'pix', label: '📱 Pix' },
                            { id: 'dinheiro', label: '💵 Dinheiro' },
                            { id: 'debito', label: '💳 Débito' },
                            { id: 'credito', label: '💳 Crédito' }
                          ].map((pm) => {
                            const isSelected = paymentMethod === pm.id;
                            return (
                              <button
                                key={pm.id}
                                type="button"
                                onClick={() => {
                                  setPaymentMethod(pm.id as any);
                                  setError(null);
                                }}
                                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                                    : 'bg-white text-bento-dark/60 border-bento-border hover:bg-stone-50'
                                }`}
                              >
                                {pm.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>


                    </div>
                  </>
                )}
              </div>

              {/* Footer Total & Send Actions */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-bento-border bg-[#FAF7F2]/40 space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-start gap-2 shadow-xs"
                    >
                      <span className="text-sm leading-none mt-0.5">⚠️</span>
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-bento-dark/60 font-serif">Total do Pedido</span>
                    <span className="text-2xl font-black text-bento-dark tracking-tight font-mono">{formattedTotal}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="btn-copy-checkout"
                      onClick={handleCopyToClipboard}
                      className="py-3 rounded-xl border border-bento-border bg-white hover:bg-stone-50 text-bento-dark/70 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ClipboardCheck className={`w-4 h-4 ${copied ? 'text-emerald-500' : 'text-bento-dark/40'}`} />
                      {copied ? 'Copiado!' : 'Copiar Texto'}
                    </button>

                    <button
                      id="btn-whatsapp-checkout"
                      onClick={handleWhatsAppCheckout}
                      className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/10 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Enviar WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
