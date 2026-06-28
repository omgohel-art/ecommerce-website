interface SectionChapterProps {
  number: string;
  label: string;
  dark?: boolean;
}

export default function SectionChapter({
  number,
  label,
  dark = false,
}: SectionChapterProps) {
  return (
    <div
      className={`chapter-marker flex items-center gap-6 px-6 py-10 md:px-12 ${
        dark ? "bg-ink text-ivory/40" : "bg-ivory text-stone/60"
      }`}
      aria-hidden
    >
      <span
        className={`font-display text-sm tracking-[0.3em] ${
          dark ? "text-bronze-light" : "text-bronze"
        }`}
      >
        {number}
      </span>
      <span className="h-px flex-1 bg-current opacity-20" />
      <span className="text-[10px] tracking-[0.35em] uppercase">{label}</span>
      <span className="h-px w-12 bg-current opacity-20" />
    </div>
  );
}
