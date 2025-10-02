import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { SkinProvider } from "./hooks/useSkin";
import Campaigns from "./pages/Campaigns";
import ClientPreviewShowcase from "./pages/ClientPreviewShowcase";
import CreateCampaign from "./pages/CreateCampaign";
import DncUpload from "./pages/DncUpload";
import FinancialsPage from "./pages/Financials";
import FlexManagement from "./pages/FlexManagement";
import GoToMarketPipeline from "./pages/GoToMarketPipeline";
import Index from "./pages/Index";
import JourneyBuilder from "./pages/JourneyBuilder";
import LeadIntelligence from "./pages/LeadIntelligence";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";
import TemplateGallery from "./pages/TemplateGallery";
import WebDevelopment from "./pages/WebDevelopment";
import WorkflowManager from "./pages/WorkflowManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SkinProvider>
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
              <Route path="war-map" element={<GoToMarketPipeline />} />
              <Route path="workflows" element={<WorkflowManager />} />
              <Route path="leads" element={<LeadIntelligence />} />
              <Route path="web-dev" element={<WebDevelopment />} />
              <Route path="dnc-upload" element={<DncUpload />} />
              <Route path="templates" element={<TemplateGallery />} />
              <Route path="client-previews" element={<ClientPreviewShowcase />} />
              <Route path="financials" element={<FinancialsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SkinProvider>
  </QueryClientProvider>
);

export default App;
