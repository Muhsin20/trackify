import Spinner from "./Spinner";

export default function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="rounded-xl bg-white p-6 shadow-lg flex flex-col items-center">
        <Spinner />
        <p className="mt-3 text-sm text-gray-700">Loading...</p>
      </div>
    </div>
  );
}