// src/atoms.js
import { atom } from "jotai";

// No default city. It will be null until user location is fetched or manually entered.
export const placeAtom = atom<string | null>(null);
// Atom to track if we are currently trying to get the user's geolocation
export const isLoadingLocationAtom = atom(false);

// Atom to track if the city's weather data is currently being loaded
export const loadingCityAtom = atom(false);

export const locationInputAtom = atom("");