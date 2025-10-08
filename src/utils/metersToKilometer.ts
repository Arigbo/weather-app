export function metersToKilometers(visibiltyInMeters:number):string{
    const visibiltyInKiloMeters=visibiltyInMeters/1000;
    return`${visibiltyInKiloMeters.toFixed(0)}km`
}