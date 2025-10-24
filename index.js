export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-5xl font-bold tracking-tight text-gold">AetherGraph</h1>
        <p className="text-xl text-slate-300">
          Mapping Thought, One Connection at a Time
        </p>
        <p className="text-md text-slate-500 italic">
          A web of meaning. A lens on the lineage of ideas.
        </p>
        <div className="mt-8">
          <a
            href="https://github.com/VibeBlind/AetherGraph"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gold text-black font-semibold rounded-md shadow-md hover:shadow-xl transition"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
