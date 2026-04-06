import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { WeatherDataSet } from '../models/city.models';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiBase = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  fetchWeather(lat: number, lon: number): Observable<WeatherDataSet> {
    const url = `${this.apiBase}?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,wind_speed_10m,relative_humidity_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`;
    return this.http.get<WeatherDataSet>(url);
  }

  getWeatherSymbol(code: number): string {
    const mapping: Record<number, string> = {
      0: '✨', 1: '🌤️', 2: '⛅', 3: '☁️',
      45: '🌫️', 48: '❄️🌫️',
      51: '💧', 53: '💧💧', 55: '💧💧💧',
      56: '🧊', 57: '🧊❄️',
      61: '🌦️', 63: '🌧️', 65: '🌧️🌧️',
      66: '🌧️❄️', 67: '⛈️❄️',
      71: '❄️', 73: '❄️❄️', 75: '❄️❄️❄️',
      77: '🌨️',
      80: '🌦️', 81: '🌧️', 82: '⛈️',
      85: '🌨️', 86: '🌨️🌨️',
      95: '⚡🌩️', 96: '⚡🧊', 99: '⚡⚡🧊'
    };
    return mapping[code] || '🌡️';
  }

  getWeatherPhrase(code: number): string {
    const phrases: Record<number, string> = {
      0: 'Без осадков', 1: 'Солнечно', 2: 'Облачно', 3: 'Пасмурно',
      45: 'Туманно', 48: 'Туман с изморозью',
      51: 'Морось', 53: 'Умеренная морось', 55: 'Сильная морось',
      61: 'Дождь', 63: 'Ливень', 65: 'Сильный ливень',
      71: 'Снег', 73: 'Снегопад', 75: 'Метель',
      80: 'Кратковременный дождь', 95: 'Грозовые разряды'
    };
    return phrases[code] || 'Переменная облачность';
  }

  formatDayLabel(dateString: string, isNow: boolean = false): string {
    if (isNow) return 'Сегодня';
    const week = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const dt = new Date(dateString);
    return week[dt.getDay()];
  }
}