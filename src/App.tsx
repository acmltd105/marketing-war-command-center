import React, { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppAuthGate from "./components/AppAuthGate";
import Layout from "./components/Layout";
import OnboardingGate from "./components/OnboardingGate";
import { SkinProvider } from "./hooks/useSkin";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const Index = lazy(() => import("./pages/Index"));
const CompanyPage = lazy(() => import("./pages/CompanyPage"));
const CreateCampaign = lazy(() => import("./pages/CreateCampaign"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const FlexManagement = lazy(() => import("./pages/FlexManagement"));
const JourneyBuilder = lazy(() => import("./pages/JourneyBuilder"));
const GoToMarketPipeline = lazy(() => import("./pages/GoToMarketPipeline"));
const WorkflowManager = lazy(() => import("./pages/WorkflowManager"));
const LeadIntelligence = lazy(() => import("./pages/LeadIntelligence"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const PerformanceAnalyticsPage = lazy(() => import("./pages/PerformanceAnalyticsPage"));
const CommunicationAssetsPage = lazy(() => import("./pages/CommunicationAssetsPage"));
const WebDevelopment = lazy(() => import("./pages/WebDevelopment"));
const DncUpload = lazy(() => import("./pages/DncUpload"));
const TemplateGallery = lazy(() => import("./pages/TemplateGallery"));
const ClientPreviewShowcase = lazy(() => import("./pages/ClientPreviewShowcase"));
const FinancialsPage = lazy(() => import("./pages/Financials"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

const queryClient = new QueryClient();

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] flex-col gap-3 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-md" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SkinProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <OnboardingGate>
            <AppAuthGate>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="company" element={<CompanyPage />} />
                    <Route path="create" element={<CreateCampaign />} />
                    <Route path="campaigns" element={<Campaigns />} />
                    <Route path="flex" element={<FlexManagement />} />
                    <Route path="journeys" element={<JourneyBuilder />} />
                    <Route path="war-map" element={<GoToMarketPipeline />} />
                    <Route path="workflows" element={<WorkflowManager />} />
                    <Route path="leads" element={<LeadIntelligence />} />
                    <Route path="contacts" element={<ContactsPage />} />
                    <Route path="analytics" element={<PerformanceAnalyticsPage />} />
                    <Route path="numbers" element={<CommunicationAssetsPage />} />
                    <Route path="web-dev" element={<WebDevelopment />} />
                    <Route path="dnc-upload" element={<DncUpload />} />
                    <Route path="templates" element={<TemplateGallery />} />
                    <Route path="client-previews" element={<ClientPreviewShowcase />} />
                    <Route path="financials" element={<FinancialsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AppAuthGate>
          </OnboardingGate>
        </BrowserRouter>
      </TooltipProvider>
    </SkinProvider>
  </QueryClientProvider>
);

export default App;
