import React from "react";
import Image from "next/image";

interface WeatherIconProps extends React.HTMLProps<HTMLDivElement> {
  iconName: string;
}

export default function WeatherIcon({ iconName, ...props }: WeatherIconProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${iconName}@4x.png`;

  return (
    <div {...props}>
      <Image
        alt="Weather icon"
        className="image"
        width={100}
        height={100}
        src={iconUrl}
      />
    </div>
  );
}
