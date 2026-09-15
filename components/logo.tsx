/** The site's mark — a monogram, not a photo, so it stays legible small (nav,
 *  favicon-scale) and distinct from the real profile photo used in the hero.
 *  A rounded square (vs. the hero avatar's circle) keeps the two roles
 *  visually separate: this is the brand, that's the person. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[0.6875rem] font-semibold text-white shadow-sm shadow-black/10"
      style={{
        width: size,
        height: size,
        backgroundImage: "var(--gradient-brand)",
        fontSize: size * 0.42,
      }}
      aria-hidden
    >
      SK
    </span>
  );
}
