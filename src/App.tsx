
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";;
import { AuthProvider } from "./context/AuthContext";
import { AuthLayout } from "./components/AuthLayout";
import Main from "./pages/Main";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <div className="min-h-screen w-full">
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/signin" element={<SigninPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                </Route>

                {/* Protected routes with persistent layout */}
                <Route element={<AuthLayout protected withHeader />}>
                <Route path="/main" element={<Main />} />
                </Route>

                {/* Redirect route */}
                <Route path="/" element={<Index />} />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;