// app/nasa-diagnostics/page.tsx
import { runNasaDiagnostics } from '../../actions/nasa-diagnostics';

export default async function NasaDiagnosticsPage() {
  const diagnostics = await runNasaDiagnostics();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NASA API Diagnostics</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Curiosity Rover</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(diagnostics.curiosity, null, 2)}
        </pre>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold">Perseverance Rover</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(diagnostics.perseverance, null, 2)}
        </pre>
      </section>
    </div>
  );
}