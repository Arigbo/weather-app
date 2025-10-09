import React from "react";
import Container from "./container";
import WeatherIcon from "./weatheric";
import WeatherDetails, { WeatherDetailProps } from "./weatherDetails";
import convertKelToCels from "@/utils/kelstocels";
export interface ForeCastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}
export default function ForeCastWeatherDetail(
  props: ForeCastWeatherDetailProps
) {
  return (
    <Container className="container forecast">
      <div className="container-inner">
        <div className="left">
          <div className="left-inner">
            <div className="left-inner-left">
              <div className="image-container">
                <WeatherIcon iconName={props.weatherIcon} />
              </div>
              <p>{props.date}</p>
              <p>{props.day}</p>
            </div>
            <div className="left-inner-right">
              {" "}
              <p className="temp">{convertKelToCels(props.temp ?? 0)}°</p>
              <p className="feels-like">
                <span>Feels like</span>
                <span>{convertKelToCels(props.feels_like ?? 0)}°</span>
              </p>
              <p>{props.description}</p>
            </div>
          </div>
        </div>
        <div className="weather-details-container">
          <div className="weather-details-container-inner">
            <WeatherDetails {...props} />
          </div>
        </div>
      </div>
    </Container>
  );
}
