"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function PublishAnywhere() {
  return (
    <div className="relative w-full flex justify-center items-center py-20 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full px-8 items-center">
        {/* Left Section */}
        
        <div className="flex flex-col space-y-6">
            {/* <Image
            src="/Div [ρniLrj].png" // place uploaded image in public folder with this name
            alt="Publish Anywhere"
            fill
            className="object-contain"
          /> */}
          <span className="uppercase tracking-wide text-sm text-purple-500 font-semibold">
            How it works
          </span>

          <h2 className="text-4xl font-bold">
            Publish <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">anywhere</span>
          </h2>

          <p className="text-gray-600 max-w-md">
            Deploy to your choice of content and link, so you can grow as you like.
          </p>
        </div>

        {/* Right Section - Image/Illustration */}
        <div className="relative w-full h-72">
          <Image
            src="/Div [ρniLrj]1.png" // place uploaded image in public folder with this name
            alt="Publish Anywhere"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
