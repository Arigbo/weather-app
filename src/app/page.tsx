"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";

import NavBar from "./components/Navbar";
import Container from "./components/container";
import WeatherIcon from "./components/weatheric";
import WeatherDetails from "./components/weatherDetails";
import ForeCastWeatherDetail from "./components/forcastweather";
import { BiArrowFromBottom, BiArrowFromTop } from "react-icons/bi";

import { isLoadingLocationAtom, loadingCityAtom, placeAtom } from "./atoms";
import convertKelToCels from "@/utils/kelstocels";
import getDayorNightIcon from "@/utils/getDayorNight";
import { metersToKilometers } from "@/utils/metersToKilometer";
import { converWindSpeed } from "@/utils/convertwindspeed";

// --- Types ---
export interface Coord {
  lat: number;
  lon: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  "3h": number;
}

export interface ForecastSys {
  pod: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface ForecastListItem {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  sys: ForecastSys;
  dt_txt: string;
}

export interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastListItem[];
  city: City;
}

// --- Utilities ---
const formatDayName = (
  utcTimestamp: number,
  timezoneOffset: number
): string => {
  const date = new Date((utcTimestamp + timezoneOffset) * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
};

const formatFullDate = (
  utcTimestamp: number,
  timezoneOffset: number
): string => {
  const date = new Date((utcTimestamp + timezoneOffset) * 1000);
  return date
    .toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    })
    .replace(/\//g, ".");
};

const getFilteredDailyForecasts = (
  data: ForecastListItem[],
  timezoneOffset: number
): ForecastListItem[] => {
  const uniqueDays = new Set<string>();
  return data
    .filter((item) => {
      const currentDay = formatDayName(item.dt, timezoneOffset);
      const isFirstDay = uniqueDays.size === 0;
      const isNoon = item.dt_txt.includes("12:00:00");
      const isNewDay = !uniqueDays.has(currentDay);

      if (isFirstDay || (isNoon && isNewDay)) {
        uniqueDays.add(currentDay);
        return true;
      }
      return false;
    })
    .slice(0, 7);
};

// --- Main Component ---
export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [, setLoadCity] = useAtom(loadingCityAtom);
  const [isLoadingLocation, setIsLoadingLocation] = useAtom(
    isLoadingLocationAtom
  );

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API;

  const { isPending, error, data, refetch } = useQuery<ForecastResponse>({
    queryKey: ["forecast", place],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${apiKey}`
      );
      return data;
    },
    enabled: !!place,
  });

  const initializeLocation = useCallback(async () => {
    if (place || isLoadingLocation) return;

    setIsLoadingLocation(true);
    if (!navigator.geolocation) {
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoadCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
          );
          setPlace(response.data.name);
        } catch (err) {
          console.error("Geolocation error:", err);
        } finally {
          setIsLoadingLocation(false);
          setLoadCity(false);
        }
      },
      () => setIsLoadingLocation(false)
    );
  }, [
    place,
    isLoadingLocation,
    setPlace,
    setLoadCity,
    setIsLoadingLocation,
    apiKey,
  ]);

  useEffect(() => {
    initializeLocation();
  }, [initializeLocation]);

  useEffect(() => {
    setLoadCity(false);
  }, [data, setLoadCity]);

  const firstData = data?.list[0];
  const timezoneOffset = data?.city.timezone ?? 0;
  const dailyForecasts = useMemo(
    () => (data ? getFilteredDailyForecasts(data.list, timezoneOffset) : []),
    [data, timezoneOffset]
  );

  if (isPending) return <h2 className="loading">Loading</h2>;
  if (isLoadingLocation)
    return <h2 className="loading">Fetching location...</h2>;
  if (error) {
    return (
      <h1 className="network-error">
        Network error. Try again or refresh page. Check your internet
        connection.
      </h1>
    );
  }

  if (!data || !firstData) return null;

  return (
    <div className="weather">
      <NavBar location={data.city.name} />
      <main>
        <CurrentWeatherSection
          firstData={firstData}
          data={data}
          timezoneOffset={timezoneOffset}
        />
        <ForecastSection
          dailyForecasts={dailyForecasts}
          timezoneOffset={timezoneOffset}
          data={data}
        />
      </main>
    </div>
  );
}

// --- Sub Components ---
function CurrentWeatherSection({
  firstData,
  data,
  timezoneOffset,
}: {
  firstData: ForecastListItem;
  data: ForecastResponse;
  timezoneOffset: number;
}) {
  return (
    <section>
      <header>
        <span>{format(parseISO(firstData.dt_txt), "EEEE")}</span>
        <span>{format(parseISO(firstData.dt_txt), "dd.MM.yyyy")}</span>
      </header>
      <Container className="container">
        <div className="container-inner">
          <div className="left">
            <span className="big">
              {convertKelToCels(firstData.main.temp)}°
            </span>
            <p className="feels-like">
              <span>Feels like</span>
              <span>{convertKelToCels(firstData.main.feels_like)}°</span>
            </p>
            <p className="min-max">
              <span>
                {convertKelToCels(firstData.main.temp_min)}° <BiArrowFromTop />
              </span>
              <span>
                {convertKelToCels(firstData.main.temp_max)}°{" "}
                <BiArrowFromBottom />
              </span>
            </p>
          </div>
          <div className="right">
            <div className="right-inner">
              {data.list.map((item, idx) => (
                <div key={idx} className="weather-details">
                  <p>{format(parseISO(item.dt_txt), "h:mm a")}</p>
                  <div className="image-container">
                    <WeatherIcon
                      iconName={getDayorNightIcon(
                        item.weather[0].icon,
                        item.dt_txt
                      )}
                    />
                  </div>
                  <p>{convertKelToCels(item.main.temp)}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <div className="container">
        <div className="container-inner">
          <Container className="left">
            <p className="first">{firstData.weather[0].description}</p>
            <div className="image-container">
              <WeatherIcon
                iconName={getDayorNightIcon(
                  firstData.weather[0].icon,
                  firstData.dt_txt
                )}
              />
            </div>
          </Container>
          <Container className="weather-details-container">
            <div className="weather-details-container-inner">
              <WeatherDetails
                visability={metersToKilometers(firstData.visibility)}
                airpressure={`${firstData.main.pressure} hpa`}
                humidity={`${firstData.main.humidity}%`}
                sunrise={format(fromUnixTime(data.city.sunrise), "H:mm")}
                sunset={format(fromUnixTime(data.city.sunset), "H:mm")}
                windspeed={converWindSpeed(firstData.wind.speed)}
              />
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}

function ForecastSection({
  dailyForecasts,
  timezoneOffset,
  data,
}: {
  dailyForecasts: ForecastListItem[];
  timezoneOffset: number;
  data: ForecastResponse;
}) {
  return (
    <section>
      <header>
        <span>Forecast</span>
        <span>(7 Days)</span>
      </header>
      {dailyForecasts.map((item, idx) => (
        <ForeCastWeatherDetail
          key={idx}
          weatherIcon={getDayorNightIcon(item.weather[0].icon, item.dt_txt)}
          date={formatFullDate(item.dt, timezoneOffset)}
          day={formatDayName(item.dt, timezoneOffset)}
          temp={item.main.temp}
          feels_like={item.main.feels_like}
          temp_min={item.main.temp_min}
          temp_max={item.main.temp_max}
          description={item.weather[0].description}
          visability={metersToKilometers(item.visibility)}
          airpressure={`${item.main.pressure} hpa`}
          humidity={`${item.main.humidity}%`}
          sunrise={format(fromUnixTime(data.city.sunrise), "H:mm")}
          sunset={format(fromUnixTime(data.city.sunset), "H:mm")}
          windspeed={converWindSpeed(item.wind.speed)}
        />
      ))}
    </section>
  );
}
