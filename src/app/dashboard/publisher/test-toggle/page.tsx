"use client";

import { useState } from "react";
import { MinimalToggle, OrangeToggle } from "@/components/ui/toggle";

export default function ToggleTestPage() {
  const [minimalChecked, setMinimalChecked] = useState(false);
  const [orangeChecked, setOrangeChecked] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Toggle Component Test</h1>
      
      <div className="space-y-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Minimal Toggle</h2>
          <div className="flex items-center gap-4">
            <MinimalToggle
              checked={minimalChecked}
              onChange={(e) => setMinimalChecked(e.target.checked)}
            />
            <span>Available: {minimalChecked ? "Yes" : "No"}</span>
          </div>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Orange Toggle</h2>
          <div className="flex items-center gap-4">
            <OrangeToggle
              checked={orangeChecked}
              onChange={(e) => setOrangeChecked(e.target.checked)}
            />
            <span>Status: {orangeChecked ? "On" : "Off"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}