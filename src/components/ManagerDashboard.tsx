import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Search, Phone, ClipboardCheck, Sparkles, RefreshCw, 
  TrendingUp, Clock, CheckCircle, Ban, Filter, BarChart3, 
  MapPin, CreditCard, ChevronRight, AlertCircle, Calendar,
  ArrowRight, DollarSign, ShoppingBag, Eye, Trash2
} from 'lucide-react';
import { Order } from '../types';
import { dbFetchAllOrders, dbUpdateOrderStatus, dbDeleteAllOrders, isSupabaseConfigured } from '../lib/supabase';

interface ManagerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminMode: boolean;
}

export function ManagerDashboard({ isOpen, onClose, isAdminMode }: ManagerDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Load orders
  const loadOrders = async () => {
    if (!isAdminMode) return;
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      let dbOrders: any[] = [];
      if (isSupabaseConfigured) {
        const fetched = await dbFetchAllOrders();
        if (fetched) {
          dbOrders = fetched;
        }
      }

      // Also fetch from local storage to keep them synchronized
      const localOrdersRaw = localStorage.getItem('bella_massa_orders') || '[]';
      let localOrders: any[] = [];
      try {
        localOrders = JSON.parse(localOrdersRaw);
      } catch (e) {
        console.error('Error parsing local orders', e);
      }

      // Merge and deduplicate
      const mergedMap = new Map<string, any>();
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

      localOrders.forEach((o) => {
        const idKey = o.id || o.orderNumber || '';
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

      const mergedList = Array.from(mergedMap.values());
      // Sort by date descending
      mergedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(mergedList);
    } catch (err) {
      console.error('Error loading manager orders', err);
      setFeedbackMsg('⚠️ Não foi possível sincronizar todos os pedidos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdminMode) {
      loadOrders();
    }
  }, [isOpen, isAdminMode]);

  const handleClearAllOrders = async () => {
    if (!confirm('⚠️ Tem certeza de que deseja ZERAR todos os pedidos? Esta ação é irreversível e apagará todos os registros locais e no banco de dados.')) {
      return;
    }

    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      let success = true;
      if (isSupabaseConfigured) {
        success = await dbDeleteAllOrders();
      }

      // Also clear local storage
      localStorage.setItem('bella_massa_orders', '[]');

      if (success) {
        setOrders([]);
        setSelectedOrder(null);
        setFeedbackMsg('🗑️ Todos os pedidos foram zerados com sucesso!');
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        setFeedbackMsg('⚠️ Ocorreu um erro ao zerar pedidos no banco de dados, mas os locais foram limpos.');
        setOrders([]);
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Error clearing orders:', err);
      setFeedbackMsg('⚠️ Ocorreu um erro ao tentar zerar os pedidos.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !isAdminMode) return null;

  // Status transitions
  const handleUpdateStatus = async (orderId: string, source: string, orderNumber: string, nextStatus: string) => {
    try {
      let success = true;
      if (isSupabaseConfigured && source === 'database') {
        success = await dbUpdateOrderStatus(orderId, nextStatus);
      }

      // Sync local storage
      const localOrdersRaw = localStorage.getItem('bella_massa_orders') || '[]';
      try {
        const localOrders = JSON.parse(localOrdersRaw);
        const updatedLocal = localOrders.map((o: any) => {
          if (o.id === orderId || o.orderNumber === orderNumber || (orderNumber && o.orderNumber === orderNumber)) {
            return { ...o, status: nextStatus };
          }
          return o;
        });
        localStorage.setItem('bella_massa_orders', JSON.stringify(updatedLocal));
      } catch (e) {
        console.error(e);
        success = false;
      }

      if (success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: nextStatus } : null);
        }
        
        let feedback = '';
        if (nextStatus === 'preparing') {
          feedback = `🍰 Recebimento confirmado para o Pedido #${orderNumber}! Status atualizado para "Preparando".`;
        } else if (nextStatus === 'delivered') {
          feedback = `✅ Pedido #${orderNumber} entregue com sucesso!`;
        } else if (nextStatus === 'cancelled') {
          feedback = `❌ Pedido #${orderNumber} foi cancelado.`;
        } else {
          feedback = `⏳ Pedido #${orderNumber} definido como pendente.`;
        }
        setFeedbackMsg(feedback);
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        setFeedbackMsg('⚠️ Ocorreu um problema ao atualizar o status.');
      }
    } catch (err) {
      console.error(err);
      setFeedbackMsg('⚠️ Ocorreu um erro na conexão.');
    }
  };

  // Helper to extract order number from observation
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

  // Stats calculation
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const preparingOrdersCount = orders.filter(o => o.status === 'preparing').length;
  const completedOrdersCount = orders.filter(o => o.status === 'delivered').length;

  const averageTicket = orders.filter(o => o.status !== 'cancelled').length > 0
    ? totalRevenue / orders.filter(o => o.status !== 'cancelled').length
    : 0;

  // Filter & Search application
  const filteredOrders = orders.filter((order) => {
    const parsed = parseOrderNumberAndObs(order.observation, order.orderNumber);
    const matchesSearch = 
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone?.includes(searchQuery) ||
      parsed.number.includes(searchQuery);

    if (statusFilter === 'all') return matchesSearch;
    return order.status === statusFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1C1917]/50 backdrop-blur-md"
      />

      {/* Main Container Dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative m-4 sm:m-8 bg-white border border-bento-border rounded-[32px] shadow-2xl w-full max-w-7xl mx-auto flex flex-col overflow-hidden z-10"
      >
        {/* Header */}
        <div className="p-6 border-b border-bento-border bg-bento-bg/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-bento-amber/15 text-bento-amber-dark">
              <ClipboardCheck className="w-6 h-6 text-bento-amber" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#1C1917] font-serif tracking-tight">Gerenciador de Encomendas</h2>
                <span className="text-[10px] bg-bento-dark text-[#FAF7F2] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Modo Gerente
                </span>
              </div>
              <p className="text-xs text-[#1C1917]/50 font-semibold">Gerencie recebimentos, status de preparo e acompanhamento do cliente</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {orders.length > 0 && (
              <button
                onClick={handleClearAllOrders}
                disabled={isLoading}
                className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-all text-rose-700 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Zerar todos os pedidos"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Zerar Pedidos</span>
              </button>
            )}

            <button
              onClick={loadOrders}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-bento-border bg-white hover:bg-stone-50 transition-all text-stone-600 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Recarregar Pedidos"
            >
              <RefreshCw className={`w-4 h-4 text-bento-amber ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full hover:bg-stone-100 transition-colors text-[#1C1917]/40 hover:text-[#1C1917] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-grow flex flex-col lg:flex-row overflow-hidden min-h-0">
          
          {/* Left panel: Stats, Filter & List */}
          <div className="flex-1 flex flex-col border-r border-bento-border overflow-hidden p-6 space-y-6">
            
            {/* Feedback message banner */}
            <AnimatePresence>
              {feedbackMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-bento-amber-light/35 border border-amber-200 text-bento-amber-deep p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-bento-amber flex-shrink-0 animate-bounce" />
                  <span>{feedbackMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick KPI stats bento grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-[#FEF3C7]/15 border border-[#FEF3C7]/60 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#78350F] uppercase tracking-wider">Pendente ⏳</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-black text-[#78350F]">{pendingOrdersCount}</span>
                  <span className="text-xs text-[#78350F]/70 font-semibold">esperando</span>
                </div>
              </div>

              <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Em Preparo 🍰</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-black text-blue-800">{preparingOrdersCount}</span>
                  <span className="text-xs text-blue-700/70 font-semibold">na cozinha</span>
                </div>
              </div>

              <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Entregues ✅</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-black text-emerald-800">{completedOrdersCount}</span>
                  <span className="text-xs text-emerald-700/70 font-semibold">concluídos</span>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Faturamento Geral 💰</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-xl font-black text-stone-800 font-mono">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalRevenue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Filters bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch sm:items-center">
              
              {/* Search bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por cliente, telefone ou nº do pedido..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-bento-border text-xs focus:outline-none focus:ring-2 focus:ring-bento-amber/10 focus:border-bento-amber bg-white text-stone-800 placeholder-stone-400"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex bg-[#FAF7F2] p-1 rounded-xl border border-bento-border self-start md:self-auto overflow-x-auto max-w-full">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'pending', label: 'Pendentes' },
                  { id: 'preparing', label: 'Em Preparo' },
                  { id: 'delivered', label: 'Entregues' },
                  { id: 'cancelled', label: 'Cancelados' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === tab.id
                        ? 'bg-bento-amber text-bento-amber-deep shadow-xs'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders list container */}
            <div className="flex-grow overflow-y-auto pr-1">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-stone-50 rounded-[24px] border border-dashed border-stone-200">
                  <span className="text-4xl block">📦</span>
                  <h4 className="font-bold text-stone-700 text-sm">Nenhum pedido encontrado</h4>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto">
                    Não encontramos registros de pedidos ativos com os filtros selecionados.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOrders.map((order) => {
                    const parsed = parseOrderNumberAndObs(order.observation, order.orderNumber);
                    const isSelected = selectedOrder?.id === order.id;

                    const dateFormatted = new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`border rounded-2xl p-4.5 cursor-pointer transition-all space-y-3 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-bento-amber/10 border-bento-amber shadow-md ring-1 ring-bento-amber'
                            : 'bg-white border-bento-border hover:border-stone-400/40 shadow-xs'
                        }`}
                      >
                        <div className="space-y-2">
                          {/* Order Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-extrabold text-sm text-stone-950 font-serif">
                                Pedido #{parsed.number}
                              </h4>
                              <p className="text-xs font-bold text-stone-800 truncate max-w-[160px] sm:max-w-xs">
                                {order.customerName}
                              </p>
                            </div>
                            <span className={`text-[10px] font-extrabold px-2 py-0.75 rounded-full border ${
                              order.status === 'delivered'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                                : order.status === 'preparing'
                                ? 'bg-blue-50 border-blue-100 text-blue-800'
                                : order.status === 'cancelled'
                                ? 'bg-rose-50 border-rose-100 text-rose-800'
                                : 'bg-amber-50 border-amber-100 text-amber-800'
                            }`}>
                              {order.status === 'pending' && '⏳ Pendente'}
                              {order.status === 'preparing' && '🍰 Preparando'}
                              {order.status === 'delivered' && '✅ Entregue'}
                              {order.status === 'cancelled' && '❌ Cancelado'}
                            </span>
                          </div>

                          {/* Quick summary of items */}
                          <div className="text-[11px] text-stone-600/95 font-medium line-clamp-2 bg-[#FAF7F2] p-2 rounded-lg border border-stone-100/70">
                            {order.items.map((it: any) => `${it.quantity}x ${it.product_name || it.product?.name}`).join(', ')}
                          </div>
                        </div>

                        {/* Bottom Metadata & Price */}
                        <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-1">
                          <div className="text-[10px] text-stone-400 font-bold">
                            {dateFormatted}
                          </div>
                          <div className="text-sm font-black text-stone-900 font-mono">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Selected Order detail & manager controller */}
          <div className="w-full lg:w-96 bg-bento-bg/15 overflow-y-auto p-6 flex flex-col justify-between">
            {selectedOrder ? (
              <div className="space-y-6 flex-grow flex flex-col justify-between h-full">
                <div className="space-y-5">
                  
                  {/* Detail Header */}
                  <div className="border-b border-bento-border pb-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">Detalhes do Pedido</span>
                        <h3 className="text-lg font-black text-stone-950 font-serif">
                          Pedido #{parseOrderNumberAndObs(selectedOrder.observation, selectedOrder.orderNumber).number}
                        </h3>
                      </div>
                      
                      <span className="text-[9px] font-bold bg-[#E7E5E4] px-2 py-0.5 rounded text-stone-700 uppercase font-mono">
                        {selectedOrder.source}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-stone-800 mt-2 flex items-center gap-1">
                      👤 {selectedOrder.customerName}
                    </p>

                    {/* WhatsApp Click-to-Action */}
                    <a
                      href={`https://api.whatsapp.com/send?phone=55${selectedOrder.customerPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Falar com Cliente: {selectedOrder.customerPhone}
                    </a>
                  </div>

                  {/* Delivery & Payment details block */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3 rounded-2xl border border-bento-border">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block mb-1">Método de Envio</span>
                      <div className="font-semibold text-stone-800 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2 leading-tight">
                          {selectedOrder.deliveryMethod === 'delivery' 
                            ? `Entrega: ${selectedOrder.address?.info || 'Endereço não preenchido'}` 
                            : 'Retirada no balcão'
                          }
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-bento-border">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block mb-1">Pagamento</span>
                      <div className="font-semibold text-stone-800 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                        <span className="uppercase">{selectedOrder.paymentMethod || 'Pix'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Complete list of items with configurations */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Fatias & Bolos Solicitados</span>
                    <div className="bg-white border border-bento-border rounded-2xl p-4 space-y-3.5">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-xs border-b border-stone-100 last:border-b-0 pb-3 last:pb-0 space-y-1">
                          <div className="flex justify-between font-bold text-stone-950">
                            <span>{item.quantity}x {item.product_name || item.product?.name}</span>
                            {item.selected_size && (
                              <span className="text-[9px] bg-bento-amber/20 text-bento-amber-dark px-1.5 py-0.25 rounded font-bold font-sans">
                                {item.selected_size.name}
                              </span>
                            )}
                          </div>

                          {/* Custom Birthday Cake configuration details */}
                          {item.custom_cake_config && (
                            <div className="bg-[#FAF7F2] p-2.5 rounded-xl text-[10px] text-stone-700 border border-amber-200/40 space-y-0.5 mt-1">
                              <p><span className="font-bold">Massa:</span> {item.custom_cake_config.massa}</p>
                              <p><span className="font-bold">Recheio:</span> {item.custom_cake_config.recheios?.join(' e ')}</p>
                              <p><span className="font-bold">Cobertura:</span> {item.custom_cake_config.cobertura}</p>
                              {item.custom_cake_config.adicionais?.length > 0 && (
                                <p><span className="font-bold">Adicionais:</span> {item.custom_cake_config.adicionais.join(', ')}</p>
                              )}
                              {item.custom_cake_config.cakeNameText && (
                                <p className="mt-1 font-semibold text-stone-900 border-t border-stone-200/50 pt-1">📝 Texto no bolo: "{item.custom_cake_config.cakeNameText}"</p>
                              )}
                            </div>
                          )}

                          {item.observation && !item.custom_cake_config && (
                            <p className="text-[10px] text-stone-500 italic mt-0.5">↳ Obs: "{item.observation}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client observation */}
                  {parseOrderNumberAndObs(selectedOrder.observation).text && (
                    <div className="bg-white/70 p-3 rounded-2xl border border-stone-200 text-xs text-stone-600 italic">
                      📝 Observação adicional: "{parseOrderNumberAndObs(selectedOrder.observation).text}"
                    </div>
                  )}

                  {/* Summary Total */}
                  <div className="flex items-center justify-between bg-stone-950 text-white p-4.5 rounded-2xl">
                    <span className="text-xs font-bold text-stone-400">Total da Encomenda:</span>
                    <span className="text-lg font-black font-mono">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.total)}
                    </span>
                  </div>

                </div>

                {/* Manager actions & state controllers */}
                <div className="border-t border-stone-200 pt-5 mt-4 space-y-2.5">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Mudar Status do Pedido</span>

                  {/* Pending state: action to Confirm Receipt */}
                  {selectedOrder.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(
                        selectedOrder.id, 
                        selectedOrder.source, 
                        parseOrderNumberAndObs(selectedOrder.observation, selectedOrder.orderNumber).number, 
                        'preparing'
                      )}
                      className="w-full py-3.5 bg-bento-amber hover:bg-bento-amber/90 text-bento-amber-deep font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      🍰 Confirmar Recebimento & Preparar
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {/* Mark as Preparing */}
                    {selectedOrder.status !== 'preparing' && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(
                          selectedOrder.id, 
                          selectedOrder.source, 
                          parseOrderNumberAndObs(selectedOrder.observation, selectedOrder.orderNumber).number, 
                          'preparing'
                        )}
                        className="py-2.5 border border-blue-200 hover:bg-blue-50 text-blue-800 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                      >
                        🍰 Em Preparo
                      </button>
                    )}

                    {/* Mark as Delivered */}
                    {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(
                          selectedOrder.id, 
                          selectedOrder.source, 
                          parseOrderNumberAndObs(selectedOrder.observation, selectedOrder.orderNumber).number, 
                          'delivered'
                        )}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-sm col-span-2"
                      >
                        ✅ Finalizar & Entregar
                      </button>
                    )}

                    {/* Mark as Cancelled */}
                    {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(
                          selectedOrder.id, 
                          selectedOrder.source, 
                          parseOrderNumberAndObs(selectedOrder.observation, selectedOrder.orderNumber).number, 
                          'cancelled'
                        )}
                        className="py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-800 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                      >
                        ❌ Cancelar Pedido
                      </button>
                    )}

                    {/* Restore to Pending */}
                    {(selectedOrder.status === 'cancelled' || selectedOrder.status === 'delivered') && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(
                          selectedOrder.id, 
                          selectedOrder.source, 
                          parseOrderNumberAndObs(selectedOrder.observation, selectedOrder.orderNumber).number, 
                          'pending'
                        )}
                        className="py-2.5 border border-amber-200 hover:bg-amber-50 text-amber-800 rounded-xl text-xs font-bold transition-all text-center cursor-pointer col-span-2"
                      >
                        ⏳ Reverter para Pendente
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <span className="text-4xl">🍰</span>
                <h4 className="font-extrabold text-stone-800 text-sm font-serif">Nenhuma Encomenda Selecionada</h4>
                <p className="text-xs text-stone-400 max-w-[200px] leading-relaxed">
                  Clique em um dos pedidos à esquerda para visualizar fatias compradas, dados de entrega e atualizar o status em tempo real.
                </p>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
