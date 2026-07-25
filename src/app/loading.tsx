export default function HomeLoading() {
  return (
    <div className="container py-16">
      <div className="mb-10 flex flex-col items-center gap-4">
        <div className="h-6 w-64 animate-pulse rounded-full bg-surface" />
        <div className="h-12 w-96 max-w-full animate-pulse rounded-2xl bg-surface" />
        <div className="h-14 w-full max-w-xl animate-pulse rounded-2xl bg-surface" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-surface" />
        ))}
      </div>
    </div>
  );
}
