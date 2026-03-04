export default function Home() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 border border-cyan-400 rounded flex items-center justify-center">
          🛡
        </div>

        <h1 className="text-cyan-400 text-2xl tracking-widest font-bold">
          QUANTUM_MAIL
        </h1>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-3 gap-6">

        {/* CURRENT IDENTITY */}
        <div className="col-span-2 glass-panel p-6">

          <h2 className="text-gray-400 tracking-widest text-sm mb-3">
            CURRENT IDENTITY
          </h2>

          <div className="flex gap-4">
            <div className="qm-email-box flex-1 p-4 rounded-lg font-mono text-xl">
              g5g40ejw@cybermail.net
            </div>

            <button className="px-6 border border-cyan-400 rounded-lg text-cyan-400">
              COPY
            </button>
          </div>
        </div>

        {/* TIMER */}
        <div className="glass-panel p-6 text-center">

          <h2 className="text-gray-400 tracking-widest text-sm mb-4">
            TIME REMAINING
          </h2>

          <div className="text-purple-400 text-5xl font-bold mb-6">
            09:54
          </div>

          <div className="flex gap-4 justify-center">
            <button className="border border-purple-500 px-5 py-2 rounded-lg text-purple-400">
              PAUSE
            </button>

            <button className="border border-cyan-400 px-5 py-2 rounded-lg text-cyan-400">
              NEW
            </button>
          </div>
        </div>

        {/* INBOX */}
        <div className="col-span-2 glass-panel p-6">

          <div className="flex items-center gap-3 mb-4">

            <span>📥</span>

            <h2 className="tracking-widest text-cyan-400">
              SECURE_INBOX (0)
            </h2>

          </div>

          <div className="border-t border-gray-800 pt-12 text-center text-gray-400">
            AWAITING TRANSMISSIONS...
          </div>

        </div>

        {/* ARCHIVES (solo para replicar layout) */}
        <div className="glass-panel p-6">

          <h2 className="text-purple-400 tracking-widest mb-4">
            ARCHIVES
          </h2>

          <div className="text-gray-500 text-sm">
            previous identities
          </div>

        </div>

      </div>

    </div>
  );
}
