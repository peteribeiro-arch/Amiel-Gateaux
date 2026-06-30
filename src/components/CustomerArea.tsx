import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Phone, ClipboardCheck, Sparkles, RefreshCw, ShoppingBag, MapPin, CreditCard, Clock, Calendar } from 'lucide-react';
import { Order } from '../types';
import { dbFetchOrdersByPhone, isSupabaseConfigured } from '../lib/supabase';

interface CustomerAreaProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerArea({ isOpen, onClose }: CustomerAreaProps) {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'phone' | 'number'>('phone');
  const [singleOrderNum, setSingleOrderNum] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // Load saved phone number on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem('bakery_customer_phone');
    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);

  // Helper to extract order number from observation string
  const parseOrderNumberAndObs = (obs: string, localOrderNum?: string) => {
    if (localOrderNum) {
      return { number: localOrderNum, text: obs || '' };
    }
    const match = obs?.match(/\[#(\d+)\]/);
    if (match) {
      return {
        number: match[1],
        text: obs.replace(match[0], '').trim()
      };
    }
    return {
      number: 'S/N',
      text: obs || ''
    };
  };

  const sanitizePhone = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const formatPhoneDisplay = (value: string) => {
    const numbers = sanitizePhone(value);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneDisplay(e.target.value);
    setPhone(formatted);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const sanitizedPhone = sanitizePhone(phone);
    if (searchMethod === 'phone' && sanitizedPhone.length < 10) {
      setMessage('Por favor, informe um número de telefone válido com DDD.');
      return;
    }

    if (searchMethod === 'number' && !singleOrderNum.trim()) {
      setMessage('Por favor, informe o número do pedido.');
      return;
    }

    setIsLoading(true);
    setSearched(true);

    try {
      // 1. Fetch from Supabase if configured
      let dbOrders: any[] = [];
      if (isSupabaseConfigured) {
        const fetched = await dbFetchOrdersByPhone(sanitizedPhone);
        if (fetched) {
          dbOrders = fetched;
        }
      }

      // 2. Fetch from LocalStorage
      const localOrdersRaw = localStorage.getItem('bella_massa_orders');
      let localOrders: any[] = [];
      if (localOrdersRaw) {
        try {
          const parsed = JSON.parse(localOrdersRaw);
          localOrders = parsed.filter((o: any) => {
            const op = sanitizePhone(o.customerPhone || o.customer_phone || '');
            return op === sanitizedPhone;
          });
        } catch (e) {
          console.error('Error parsing local orders', e);
        }
      }

      // 3. Merge and deduplicate orders based on UUID/local ID or order number
      const mergedMap = new Map<string, any>();

      // Add db orders first
      dbOrders.forEach((o) => {
        const idKey = o.id || o.orderNumber || '';
        mergedMap.set(idKey, {
          id: o.id,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          deliveryMethod: o.delivery_method,
          address: o.address,
          paymentMethod: o.payment_method,
          items: o.items || [],
          total: Number(o.total),
          observation: o.observation,
          status: o.status || 'pending',
          createdAt: o.created_at,
          source: 'database'
        });
      });

      // Add local orders (overwrite duplicates to prioritize local or keep both if ids differ)
      localOrders.forEach((o) => {
        const idKey = o.id || o.orderNumber || '';
        // If already in map, we can update or keep db one. Database status is usually more up-to-date.
        if (!mergedMap.has(idKey)) {
          mergedMap.set(idKey, {
            id: o.id,
            customerName: o.customerName || o.customer_name,
            customerPhone: o.customerPhone || o.customer_phone,
            deliveryMethod: o.deliveryMethod || o.delivery_method,
            address: o.address,
            paymentMethod: o.paymentMethod || o.payment_method,
            items: o.items || [],
            total: Number(o.total),
            observation: o.observation,
            status: o.status || 'pending',
            createdAt: o.createdAt || o.created_at,
            orderNumber: o.orderNumber,
            source: 'local'
          });
        }
      });

      let allMerged = Array.from(mergedMap.values());

      // Filter by single order number if that method is selected
      if (searchMethod === 'number') {
        const targetNum = singleOrderNum.trim();
        allMerged = allMerged.filter((o) => {
          const parsed = parseOrderNumberAndObs(o.observation, o.orderNumber);
          return parsed.number === targetNum;
        });
      }

      // Sort by date descending
      allMerged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setOrders(allMerged);
      
      // Save phone number to remember for next time
      if (searchMethod === 'phone' && sanitizedPhone) {
        localStorage.setItem('bakery_customer_phone', phone);
      }
    } catch (err) {
      console.error(err);
      setMessage('Ocorreu um erro ao buscar os pedidos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; style: string }> = {
      pending: { label: 'Pendente ⏳', style: 'bg-amber-50 border-amber-200 text-amber-700' },
      preparing: { label: 'Preparando 🍰', style: 'bg-blue-50 border-blue-200 text-blue-700' },
      delivered: { label: 'Entregue ✅', style: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
      cancelled: { label: 'Cancelado ❌', style: 'bg-rose-50 border-rose-200 text-rose-700' },
    };
    const current = statuses[status] || { label: 'Pendente', style: 'bg-amber-50 border-amber-200 text-amber-700' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border shadow-xs ${current.style}`}>
        {current.label}
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1C1917]/40 backdrop-blur-xs"
          />

          {/* Sliding drawer */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="w-screen max-w-lg bg-white border-l border-bento-border rounded-l-[32px] shadow-2xl flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-bento-border flex items-center justify-between bg-bento-bg/30">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-bento-amber/15 text-bento-amber-dark">
                    <Sparkles className="w-5 h-5 text-bento-amber" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1C1917] tracking-tight font-serif">Área do Cliente</h3>
                    <p className="text-xs text-[#1C1917]/50 font-semibold">Acompanhe seus pedidos em tempo real</p>
                  </div>
                </div>
                <button
                  id="close-customer-area-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-stone-100 transition-colors text-[#1C1917]/40 hover:text-[#1C1917] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Search Panel */}
              <div className="p-6 border-b border-bento-border bg-bento-bg/10 space-y-4">
                <div className="flex bg-white p-1 rounded-xl border border-bento-border shadow-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchMethod('phone');
                      setSearched(false);
                      setOrders([]);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      searchMethod === 'phone'
                        ? 'bg-bento-amber text-bento-amber-deep shadow-xs'
                        : 'text-[#1C1917]/60 hover:bg-stone-50'
                    }`}
                  >
                    📞 Buscar por Telefone
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchMethod('number');
                      setSearched(false);
                      setOrders([]);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      searchMethod === 'number'
                        ? 'bg-bento-amber text-bento-amber-deep shadow-xs'
                        : 'text-[#1C1917]/60 hover:bg-stone-50'
                    }`}
                  >
                    🔢 Buscar por Número
                  </button>
                </div>

                <form onSubmit={handleSearch} className="space-y-3">
                  {searchMethod === 'phone' ? (
                    <div>
                      <label className="block text-[10px] font-bold text-[#1C1917]/50 uppercase tracking-widest mb-1.5">
                        Número de Telefone (WhatsApp)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#1C1917]/30" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="Ex: (35) 99995-8397"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-xs text-[#1C1917] placeholder-[#1C1917]/30 bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-[#1C1917]/50 uppercase tracking-widest mb-1.5">
                        Número do Pedido (4 dígitos)
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#1C1917]/30" />
                        <input
                          type="text"
                          maxLength={6}
                          value={singleOrderNum}
                          onChange={(e) => setSingleOrderNum(e.target.value.replace(/\D/g, ''))}
                          placeholder="Ex: 5432"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-bento-border focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber text-xs text-[#1C1917] placeholder-[#1C1917]/30 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {message && (
                    <p className="text-[11px] font-semibold text-rose-500 bg-rose-50 border border-rose-100 p-2 rounded-lg">
                      ⚠️ {message}
                    </p>
                  )}

                  <button
                    id="btn-customer-search"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#1C1917] hover:bg-[#1C1917]/90 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-bento-amber" />
                        Buscando informações...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 text-bento-amber" />
                        Acessar meus Pedidos
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Order Results List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {!searched ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                    <div className="p-5 rounded-3xl bg-bento-bg text-[#1C1917]/20">
                      <ShoppingBag className="w-12 h-12 stroke-1 text-bento-amber" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1C1917] text-sm font-serif">Sua jornada de doces</h4>
                      <p className="text-xs text-[#1C1917]/50 mt-1.5 max-w-[240px] mx-auto font-medium leading-relaxed">
                        Insira os seus dados de contato acima para sincronizar e acompanhar suas fatias, bolos ou encomendas.
                      </p>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <span className="text-4xl block">🔍</span>
                    <h4 className="font-bold text-[#1C1917] text-sm">Nenhum pedido encontrado</h4>
                    <p className="text-xs text-[#1C1917]/50 max-w-[240px] mx-auto font-medium">
                      Não localizamos nenhuma encomenda registrada para as informações fornecidas. Certifique-se de que os números digitados estão corretos.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-bento-border pb-2">
                      <span className="text-[10px] font-black text-[#1C1917]/40 uppercase tracking-wider">
                        Pedidos Encontrados ({orders.length})
                      </span>
                      <span className="text-[9px] font-bold bg-[#FAF7F2] text-[#1C1917]/60 px-2 py-0.5 rounded border">
                        Sincronizado
                      </span>
                    </div>

                    <div className="space-y-4">
                      {orders.map((order) => {
                        const parsed = parseOrderNumberAndObs(order.observation, order.orderNumber);
                        const dateFormatted = new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });

                        return (
                          <div
                            key={order.id}
                            className="bg-white border border-bento-border rounded-2xl p-4.5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                          >
                            {/* Card Top Header */}
                            <div className="flex items-start justify-between gap-2 border-b border-bento-border/50 pb-3">
                              <div className="space-y-1">
                                <h4 className="text-sm font-black text-[#1C1917] font-serif flex items-center gap-1.5">
                                  <span className="text-bento-amber text-xs font-sans">#</span>
                                  <span>Pedido {parsed.number}</span>
                                </h4>
                                <div className="flex items-center gap-1 text-[10px] text-[#1C1917]/50 font-bold">
                                  <Calendar className="w-3.5 h-3.5 text-bento-amber" />
                                  <span>{dateFormatted}</span>
                                </div>
                              </div>
                              {getStatusBadge(order.status)}
                            </div>

                            {/* Items List */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-black text-[#1C1917]/40 uppercase tracking-widest block">Itens da Encomenda</span>
                              <div className="divide-y divide-bento-border/40 bg-[#FAF7F2]/50 rounded-xl border border-bento-border/40 p-2.5">
                                {order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="py-2 first:pt-0 last:pb-0 text-xs">
                                    <div className="flex justify-between font-bold text-[#1C1917] gap-2">
                                      <span>{item.quantity}x {item.product_name || item.product?.name}</span>
                                      {item.selected_size && (
                                        <span className="text-[10px] text-bento-amber-dark bg-[#FEF3C7] px-1.5 py-0.25 rounded font-extrabold flex-shrink-0">
                                          {item.selected_size.name}
                                        </span>
                                      )}
                                    </div>

                                    {/* Custom birthday cake subconfig */}
                                    {item.custom_cake_config && (
                                      <div className="mt-1.5 bg-white/75 border border-amber-200/50 rounded-lg p-2 text-[10px] text-bento-amber-dark space-y-0.5">
                                        <p><span className="font-bold">Massa:</span> {item.custom_cake_config.massa}</p>
                                        <p><span className="font-bold">Recheios:</span> {item.custom_cake_config.recheios?.join(' e ')}</p>
                                        <p><span className="font-bold">Cobertura:</span> {item.custom_cake_config.cobertura}</p>
                                        {item.custom_cake_config.adicionais?.length > 0 && (
                                          <p><span className="font-bold">Adicionais:</span> {item.custom_cake_config.adicionais.join(', ')}</p>
                                        )}
                                        {item.custom_cake_config.cakeNameText && (
                                          <p className="mt-1 text-[#1C1917] font-semibold italic">📝 "{item.custom_cake_config.cakeNameText}"</p>
                                        )}
                                      </div>
                                    )}

                                    {item.observation && !item.custom_cake_config && (
                                      <p className="text-[10px] text-[#1C1917]/60 italic mt-0.5">↳ Obs: "{item.observation}"</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Delivery & Payment details */}
                            <div className="grid grid-cols-2 gap-3 text-[10px] text-[#1C1917]/70 font-semibold border-t border-bento-border/50 pt-3">
                              <div className="space-y-1">
                                <span className="text-[9px] font-black text-[#1C1917]/40 uppercase tracking-widest block">Entrega</span>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                  <span className="truncate">
                                    {order.deliveryMethod === 'delivery' ? `Entregar: ${order.address?.info || 'Endereço'}` : 'Retirar na Confeitaria'}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[9px] font-black text-[#1C1917]/40 uppercase tracking-widest block">Pagamento</span>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                                  <span className="uppercase">{order.paymentMethod || 'Não informado'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Observation note */}
                            {parsed.text && (
                              <div className="bg-[#FAF7F2] p-2.5 rounded-xl text-[10px] text-[#1C1917]/60 italic border border-bento-border/40">
                                📝 Observações: "{parsed.text}"
                              </div>
                            )}

                            {/* Total and actions */}
                            <div className="flex items-center justify-between border-t border-bento-border/50 pt-3.5 bg-bento-bg/10 -mx-4.5 -mb-4.5 p-4 rounded-b-2xl">
                              <div>
                                <span className="text-[9px] font-black text-[#1C1917]/40 uppercase tracking-widest block">Total Geral</span>
                                <span className="text-base font-black text-[#1C1917] font-mono">
                                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                </span>
                              </div>

                              {/* Customer action button: talk about order */}
                              <a
                                href={`https://api.whatsapp.com/send?phone=5535999958397&text=${encodeURIComponent(
                                  `Olá! Gostaria de falar sobre o meu Pedido #${parsed.number} de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)} feito por ${order.customerName}. Como está o andamento?`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all"
                              >
                                💬 Perguntar no WhatsApp
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
