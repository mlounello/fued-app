export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-sm text-red-700">
      {message}
    </div>
  );
}
