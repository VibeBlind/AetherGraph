export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center text-white font-sans overflow-hidden">
      {/* Background Layer (z-0) */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-black bg-cover bg-center bg-no-repeat brightness-50"
          style={{
            //backgroundImage: "url('https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1600&q=80')"
            backgroundImage: "url('/athena.jpg')"
          }}
        />
      </div>

      {/* Overlay Layer (z-10) */}
      <div className="absolute inset-0 bg-black z-10 opacity-80" />

      {/* Foreground Content (z-20) */}
      <div className="relative z-20 text-center px-4 max-w-4xl space-y-8">
        <h1 className="text-8xl font-serif font-bold tracking-tight">
          <span className="text-yellow-500 golden-glow" >AETHER GRAPH</span>
        </h1>
        <p className="text-xl italic text-white/80">
          A living constellation of thought
        </p>
        <p className="text-md text-white/60">
          "I was having a hard time expressing my thoughts with words, so I'm going to make an tool to express the liminal space between concepts. It's difficult when people can't see the mosaic of little details and how they relate to the gestalt whole." - Seth George
        </p>
        <a
          href="https://github.com/VibeBlind/AetherGraph"
          className="inline-block px-6 py-3 mt-6 bg-yellow-500 hover:bg-yellow-600 golden-glow text-black font-semibold rounded-lg shadow transition"
        >
          Coming Soon
        </a>
      </div>
    </main>
  );
}