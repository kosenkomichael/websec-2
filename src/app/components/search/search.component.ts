import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CityService } from '../../services/city.service';
import { CityItem } from '../../models/city.models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  queryText = '';
  suggestedCities: CityItem[] = [];
  showDropdown = false;

  @Output() cityPicked = new EventEmitter<CityItem>();

  constructor(private cityService: CityService) {}

  onSearchInput(): void {
    if (this.queryText.length < 2) {
      this.suggestedCities = [];
      this.showDropdown = false;
      return;
    }
    this.suggestedCities = this.cityService.searchLocal(this.queryText);
    this.showDropdown = this.suggestedCities.length > 0;
  }

  selectCity(city: CityItem): void {
    this.queryText = city.name;
    this.showDropdown = false;
    this.cityPicked.emit(city);
  }

  @HostListener('document:click', ['$event'])
  closeOnOutside(e: Event): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.search-panel')) {
      this.showDropdown = false;
    }
  }

  formatPop(pop: number): string {
    return this.cityService.formatPop(pop);
  }
}