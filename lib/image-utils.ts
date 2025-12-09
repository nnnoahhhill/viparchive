const ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function getRandomString(length = 9): string {
  return Array.from({ length }, () => ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)]).join("");
}

const encodeUrlSafe = (input: string): string => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf8").toString("base64url");
  }
  const binary = encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const decodeUrlSafe = (input: string): string => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "base64url").toString("utf8");
  }
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return decodeURIComponent(
    Array.from(binary, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""),
  );
};

export function encodeImageName(filename: string): string {
  return encodeUrlSafe(filename);
}

export function decodeImageName(encoded: string): string | null {
  try {
    const decoded = decodeUrlSafe(encoded);
    return decoded || null;
  } catch {
    return null;
  }
}

export function getRandomImage(images: string[]): string {
  if (!images.length) {
    throw new Error("No images available to choose from.");
  }
  const index = Math.floor(Math.random() * images.length);
  return images[index];
}

export function updateUrlWithRandom(img?: string): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("r", getRandomString());
  if (img) {
    url.searchParams.set("img", encodeImageName(img));
  } else {
    url.searchParams.delete("img");
  }
  window.history.replaceState(null, "", url.toString());
}

