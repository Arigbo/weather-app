import React from "react";
import Image from "next/image";
export default function WeatherIcon(
  props: React.HTMLProps<HTMLDivElement> & { iconName: string }
) {
  return (
    <div {...props} className={`weather-icon ${props.className ?? ""}`}>
      <Image
        alt="weather icon"
        className="image"
        width={100}
        height={100}
        src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`}
      />
    </div>
  );
}
