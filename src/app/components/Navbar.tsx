"use client";
import React, { useState, useCallback, useMemo } from "react";
import { IoMdLocate } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import SearchBox from "./Searchbox";
import axios from "axios";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "../atoms";

const API_BASE = "https://api.openweathermap.org/data/2.5";
const DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 3;

export default function NavBar({ location }: { location?: string }) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [, setLoadCity] = useAtom(loadingCityAtom);
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API;

  const handleInput = useCallback(
    async (value: string) => {
      setCity(value);
      if (value.length < MIN_SEARCH_LENGTH) {
        setSuggestions([]);
        setShowSuggestions(false);
        setError("");
        return;
      }

      try {
        const { data } = await axios.get(
          `${API_BASE}/find?q=${value}&appid=${apiKey}`
        );
        setSuggestions(data?.list?.map((item: any) => item.name) ?? []);
        setError("");
        setShowSuggestions(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Error fetching suggestions";
        setError(errorMsg);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [apiKey]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!suggestions.length) {
        setError("Location not found");
        return;
      }
      setLoadCity(true);
      setError("");
      setTimeout(() => {
        setShowSuggestions(false);
        setLoadCity(false);
        setPlace(city);
      }, DEBOUNCE_DELAY);
    },
    [suggestions.length, setLoadCity, setPlace, city]
  );

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoadCity(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const { data } = await axios.get(
            `${API_BASE}/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
          );
          setTimeout(() => {
            setLoadCity(false);
            setPlace(data.name);
          }, DEBOUNCE_DELAY);
        } catch {
          setLoadCity(false);
          setError("Network error. Please try again.");
        }
      },
      () => {
        setLoadCity(false);
        setError("Failed to get location");
      }
    );
  }, [apiKey, setLoadCity, setPlace]);

  const showError = useMemo(() => !!error && suggestions.length === 0, [error, suggestions.length]);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-inner-left">
          <h2 className="logo">Weather</h2>
          <MdSunny className="sun" />
        </div>
        <section className="nav-inner-right">
          <IoMdLocate
            className="location"
            title="Your Current Location"
            onClick={handleCurrentLocation}
          />
          <p>
            <IoLocation className="pin" />
            {location}
          </p>
          <SearchBox
            value={city}
            onChange={(e) => handleInput(e.target.value)}
            className="searchbox"
            onSubmit={handleSubmit}
          />
        </section>
        <SuggestionBox
          showSuggestions={showSuggestions}
          suggestions={suggestions}
          onSelectSuggestion={setCity}
          showError={showError}
          error={error}
        />
      </div>
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      )}
    </nav>
  );
}

interface SuggestionBoxProps {
  showSuggestions: boolean;
  suggestions: string[];
  onSelectSuggestion: (item: string) => void;
  showError: boolean;
  error: string;
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  onSelectSuggestion,
  showError,
  error,
}: SuggestionBoxProps) {
  if (!showSuggestions && !showError) return null;

  return (
    <ul className="suggestion-box">
      {showError && <li>{error}</li>}
      {suggestions.map((item) => (
        <li key={item} onClick={() => onSelectSuggestion(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
}
