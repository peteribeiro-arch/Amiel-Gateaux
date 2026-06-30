import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sliders, RefreshCw, Star, MapPin, Clock, ShieldAlert, Sparkles, Eye, EyeOff } from 'lucide-react';

import { Product, Category, CartItem, CustomCakeConfig } from './types';
import { DEFAULT_PRODUCTS } from './data';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { BirthdayCakeConfigurator } from './components/BirthdayCakeConfigurator';
import { ProductFormModal } from './components/ProductFormModal';
import { CartSidebar } from './components/CartSidebar';
import Logo from './components/Logo';
import LoginModal from './components/LoginModal';
import {
  isSupabaseConfigured,
  dbFetchProducts,
  dbSaveProduct,
  dbDeleteProduct,
  dbFetchHiddenCategories,
  dbSaveHiddenCategories,
  subscribeToSupabaseErrors
} from './lib/supabase';

export default function App() {
  // --- States ---
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [hiddenCategories, setHiddenCategories] = useState<Category[]>([]);
  const [supabaseSchemaError, setSupabaseSchemaError] = useState(false);
  const [supabaseErrorMessage, setSupabaseErrorMessage] = useState<string | null>(null);

  // --- Subscribe to Supabase Connection/Schema Errors ---
  useEffect(() => {
    return subscribeToSupabaseErrors((hasError, msg) => {
      setSupabaseSchemaError(hasError);
      setSupabaseErrorMessage(msg);
    });
  }, []);

  // --- Hide Watermark/Username Elements (Especially in Admin Mode) ---
  useEffect(() => {
    const emailPattern = /peteribeiro/i;

    const hideWatermarks = () => {
      // 1. Hide generic watermark/email elements
      const watermarkElements = document.querySelectorAll(
        '[class*="watermark" i], [id*="watermark" i], [class*="email" i], [id*="email" i], .watermark, #watermark'
      );
      watermarkElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('opacity', '0', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
        }
      });

      // 2. Hide text-containing elements with username
      const allElements = document.querySelectorAll('body *');
      allElements.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        // Skip root-like elements to avoid hiding the whole page
        if (el.tagName === 'BODY' || el.tagName === 'HTML' || el.id === 'root') return;

        // If it's a leaf node containing the pattern
        if (el.children.length === 0 && el.textContent && emailPattern.test(el.textContent)) {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('opacity', '0', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
        } else if (el.children.length > 0) {
          // Check direct text node children
          for (let i = 0; i < el.childNodes.length; i++) {
            const node = el.childNodes[i];
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue && emailPattern.test(node.nodeValue)) {
              el.style.setProperty('display', 'none', 'important');
              el.style.setProperty('opacity', '0', 'important');
              el.style.setProperty('visibility', 'hidden', 'important');
              break;
            }
          }
        }
      });
    };

    // Run immediately
    hideWatermarks();

    // Setup an observer to watch for DOM injections
    const observer = new MutationObserver(() => {
      hideWatermarks();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Also set up a periodic interval just in case
    const interval = setInterval(hideWatermarks, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [isAdminMode]);

  // --- Scroll to top on category change ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  // --- Load Initial Data from localStorage / Supabase ---
  useEffect(() => {
    async function loadData() {
      // 1. Load Cart (Always client-side/local for shopping experience)
      const savedCart = localStorage.getItem('bella_massa_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          setCart([]);
        }
      }

      // 2. Load Products and Settings
      let loadedFromDb = false;

      if (isSupabaseConfigured) {
        console.log('🔌 Supabase configurado! Sincronizando dados em tempo real...');
        // Fetch products from Supabase
        const dbProducts = await dbFetchProducts();
        if (dbProducts !== null) {
          loadedFromDb = true;
          if (dbProducts.length > 0) {
            const updatedDb: Product[] = [];
            
            // Sync / update existing products in database with new default image/descriptions
            for (const p of dbProducts) {
              const defaultProduct = DEFAULT_PRODUCTS.find((dp) => dp.id === p.id || dp.name.toLowerCase() === p.name.toLowerCase());
              if (defaultProduct) {
                const updatedItem: Product = {
                  ...p,
                  imageUrl: defaultProduct.imageUrl,
                  description: defaultProduct.description,
                  ingredients: defaultProduct.ingredients,
                  sizes: defaultProduct.sizes,
                };
                updatedDb.push(updatedItem);
                
                // If there's a mismatch (e.g. image URL was updated), save it to Supabase
                if (p.imageUrl !== defaultProduct.imageUrl || p.description !== defaultProduct.description) {
                  console.log(`🔄 Atualizando imagem/detalhes de ${p.name} no banco de dados...`);
                  await dbSaveProduct(updatedItem);
                }
              } else {
                updatedDb.push(p);
              }
            }

            // Seed any new products from defaults that are missing in the database
            const dbProductKeys = new Set(dbProducts.map(p => p.id));
            const dbProductNames = new Set(dbProducts.map(p => p.name.toLowerCase()));
            
            for (const dp of DEFAULT_PRODUCTS) {
              if (!dbProductKeys.has(dp.id) && !dbProductNames.has(dp.name.toLowerCase())) {
                console.log(`🌱 Semeando novo produto de fábrica: ${dp.name} no banco de dados...`);
                await dbSaveProduct(dp);
                updatedDb.push(dp);
              }
            }

            setProducts(updatedDb);
            localStorage.setItem('bella_massa_products', JSON.stringify(updatedDb));
          } else {
            // If connected but empty, seed defaults
            console.log('🌱 Banco de dados Supabase vazio. Semeando produtos iniciais...');
            setProducts(DEFAULT_PRODUCTS);
            localStorage.setItem('bella_massa_products', JSON.stringify(DEFAULT_PRODUCTS));
            for (const product of DEFAULT_PRODUCTS) {
              await dbSaveProduct(product);
            }
          }

          // Fetch hidden categories from Supabase
          const dbHiddenCats = await dbFetchHiddenCategories();
          if (dbHiddenCats !== null) {
            setHiddenCategories(dbHiddenCats);
            localStorage.setItem('bella_massa_hidden_categories', JSON.stringify(dbHiddenCats));
          }
        } else {
          console.warn('⚠️ Falha ao buscar dados do Supabase. Usando LocalStorage como backup temporário.');
        }
      }

      if (!isSupabaseConfigured || !loadedFromDb) {
        if (!isSupabaseConfigured) {
          console.log('🏠 Supabase não configurado. Utilizando banco local (LocalStorage).');
        }
        // Standard localStorage Products
        const savedProducts = localStorage.getItem('bella_massa_products');
        if (savedProducts) {
          try {
            const parsed = JSON.parse(savedProducts) as Product[];
            const updated = parsed.map((p) => {
              const defaultProduct = DEFAULT_PRODUCTS.find((dp) => dp.id === p.id);
              if (defaultProduct) {
                return {
                  ...p,
                  imageUrl: defaultProduct.imageUrl,
                  description: defaultProduct.description,
                  ingredients: defaultProduct.ingredients,
                  sizes: defaultProduct.sizes,
                };
              }
              return p;
            });
            setProducts(updated);
            localStorage.setItem('bella_massa_products', JSON.stringify(updated));
          } catch (e) {
            setProducts(DEFAULT_PRODUCTS);
          }
        } else {
          setProducts(DEFAULT_PRODUCTS);
          localStorage.setItem('bella_massa_products', JSON.stringify(DEFAULT_PRODUCTS));
        }

        // Standard localStorage Hidden categories
        const savedHiddenCats = localStorage.getItem('bella_massa_hidden_categories');
        if (savedHiddenCats) {
          try {
            setHiddenCategories(JSON.parse(savedHiddenCats));
          } catch (e) {
            setHiddenCategories([]);
          }
        }
      }
    }

    loadData();
  }, []);

  // --- Sync State back to localStorage ---
  const saveProductsToStorage = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('bella_massa_products', JSON.stringify(updatedProducts));
  };

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('bella_massa_cart', JSON.stringify(updatedCart));
  };

  const saveHiddenCategoriesToStorage = (updatedCats: Category[]) => {
    setHiddenCategories(updatedCats);
    localStorage.setItem('bella_massa_hidden_categories', JSON.stringify(updatedCats));
  };

  const handleToggleProductVisibility = async (id: string) => {
    let updatedProduct: Product | null = null;
    const updated = products.map((p) => {
      if (p.id === id) {
        updatedProduct = {
          ...p,
          hidden: !p.hidden,
        };
        return updatedProduct;
      }
      return p;
    });
    saveProductsToStorage(updated);
    if (isSupabaseConfigured && updatedProduct) {
      await dbSaveProduct(updatedProduct);
    }
  };

  const handleToggleCategoryVisibility = async (cat: Category) => {
    const updated = hiddenCategories.includes(cat)
      ? hiddenCategories.filter((c) => c !== cat)
      : [...hiddenCategories, cat];
    saveHiddenCategoriesToStorage(updated);
    if (isSupabaseConfigured) {
      await dbSaveHiddenCategories(updated);
    }
  };

  // Redirect to 'all' if the user is not admin and is currently looking at a hidden category
  useEffect(() => {
    if (!isAdminMode && activeCategory !== 'all' && hiddenCategories.includes(activeCategory)) {
      setActiveCategory('all');
    }
  }, [isAdminMode, activeCategory, hiddenCategories]);

  // --- Product Management Logic ---
  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (productData.id) {
      // Editing existing product
      let updatedProduct: Product | null = null;
      const updated = products.map((p) => {
        if (p.id === productData.id) {
          updatedProduct = {
            ...p,
            ...productData,
          } as Product;
          return updatedProduct;
        }
        return p;
      });
      saveProductsToStorage(updated);
      if (isSupabaseConfigured && updatedProduct) {
        await dbSaveProduct(updatedProduct);
      }
    } else {
      // Creating a new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productData.name || 'Nova Torta',
        category: productData.category || 'doces',
        price: productData.price || 0,
        ingredients: productData.ingredients || [],
        imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80',
        description: productData.description || 'Receita artesanal fresquinha feita com carinho.',
      };
      saveProductsToStorage([...products, newProduct]);
      if (isSupabaseConfigured) {
        await dbSaveProduct(newProduct);
      }
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProductsToStorage(updated);
    if (isSupabaseConfigured) {
      await dbDeleteProduct(id);
    }

    // Also remove from cart if present
    const updatedCart = cart.filter((item) => item.product.id !== id);
    saveCartToStorage(updatedCart);
  };

  const handleResetDefaults = async () => {
    if (confirm('Tem certeza de que deseja restaurar o catálogo para os itens originais da fábrica? Suas modificações locais serão perdidas.')) {
      saveProductsToStorage(DEFAULT_PRODUCTS);
      if (isSupabaseConfigured) {
        // Clear products and seed defaults in Supabase
        for (const p of products) {
          await dbDeleteProduct(p.id);
        }
        for (const p of DEFAULT_PRODUCTS) {
          await dbSaveProduct(p);
        }
      }
    }
  };

  // --- Cart Actions ---
  const handleAddToCart = (product: Product, selectedSize?: any, observation?: string, customCakeConfig?: CustomCakeConfig) => {
    // Generate a unique identifier for this product, size and observation combination
    const sizeId = selectedSize ? selectedSize.id : 'default';
    const obsHash = observation ? encodeURIComponent(observation.trim().toLowerCase()) : '';
    
    // Custom cakes get unique IDs to stay separate, standard products merge
    const cartItemId = customCakeConfig
      ? `custom-cake-${Date.now()}`
      : `${product.id}-${sizeId}-${obsHash}`;

    const existingIndex = cart.findIndex((item) => item.id === cartItemId);
    if (existingIndex > -1 && !customCakeConfig) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCartToStorage(updated);
    } else {
      const updated = [...cart, {
        id: cartItemId,
        product,
        quantity: 1,
        selectedSize,
        observation: observation?.trim(),
        customCakeConfig
      }];
      saveCartToStorage(updated);
    }
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCartToStorage(updated);
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    const updated = cart.filter((item) => item.id !== cartItemId);
    saveCartToStorage(updated);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  const handleToggleAdminMode = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // --- Filtered and Searched list ---
  const filteredProducts = products.filter((p) => {
    if (!isAdminMode) {
      if (p.hidden) return false;
      if (hiddenCategories.includes(p.category)) return false;
    }

    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchLower) ||
      p.ingredients.some((i) => i.toLowerCase().includes(searchLower)) ||
      (p.description && p.description.toLowerCase().includes(searchLower));

    return matchesCategory && matchesSearch;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-bento-bg text-bento-dark font-sans selection:bg-bento-amber-light selection:text-bento-amber-deep flex flex-col">
      
      {/* Navbar with Categories and Search */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdminMode={isAdminMode}
        setIsAdminMode={handleToggleAdminMode}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        hiddenCategories={hiddenCategories}
      />

      {/* Main Content Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        
        {activeCategory === 'aniversario' ? (
          <BirthdayCakeConfigurator onAddToCart={handleAddToCart} />
        ) : (
          <>
            {/* Banner Informative / Storefront Hero (Premium Large Bento Cell) */}
            <div className="relative rounded-[32px] overflow-hidden bg-bento-dark text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-bento-border/10">
          <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-bento-amber-light/10 rounded-full border border-bento-amber-bright/20 text-xs font-bold text-bento-amber-bright">
              <Star className="w-3.5 h-3.5 fill-bento-amber-bright stroke-bento-amber-bright" />
              Encomendas Abertas para o Fim de Semana!
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-serif leading-tight">
              Tortas & Bolos <br className="hidden sm:inline" />Artesanais sob Medida
            </h2>
            
            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed font-light">
              Ingredientes nobres, preparo artesanal impecável e sabor inesquecível. Escolha seus itens preferidos e feche sua encomenda diretamente pelo WhatsApp de forma ágil e prática!
            </p>

            {/* Quick badges of trust */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-bento-amber-bright/90 font-semibold">
              <span className="flex items-center gap-1.5 bg-[#4D392B] px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-bento-amber-bright" /> Encomende com 24h de antecedência
              </span>
              <span className="flex items-center gap-1.5 bg-[#4D392B] px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-bento-amber-bright" /> Entregas em toda a região
              </span>
            </div>
          </div>

          {/* Quick promotional visual graphic */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0 hidden md:block z-10">
            <img
              src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=300&q=80"
              alt="Promo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-[24px] shadow-2xl rotate-3 border-4 border-white/10"
            />
            <div className="absolute -bottom-2 -left-2 bg-bento-amber text-bento-amber-deep px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg shadow-md -rotate-3">
              100% Caseiro
            </div>
          </div>

          {/* Beautiful golden glow element just like the Bento specification */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-bento-amber rounded-full blur-3xl opacity-25"></div>
        </div>

        {/* Admin Mode Informative Banner & Controls */}
        <AnimatePresence>
          {isAdminMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-bento-amber-light/40 border border-[#FEF3C7] rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 text-bento-amber-dark space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-bento-amber mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold flex flex-wrap items-center gap-2 uppercase tracking-wider text-bento-amber-dark">
                      <span>Painel do Administrador (Edição de Catálogo Ativo)</span>
                      {isSupabaseConfigured ? (
                        supabaseSchemaError ? (
                          <span className="text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black tracking-widest flex items-center gap-1 animate-pulse">
                            🚨 TABELAS AUSENTES (MODO LOCAL ATIVADO)
                          </span>
                        ) : (
                          <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black tracking-widest flex items-center gap-1">
                            🟢 SUPABASE ATIVO & SINCRONIZADO
                          </span>
                        )
                      ) : (
                        <span className="text-[9px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-black tracking-widest flex items-center gap-1">
                          ⚪ ARMAZENAMENTO LOCAL (OFFLINE)
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-bento-amber-dark/80 leading-relaxed mt-1 font-medium">
                      {isSupabaseConfigured 
                        ? (supabaseSchemaError 
                            ? "Sua chave de API do Supabase está correta, mas faltam tabelas no banco de dados! O Bella Massa ativou o backup local temporário para você continuar trabalhando livremente sem perder nada."
                            : "Sincronização em tempo real ativa! Suas alterações de preços, novos produtos, pedidos enviados e visibilidade de categorias são persistidos com total segurança no Supabase."
                          )
                        : "Você pode editar preços, ingredientes, fotos e categorias das mercadorias. Suas mudanças serão salvas no navegador e, assim que você fornecer as credenciais do Supabase no painel de Secrets, elas sincronizarão automaticamente na nuvem!"
                      }
                    </p>
                  </div>
                </div>

                {/* Manager buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    id="btn-restore-defaults"
                    onClick={handleResetDefaults}
                    className="px-3.5 py-2 rounded-xl border border-bento-amber/30 bg-white hover:bg-[#FEF3C7]/40 text-xs font-bold text-bento-amber-dark transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Restaurar itens padrão"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-bento-amber" />
                    Restaurar Padrões
                  </button>

                  <button
                    id="btn-add-product"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsFormModalOpen(true);
                    }}
                    className="px-4.5 py-2 rounded-xl bg-bento-dark hover:bg-bento-amber text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-bento-amber-bright" />
                    Novo Doce/Salgado
                  </button>
                </div>
              </div>

              {/* Category Visibility Manager */}
              <div className="border-t border-bento-amber/20 pt-4 mt-4 space-y-3">
                <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-bento-amber-dark flex items-center gap-1.5">
                  📁 Visibilidade das Categorias
                </h4>
                <p className="text-[10px] sm:text-xs text-bento-amber-dark/75 leading-relaxed">
                  Oculte ou mostre grupos inteiros de itens do catálogo dos clientes. Quando uma categoria está oculta, o botão de navegação correspondente e todos os seus produtos somem para o cliente comum.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {[
                    { id: 'doces', label: '🍰 Tortas Doces' },
                    { id: 'salgadas', label: '🥧 Tortas Salgadas' },
                    { id: 'bolos', label: '🎂 Bolos Especiais' },
                    { id: 'aniversario', label: '🎈 Bolos de Aniversário' },
                  ].map((cat) => {
                    const isHidden = hiddenCategories.includes(cat.id as Category);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleToggleCategoryVisibility(cat.id as Category)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                          isHidden
                            ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                            : 'bg-white border-bento-amber/20 text-bento-amber-dark hover:bg-amber-50 shadow-xs'
                        }`}
                      >
                        {isHidden ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-rose-500" />
                            <span>{cat.label} (Oculto)</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-stone-500" />
                            <span>{cat.label} (Visível)</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Supabase Schema Error Instruction Banner */}
              {supabaseSchemaError && (
                <div className="border-t border-rose-200 bg-rose-50/70 p-4.5 rounded-2xl space-y-2.5 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-600 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                      ⚠️ CONFIGURAÇÃO ADICIONAL NECESSÁRIA NO SUPABASE
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-rose-850 leading-relaxed font-medium">
                    As suas chaves de API do Supabase estão corretas, mas as tabelas necessárias não foram encontradas no banco de dados ainda!
                  </p>
                  <p className="text-[10px] sm:text-xs text-rose-800 leading-relaxed">
                    Para resolver isso e habilitar a sincronização na nuvem, basta acessar o painel do seu projeto no <strong>Supabase</strong>, ir em <strong>SQL Editor</strong>, criar uma nova query, copiar todo o conteúdo do arquivo <code className="bg-rose-100 px-1 py-0.5 rounded font-mono text-[9px] sm:text-[10px]">supabase_schema.sql</code> (disponível na raiz do seu projeto Bella Massa) e clicar em <strong>Run</strong>.
                  </p>
                  <p className="text-[10px] sm:text-xs text-emerald-700 leading-relaxed font-semibold">
                    💡 Não se preocupe: o Bella Massa ativou automaticamente o modo de segurança e está salvando todas as suas alterações localmente no seu navegador!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Heading with Filters count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-bento-dark tracking-tight font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-bento-amber" />
              {activeCategory === 'all'
                ? 'Cardápio Completo'
                : activeCategory === 'doces'
                ? 'Tortas Doces Deliciosas'
                : activeCategory === 'salgadas'
                ? 'Tortas Salgadas Gourmet'
                : 'Bolos de Festa & Fofinhos'}
            </h3>
            <p className="text-xs text-bento-dark/50 font-semibold mt-0.5 uppercase tracking-wide">
              Exibindo {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'} de acordo com seus filtros.
            </p>
          </div>

          {/* Quick empty space placeholder trigger when search/filters result in empty */}
          {isAdminMode && !isFormModalOpen && (
            <button
              id="btn-add-product-quick"
              onClick={() => {
                setEditingProduct(null);
                setIsFormModalOpen(true);
              }}
              className="text-xs font-bold text-bento-amber hover:text-bento-amber-dark hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Adicionar nova receita rapidamente
            </button>
          )}
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-xs max-w-lg mx-auto p-8 space-y-4">
            <span className="text-4xl block">🧁</span>
            <h4 className="font-bold text-stone-700">Nenhum sabor encontrado</h4>
            <p className="text-xs text-stone-400">
              Não encontramos nenhuma receita correspondente à busca "{searchQuery}" ou a esta categoria de filtro. Tente reajustar o termo digitado ou adicione um novo produto!
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
              >
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdminMode={isAdminMode}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setIsFormModalOpen(true);
                  }}
                  onDelete={handleDeleteProduct}
                  onAddToCart={handleAddToCart}
                  cartQuantity={cart.filter((item) => item.product.id === product.id).reduce((sum, item) => sum + item.quantity, 0)}
                  onToggleVisibility={handleToggleProductVisibility}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
          </>
        )}
      </main>

      {/* Footer Details */}
      <footer className="bg-stone-900 text-stone-400 py-10 mt-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-800">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <Logo size={44} showBackground={true} className="mx-auto md:mx-0 shadow-md" />
              <div>
                <h4 className="text-white font-serif font-bold text-lg">Amiel Gâteaux - Confeitaria & Padaria Artesanal</h4>
                <p className="text-xs text-stone-500 mt-1">Sua mesa muito mais doce e repleta de carinho artesanal.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold">
              <a href="#" className="hover:text-white transition-colors">Políticas</a>
              <span className="text-stone-700">•</span>
              <a href="#" className="hover:text-white transition-colors">Termos de Serviço</a>
              <span className="text-stone-700">•</span>
              <button
                onClick={handleToggleAdminMode}
                className="hover:text-amber-500 transition-colors cursor-pointer"
              >
                Acesso Gerente
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
            <p>© {new Date().getFullYear()} Amiel Gâteaux. Todos os direitos reservados. Feito com muito amor em São Paulo.</p>
            <p className="font-mono bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-[10px]">
              Vendas via WhatsApp • 100% Responsivo
            </p>
          </div>
        </div>
      </footer>

      {/* Product Add/Edit Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {/* Cart Drawer Panel */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsAdminMode(true)}
      />

    </div>
  );
}
