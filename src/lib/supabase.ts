import { createClient } from '@supabase/supabase-js';
import { Product, Category } from '../types';

// Read credentials from Vite environment variables safely
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid non-empty strings
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('YOUR_') &&
  !supabaseAnonKey.includes('YOUR_')
);

// Gracefully initialize Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Track if there is a missing table or general schema error in Supabase
export let hasSupabaseSchemaError = false;
export let lastSupabaseError: string | null = null;

// Allow listening/notifying UI of schema error changes
let schemaErrorListeners: ((hasError: boolean, errorMsg: string | null) => void)[] = [];

export function subscribeToSupabaseErrors(listener: (hasError: boolean, errorMsg: string | null) => void) {
  schemaErrorListeners.push(listener);
  // Initial call
  listener(hasSupabaseSchemaError, lastSupabaseError);
  return () => {
    schemaErrorListeners = schemaErrorListeners.filter(l => l !== listener);
  };
}

function triggerErrorChange(hasError: boolean, message: string) {
  hasSupabaseSchemaError = hasError;
  lastSupabaseError = message;
  schemaErrorListeners.forEach(listener => listener(hasError, message));
}

// Helpers to map database structure (snake_case) to application types (camelCase)
function mapProductFromDb(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category as Category,
    price: Number(dbProduct.price),
    ingredients: dbProduct.ingredients || [],
    imageUrl: dbProduct.image_url,
    description: dbProduct.description || '',
    sizes: dbProduct.sizes || [],
    hidden: Boolean(dbProduct.hidden)
  };
}

function mapProductToDb(product: Product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    ingredients: product.ingredients,
    image_url: product.imageUrl,
    description: product.description || '',
    sizes: product.sizes || [],
    hidden: Boolean(product.hidden)
  };
}

// --- DB Operations with Local Fallbacks ---

/**
 * Fetch all products from Supabase
 */
export async function dbFetchProducts(): Promise<Product[] | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('⚠️ Supabase não configurado. Usando armazenamento local.');
    return null;
  }

  // If we already know there's a schema error, skip and fallback immediately
  if (hasSupabaseSchemaError) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Erro ao buscar produtos do Supabase:', error);
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
        triggerErrorChange(true, `Tabela 'products' não encontrada. Execute as queries SQL em supabase_schema.sql no painel do Supabase.`);
      } else {
        triggerErrorChange(false, error.message);
      }
      return null;
    }

    return (data || []).map(mapProductFromDb);
  } catch (error: any) {
    console.warn('Falha de rede ao se comunicar com o Supabase:', error);
    triggerErrorChange(false, error?.message || 'Erro de rede desconectado');
    return null;
  }
}

/**
 * Save or update a product in Supabase
 */
export async function dbSaveProduct(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || hasSupabaseSchemaError) return false;

  try {
    const dbPayload = mapProductToDb(product);
    const { error } = await supabase
      .from('products')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      console.warn('Erro ao salvar produto no Supabase:', error);
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
        triggerErrorChange(true, `Tabela 'products' não encontrada. Execute as queries SQL em supabase_schema.sql no painel do Supabase.`);
      }
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erro de conexão ao salvar produto:', error);
    return false;
  }
}

/**
 * Delete a product from Supabase
 */
export async function dbDeleteProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || hasSupabaseSchemaError) return false;

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Erro ao deletar produto do Supabase:', error);
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
        triggerErrorChange(true, `Tabela 'products' não encontrada. Execute as queries SQL em supabase_schema.sql no painel do Supabase.`);
      }
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erro de conexão ao deletar produto:', error);
    return false;
  }
}

/**
 * Fetch list of hidden categories
 */
export async function dbFetchHiddenCategories(): Promise<Category[] | null> {
  if (!isSupabaseConfigured || !supabase || hasSupabaseSchemaError) return null;

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'hidden_categories')
      .single();

    if (error) {
      // If table row doesn't exist yet, return empty list
      if (error.code === 'PGRST116') {
        return [];
      }
      console.warn('Erro ao buscar configurações do Supabase:', error);
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
        triggerErrorChange(true, `Tabela 'settings' não encontrada. Execute as queries SQL em supabase_schema.sql no painel do Supabase.`);
      }
      return null;
    }

    return data?.value || [];
  } catch (error) {
    console.warn('Erro de conexão ao buscar configurações:', error);
    return null;
  }
}

/**
 * Save hidden categories to Supabase settings
 */
export async function dbSaveHiddenCategories(categories: Category[]): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || hasSupabaseSchemaError) return false;

  try {
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'hidden_categories',
        value: categories,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.warn('Erro ao salvar configurações no Supabase:', error);
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
        triggerErrorChange(true, `Tabela 'settings' não encontrada. Execute as queries SQL em supabase_schema.sql no painel do Supabase.`);
      }
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erro de conexão ao salvar configurações:', error);
    return false;
  }
}

/**
 * Submit order (Optional feature, logs orders to database)
 */
export async function dbSubmitOrder(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: string;
  address: any;
  paymentMethod: string;
  items: any[];
  total: number;
  observation?: string;
}): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase || hasSupabaseSchemaError) return null;

  try {
    // We prepend the [#orderNumber] tag to observation to keep it schema-safe 
    // while also supporting database-driven storage
    const formattedObservation = `[#${order.orderNumber}] ${order.observation || ''}`.trim();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        delivery_method: order.deliveryMethod,
        address: order.address,
        payment_method: order.paymentMethod,
        items: order.items,
        total: order.total,
        observation: formattedObservation
      })
      .select('id')
      .single();

    if (error) {
      console.warn('Erro ao enviar pedido para o Supabase:', error);
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
        triggerErrorChange(true, `Tabela 'orders' não encontrada. Execute as queries SQL em supabase_schema.sql no painel do Supabase.`);
      }
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.warn('Erro de conexão ao registrar pedido:', error);
    return null;
  }
}

/**
 * Fetch orders by customer phone number from Supabase
 */
export async function dbFetchOrdersByPhone(phone: string): Promise<any[] | null> {
  if (!isSupabaseConfigured || !supabase || hasSupabaseSchemaError) return null;

  try {
    const sanitizedPhone = phone.replace(/\D/g, '');
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', sanitizedPhone)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erro ao buscar pedidos do Supabase por telefone:', error);
      return null;
    }

    return data || [];
  } catch (error) {
    console.warn('Erro de conexão ao buscar pedidos por telefone:', error);
    return null;
  }
}

/**
 * Fetch all orders from Supabase (for Admin mode)
 */
export async function dbFetchAllOrders(): Promise<any[] | null> {
  if (!isSupabaseConfigured || !supabase || hasSupabaseSchemaError) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erro ao buscar todos os pedidos do Supabase:', error);
      return null;
    }

    return data || [];
  } catch (error) {
    console.warn('Erro de conexão ao buscar todos os pedidos:', error);
    return null;
  }
}

/**
 * Update order status in Supabase
 */
export async function dbUpdateOrderStatus(orderId: string, status: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || hasSupabaseSchemaError) return false;

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.warn('Erro ao atualizar status do pedido no Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Erro de conexão ao atualizar status do pedido:', error);
    return false;
  }
}

/**
 * Delete all orders from Supabase
 */
export async function dbDeleteAllOrders(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || hasSupabaseSchemaError) return false;

  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .gte('total', 0); // Delete all orders where total >= 0

    if (error) {
      console.warn('Erro ao deletar todos os pedidos do Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Erro de conexão ao deletar todos os pedidos:', error);
    return false;
  }
}

