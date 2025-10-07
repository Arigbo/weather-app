"use client";
import NavBar from "./components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
// Mock WeatherResponse type (imported from weather_types.ts)
/**
 * TypeScript interfaces for the OpenWeatherMap current weather API response structure.
 * Expanded with detailed documentation for time and date fields.
 */

// 1. Coordinates Interface
interface Coord {
  /** Longitude of the location. */
  lon: number;
  /** Latitude of the location. */
  lat: number;
}

// 2. Weather Condition Interface
interface Weather {
  /** Weather condition ID. */
  id: number;
  /** Group of weather parameters (e.g., 'Clouds', 'Rain'). */
  main: string;
  /** Weather condition within the group (e.g., 'overcast clouds'). */
  description: string;
  /** Weather icon ID (e.g., '04n'). */
  icon: string;
}

// 3. Main Temperature and Humidity Data Interface
interface Main {
  /** Temperature in Kelvin (K). Use T-273.15 to convert to Celsius. */
  temp: number;
  /** Temperature in Kelvin (accounts for the human perception of weather). */
  feels_like: number;
  /** Minimum temperature at the moment (K). */
  temp_min: number;
  /** Maximum temperature at the moment (K). */
  temp_max: number;
  /** Atmospheric pressure (hPa). */
  pressure: number;
  /** Humidity (%). */
  humidity: number;
  /** Atmospheric pressure on the sea level (hPa). */
  sea_level: number;
  /** Atmospheric pressure on the ground level (hPa). */
  grnd_level: number;
}

// 4. Wind Data Interface
interface Wind {
  /** Wind speed (m/s). */
  speed: number;
  /** Wind direction (degrees, meteorological). */
  deg: number;
  /** Wind gust (m/s). */
  gust: number;
}

// 5. Clouds Data Interface
interface Clouds {
  /** Cloudiness (%). */
  all: number;
}

// 6. System Parameters Interface (Sunrise/Sunset)
interface Sys {
  /** Country code (e.g., 'NG'). */
  country: string;
  /** Sunrise time, Unix timestamp (UTC). */
  sunrise: number;
  /** Sunset time, Unix timestamp (UTC). */
  sunset: number;
}

// 7. Root API Response Interface
export interface WeatherResponse {
  coord: Coord;
  weather: Weather[];
  /** Internal parameter. */
  base: string;
  main: Main;
  /** Visibility distance (meters). */
  visibility: number;
  wind: Wind;
  clouds: Clouds;

  // --- EXPANDED TIME/DATE FIELDS ---

  /** * Time of data calculation, Unix timestamp (UTC).
   * This indicates when the weather reading was taken.
   */
  dt: number;

  /** * Shift in seconds from UTC.
   * Use this to convert 'dt' to the local time of the queried city. (e.g., dt + timezone)
   */
  timezone: number;

  /** City ID. */
  id: number;
  /** City name. */
  name: string;
  /** Internal parameter (HTTP status code, should be 200). */
  cod: number;

  sys: Sys;
}

export default function Home() {
  const { isPending, error, data } = useQuery<WeatherResponse>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=port+harcourt&appid=${process.env.NEXT_PUBLIC_WEATHER_API}`
      );
      return response.data;
    },
  });
  const firstData = data?.weather[0];
  console.log("data", data?.name);
  if (isPending) return "Loading...";
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
   <NavBar/>
      <main>
        <section>
          <header>
            <h2></h2>
            <h5>{format(parseISO(firstData?.dt_txt??""),"EEEE")}🌅 🌇</h5>
          </header>
        </section>
        <section></section>
      </main>
    </div>
  );
}
