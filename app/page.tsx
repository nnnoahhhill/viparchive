"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { realImages } from "@/lib/load-manifest";
import {
  decodeImageName,
  encodeImageName,
  getRandomImage,
  getRandomString,
  updateUrlWithRandom,
} from "@/lib/image-utils";

export default function Home() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const hasImages = realImages.length > 0;

  useEffect(() => {
    if (!hasImages) return;
    const params = new URLSearchParams(window.location.search);
    const encodedImg = params.get("img");
    const decoded = encodedImg ? decodeImageName(encodedImg) : null;
    const valid = decoded && realImages.includes(decoded) ? decoded : null;
    const picked = valid ?? getRandomImage(realImages);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentImage(picked);
    // Always generate a new random 'r' on mount, overwriting any existing one
    updateUrlWithRandom(valid ?? undefined);
  }, [hasImages]);

  useEffect(() => {
    if (!hasImages) {
      updateUrlWithRandom();
    }
  }, [hasImages]);

  const handleNew = () => {
    if (!hasImages) return;
    const next = getRandomImage(realImages);
    setCurrentImage(next);
    updateUrlWithRandom();
  };

  const handleCopy = async () => {
    if (!currentImage) return;
    const url = new URL(window.location.href);
    url.searchParams.set("img", encodeImageName(currentImage));
    url.searchParams.set("r", getRandomString());
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex min-h-screen justify-center bg-white text-neutral-900">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 px-8 py-12 pt-[25vh]">
        <div className="flex w-full justify-center items-center mb-4 gap-8">
          <a
            href="#"
            onClick={handleNew}
            className="text-lg font-medium hover:underline transition"
            style={{ textDecorationThickness: 2, color: 'green' }}
          >
            New
          </a>
          <a
            href="#"
            onClick={handleCopy}
            className="text-lg font-medium hover:underline transition"
            style={{ textDecorationThickness: 2, color: 'blue' }}
          >
            {copied ? "Copied!" : "Share"}
          </a>
          <a
            href="/fakes"
            className="text-lg font-medium hover:underline transition"
            style={{ textDecorationThickness: 2, color: 'red' }}
          >
            Fakes
          </a>
        </div>
        <div className="relative flex h-[44vh] w-full items-center justify-center">
          {currentImage ? (
            <Image
              src={`/images/real-optimized/${currentImage}`}
              alt="Real image"
              fill
              className="drop-shadow-lg"
              style={{ objectFit: "contain" }}
              priority
            />
          ) : (
            <div className="flex h-[44vh] w-full max-w-sm items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
              <p className="text-sm text-neutral-500">Add images and run npm run optimize.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
