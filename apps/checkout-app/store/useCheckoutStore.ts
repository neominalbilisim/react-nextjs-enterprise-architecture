import { create } from "zustand";

// MODÜL 6 · Checkout State Management with Zustand
// Bu store checkout flow'unun tüm state'ini yönetir

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutData {
  items: CartItem[];
  cardNumber: string;
  cardName: string;
  cvv: string;
  expiry: string;
}

interface CheckoutStore {
  // State
  items: CartItem[];
  cardNumber: string;
  cardName: string;
  cvv: string;
  expiry: string;
  
  // Actions - Cart
  addItem: (name: string, price?: number) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Actions - Payment
  setPaymentInfo: (data: { 
    cardNumber: string; 
    cardName: string; 
    cvv: string; 
    expiry: string;
  }) => void;
  
  // Actions - Reset
  reset: () => void;
}

// ID generator için counter (unique ID garantisi)
let idCounter = 0;
const generateId = () => {
  idCounter += 1;
  return `${Date.now()}-${idCounter}`;
};

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  // Initial state
  items: [],
  cardNumber: "",
  cardName: "",
  cvv: "",
  expiry: "",
  
  // Cart actions
  addItem: (name: string, price = 500) => {
    const items = get().items;
    const existingItem = items.find((item) => item.name === name);
    
    if (existingItem) {
      // Ürün zaten var, quantity artır
      set({
        items: items.map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      // Yeni ürün ekle - unique ID kullan
      set({
        items: [
          ...items,
          {
            id: generateId(),
            name,
            price,
            quantity: 1,
          },
        ],
      });
    }
  },
  
  removeItem: (id: string) => {
    set({
      items: get().items.filter((item) => item.id !== id),
    });
  },
  
  updateItemQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(id);
    } else {
      set({
        items: get().items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      });
    }
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  // Payment actions
  setPaymentInfo: (data) => {
    set({
      cardNumber: data.cardNumber,
      cardName: data.cardName,
      cvv: data.cvv,
      expiry: data.expiry,
    });
  },
  
  // Reset
  reset: () => {
    set({
      items: [],
      cardNumber: "",
      cardName: "",
      cvv: "",
      expiry: "",
    });
  },
}));

// Computed value selectors (derived from state)
export const selectTotal = (state: CheckoutStore) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectItemCount = (state: CheckoutStore) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
