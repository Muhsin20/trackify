export default function LoadingDots() {
  return (
    <span className="inline-flex items-end gap-1 h-4 align-middle" aria-label="Loading">
      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:300ms]" />
    </span>
  );
}
