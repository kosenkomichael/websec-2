import { Component, Input, OnChanges, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityItem, WeatherDataSet } from '../../models/city.models';
import { WeatherService } from '../../services/weather.service';
import { CityService } from '../../services/city.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnChanges {
  @Input() cityData: CityItem | null = null;
  @ViewChild('weatherCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  weatherBundle: WeatherDataSet | null = null;
  isBusy = false;
  hasErrorFlag = false;
  activeMetric: 'temp' | 'rain' = 'temp';

  private chartInstance: Chart | null = null;
  readonly Math = Math;

  constructor(
    private weatherApi: WeatherService,
    private cityUtil: CityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    if (this.cityData) this.loadWeatherData();
  }

  private loadWeatherData(): void {
    if (!this.cityData) return;
    this.isBusy = true;
    this.hasErrorFlag = false;
    this.weatherBundle = null;
    this.cdr.detectChanges();

    this.weatherApi.fetchWeather(this.cityData.lat, this.cityData.lon).subscribe({
      next: (data) => {
        this.weatherBundle = data;
        this.isBusy = false;
        this.cdr.detectChanges();
        setTimeout(() => this.renderChart(), 80);
      },
      error: () => {
        this.isBusy = false;
        this.hasErrorFlag = true;
        this.cdr.detectChanges();
      }
    });
  }

  setMetric(metric: 'temp' | 'rain'): void {
    this.activeMetric = metric;
    this.renderChart();
  }

  private renderChart(): void {
    if (!this.weatherBundle || !this.canvasRef) return;
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const daily = this.weatherBundle.daily;
    const isTempMode = this.activeMetric === 'temp';
    const dataSet = isTempMode ? daily.temperature_2m_max : daily.precipitation_sum;
    const labelText = isTempMode ? 'Температура (Celsius)' : 'Сумма осадков (mm)';
    const lineColor = isTempMode ? '#7fb0ff' : '#60d0a0';
    const fillColor = isTempMode ? 'rgba(127, 176, 255, 0.1)' : 'rgba(96, 208, 160, 0.1)';

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: daily.time.map((t, idx) => this.getDayLabel(t, idx === 0)),
        datasets: [{
          label: labelText,
          data: dataSet,
          borderColor: lineColor,
          backgroundColor: fillColor,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: lineColor,
          pointBorderColor: '#0a1020',
          tension: 0.25,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { labels: { color: '#bfd6ff' } },
          tooltip: { backgroundColor: '#0e162e', titleColor: '#cae0ff', bodyColor: '#9db9f0' }
        },
        scales: {
          y: { ticks: { color: '#cae0ff' }, grid: { color: '#2a3a6040' } },
          x: { ticks: { color: '#cae0ff' }, grid: { display: false } }
        }
      }
    });
  }

  getWeatherSymbol(code: number): string { return this.weatherApi.getWeatherSymbol(code); }
  getWeatherPhrase(code: number): string { return this.weatherApi.getWeatherPhrase(code); }
  getDayLabel(date: string, isToday: boolean): string { return this.weatherApi.formatDayLabel(date, isToday); }
  formatTemp(t: number): string { return Math.round(t).toString(); }
  formatPop(p: number): string { return this.cityUtil.formatPop(p); }
}