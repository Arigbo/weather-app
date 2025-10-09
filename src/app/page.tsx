"use client";
import NavBar from "./components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "./components/container";
import convertKelToCels from "@/utils/kelstocels";
import { BiArrowFromBottom, BiArrowFromTop } from "react-icons/bi";
import WeatherIcon from "./components/weatheric";
import getDayorNightIcon from "@/utils/getDayorNight";
import WeatherDetails from "./components/weatherDetails";
import { metersToKilometers } from "@/utils/metersToKilometer";
import { converWindSpeed } from "@/utils/convertwindspeed";
import ForeCastWeatherDetail from "./components/forcastweather";
import { loadingCityAtom, placeAtom } from "./atoms";
import { useAtom } from "jotai";
/**
 * TypeScript Interfaces for the 5-Day / 3-Hour Forecast API response structure.
 * Generated from the provided JSON data sample.
 */

// --- Reusable Core Interfaces ---

/** Geographical coordinates (Latitude and Longitude). */
export interface Coord {
  lat: number;
  lon: number;
}

/** Weather condition details (ID, brief description, full description, and icon code). */
export interface Weather {
  id: number;
  main: string; // e.g., "Rain", "Clouds"
  description: string; // e.g., "light rain", "overcast clouds"
  icon: string;
}

/** Wind speed, direction, and gust. */
export interface Wind {
  speed: number; // m/s
  deg: number; // degrees
  gust: number; // m/s
}

/** Cloudiness percentage. */
export interface Clouds {
  all: number; // Cloudiness (%)
}

/** Rain volume for the last 3 hours (only present if there is rain). */
export interface Rain {
  "3h": number; // Rain volume for the last 3 hours (mm)
}

/** System internal parameter indicating part of the day (day 'd' or night 'n'). */
export interface ForecastSys {
  pod: string;
}

/** Main temperature and atmospheric data for a 3-hour period. */
export interface Main {
  temp: number; // Temperature (Kelvin)
  feels_like: number; // Feels like temperature (Kelvin)
  temp_min: number; // Minimum temp in 3h block (Kelvin)
  temp_max: number; // Maximum temp in 3h block (Kelvin)
  pressure: number; // Atmospheric pressure (hPa)
  sea_level: number; // Atmospheric pressure on the sea level (hPa)
  grnd_level: number; // Atmospheric pressure on the ground level (hPa)
  humidity: number; // Humidity (%)
  temp_kf: number; // Internal temperature parameter
}

// --- Forecast-Specific Interfaces ---

/** Structure for a single 3-hour forecast entry within the list. */
export interface ForecastListItem {
  dt: number; // Time of data forecasted, Unix, UTC
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number; // Visibility (meters)
  pop: number; // Probability of precipitation (0 to 1)
  rain?: Rain; // Optional: only present if rain is forecasted
  sys: ForecastSys;
  dt_txt: string; // Time of data forecasted, ISO format (e.g., "2025-10-08 00:00:00")
}

/** Geographical and historical information about the city. */
export interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number; // Shift in seconds from UTC
  sunrise: number; // Sunrise time, Unix, UTC
  sunset: number; // Sunset time, Unix, UTC
}

/** The root interface for the entire 5-day/3-hour forecast response. */
export interface ForecastResponse {
  cod: string; // Internal code, should be "200"
  message: number;
  cnt: number; // Number of 3-hour data points (should be 40)
  list: ForecastListItem[];
  city: City;
}
export interface Homepage {
  search?: string;
  finalDailyForecasts: ForecastListItem[] | undefined;
  timezoneOffset: number | undefined;
  firstData?: ForecastListItem;
  formatLocalTime: (utcTimestamp: number, timezoneOffset: number) => string;
  formatDayName: (utcTimestamp: number, timezoneOffset: number) => string;
  formatFullDate: (utcTimestamp: number, timezoneOffset: number) => string;
}

export default function Home(props: Homepage) {
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadCity] = useAtom(loadingCityAtom);

  const { isPending, error, data, refetch } = useQuery<ForecastResponse>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_API}`
      );
      return data;
    },
  });
  useEffect(() => {
    refetch();
  }, [place, refetch]);
  const firstData = data?.list[0];
  console.log("data", data?.city.name);
  const formatLocalTime = (
    utcTimestamp: number,
    timezoneOffset: number
  ): string => {
    // 1. Adjust UTC timestamp by the city's timezone offset
    const localMilliseconds = (utcTimestamp + timezoneOffset) * 1000;
    const date = new Date(localMilliseconds);

    // 2. Format as UTC to ignore the browser's local timezone
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  /** * Formats a UTC Unix timestamp into a full day name (e.g., Saturday).
   * This replaces the "EEEE" format from the original problematic code.
   */
  const formatDayName = (
    utcTimestamp: number,
    timezoneOffset: number
  ): string => {
    const localMilliseconds = (utcTimestamp + timezoneOffset) * 1000;
    const date = new Date(localMilliseconds);

    return date.toLocaleDateString("en-US", {
      weekday: "long", // Long weekday name to match EEEE
      timeZone: "UTC",
    });
  };

  /** * Formats a UTC Unix timestamp into a full date string (e.g., 28.10.2023).
   * This replaces the "dd.MM.yyyy" format from the original problematic code.
   */
  const formatFullDate = (
    utcTimestamp: number,
    timezoneOffset: number
  ): string => {
    const localMilliseconds = (utcTimestamp + timezoneOffset) * 1000;
    const date = new Date(localMilliseconds);

    // Use 'en-GB' for day/month/year format and replace '/' with '.'
    return date
      .toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      })
      .replace(/\//g, ".");
  };
  const timezoneOffset = data?.city.timezone;
  const uniqueDays = new Set<string>();
  const finalDailyForecasts = data?.list
    .filter((item) => {
      // Use the full day name for accurate day comparison
      const currentDay = formatDayName(item.dt, props.timezoneOffset ?? 0);

      // Always include the first item for today's forecast
      if (uniqueDays.size === 0 && uniqueDays.add(currentDay)) {
        return true;
      }

      // For subsequent days, we try to grab the 12:00:00 sample for consistency
      const isNoon = item.dt_txt.includes("12:00:00");

      if (isNoon && !uniqueDays.has(currentDay) && uniqueDays.add(currentDay)) {
        return true;
      }

      return false;
    })
    .slice(0, 5); // Ensure a maximum of 5 days
  if (isPending) return "Loading...";
  return (
    <div className="weather">
      <NavBar location={data?.city.name} />
      <main>
        <section>
          <header>
            <span>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</span>
            <span>
              {format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")}
            </span>
          </header>
          <Container className="container">
            <div className="container-inner">
              <div className="left">
                <span className="big">
                  {convertKelToCels(firstData?.main.temp ?? 0)}°
                </span>
                <p className="feels-like">
                  <span>Feels like</span>
                  <span>
                    {convertKelToCels(firstData?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className="min-max">
                  <span>
                    {convertKelToCels(firstData?.main.temp_min ?? 0)}°
                    <BiArrowFromTop />
                  </span>
                  <span>
                    {convertKelToCels(firstData?.main.temp_max ?? 0)}°
                    <BiArrowFromBottom />
                  </span>
                </p>
              </div>
              <div className="right">
                <div className="right-inner">
                  {data?.list.map((d, i) => {
                    return (
                      <div key={i} className="weather-details">
                        <p>{format(parseISO(d.dt_txt), "h:mm a")}</p>
                        <div className="image-container">
                          <WeatherIcon
                            iconName={getDayorNightIcon(
                              d.weather[0].icon,
                              d.dt_txt
                            )}
                          />
                        </div>
                        <p>{convertKelToCels(d?.main.temp ?? 0)}°</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Container>
          <div className="container">
            <div className="container-inner">
              <Container className="left">
                <p className="first">{firstData?.weather[0].description}</p>
                <div className="image-container">
                  <WeatherIcon
                    iconName={getDayorNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  />
                </div>
              </Container>
              <Container className="weather-details-container">
                <div className="weather-details-container-inner">
                  <WeatherDetails
                    visability={metersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    airpressure={`${firstData?.main.pressure} hpa`}
                    humidity={`${firstData?.main.humidity}%`}
                    sunrise={`${format(
                      fromUnixTime(data?.city.sunrise ?? 111111),
                      "H:mm"
                    )}`}
                    sunset={`${format(
                      fromUnixTime(data?.city.sunset ?? 111111),
                      "H:mm"
                    )}`}
                    windspeed={converWindSpeed(firstData?.wind.speed ?? 0)}
                  />
                </div>
              </Container>
            </div>
          </div>
        </section>
        <section>
          <header>
            <span> Forest</span> <span>(7 Days)</span>
          </header>
          {finalDailyForecasts?.map((d, i) => (
            <ForeCastWeatherDetail
              key={i}
              weatherIcon={getDayorNightIcon(d.weather[0].icon, d.dt_txt)}
              date={formatFullDate(d.dt, timezoneOffset ?? 0)}
              day={formatDayName(d.dt, timezoneOffset ?? 0)}
              temp={d.main.temp}
              feels_like={d.main.feels_like}
              temp_min={d.main.temp_min}
              temp_max={d.main.temp_max}
              description={d.weather[0].description}
              visability={metersToKilometers(d.visibility ?? 10000)}
              airpressure={`${d.main.pressure} hpa`}
              humidity={`${d.main.humidity}%`}
              sunrise={`${format(
                fromUnixTime(data?.city.sunrise ?? 111111),
                "H:mm"
              )}`}
              sunset={`${format(
                fromUnixTime(data?.city.sunset ?? 111111),
                "H:mm"
              )}`}
              windspeed={converWindSpeed(d.wind.speed ?? 0)}
            />
          ))}
        </section>

      </main>
    </div>
  );
}
