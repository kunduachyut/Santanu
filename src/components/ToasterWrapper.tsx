"use client";

import React, { useRef, useEffect } from "react";
import ToasterComponent from "@/components/ui/sonner-toast";

const ToasterWrapper = () => {
  const toasterRef = useRef<any>(null);

  useEffect(() => {
    // Make the toasterRef globally accessible
    if (typeof window !== 'undefined') {
      (window as any).toasterRef = toasterRef;
    }
  }, []);

  return (
    <ToasterComponent ref={toasterRef} />
  );
};

export default ToasterWrapper;