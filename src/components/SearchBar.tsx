"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "./icons";
import { formatINR } from "@/lib/format";

type Hit = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  categoryName: string;
  categorySlug: string;
};

export function SearchBar({ autoFocus = false, size = "md" }: { autoFocus?: boolean; size?: "md" | "lg" }) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setHits([]);
      return;
    }
    setLoading(true);
    const handle = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(query)}&limit=6`)
        .then((r) => r.json())
        .then((data) => setHits(data.products ?? []))
        .catch(() => setHits([]))
        .finally(() => setLoading(false));
    }, 220);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submitSearch} className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search bolts, pumps, fittings…"
          className={`input pl-9 ${size === "lg" ? "py-3 text-base" : ""}`}
          aria-label="Search products"
        />
      </form>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-96 overflow-auto rounded-md border border-charcoal-100 bg-white shadow-lg">
          {loading && <div className="p-3 text-sm text-charcoal-400">Searching…</div>}
          {!loading && hits.length === 0 && (
            <div className="p-3 text-sm text-charcoal-400">No products match &quot;{query}&quot; yet.</div>
          )}
          {!loading &&
            hits.map((hit) => (
              <Link
                key={hit.id}
                href={`/products/${hit.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-charcoal-50 p-2.5 last:border-0 hover:bg-steel-50"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded bg-charcoal-50">
                  {hit.imageUrl && (
                    <Image src={hit.imageUrl} alt="" fill sizes="44px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-charcoal-800">{hit.name}</div>
                  <div className="text-xs text-charcoal-400">{hit.categoryName}</div>
                </div>
                <div className="shrink-0 text-sm font-semibold text-steel-800">{formatINR(hit.price)}</div>
              </Link>
            ))}
          {!loading && hits.length > 0 && (
            <button
              onClick={submitSearch}
              className="block w-full p-2.5 text-center text-sm font-semibold text-safety-600 hover:bg-safety-50"
            >
              See all results for &quot;{query}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
