export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-serif px-4">
      <section className="text-center space-y-6 max-w-xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gold drop-shadow-md">
          AetherGraph
        </h1>
        <p className="text-lg md:text-xl text-slate-300 italic">
          A living constellation of thought.
        </p>
        <p className="text-md md:text-lg text-slate-400">
          Visualize the genealogy of ideas. Annotate connections. Explore the web of meaning.
        </p>
        <div className="mt-8">
          <a
            href="https://github.com/VibeBlind/AetherGraph"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-gold text-black font-semibold rounded-lg shadow-md hover:shadow-xl transition duration-300"
          >
            View on GitHub
          </a>
        </div>
      </section>
    </main>
  );
}