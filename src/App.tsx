import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import FloatingDonateFab from "@/components/FloatingDonateFab";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Candidates from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import IndependentExpenditures from "./pages/IndependentExpenditures";
import TopDonors from "./pages/TopDonors";
import Polling from "./pages/Polling";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import BetaDashboard from "./pages/beta/Dashboard";
import BetaCandidates from "./pages/beta/Candidates";
import BetaCandidateDetail from "./pages/beta/CandidateDetail";
import BetaPolling from "./pages/beta/Polling";
import BetaTopDonors from "./pages/beta/TopDonors";
import BetaIe from "./pages/beta/Ie";
import BetaFaq from "./pages/beta/Faq";
import "./styles/beta.css";

const queryClient = new QueryClient();

function AppShell() {
  const location = useLocation();
  const isBeta = location.pathname.startsWith("/beta");

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).posthog?.capture) {
      (window as any).posthog.capture("$pageview", { $current_url: window.location.href });
    }
  }, [location.pathname, location.search]);

  return (
    <>
      {!isBeta && <Header />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/:slug" element={<CandidateDetail />} />
        <Route path="/independent-expenditures" element={<IndependentExpenditures />} />
        <Route path="/top-donors" element={<TopDonors />} />
        <Route path="/polling" element={<Polling />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/beta" element={<BetaDashboard />} />
        <Route path="/beta/candidates" element={<BetaCandidates />} />
        <Route path="/beta/candidates/:slug" element={<BetaCandidateDetail />} />
        <Route path="/beta/polling" element={<BetaPolling />} />
        <Route path="/beta/top-donors" element={<BetaTopDonors />} />
        <Route path="/beta/ie" element={<BetaIe />} />
        <Route path="/beta/faq" element={<BetaFaq />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isBeta && <Footer />}
      {!isBeta && <MobileTabBar />}
      {!isBeta && <div className="md:hidden h-14" aria-hidden />}
      {!isBeta && <FloatingDonateFab />}
    </>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
