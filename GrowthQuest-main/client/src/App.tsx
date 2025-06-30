import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Map from "@/pages/map";
import Goals from "@/pages/goals";
import Journal from "@/pages/journal";
import Community from "@/pages/community";
import Progress from "@/pages/progress";
import Achievements from "@/pages/achievements";
import Settings from "@/pages/settings";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/map" component={Map} />
          <Route path="/goals" component={Goals} />
          <Route path="/journal" component={Journal} />
          <Route path="/community" component={Community} />
          <Route path="/progress" component={Progress} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/settings" component={Settings} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;
