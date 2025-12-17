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

const ForeCastWeatherDetail: React.FC<ForeCastWeatherDetailProps> = ({
  weatherIcon,
  date,
  day,
  temp,
  feels_like,
  description,
  ...weatherDetailsProps
}) => {
  const currentTemp = convertKelToCels(temp ?? 0);
  const feelsLikeTemp = convertKelToCels(feels_like ?? 0);

  return (
    <Container className="container forecast">
      <div className="container-inner">
        <div className="left">
          <div className="left-inner">
            <div className="left-inner-left">
              <div className="image-container">
                <WeatherIcon iconName={weatherIcon} />
              </div>
              <p>{date}</p>
              <p>{day}</p>
            </div>
            <div className="left-inner-right">
              <p className="temp">{currentTemp}°</p>
              <p className="feels-like">
                <span>Feels like</span>
                <span>{feelsLikeTemp}°</span>
              </p>
              <p>{description}</p>
            </div>
          </div>
        </div>
        <div className="weather-details-container">
          <WeatherDetails {...weatherDetailsProps} />
        </div>
      </div>
    </Container>
  );
};

export default ForeCastWeatherDetail;
