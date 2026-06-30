import {
  SkipToContent,
  NavBar,
  AuditBanner,
  Hero,
  StatsBanner,
  ParamsGrid,
  HowItWorks,
  UseCases,
  Architecture,
  Lifecycle,
  Contracts,
  Security,
  TechStack,
  Roadmap,
  FAQ,
  CTASection,
  ContributeSection,
  OpenSourceBanner,
  BackToTop,
  Footer,
} from "./components";

const CONTRACT_OWNER = 'SP3TZAPPW443JF9F7K5T0MRKRJQGX2F9DMW0CRB4R';
const HIRO_API = 'https://api.mainnet.hiro.so';

async function fetchTotalStreams(): Promise<number | undefined> {
  try {
    const res = await fetch(
      `${HIRO_API}/v2/contracts/call-read/${CONTRACT_OWNER}/stream-registry/get-next-stream-id`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: CONTRACT_OWNER, arguments: [] }),
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return undefined;
    const data = await res.json();
    if (!data.okay || !data.result) return undefined;
    // result = "0x01" + 32 hex digits (uint128 big-endian)
    const hex = data.result.slice(4);
    return Number(BigInt('0x' + hex));
  } catch {
    return undefined;
  }
}

export default async function Home() {
  const totalStreams = await fetchTotalStreams();

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
        <StatsBanner totalStreams={totalStreams} />
        <AuditBanner />
        <ParamsGrid />
        <HowItWorks />
        <UseCases />
        <Architecture />
        <Lifecycle />
        <Contracts />
        <Security />
        <TechStack />
        <Roadmap />
        <FAQ />
        <CTASection />
        <ContributeSection />
        <OpenSourceBanner />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
