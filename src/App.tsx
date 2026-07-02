import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sliders, RefreshCw, Star, MapPin, Clock, ShieldAlert, Sparkles, Eye, EyeOff } from 'lucide-react';

import { Product, Category, CartItem, CustomCakeConfig } from './types';
import { DEFAULT_PRODUCTS } from './data';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { BirthdayCakeConfigurator } from './components/BirthdayCakeConfigurator';
import { PoteConfigurator } from './components/PoteConfigurator';
import { FestivalDeFatias } from './components/FestivalDeFatias';
import { ProductFormModal } from './components/ProductFormModal';
import { CartSidebar } from './components/CartSidebar';
import Logo from './components/Logo';
import LoginModal from './components/LoginModal';
import {
  isSupabaseConfigured,
  supabase,
  dbFetchProducts,
  dbSaveProduct,
  dbDeleteProduct,
  dbFetchHiddenCategories,
  dbSaveHiddenCategories,
  subscribeToSupabaseErrors,
  dbFetchAllOrders,
  dbUpdateOrderStatus,
  dbDeleteAllOrders
} from './lib/supabase';
import { CustomerArea } from './components/CustomerArea';
import { ManagerDashboard } from './components/ManagerDashboard';


export default function App() {
  // --- States ---
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isCustomerAreaOpen, setIsCustomerAreaOpen] = useState(false);
  const [isManagerDashboardOpen, setIsManagerDashboardOpen] = useState(false);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [isLoadingAdminOrders, setIsLoadingAdminOrders] = useState(false);
  const [showAdminOrdersPanel, setShowAdminOrdersPanel] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [hiddenCategories, setHiddenCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('bella_massa_hidden_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [supabaseSchemaError, setSupabaseSchemaError] = useState(false);
  const [supabaseErrorMessage, setSupabaseErrorMessage] = useState<string | null>(null);
  const [hasInitializedDefaultCategory, setHasInitializedDefaultCategory] = useState(false);

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
              if (['1', '2', '3', '4', '5', '6'].includes(p.id)) {
                console.log(`🗑️ Removendo produto de template antigo da nuvem: ${p.name}`);
                await dbDeleteProduct(p.id);
                continue;
              }
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
                
                // If there's a mismatch (e.g. image URL was updated, or ingredients/sizes changed), save it to Supabase
                if (
                  p.imageUrl !== defaultProduct.imageUrl || 
                  p.description !== defaultProduct.description ||
                  JSON.stringify(p.ingredients) !== JSON.stringify(defaultProduct.ingredients) ||
                  JSON.stringify(p.sizes) !== JSON.stringify(defaultProduct.sizes)
                ) {
                  console.log(`🔄 Sincronizando e atualizando ${p.name} no banco de dados...`);
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
        } else {
          console.warn('⚠️ Falha ao buscar dados do Supabase. Usando LocalStorage como backup temporário.');
        }

        // Fetch hidden categories from Supabase (Always execute independently)
        let dbHiddenCats = await dbFetchHiddenCategories();
        
        // Force-hide all pages except Festival de Fatias on first load to apply the manager's request
        const forcedFlag = 'bella_massa_forced_festival_only_v4';
        if (!localStorage.getItem(forcedFlag)) {
          const onlyFestivalHidden: Category[] = ['doces', 'salgadas', 'bolos', 'aniversario', 'potes', 'salgados'];
          if (isSupabaseConfigured) {
            await dbSaveHiddenCategories(onlyFestivalHidden);
          }
          dbHiddenCats = onlyFestivalHidden;
          localStorage.setItem(forcedFlag, 'true');
        }

        if (dbHiddenCats !== null) {
          setHiddenCategories(dbHiddenCats);
          localStorage.setItem('bella_massa_hidden_categories', JSON.stringify(dbHiddenCats));
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
            const updated: Product[] = [];
            
            // Map existing products to their new counterparts
            for (const p of parsed) {
              if (['1', '2', '3', '4', '5', '6'].includes(p.id)) {
                console.log(`🗑️ Removendo produto de template antigo local: ${p.name}`);
                continue;
              }
              const defaultProduct = DEFAULT_PRODUCTS.find((dp) => dp.id === p.id || dp.name.toLowerCase() === p.name.toLowerCase());
              if (defaultProduct) {
                updated.push({
                  ...p,
                  imageUrl: defaultProduct.imageUrl,
                  description: defaultProduct.description,
                  ingredients: defaultProduct.ingredients,
                  sizes: defaultProduct.sizes,
                });
              } else {
                updated.push(p);
              }
            }

            // Append any new default products that are missing from the list
            const existingKeys = new Set(parsed.map(p => p.id));
            const existingNames = new Set(parsed.map(p => p.name.toLowerCase()));
            
            for (const dp of DEFAULT_PRODUCTS) {
              if (!existingKeys.has(dp.id) && !existingNames.has(dp.name.toLowerCase())) {
                updated.push(dp);
              }
            }

            setProducts(updated);
            localStorage.setItem('bella_massa_products', JSON.stringify(updated));
          } catch (e) {
            setProducts(DEFAULT_PRODUCTS);
            localStorage.setItem('bella_massa_products', JSON.stringify(DEFAULT_PRODUCTS));
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

  // --- Periodic Synchronization (Polling) for Global Consistency ("todos os acessos") ---
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const interval = setInterval(async () => {
      try {
        // 1. Sync Hidden Categories globally
        const dbHiddenCats = await dbFetchHiddenCategories();
        if (dbHiddenCats !== null) {
          setHiddenCategories((prev) => {
            // Check if there is an actual difference to avoid unnecessary react renders
            if (JSON.stringify(prev) !== JSON.stringify(dbHiddenCats)) {
              localStorage.setItem('bella_massa_hidden_categories', JSON.stringify(dbHiddenCats));
              return dbHiddenCats;
            }
            return prev;
          });
        }

        // 2. Sync Active Products list globally (e.g., hidden products, price changes, edits)
        const dbProducts = await dbFetchProducts();
        if (dbProducts !== null && dbProducts.length > 0) {
          setProducts((prev) => {
            // Keep local overrides if we added new products/images on the fly, 
            // but align with DB for matches
            const serializedPrev = JSON.stringify(prev.map(p => ({ id: p.id, hidden: p.hidden, price: p.price, name: p.name })));
            const serializedDb = JSON.stringify(dbProducts.map(p => ({ id: p.id, hidden: p.hidden, price: p.price, name: p.name })));
            
            if (serializedPrev !== serializedDb) {
              const updatedList = dbProducts.map((p) => {
                const defaultProduct = DEFAULT_PRODUCTS.find((dp) => dp.id === p.id || dp.name.toLowerCase() === p.name.toLowerCase());
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
              localStorage.setItem('bella_massa_products', JSON.stringify(updatedList));
              return updatedList;
            }
            return prev;
          });
        }
      } catch (error) {
        console.warn('Erro de sincronização em segundo plano:', error);
      }
    }, 2000); // 2 seconds interval for maximum responsiveness

    return () => clearInterval(interval);
  }, []);

  // --- Realtime WebSocket Synchronization via Supabase Channels ---
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Listen to changes in settings table (hidden_categories)
    const settingsChannel = supabase
      .channel('public-settings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload) => {
          if (payload.new && (payload.new as any).key === 'hidden_categories') {
            const dbHiddenCats = (payload.new as any).value as Category[];
            if (dbHiddenCats) {
              setHiddenCategories((prev) => {
                if (JSON.stringify(prev) !== JSON.stringify(dbHiddenCats)) {
                  localStorage.setItem('bella_massa_hidden_categories', JSON.stringify(dbHiddenCats));
                  return dbHiddenCats;
                }
                return prev;
              });
            }
          }
        }
      )
      .subscribe();

    // Listen to changes in products table
    const productsChannel = supabase
      .channel('public-products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          const dbProducts = await dbFetchProducts();
          if (dbProducts !== null && dbProducts.length > 0) {
            setProducts((prev) => {
              const serializedPrev = JSON.stringify(prev.map(p => ({ id: p.id, hidden: p.hidden, price: p.price, name: p.name })));
              const serializedDb = JSON.stringify(dbProducts.map(p => ({ id: p.id, hidden: p.hidden, price: p.price, name: p.name })));
              
              if (serializedPrev !== serializedDb) {
                const updatedList = dbProducts.map((p) => {
                  const defaultProduct = DEFAULT_PRODUCTS.find((dp) => dp.id === p.id || dp.name.toLowerCase() === p.name.toLowerCase());
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
                localStorage.setItem('bella_massa_products', JSON.stringify(updatedList));
                return updatedList;
              }
              return prev;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(productsChannel);
    };
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

  // Redirect if looking at a hidden category, or looking at 'all' when everything else is hidden
  useEffect(() => {
    if (!isAdminMode) {
      const isCurrentHidden = activeCategory !== 'all' && hiddenCategories.includes(activeCategory);
      const standardCategories: Category[] = ['doces', 'salgadas', 'salgados', 'bolos', 'aniversario', 'potes'];
      const allStandardHidden = standardCategories.every(c => hiddenCategories.includes(c));

      if (isCurrentHidden || (activeCategory === 'all' && allStandardHidden)) {
        if (!hiddenCategories.includes('festival')) {
          setActiveCategory('festival');
        } else {
          setActiveCategory('all');
        }
      }
    }
  }, [isAdminMode, activeCategory, hiddenCategories]);

  // --- Landing page / Default active category logic ---
  // Sets 'festival' as default homepage if visible. If it is hidden, defaults to 'all'.
  const prevFestivalHiddenRef = useRef<boolean | null>(null);

  useEffect(() => {
    const isFestivalHidden = hiddenCategories.includes('festival');
    const defaultCategory = isFestivalHidden ? 'all' : 'festival';

    if (!hasInitializedDefaultCategory) {
      setActiveCategory(defaultCategory);
      setHasInitializedDefaultCategory(true);
      prevFestivalHiddenRef.current = isFestivalHidden;
    } else {
      // Monitor changes to the visibility of the festival
      if (prevFestivalHiddenRef.current !== null && prevFestivalHiddenRef.current !== isFestivalHidden) {
        if (isFestivalHidden) {
          if (activeCategory === 'festival') {
            setActiveCategory('all');
          }
        } else {
          setActiveCategory('festival');
        }
        prevFestivalHiddenRef.current = isFestivalHidden;
      }
    }
  }, [hiddenCategories, hasInitializedDefaultCategory, activeCategory]);

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

  const loadAdminOrders = async () => {
    setIsLoadingAdminOrders(true);
    try {
      let dbOrders: any[] = [];
      if (isSupabaseConfigured) {
        const fetched = await dbFetchAllOrders();
        if (fetched) {
          dbOrders = fetched;
        }
      }

      // Also get from LocalStorage
      const localOrdersRaw = localStorage.getItem('bella_massa_orders') || '[]';
      let localOrders: any[] = [];
      try {
        localOrders = JSON.parse(localOrdersRaw);
      } catch (e) {
        console.error(e);
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
      mergedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAdminOrders(mergedList);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAdminOrders(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: any) => {
    const order = adminOrders.find(o => o.id === orderId);
    if (!order) return;

    if (isSupabaseConfigured && order.source === 'database') {
      await dbUpdateOrderStatus(orderId, status);
    }

    // Update LocalStorage
    const localOrdersRaw = localStorage.getItem('bella_massa_orders') || '[]';
    try {
      const localOrders = JSON.parse(localOrdersRaw);
      const updatedLocal = localOrders.map((o: any) => {
        if (o.id === orderId || o.orderNumber === orderId || (order.orderNumber && o.orderNumber === order.orderNumber)) {
          return { ...o, status };
        }
        return o;
      });
      localStorage.setItem('bella_massa_orders', JSON.stringify(updatedLocal));
    } catch (e) {
      console.error(e);
    }

    // Update state
    setAdminOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleClearAllOrders = async () => {
    if (!confirm('⚠️ Tem certeza de que deseja ZERAR todos os pedidos? Esta ação apagará permanentemente todos os registros do banco de dados e os locais.')) {
      return;
    }

    setIsLoadingAdminOrders(true);
    try {
      let success = true;
      if (isSupabaseConfigured) {
        success = await dbDeleteAllOrders();
      }

      // Clear LocalStorage
      localStorage.setItem('bella_massa_orders', '[]');

      if (success) {
        setAdminOrders([]);
      } else {
        alert('⚠️ Ocorreu um erro ao zerar pedidos no banco de dados, mas os registros locais foram limpos.');
        setAdminOrders([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAdminOrders(false);
    }
  };

  useEffect(() => {
    if (isAdminMode) {
      loadAdminOrders();
    }
  }, [isAdminMode]);

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

    // Filter out potes and aniversario from 'all' view since they use custom configurators
    if (activeCategory === 'all' && (p.category === 'potes' || p.category === 'aniversario')) {
      return false;
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
        onOpenCustomerArea={() => setIsCustomerAreaOpen(true)}
        onOpenManagerDashboard={() => setIsManagerDashboardOpen(true)}
        hiddenCategories={hiddenCategories}
      />

      {/* Main Content Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        
        {activeCategory === 'festival' ? (
          <FestivalDeFatias onAddToCart={handleAddToCart} isAdminMode={isAdminMode} />
        ) : activeCategory === 'aniversario' ? (
          <BirthdayCakeConfigurator onAddToCart={handleAddToCart} isAdminMode={isAdminMode} />
        ) : activeCategory === 'potes' ? (
          <PoteConfigurator onAddToCart={handleAddToCart} isAdminMode={isAdminMode} />
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
              src="/assets/images/lemon_meringue_tart_1782777880427.jpg"
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
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 flex-wrap justify-end">
                  <button
                    id="btn-toggle-admin-orders"
                    onClick={() => {
                      setShowAdminOrdersPanel(!showAdminOrdersPanel);
                      if (!showAdminOrdersPanel) {
                        loadAdminOrders();
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-bold ${
                      showAdminOrdersPanel
                        ? 'bg-bento-dark text-white border-bento-dark'
                        : 'border-bento-amber/30 bg-white hover:bg-[#FEF3C7]/40 text-bento-amber-dark'
                    }`}
                  >
                    📦 Ver Pedidos ({adminOrders.length})
                  </button>

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

              {/* Admin Orders Section */}
              {showAdminOrdersPanel && (
                <div className="border-t border-bento-amber/20 pt-4 mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-bento-amber-dark flex items-center gap-1.5">
                      📦 Registro de Encomendas Recebidas ({adminOrders.length})
                    </h4>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={loadAdminOrders}
                        disabled={isLoadingAdminOrders}
                        className="text-[10px] font-black uppercase text-bento-amber hover:text-bento-amber-dark flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingAdminOrders ? 'animate-spin' : ''}`} />
                        Sincronizar Pedidos
                      </button>

                      {adminOrders.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllOrders}
                          disabled={isLoadingAdminOrders}
                          className="text-[10px] font-black uppercase text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer border border-rose-200 bg-rose-50/50 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors font-sans"
                        >
                          Zerar Pedidos
                        </button>
                      )}
                    </div>
                  </div>

                  {isLoadingAdminOrders ? (
                    <div className="py-6 flex items-center justify-center gap-2 text-xs font-bold text-bento-amber-dark/60">
                      <RefreshCw className="w-4 h-4 animate-spin text-bento-amber" />
                      Buscando encomendas...
                    </div>
                  ) : adminOrders.length === 0 ? (
                    <p className="text-[11px] text-[#78350F] font-medium bg-white/50 p-4 rounded-xl border border-amber-200 text-center">
                      Nenhuma encomenda registrada ainda. Os novos pedidos feitos pelos clientes aparecerão aqui em tempo real!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-1">
                      {adminOrders.map((order) => {
                        // Helper to extract order number from observation string
                        const match = order.observation?.match(/\[#(\d+)\]/);
                        const orderNum = order.orderNumber || (match ? match[1] : 'S/N');
                        
                        const dateFormatted = new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        });

                        return (
                          <div key={order.id} className="bg-white border border-[#E7E5E4] rounded-2xl p-4.5 space-y-3.5 shadow-xs">
                            <div className="flex items-start justify-between border-b pb-2.5">
                              <div>
                                <h5 className="font-extrabold text-xs text-[#1C1917] font-serif">
                                  Pedido #{orderNum} - {order.customerName}
                                </h5>
                                <div className="text-[9px] text-[#1C1917]/50 font-bold mt-0.5">
                                  {dateFormatted} | <span className="uppercase text-bento-amber-dark font-mono text-[8px] bg-amber-50 px-1 rounded">{order.source}</span>
                                </div>
                              </div>

                              <select
                                value={order.status || 'pending'}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                className={`text-[10px] font-extrabold rounded-lg px-2 py-1 border cursor-pointer focus:outline-none ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : order.status === 'preparing'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : order.status === 'cancelled'
                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                <option value="pending">⏳ Pendente</option>
                                <option value="preparing">🍰 Preparando</option>
                                <option value="delivered">✅ Entregue</option>
                                <option value="cancelled">❌ Cancelado</option>
                              </select>
                            </div>

                            {/* Contact & delivery */}
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-[#1C1917]/70 font-semibold">
                              <div>
                                <span className="text-[8px] font-black text-[#1C1917]/40 uppercase tracking-widest block mb-0.5">Contato Cliente</span>
                                <a
                                  href={`https://api.whatsapp.com/send?phone=55${order.customerPhone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-600 hover:underline flex items-center gap-0.5"
                                >
                                  💬 {order.customerPhone}
                                </a>
                              </div>
                              <div>
                                <span className="text-[8px] font-black text-[#1C1917]/40 uppercase tracking-widest block mb-0.5">Forma Recebimento</span>
                                <span className="truncate block text-[#1C1917]">
                                  {order.deliveryMethod === 'delivery' ? `Entrega: ${order.address?.info || ''}` : 'Retirar no Balcão'}
                                </span>
                              </div>
                            </div>

                            {/* Items list */}
                            <div>
                              <span className="text-[8px] font-black text-[#1C1917]/40 uppercase tracking-widest block mb-1">Itens do Pedido</span>
                              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border text-[10px] space-y-1.5">
                                {order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between font-bold text-stone-700">
                                    <span>{item.quantity}x {item.product_name || item.product?.name}</span>
                                    {item.selected_size && <span className="text-[9px] text-stone-500 font-sans">({item.selected_size.name})</span>}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-[10px] font-bold text-[#1C1917]/50 uppercase">Forma Pagamento: <strong className="text-[#1C1917] uppercase">{order.paymentMethod || 'Pix'}</strong></span>
                              <span className="text-xs font-black text-stone-900 font-mono">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

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
                    { id: 'festival', label: '⭐ Festival de Fatias' },
                    { id: 'doces', label: '🍰 Tortas Doces' },
                    { id: 'salgadas', label: '🥧 Tortas Salgadas' },
                    { id: 'salgados', label: '🥪 Salgados' },
                    { id: 'bolos', label: '🎂 Bolos Especiais' },
                    { id: 'aniversario', label: '🎈 Bolos de Aniversário' },
                    { id: 'potes', label: '🫙 Delícias no Pote' },
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
                ? 'Tortas Doces Assadas'
                : activeCategory === 'salgadas'
                ? 'Tortas Salgadas Assadas'
                : activeCategory === 'salgados'
                ? 'Salgados Artesanais'
                : activeCategory === 'bolos'
                ? 'Bolos de Festa & Fofinhos'
                : 'Delícias no Pote'}
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
                <p className="text-[11px] text-stone-500 mt-1.5 font-sans">📍 Rua Capitão Francisco Lima, 814, Centro - Nepomuceno/MG</p>
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
            <p>© {new Date().getFullYear()} Amiel Gâteaux. Todos os direitos reservados. Feito com muito amor em Nepomuceno/MG.</p>
            <p className="font-mono bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-[10px]">
              Vendas via WhatsApp • 100% Responsivo
            </p>
          </div>
        </div>
      </footer>

      {/* Customer Area Panel */}
      <CustomerArea
        isOpen={isCustomerAreaOpen}
        onClose={() => setIsCustomerAreaOpen(false)}
      />

      {/* Manager Orders Dashboard */}
      <ManagerDashboard
        isOpen={isManagerDashboardOpen}
        onClose={() => setIsManagerDashboardOpen(false)}
        isAdminMode={isAdminMode}
      />

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
        onLoginSuccess={() => {
          setIsAdminMode(true);
          setIsManagerDashboardOpen(true);
        }}
      />

    </div>
  );
}
