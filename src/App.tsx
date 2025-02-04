import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Companies from "./pages/Companies";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import MainLayout from "./components/layout/MainLayout";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </MainLayout>
    </Suspense>
  );
}

export default App;
