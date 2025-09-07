import Spinner from "./Spinner";

export default function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <Spinner />
        <p className="mt-3 text-sm text-gray-700">Loading...</p>
      </div>
    </div>
  );
}
