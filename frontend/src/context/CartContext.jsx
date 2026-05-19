import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "bn_cart_v1";
const VEHICLE_KEY = "bn_vehicle_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [vehicle, setVehicle] = useState(() => {
    try {
      const raw = localStorage.getItem(VEHICLE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    if (vehicle) localStorage.setItem(VEHICLE_KEY, JSON.stringify(vehicle));
    else localStorage.removeItem(VEHICLE_KEY);
  }, [vehicle]);

  const add = (part, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.ref === part.ref);
      if (existing) {
        return prev.map((p) =>
          p.ref === part.ref ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { ...part, quantity: qty }];
    });
  };

  const updateQty = (ref, qty) => {
    if (qty <= 0) return remove(ref);
    setItems((prev) => prev.map((p) => (p.ref === ref ? { ...p, quantity: qty } : p)));
  };

  const remove = (ref) => setItems((prev) => prev.filter((p) => p.ref !== ref));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((s, p) => s + p.quantity, 0), [items]);
  const total = useMemo(
    () => items.reduce((s, p) => s + p.price_tnd * p.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, add, updateQty, remove, clear, count, total, vehicle, setVehicle }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
