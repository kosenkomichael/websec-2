export interface CityItem {
  name: string;
  lat: number;
  lon: number;
  population: number;
}

export interface CurrentWeather {
  temperature_2m: number;
  precipitation: number;
  wind_speed_10m: number;
  relative_humidity_2m: number;
  weathercode: number;
}

export interface DailyForecastSet {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

export interface WeatherDataSet {
  current: CurrentWeather;
  daily: DailyForecastSet;
}