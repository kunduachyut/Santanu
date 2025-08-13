"use client";

import { useEffect, useState } from "react";

type Website = {
  _id: string;
  title: string;
  url: string;
  description: string;
  priceCents: number;
};

type AdRequest = {
  _id: string;
  websiteId: Website;
  message: string;
  status: string;
  createdAt: string;
};

export default function PublisherDashboard() {
  const [mySites, setMySites] = useState<Website[]>([]);
  const [adRequests, setAdRequests] = useState<AdRequest[]>([]);
  const [form, setForm] = useState({ title: "", url: "", description: "", priceCents: 0 });

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    fetch("/api/websites?owner=me").then(r => r.json()).then(setMySites);
    fetch("/api/ad-requests?role=publisher").then(r => r.json()).then(setAdRequests);
  }

  async function createSite(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/websites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, priceCents: Number(form.priceCents) }),
    });
    if (res.ok) {
      setForm({ title: "", url: "", description: "", priceCents: 0 });
      refresh();
    } else {
      const err = await res.json(); alert(JSON.stringify(err));
    }
  }

  async function removeSite(id: string) {
    await fetch(`/api/websites/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Publish a Website</h2>
        <form onSubmit={createSite} className="grid gap-3 max-w-xl">
          <input className="border rounded px-2 py-2" placeholder="Title"
                 value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/>
          <input className="border rounded px-2 py-2" placeholder="https://site.com"
                 value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}/>
          <textarea className="border rounded px-2 py-2" placeholder="Description"
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/>
          <input className="border rounded px-2 py-2" type="number" placeholder="Price (cents)"
                 value={form.priceCents} onChange={e => setForm({ ...form, priceCents: Number(e.target.value) })}/>
          <button className="px-4 py-2 rounded bg-black text-white">Create</button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Websites</h2>
        <ul className="space-y-3">
          {mySites.map(s => (
            <li key={s._id} className="border rounded p-4">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-sm text-gray-600">{s.url}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span>${(s.priceCents/100).toFixed(2)}</span>
                  <button onClick={() => removeSite(s._id)} className="text-sm text-red-600">Delete</button>
                </div>
              </div>
              <p className="text-sm mt-2">{s.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Ad Requests (for my sites)</h2>
        <ul className="space-y-3">
          {adRequests.map(ar => (
            <li key={ar._id} className="border rounded p-4">
              <div className="font-semibold">{ar.websiteId?.title}</div>
              <p className="text-sm mt-1">{ar.message}</p>
              <div className="text-xs text-gray-500 mt-2">{new Date(ar.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
