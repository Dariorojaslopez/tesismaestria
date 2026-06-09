"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import type { PublicUser } from "@/services/auth/types";
import type { CartItemView } from "@/services/repositories/cartRepository";

type AuthMode = "login" | "register";

type AppStoreContextValue = {
  user: PublicUser | null;
  cartItems: CartItemView[];
  cartCount: number;
  cartOpen: boolean;
  authOpen: boolean;
  authMode: AuthMode;
  changePasswordOpen: boolean;
  loading: boolean;
  openCart: () => void;
  closeCart: () => void;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  openChangePassword: () => void;
  closeChangePassword: () => void;
  addToCart: (treatmentId: string, treatmentName?: string) => Promise<boolean>;
  removeFromCart: (treatmentId: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore debe usarse dentro de AppStoreProvider");
  return ctx;
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [cartItems, setCartItems] = useState<CartItemView[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotalInCents, setCartTotalInCents] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingTreatmentId, setPendingTreatmentId] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    const res = await fetch("/api/cart", { credentials: "include" });
    if (!res.ok) {
      setCartItems([]);
      setCartCount(0);
      setCartTotalInCents(0);
      return;
    }
    const data = (await res.json()) as {
      items: CartItemView[];
      count: number;
      totalInCents: number;
    };
    setCartItems(data.items ?? []);
    setCartCount(data.count ?? 0);
    setCartTotalInCents(data.totalInCents ?? 0);
  }, []);

  const refreshSession = useCallback(async () => {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    const data = (await res.json()) as { user: PublicUser | null };
    setUser(data.user ?? null);
    if (data.user) {
      await refreshCart();
    } else {
      setCartItems([]);
      setCartCount(0);
      setCartTotalInCents(0);
    }
  }, [refreshCart]);

  useEffect(() => {
    void (async () => {
      await refreshSession();
      setLoading(false);
    })();
  }, [refreshSession]);

  const addToCart = useCallback(
    async (treatmentId: string) => {
      if (!user) {
        setPendingTreatmentId(treatmentId);
        setAuthMode("login");
        setAuthOpen(true);
        return false;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treatmentId }),
      });

      if (res.status === 401) {
        setUser(null);
        setPendingTreatmentId(treatmentId);
        setAuthMode("login");
        setAuthOpen(true);
        return false;
      }

      if (!res.ok) return false;

      const data = (await res.json()) as {
        items: CartItemView[];
        count: number;
        totalInCents: number;
      };
      setCartItems(data.items ?? []);
      setCartCount(data.count ?? 0);
      setCartTotalInCents(data.totalInCents ?? 0);
      setCartOpen(true);
      return true;
    },
    [user],
  );

  const removeFromCart = useCallback(async (treatmentId: string) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ treatmentId }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as {
      items: CartItemView[];
      count: number;
      totalInCents: number;
    };
    setCartItems(data.items ?? []);
    setCartCount(data.count ?? 0);
    setCartTotalInCents(data.totalInCents ?? 0);
  }, []);

  const updateCartQuantity = useCallback(
    async (treatmentId: string, action: "increment" | "decrement") => {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treatmentId, action }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as {
        items: CartItemView[];
        count: number;
        totalInCents: number;
      };
      setCartItems(data.items ?? []);
      setCartCount(data.count ?? 0);
      setCartTotalInCents(data.totalInCents ?? 0);
    },
    [],
  );

  const proceedToCheckout = useCallback(async () => {
    const res = await fetch("/api/checkout/wompi", {
      method: "POST",
      credentials: "include",
    });
    const data = (await res.json()) as {
      checkoutUrl?: string;
      error?: string;
    };
    if (!res.ok || !data.checkoutUrl) {
      window.alert(data.error ?? "No se pudo iniciar el pago. Intenta de nuevo.");
      return;
    }
    window.location.href = data.checkoutUrl;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setCartItems([]);
    setCartCount(0);
    setCartTotalInCents(0);
    setCartOpen(false);
  }, []);

  const handleAuthSuccess = useCallback(
    async (nextUser: PublicUser) => {
      setUser(nextUser);
      setAuthOpen(false);
      await refreshCart();
      if (pendingTreatmentId) {
        const id = pendingTreatmentId;
        setPendingTreatmentId(null);
        const res = await fetch("/api/cart", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ treatmentId: id }),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            items: CartItemView[];
            count: number;
            totalInCents: number;
          };
          setCartItems(data.items ?? []);
          setCartCount(data.count ?? 0);
          setCartTotalInCents(data.totalInCents ?? 0);
          setCartOpen(true);
        }
      }
    },
    [pendingTreatmentId, refreshCart],
  );

  const value = useMemo<AppStoreContextValue>(
    () => ({
      user,
      cartItems,
      cartCount,
      cartOpen,
      authOpen,
      authMode,
      changePasswordOpen,
      loading,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      openAuth: (mode = "login") => {
        setAuthMode(mode);
        setAuthOpen(true);
      },
      closeAuth: () => {
        setAuthOpen(false);
        setPendingTreatmentId(null);
      },
      openChangePassword: () => setChangePasswordOpen(true),
      closeChangePassword: () => setChangePasswordOpen(false),
      addToCart,
      removeFromCart,
      logout,
      refreshSession,
    }),
    [
      user,
      cartItems,
      cartCount,
      cartOpen,
      authOpen,
      authMode,
      changePasswordOpen,
      loading,
      addToCart,
      removeFromCart,
      logout,
      refreshSession,
    ],
  );

  return (
    <AppStoreContext.Provider value={value}>
      {children}
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={value.closeAuth}
        onModeChange={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
      <CartDrawer
        open={cartOpen}
        items={cartItems}
        totalInCents={cartTotalInCents}
        onClose={value.closeCart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
        onCheckout={proceedToCheckout}
      />
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={value.closeChangePassword}
      />
    </AppStoreContext.Provider>
  );
}
