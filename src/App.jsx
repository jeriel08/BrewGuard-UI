import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/sonner"; // Assuming you use Sonner for toasts
import AppRoutes from "@/routes/AppRoutes";
import { ThemeProvider } from "@/components/theme-provider";
import NavigationProgress from "@/components/common/NavigationProgress";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>
          <NavigationProgress />
          <AuthProvider>
            {/* The Router handles all the page logic now */}
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
