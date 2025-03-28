import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AboutPage from "@/pages/about-page";
import TermsPage from "@/pages/terms-page";
import PrivacyPage from "@/pages/privacy-page";
import PartnersPage from "@/pages/partners-page";
import { ProtectedRoute } from "./lib/protected-route";
import UserDashboard from "@/pages/user-dashboard";
import DriverDashboard from "@/pages/driver-dashboard";
import DriverRegistration from "@/pages/driver-register";
import DriverPlans from "@/pages/driver-plans";
import DriverDetail from "@/pages/driver-detail";
import FreightRequest from "@/pages/freight-request";
import Payment from "@/pages/payment";
import AdminDashboard from "@/pages/admin-dashboard";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/partners" component={PartnersPage} />
      <ProtectedRoute path="/dashboard" component={UserDashboard} />
      <ProtectedRoute path="/driver/dashboard" component={DriverDashboard} requiredRole="driver" />
      <ProtectedRoute path="/driver/register" component={DriverRegistration} />
      <ProtectedRoute path="/driver/plans" component={DriverPlans} />
      <ProtectedRoute path="/driver/:id" component={DriverDetail} />
      <ProtectedRoute path="/freight/request/:driverId" component={FreightRequest} />
      <ProtectedRoute path="/freight/payment/:freightId" component={Payment} />
      <ProtectedRoute path="/admin-dashboard" component={AdminDashboard} requiredRole="admin" />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
