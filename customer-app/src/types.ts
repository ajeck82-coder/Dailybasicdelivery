export interface Store {
  id: string;
  name: string;
  slug: string;
  category: 'RESTAURANT' | 'DARK_STORE' | 'GROCERY' | 'PHARMACY';
  description: string;
  logoUrl: string;
  coverUrl: string;
  phone: string;
  ward: string;
  street: string;
  lat: number;
  lng: number;
  rating: number;
  totalRatings: number;
  isOpen: boolean;
  prepTimeMinutes: number;
  minimumOrderAmount: number;
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  storeId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
  storeName: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  storeId: string;
  storeName: string;
  storePhone: string;
  storeWard: string;
  driverId?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  driverVehicle?: string | null;
  status: string;
  deliveryWard: string;
  deliveryStreet: string;
  deliveryBuilding?: string;
  deliveryLandmark?: string;
  deliveryLat: number;
  deliveryLng: number;
  subtotal: number;
  deliveryFee: number;
  platformCommission: number;
  paymentMethod: string;
  paymentStatus: string;
  specialNotes?: string;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    itemTotal: number;
  }[];
}
