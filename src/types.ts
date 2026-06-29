export type Category = 'doces' | 'salgadas' | 'bolos' | 'aniversario';

export interface ProductSize {
  id: string;
  name: string; // e.g., "Individual", "Fatia", "Inteira", "Família"
  price: number;
}

export interface CustomCakeConfig {
  size: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
  massa: string;
  recheios: string[];
  adicionais: string[];
  cobertura: string;
  cakeNameText?: string; // Nome a ser escrito no bolo
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  ingredients: string[];
  imageUrl: string;
  description?: string;
  sizes?: ProductSize[]; // Up to 3 sizes
  hidden?: boolean;
}

export interface CartItem {
  id: string; // Unique ID for each line item (to allow same product in different sizes/observations)
  product: Product;
  quantity: number;
  selectedSize?: ProductSize;
  observation?: string;
  customCakeConfig?: CustomCakeConfig;
}
