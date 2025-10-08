"use client";
import React, { useState } from "react";
import { IoMdLocate } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import SearchBox from "./Searchbox";
import axios from "axios";

export default function NavBar() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  async function handleInput(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${process.env.NEXT_PUBLIC_WEATHER_API}`
        );
        const suggestions = response.data?.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error: any) {
        setError(error.message);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setError("");
    }
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (suggestions.length == 0) {
      setError("location not found");
    } else {
      setShowSuggestions(false);
    }
  };
  function onSelectSuggestion(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-inner-left">
          <h2 className="logo">Weather</h2>
          <MdSunny className="sun" />
        </div>
        <section className="nav-inner-right">
          <IoMdLocate className="location" title="Your Location" />
          <p className="">
            {" "}
            <IoLocation className="pin" />
            {city}
          </p>
          <SearchBox
            value={city}
            onChange={(e) => handleInput(e.target.value)}
            className="searchbox"
            onSubmit={(e) => handleSubmit}
          />
        </section>
        <SuggestionBox
          {...{ showSuggestions, suggestions, onSelectSuggestion, error }}
        />
      </div>
      {/* <div className="error-container">
        {error && <p className="error-message">{error}</p>}
      </div> */}
    </nav>
  );
}
function SuggestionBox({
  showSuggestions,
  suggestions,
  onSelectSuggestion,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  onSelectSuggestion: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul>
          {error && suggestions.length < 1 && <li>{error}</li>}
          {suggestions.map((d, i) => (
            <li key={i} onClick={() => onSelectSuggestion(d)}>
              {d}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
