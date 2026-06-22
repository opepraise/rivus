import type { Metadata } from 'next';
import { NavBar } from '../components';
import { DashboardWrapper } from './components/DashboardWrapper';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Open streams, withdraw earnings, and manage your Rivus payment flows.',
};

export default function DashboardPage() {
  return (
    <>
      <NavBar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <DashboardWrapper />
      </main>
    </>
  );
}
