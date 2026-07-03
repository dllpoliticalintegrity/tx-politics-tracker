import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Candidates from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import IndependentExpenditures from "./pages/IndependentExpenditures";
import TopDonors from "./pages/TopDonors";
import Polling from "./pages/Polling";
import Statewide from "./pages/Statewide";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppShell() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).posthog?.capture) {
      (window as any).posthog.capture("$pageview", { $current_url: window.location.href });
    }
  }, [location.pathname, location.search]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/:slug" element={<CandidateDetail />} />
        <Route path="/money" element={<Navigate to="/money/donors" replace />} />
        <Route path="/money/donors" element={<TopDonors />} />
        <Route path="/money/outside-spending" element={<IndependentExpenditures />} />
        <Route path="/polling" element={<Polling />} />
        <Route path="/statewide" element={<Statewide />} />
        <Route path="/about" element={<About />} />
        {/* Legacy routes */}
        <Route path="/top-donors" element={<Navigate to="/money/donors" replace />} />
        <Route
          path="/independent-expenditures"
          element={<Navigate to="/money/outside-spending" replace />}
        />
        <Route path="/faq" element={<Navigate to="/about" replace />} />
        <Route path="/beta/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <MobileTabBar />
      <div className="md:hidden h-14" aria-hidden />
    </>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
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
