import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import CreateVehicle from "./pages/CreateVehicle";
import EditVehicle from "./pages/EditVehicle";
import Interventions from "./pages/Interventions";
import InterventionDetails from "./pages/InterventionDetails";
import EditIntervention from "./pages/EditIntervention";
import CreateIntervention from "./pages/CreateIntervention";
import Planning from "./pages/Planning";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import Settings from "./pages/Settings";
import DatabaseTest from "./pages/DatabaseTest";
import RealData from "./pages/RealData";
import MySQLDashboard from "./pages/MySQLDashboard";
import NotFound from "./pages/NotFound";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import CreateClient from "./pages/CreateClient";
import EditClient from "./pages/EditClient";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import CustomFieldsSettings from "./pages/CustomFieldsSettings";
import FormsSettings from "./pages/FormsSettings";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/test-db" element={<DatabaseTest />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
          <Route path="/vehicles/create" element={<ProtectedRoute><CreateVehicle /></ProtectedRoute>} />
          <Route path="/vehicles/:id" element={<ProtectedRoute><VehicleDetails /></ProtectedRoute>} />
          <Route path="/vehicles/:id/edit" element={<ProtectedRoute><EditVehicle /></ProtectedRoute>} />
          <Route path="/interventions" element={<ProtectedRoute><Interventions /></ProtectedRoute>} />
          <Route path="/interventions/create" element={<ProtectedRoute><CreateIntervention /></ProtectedRoute>} />
          <Route path="/interventions/:id" element={<ProtectedRoute><InterventionDetails /></ProtectedRoute>} />
          <Route path="/interventions/:id/edit" element={<ProtectedRoute><EditIntervention /></ProtectedRoute>} />
          <Route path="/planning" element={<ProtectedRoute><Planning /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/users/create" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          <Route path="/users/:id/edit" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/db-test" element={<ProtectedRoute><DatabaseTest /></ProtectedRoute>} />
          <Route path="/database-test" element={<ProtectedRoute><DatabaseTest /></ProtectedRoute>} />
          <Route path="/real-data" element={<ProtectedRoute><RealData /></ProtectedRoute>} />
          <Route path="/mysql" element={<ProtectedRoute><MySQLDashboard /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
          <Route path="/clients/create" element={<ProtectedRoute><CreateClient /></ProtectedRoute>} />
          <Route path="/clients/:id" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
          <Route path="/clients/:id/edit" element={<ProtectedRoute><EditClient /></ProtectedRoute>} />
          <Route path="/custom-fields" element={<ProtectedRoute><CustomFieldsSettings /></ProtectedRoute>} />
          <Route path="/settings/forms" element={<ProtectedRoute><FormsSettings /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
