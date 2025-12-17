import React from "react";
import { FiDroplet } from "react-icons/fi";
import { ImMeter } from "react-icons/im";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { MdAir } from "react-icons/md";

export interface WeatherDetailProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

const WEATHER_DETAILS = [
  { icon: LuEye, label: "Visibility", key: "visibility" },
  { icon: FiDroplet, label: "Humidity", key: "humidity" },
  { icon: MdAir, label: "Wind Speed", key: "windSpeed" },
  { icon: ImMeter, label: "Air Pressure", key: "airPressure" },
  { icon: LuSunrise, label: "Sunrise", key: "sunrise" },
  { icon: LuSunset, label: "Sunset", key: "sunset" },
] as const;

export default function WeatherDetails(props: WeatherDetailProps) {
  return (
    <>
      {WEATHER_DETAILS.map(({ icon: Icon, label, key }) => (
        <SingleWeatherDetails
          key={key}
          icon={<Icon />}
          information={label}
          value={props[key as keyof WeatherDetailProps]}
        />
      ))}
    </>
  );
}

interface SingleWeatherDetailsProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetails({
  information,
  icon,
  value,
}: SingleWeatherDetailsProps) {
  return (
    <div className="weather-details">
      <p>{information}</p>
      <div>{icon}</div>
      <p>{value}</p>
    </div>
  );
}
