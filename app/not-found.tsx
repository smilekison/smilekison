import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell grid min-h-[100svh] place-items-center py-24">
      <div>
        <p className="type-data text-signal">404</p>
        <h1 className="type-section mt-5 max-w-[16ch]">This route does not resolve.</h1>
        <p className="measure type-body mt-5 text-dim">
          The page you asked for is not here. The rest of the site is.
        </p>
        <Link
          href="/"
          className="group mt-9 inline-flex min-h-12 items-center gap-2.5 bg-signal px-6 font-medium text-ink"
        >
          Back to the start
          <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </main>
  );
}
