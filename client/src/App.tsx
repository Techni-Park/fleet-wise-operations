
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import CreateVehicle from "./pages/CreateVehicle";
import EditVehicle from "./pages/EditVehicle";
import Interventions from "./pages/Interventions";
import InterventionDetails from "./pages/InterventionDetails";
import EditIntervention from "./pages/EditIntervention";
import Planning from "./pages/Planning";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import DatabaseTest from "./pages/DatabaseTest";
import RealData from "./pages/RealData";
import MySQLDashboard from "./pages/MySQLDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/create" element={<CreateVehicle />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/vehicles/:id/edit" element={<EditVehicle />} />
          <Route path="/interventions" element={<Interventions />} />
          <Route path="/interventions/:id" element={<InterventionDetails />} />
          <Route path="/interventions/:id/edit" element={<EditIntervention />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/db-test" element={<DatabaseTest />} />
          <Route path="/real-data" element={<RealData />} />
          <Route path="/mysql" element={<MySQLDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
