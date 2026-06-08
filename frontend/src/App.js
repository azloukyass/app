import "@/App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import SplashScreen from "@/components/SplashScreen";

import LandingPage from "@/pages/LandingPage";
import VinSearch from "@/pages/VinSearch";
import VehicleDetail from "@/pages/VehicleDetail";
import PartsCategory from "@/pages/PartsCategory";
import PartsList from "@/pages/PartsList";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Account from "@/pages/Account";
import AdminDashboard from "@/pages/AdminDashboard";
import PartsouqCatalog from "@/pages/PartsouqCatalog";
import BrandModels from "@/pages/BrandModels";
import SearchResults from "@/pages/SearchResults";
import Contact from "@/pages/Contact";
import Impressum from "@/pages/Impressum";
import NotFound from "@/pages/NotFound";

function Layout({ children }) {
  return (
    <div className="App min-h-screen flex flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-1 bg-white text-slate-900">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash only on first load per browser session
    try {
      return !sessionStorage.getItem("bn_splash_done");
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!showSplash) return;
    try {
      sessionStorage.setItem("bn_splash_done", "1");
    } catch {}
  }, [showSplash]);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          {showSplash && <SplashScreen onDone={() => setShowSplash(false)} duration={4500} />}
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/recherche-vin" element={<VinSearch />} />
              <Route path="/vehicule/:vin" element={<VehicleDetail />} />
              <Route path="/vehicule/:vin/catalogue-oem" element={<PartsouqCatalog />} />
              <Route path="/marque/:brand" element={<BrandModels />} />
              <Route path="/catalogue/:section" element={<PartsCategory />} />
              <Route path="/catalogue/:section/:category" element={<PartsList />} />
              <Route path="/recherche" element={<SearchResults />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/panier" element={<Cart />} />
              <Route
                path="/commande"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/commande/confirmation/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />
              <Route path="/connexion" element={<Login />} />
              <Route path="/inscription" element={<Register />} />
              <Route
                path="/compte"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
