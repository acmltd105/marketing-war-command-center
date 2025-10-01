
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import CreateCampaign from "./pages/CreateCampaign";
import SettingsPage from "./pages/SettingsPage";
import Campaigns from "./pages/Campaigns";
import FlexManagement from "./pages/FlexManagement";
import JourneyBuilder from "./pages/JourneyBuilder";
import WorkflowManager from "./pages/WorkflowManager";
import DncUpload from "./pages/DncUpload";
import NotFound from "./pages/NotFound";
import TemplateGallery from "./pages/TemplateGallery";
import ClientPreviewShowcase from "./pages/ClientPreviewShowcase";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="create" element={<CreateCampaign />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="flex" element={<FlexManagement />} />
            <Route path="journeys" element={<JourneyBuilder />} />
            <Route path="workflows" element={<WorkflowManager />} />
            <Route path="dnc-upload" element={<DncUpload />} />
            <Route path="templates" element={<TemplateGallery />} />
            <Route path="client-previews" element={<ClientPreviewShowcase />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
