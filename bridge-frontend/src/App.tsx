import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import Landing from "./pages/landing";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import { AnalyticsPage, ConverterPage, ReconciliationPage } from "./pages";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5000,
    },
  },
});

function AppContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
              <Route path="/dashboard/analytics/volume" element={<AnalyticsPage />} />
              <Route path="/dashboard/analytics/performance" element={<AnalyticsPage />} />
              <Route path="/dashboard/converter" element={<ConverterPage />} />
              <Route path="/dashboard/reconciliation" element={<ReconciliationPage />} />
              <Route path="/dashboard/history" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export function App() {
  return <AppContent />;
}

export default App;
