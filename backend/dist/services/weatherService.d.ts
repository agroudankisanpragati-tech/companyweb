type LocationSuggestion = {
    name: string;
    displayName: string;
    lat: number;
    lon: number;
};
declare class LocationNotFoundError extends Error {
    constructor(message: string);
}
declare function fetchWeather(lat: string | number, lon: string | number): Promise<any>;
declare function searchLocations(query: string): Promise<LocationSuggestion[]>;
declare function fetchWeatherByLocationQuery(query: string): Promise<{
    location: LocationSuggestion;
    data: any;
}>;
declare const _default: {
    fetchWeather: typeof fetchWeather;
    searchLocations: typeof searchLocations;
    fetchWeatherByLocationQuery: typeof fetchWeatherByLocationQuery;
    LocationNotFoundError: typeof LocationNotFoundError;
};
export default _default;
//# sourceMappingURL=weatherService.d.ts.map