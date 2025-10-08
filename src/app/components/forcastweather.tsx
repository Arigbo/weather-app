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
    <Container>
      <section>
        <div>
          <WeatherIcon iconName={props.weatherIcon} />
          <p>{props.date}</p>
          <p>{props.day}</p>
          <p>{convertKelToCels(props.temp ?? 0)}degree</p>
          <p>
            <span>Feels like</span>
            <span>{convertKelToCels(props.feels_like ?? 0)}degree</span>
          </p>
          <p>{props.description}</p>
        </div>
      </section>
      <section>
        <WeatherDetails {...props}/>
      </section>
    </Container>
  );
}
