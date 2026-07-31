"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Inbox, X, Trash2, Loader2, Mail, Building2, Factory, MapPin,
  Calendar, Tag, MessageSquare, StickyNote, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type LeadRow = {
  id: string; name: string; company: string; email: string; industry: string;
  projectType: string; source: string; sourceRef?: string | null; status: string;
  createdAt: string; contactedAt?: string | null;
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_STYLE: Record<Status, string> = {
  new: "bg-slate-100 text-slate-700",
  contacted: "bg-blue-100 text-blue-700",
  qualified: "bg-amber-100 text-amber-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
  spam: "bg-zinc-200 text-zinc-500 line-through",
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric", month: "short", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function LeadTable({
  initialItems,
  byStatus,
}: {
  initialItems: LeadRow[];
  byStatus: { status: string; _count: { _all: number } }[];
}) {
  const [items, setItems] = useState<LeadRow[]>(initialItems);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const s of byStatus) m[s.status] = s._count._all;
    return m;
  }, [byStatus]);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((l) => l.status === filter)),
    [items, filter]
  );

  async function patchStatus(id: string, status: Status) {
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (e) {
      alert("Failed to update status: " + (e as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All" count={items.length} active={filter === "all"} onClick={() => setFilter("all")} />
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={s}
            count={counts[s] ?? 0}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Name / Company</th>
              <th className="px-3 py-2 font-medium">Industry / Project</th>
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Received</th>
              <th className="px-3 py-2 font-medium text-right">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-10 text-center text-slate-400">No leads in this view.</td></tr>
            )}
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-3 py-2">
                  <div className="font-medium text-navy">{l.name}</div>
                  <div className="text-slate-500">{l.company}</div>
                </td>
                <td className="px-3 py-2">
                  <div>{l.industry}</div>
                  <div className="text-slate-500">{l.projectType}</div>
                </td>
                <td className="px-3 py-2 text-slate-600">{l.source}</td>
                <td className="px-3 py-2">
                  <select
                    value={l.status}
                    onChange={(e) => patchStatus(l.id, e.target.value as Status)}
                    className={cn(
                      "rounded-md border-0 px-2 py-1 text-xs font-medium cursor-pointer",
                      STATUS_STYLE[l.status as Status] ?? "bg-slate-100 text-slate-700"
                    )}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{fmtDate(l.createdAt)}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => setActiveId(l.id)}
                    className="text-engineering-blue hover:underline text-xs font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeId && (
        <LeadDetail
          id={activeId}
          onClose={() => setActiveId(null)}
          onStatusChange={(status) =>
            setItems((prev) => prev.map((l) => (l.id === activeId ? { ...l, status } : l)))
          }
          onDeleted={() => {
            setItems((prev) => prev.filter((l) => l.id !== activeId));
            setActiveId(null);
          }}
        />
      )}
    </div>
  );
}

function FilterChip({
  label, count, active, onClick,
}: {
  label: string; count: number; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
        active ? "bg-navy text-white border-navy" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      )}
    >
      <span className="capitalize">{label}</span>
      <span className={cn("ml-1.5", active ? "text-white/70" : "text-slate-400")}>{count}</span>
    </button>
  );
}

function LeadDetail({
  id, onClose, onStatusChange, onDeleted,
}: {
  id: string;
  onClose: () => void;
  onStatusChange: (s: Status) => void;
  onDeleted: () => void;
}) {
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/leads/${id}`);
    setLead(await res.json());
    setLoading(false);
  }
  // load once on mount
  useEffect(() => { load(); }, []);

  async function saveNotes() {
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSaving(false);
    if (!res.ok) alert("Failed to save notes");
  }

  async function del() {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (res.ok) onDeleted();
    else alert("Failed to delete");
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto h-full w-full max-w-lg bg-white shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-navy">Lead detail</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>

        {loading || !lead ? (
          <div className="p-10 flex items-center justify-center text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-navy">{lead.name}</div>
                <div className="text-sm text-slate-500">{lead.company}</div>
              </div>
              <select
                value={lead.status}
                onChange={async (e) => {
                  const s = e.target.value as Status;
                  const res = await fetch(`/api/admin/leads/${id}`, {
                    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }),
                  });
                  if (res.ok) { setLead({ ...lead, status: s }); onStatusChange(s); }
                }}
                className={cn("rounded-md border-0 px-2 py-1 text-xs font-medium", STATUS_STYLE[lead.status as Status])}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Field icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={lead.email} href={`mailto:${lead.email}`} />
              <Field icon={<Building2 className="h-3.5 w-3.5" />} label="Phone" value={lead.phone || "—"} />
              <Field icon={<Factory className="h-3.5 w-3.5" />} label="Industry" value={lead.industry} />
              <Field icon={<Tag className="h-3.5 w-3.5" />} label="Project type" value={lead.projectType} />
              <Field icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={lead.location || "—"} />
              <Field icon={<Tag className="h-3.5 w-3.5" />} label="Project size" value={lead.projectSize || "—"} />
              <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Timeline" value={lead.timeline || "—"} />
              <Field icon={<Tag className="h-3.5 w-3.5" />} label="Source" value={`${lead.source}${lead.sourceRef ? ` (${lead.sourceRef})` : ""}`} />
              <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Received" value={fmtDate(lead.createdAt)} />
              {lead.contactedAt && <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Contacted" value={fmtDate(lead.contactedAt)} />}
            </dl>

            {lead.services?.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Services</div>
                <div className="flex flex-wrap gap-1.5">
                  {lead.services.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-1 flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> Message</div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-md p-3 border border-slate-100">{lead.message}</p>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-1 flex items-center gap-1"><StickyNote className="h-3.5 w-3.5" /> Internal notes</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lead.notes || "Add follow-up notes…"}
                rows={4}
                className="w-full rounded-md border border-slate-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-engineering-blue/40"
              />
              <button
                onClick={saveNotes}
                disabled={saving}
                className="mt-2 inline-flex items-center gap-1.5 bg-navy text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-navy/90 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save notes
              </button>
            </div>

            {lead.userAgent && (
              <div className="text-xs text-slate-400 break-all">UA: {lead.userAgent}</div>
            )}

            <div className="pt-2 border-t border-slate-100">
              <button onClick={del} className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-medium">
                <Trash2 className="h-3.5 w-3.5" /> Delete lead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  icon, label, value, href,
}: {
  icon: React.ReactNode; label: string; value: string; href?: string;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400 flex items-center gap-1">{icon} {label}</dt>
      <dd className="text-slate-700 mt-0.5">
        {href ? <a href={href} className="text-engineering-blue hover:underline inline-flex items-center gap-0.5">{value}<ExternalLink className="h-3 w-3" /></a> : value}
      </dd>
    </div>
  );
}
