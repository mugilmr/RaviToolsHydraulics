"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/models/category";

type CategoryWithCount = Category & { productCount: number };

export function CategoryManager({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [mergeTarget, setMergeTarget] = useState<Record<string, string>>({});

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setError(null);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not create category.");
      return;
    }
    setNewName("");
    router.refresh();
  }

  function startEdit(cat: CategoryWithCount) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description ?? "");
  }

  async function saveEdit(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, description: editDescription }),
    });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(data.error ?? "Could not save changes.");
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function deleteCategory(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    setBusyId(id);
    setError(null);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(data.error ?? "Could not delete category.");
      return;
    }
    router.refresh();
  }

  async function mergeCategory(id: string, name: string) {
    const targetId = mergeTarget[id];
    if (!targetId) return;
    const target = categories.find((c) => c.id === targetId);
    if (!target) return;
    if (!confirm(`Move every product from "${name}" into "${target.name}" and delete "${name}"?`)) return;
    setBusyId(id);
    setError(null);
    const res = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mergeInto: targetId }),
    });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(data.error ?? "Could not merge categories.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={createCategory} className="card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="label" htmlFor="new-category">New category</label>
          <input
            id="new-category"
            className="input"
            placeholder="e.g. Submersible Pump Cables"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">+ Add category</button>
      </form>

      {error && <div className="mb-4 rounded-md bg-safety-50 p-3 text-sm text-safety-700">{error}</div>}

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className={`card p-4 ${busyId === cat.id ? "opacity-60" : ""}`}>
            {editingId === cat.id ? (
              <div className="space-y-2">
                <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                <textarea
                  className="input"
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Short description shown on the category page"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(cat.id)} className="btn-primary !px-3 !py-1.5 !text-xs">Save</button>
                  <button onClick={() => setEditingId(null)} className="btn-ghost !px-3 !py-1.5 !text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-charcoal-800">{cat.name}</p>
                  {cat.description && <p className="text-sm text-charcoal-500">{cat.description}</p>}
                  <p className="text-xs text-charcoal-400">{cat.productCount} products</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => startEdit(cat)} className="btn-ghost !px-3 !py-1.5 !text-xs">Rename</button>

                  {categories.length > 1 && (
                    <>
                      <select
                        className="input !w-auto !py-1.5 !text-xs"
                        value={mergeTarget[cat.id] ?? ""}
                        onChange={(e) => setMergeTarget((m) => ({ ...m, [cat.id]: e.target.value }))}
                      >
                        <option value="">Merge into…</option>
                        {categories.filter((c) => c.id !== cat.id).map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => mergeCategory(cat.id, cat.name)}
                        disabled={!mergeTarget[cat.id]}
                        className="btn-outline !px-3 !py-1.5 !text-xs"
                      >
                        Merge
                      </button>
                    </>
                  )}

                  <button onClick={() => deleteCategory(cat.id, cat.name)} className="btn-ghost !px-3 !py-1.5 !text-xs !text-safety-600">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
