"use client";

import { useEffect, useState } from "react";

type Website = {
  _id: string;
  ownerId: string;
  title: string;
  url: string;
  description: string;
  priceCents: number;
  status: "pending" | "approved" | "denied";
};

export default function SuperAdminDashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    // Fetch all websites for super admin view
    fetch("/api/websites?role=superadmin").then(r => r.json()).then(setWebsites);
  }

  async function updateStatus(id: string, status: "approved" | "denied") {
    const res = await fetch(`/api/websites/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      refresh();
    } else {
      const err = await res.json();
      // Using a custom message box instead of alert()
      console.error(err);
      alert("Failed to update status: " + JSON.stringify(err));
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Website Moderation</h2>
        <ul className="space-y-3">
          {websites.map(s => (
            <li key={s._id} className="border rounded p-4">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-sm text-gray-600">URL: {s.url}</div>
                  <div className="text-sm text-gray-600">Owner: {s.ownerId}</div>
                  <div className="text-sm mt-1">Status: <span className={`font-medium ${s.status === 'approved' ? 'text-green-600' : s.status === 'denied' ? 'text-red-600' : 'text-yellow-600'}`}>{s.status}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <span>${(s.priceCents/100).toFixed(2)}</span>
                  {/* Conditionally render buttons only if the status is pending */}
                  {s.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(s._id, "approved")} className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors">Approve</button>
                      <button onClick={() => updateStatus(s._id, "denied")} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors">Deny</button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm mt-2">{s.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}