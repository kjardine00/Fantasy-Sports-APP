
import AuthStatus from './components/AuthStatus'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Fantasy Sports App</h1>
      <AuthStatus />
    </main>
  );
}
