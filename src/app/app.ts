import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityService } from './services/city.service';
import { CityItem } from './models/city.models';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { WeatherComponent } from './components/weather/weather.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MapComponent, SearchComponent, WeatherComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  cityList: CityItem[] = [];
  selectedCity: CityItem | null = null;

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.fetchCityCatalog().subscribe({
      next: (data) => {
        this.cityList = data;
        this.cityService.storeCatalog(data);
      },
      error: (err) => console.error('City load error:', err)
    });
  }

  onCitySelected(city: CityItem): void {
    this.selectedCity = city;
  }

  dismissModal(): void {
    this.selectedCity = null;
  }
}