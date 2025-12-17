// src/atoms.ts
import { atom } from "jotai";

export const placeAtom = atom<string>("Republic of India");
export const isLoadingLocationAtom = atom(false);
export const loadingCityAtom = atom(false);
export const locationInputAtom = atom("");
