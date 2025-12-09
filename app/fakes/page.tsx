"use client";

import Image from "next/image";
import Link from "next/link";
import { fakesImages } from "@/lib/load-manifest";

export default function FakesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">DO NOT BE FOOLED</h1>
          <Link href="/" className="text-sm font-medium underline underline-offset-4">
            Home
          </Link>
        </header>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {fakesImages.map((file) => (
            <div key={file} className="flex items-center justify-center bg-neutral-50 p-2">
              <Image
                src={`/images/fakes-optimized/${file}`}
                alt=""
                width={300}
                height={300}
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
        {!fakesImages.length && (
          <p className="text-sm text-neutral-500">Add images to see the gallery.</p>
        )}
      </div>
    </div>
  );
}

