import {
  SkipToContent,
  NavBar,
  AuditBanner,
  Hero,
  ParamsGrid,
  UseCases,
  Lifecycle,
  Contracts,
  Security,
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
        <UseCases />
        <Lifecycle />
        <Contracts />
        <Security />
      </main>
      <footer className="max-w-5xl mx-auto px-6">
        <Footer />
      </footer>
    </>
  );
}
