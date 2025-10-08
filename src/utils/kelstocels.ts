export default function convertKelToCels(tempInKelvin:number):number{
    const tempToCelsius=tempInKelvin-273.15;
    return Math.floor(tempToCelsius)
}