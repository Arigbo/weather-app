"use client";
import Image from "next/image";
import NavBar from "./components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
// Mock WeatherResponse type (imported from weather_types.ts)
interface Coord {
  lon: number;
  lat: number;
}
interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}
interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}
interface Wind {
  speed: number;
  deg: number;
  gust: number;
}
interface Clouds {
  all: number;
}
interface Sys {
  country: string;
  sunrise: number;
  sunset: number;
}
interface WeatherResponse {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
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
  console.log("data", data?.name);
  if (isPending) return "Loading...";
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <NavBar />
    </div>
  );
}
// fetch("https://api.openweathermap.org/data/2.5/weather?q=port+harcourt&appid=109c581fed009858c49d951fed1ffb86").then((res) =>
//         res.json()
//       ),
