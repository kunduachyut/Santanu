"use client";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const ToasterWrapper = () => {
  return (
    <>
      <Toaster />
      <SonnerToaster />
    </>
  );
};

export default ToasterWrapper;