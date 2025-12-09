import manifest from "../data/images-manifest.json";

type Manifest = {
  real: string[];
  fakes: string[];
};

const parsed = manifest as Manifest;

export const realImages = parsed.real;
export const fakesImages = parsed.fakes;

