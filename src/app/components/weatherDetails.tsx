import React from "react";
import { FiDroplet } from "react-icons/fi";
import { ImMeter } from "react-icons/im";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { MdAir } from "react-icons/md";
type Props = {};
export interface WeatherDetailProps {
  visability: string;
  humidity: string;
  windspeed: string;
  airpressure: string;
  sunrise: string;
  sunset: string;
}
export default function WeatherDetails(props: WeatherDetailProps) {

  return (
    <>
      <SingleWeatherDetails
        icon={<LuEye />}
        information={"Visability"}
        value={props.visability}
      />
      <SingleWeatherDetails
        icon={<FiDroplet />}
        information={"Humidity"}
        value={props.humidity}
      />
      <SingleWeatherDetails
        icon={<MdAir />}
        information={"Wind speed"}
        value={props.windspeed}
      />
      <SingleWeatherDetails
        icon={<ImMeter />}
        information={"Air Pressure"}
        value={props.airpressure}
      />
      <SingleWeatherDetails
        icon={<LuSunrise />}
        information={"Sunrise"}
        value={props.sunrise}
      />
      <SingleWeatherDetails
icon={<LuSunset/>}
information={"Sunset"}
value={props.sunset}/>
    </>
  );
}
export interface SingleWeatherDetailsProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}
function SingleWeatherDetails(props: SingleWeatherDetailsProps) {
  return (
    <div className="weather-details">
      <p>{props.information}</p>
      <div>{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}
