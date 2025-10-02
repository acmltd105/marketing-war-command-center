
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
 codex/define-lead-processing-and-marketing-workflow
import GoToMarketPipeline from "./pages/GoToMarketPipeline";
=======
import { SkinProvider } from "./hooks/useSkin";
 main

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
codex/define-lead-processing-and-marketing-workflow
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
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
=======
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
              <Route path="workflows" element={<WorkflowManager />} />
              <Route path="dnc-upload" element={<DncUpload />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SkinProvider>
main
  </QueryClientProvider>
);

export default App;
