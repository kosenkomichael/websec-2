import { Component, AfterViewInit, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { CityItem } from '../../models/city.models';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() citiesCatalog: CityItem[] = [];
  @Output() cityPicked = new EventEmitter<CityItem>();

  private mapCore: L.Map | null = null;
  private markersPool: L.CircleMarker[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.initMapSystem();
  }

  ngOnChanges(): void {
    if (this.mapCore) this.refreshMarkers();
  }

  private initMapSystem(): void {
    const container = document.getElementById('globeContainer');
    if (!container || this.mapCore) return;

    this.mapCore = L.map(container, {
      center: [61.5, 95.0],
      zoom: 3.8,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB | OpenStreetMap',
      subdomains: 'abcd'
    }).addTo(this.mapCore);

    setTimeout(() => {
      this.mapCore?.invalidateSize();
      this.refreshMarkers();
    }, 120);
  }

  private refreshMarkers(): void {
    if (!this.mapCore) return;
    this.markersPool.forEach(m => m.remove());
    this.markersPool = [];

    this.citiesCatalog.forEach(city => {
      const marker = L.circleMarker([city.lat, city.lon], {
        radius: 5.5,
        color: '#5f9eff',
        fillColor: '#2a6eff',
        fillOpacity: 0.85,
        weight: 1.2
      }).addTo(this.mapCore!);

      marker.bindTooltip(city.name, { direction: 'top' });
      marker.on('click', () => {
        this.moveMapTo(city.lat, city.lon);
        this.cityPicked.emit(city);
      });
      this.markersPool.push(marker);
    });
    this.cdr.detectChanges();
  }

  moveMapTo(lat: number, lon: number): void {
    this.mapCore?.setView([lat, lon], 8.5, { animate: true });
  }
}