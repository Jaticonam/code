export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-pink-300">Integrations</p>
        <h1 className="mt-2 text-3xl font-black md:text-5xl">Centro de Integraciones</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Conectores, feeds, estados y distribución comercial hacia canales externos.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <article className="rounded-3xl border border-emerald-400/20 bg-white/10 p-6">
            <h2 className="text-xl font-black">Meta Commerce</h2>
            <p className="mt-2 text-sm text-slate-300">Facebook Shop · Instagram Shopping · WhatsApp Catálogo</p>
            <a href="/api/exports/meta.csv" target="_blank" className="mt-5 inline-block rounded-full bg-pink-500 px-5 py-2 text-sm font-bold hover:bg-pink-400">Ver feed</a>
          </article>

          {["Google Merchant", "Pinterest", "Mercado Libre"].map((name) => (
            <article key={name} className="rounded-3xl border border-white/10 bg-white/5 p-6 opacity-70">
              <h2 className="text-xl font-black">{name}</h2>
              <p className="mt-2 text-sm text-slate-400">Próximo conector</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
