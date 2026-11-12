export default function Loading() {
  return (
    <main
      className="container page"
      aria-busy="true"
      aria-label="Memuat TeamUp"
    >
      <div className="skeleton title-skeleton" />
      <div className="grid three">
        {[1, 2, 3].map((n) => (
          <div className="skeleton card-skeleton" key={n} />
        ))}
      </div>
      <p className="muted">Memuat TeamUp…</p>
    </main>
  );
}
