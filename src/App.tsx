
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
import FinancialsPage from "./pages/Financials";
import NotFound from "./pages/NotFound";
codex/find-email-templates-for-dental-and-precare-coverage-bku57i
 codex/find-email-templates-for-dental-and-precare-coverage-bku57i
import TemplateGallery from "./pages/TemplateGallery";

=======
 codex/find-email-templates-for-dental-and-precare-coverage-dftp26
import TemplateGallery from "./pages/TemplateGallery";
import ClientPreviewShowcase from "./pages/ClientPreviewShowcase";
=======
 codex/set-up-dashboard-for-project-overview
import LeadIntelligence from "./pages/LeadIntelligence";
import WebDevelopment from "./pages/WebDevelopment";
=======
 codex/find-email-templates-for-dental-and-precare-coverage-cxc1oz
import TemplateGallery from "./pages/TemplateGallery";
=======
codex/add-skin-selector-for-color-theme
import { SkinProvider } from "./hooks/useSkin";
=======
 main
 codex/add-skin-selector-for-color-theme-on40yv
import { SkinProvider } from "./hooks/useSkin";

 codex/define-lead-processing-and-marketing-workflow
import GoToMarketPipeline from "./pages/GoToMarketPipeline";

import { SkinProvider } from "./hooks/useSkin";
 main
main
main
codex/find-email-templates-for-dental-and-precare-coverage-bku57i
=======
 main
 main
main
 main

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
codex/add-skin-selector-for-color-theme
=======
 codex/add-skin-selector-for-color-theme-on40yv
=======
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
codex/set-up-dashboard-for-project-overview
            <Route path="leads" element={<LeadIntelligence />} />
            <Route path="web-dev" element={<WebDevelopment />} />
=======
 codex/integrate-revenue-and-expense-tabs-qmhblg
            <Route path="dnc-upload" element={<DncUpload />} />
codex/find-email-templates-for-dental-and-precare-coverage-bku57i
 codex/find-email-templates-for-dental-and-precare-coverage-bku57i
            <Route path="templates" element={<TemplateGallery />} />

=======
 codex/find-email-templates-for-dental-and-precare-coverage-dftp26
            <Route path="templates" element={<TemplateGallery />} />
            <Route path="client-previews" element={<ClientPreviewShowcase />} />
=======
codex/find-email-templates-for-dental-and-precare-coverage-cxc1oz
            <Route path="templates" element={<TemplateGallery />} />
=======
main
            <Route path="financials" element={<FinancialsPage />} />
 codex/integrate-revenue-and-expense-tabs-ugnmqm

 main
main
codex/find-email-templates-for-dental-and-precare-coverage-bku57i
=======
main
 main
 main
 main
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
=======
main
main
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
codex/add-skin-selector-for-color-theme
=======
 codex/add-skin-selector-for-color-theme-on40yv

main
main
main
  </QueryClientProvider>
);

export default App;
