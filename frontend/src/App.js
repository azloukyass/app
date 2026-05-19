import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

import LandingPage from "@/pages/LandingPage";
import VinSearch from "@/pages/VinSearch";
import VehicleDetail from "@/pages/VehicleDetail";
import PartsCategory from "@/pages/PartsCategory";
import PartsList from "@/pages/PartsList";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Account from "@/pages/Account";
import AdminDashboard from "@/pages/AdminDashboard";
import SearchResults from "@/pages/SearchResults";
import NotFound from "@/pages/NotFound";

function Layout({ children }) {
  return (
    <div className="App min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/recherche-vin" element={<VinSearch />} />
              <Route path="/vehicule/:vin" element={<VehicleDetail />} />
              <Route path="/catalogue/:section" element={<PartsCategory />} />
              <Route path="/catalogue/:section/:category" element={<PartsList />} />
              <Route path="/recherche" element={<SearchResults />} />
              <Route path="/panier" element={<Cart />} />
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
