export function StrikeDisplay({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-black/20 px-6 py-4 text-2xl font-bold">
      <span>Strikes</span>
      <span>{count}</span>
    </div>
  );
}
