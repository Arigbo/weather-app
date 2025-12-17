export default function convertKelvinToCelsius(tempInKelvin: number): number {
    return Math.round(tempInKelvin - 273.15);
}
