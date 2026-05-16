import {
  SkipToContent,
  NavBar,
  Hero,
  AuditBanner,
  ParamsGrid,
  HowItWorks,
  UseCases,
  Lifecycle,
  Architecture,
  Contracts,
  Security,
  TechStack,
  Roadmap,
  ContributeSection,
  FAQ,
  CTASection,
  OpenSourceBanner,
  BackToTop,
  Footer,
} from "./components";

export default function Home() {
  return (
    <>
      <SkipToContent />
      <NavBar />
      <main
        id="main-content"
        className="max-w-5xl mx-auto px-6 pb-24 space-y-24"
        tabIndex={-1}
      >
        <Hero />
        <AuditBanner />
        <ParamsGrid />
        <HowItWorks />
        <UseCases />
        <Lifecycle />
        <Architecture />
        <Contracts />
        <Security />
        <TechStack />
        <Roadmap />
        <ContributeSection />
        <FAQ />
        <CTASection />
        <OpenSourceBanner />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
