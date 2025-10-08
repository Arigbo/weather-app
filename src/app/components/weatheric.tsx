import React from "react";
import Image from "next/image";
type Props = {};
export default function WeatherIcon(
  props: React.HTMLProps<HTMLDivElement> & { iconName: string }
) {
  return (
    <div {...props}>
      <Image
        alt="weather icon"
        width={100}
        height={100}
        src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`}
      />
    </div>
  );
}
