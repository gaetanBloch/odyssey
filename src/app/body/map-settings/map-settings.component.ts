import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FeatureType } from '../../types/FeatureType';
import { Router } from '@angular/router';
import { GeolocationService } from '../../services/geolocation.service';
import { ItineraryService } from '../../services/itinerary.service';
import { SettingsParserService } from '../../services/settings-parser.service';
import { Settings } from '../../types/Settings';

import settings from '../../../assets/default-settings.json';

@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss']
})
export class MapSettingsComponent implements OnInit {
  settingsForm = new FormGroup({
    featureType: new FormControl(''),
    geoAddress: new FormControl(''),
    reverseLongitude: new FormControl(''),
    reverseLatitude: new FormControl(''),
    origin: new FormControl('-0.67561,45.87869'),
    destination: new FormControl('-0.24465,46.01524'),
    transportType: new FormControl('voiture'),
  });
  geoLongitude? = ' ';
  geoLatitude? = ' ';
  reverseAddress? = ' ';
  distance? = ' ';
  duration? = ' ';
  home = true

  settings?: Settings;

  constructor(
    private router: Router,
    private geoService: GeolocationService,
    private itineraryService: ItineraryService,
    private settingsParser: SettingsParserService,
  ) {
  }

  ngOnInit(): void {
    this.home = this.router.url === '/';
    this.settings = this.settingsParser.resolveSecrets(settings);
  }

  // Getting all values of Feature enum
  getFeatures = (): (FeatureType | string)[] =>
    Object.keys(FeatureType).filter((item) => isNaN(Number(item)));

  onSubmit = (): void => {
    this.home = false;
    this.router.navigate(['ol']);
    switch (this.getFeatureType()) {
      case 'geolocation':
        this.geolocalize();
        break;
      case 'reverseGeolocation':
        this.reverse();
        break;
      case 'itinerary':
        this.calculateItinerary();
        break;
    }
  };

  getFeatureType = () => this.getSettings('featureType');

  getGeoAddress = () => this.getSettings('geoAddress');

  getReverseLon = () => this.getSettings('reverseLongitude');

  getReverseLat = () => this.getSettings('reverseLatitude');

  getOrigin = () => this.getSettings('origin');

  getDestination = () => this.getSettings('destination');

  getTransport = () => this.getSettings('transportType');

  geolocalize = (): void => {
    const request = this.settingsParser.resolveVariables(
      settings.features.ol.geolocation[0].requestUrl,
      { address: this.getGeoAddress() }
    );
    this.geoService.getCoordinatesFromAddress(request, settings)
      .subscribe((coords) => {
        this.geoLongitude = coords.longitude;
        this.geoLatitude = coords.latitude;
        this.geoService.setPoint(coords.features);
      });
  }

  reverse = (): void => {
    const lon = this.getReverseLon() ? this.getReverseLon() : 2.347;
    const lat = this.getReverseLat() ? this.getReverseLat() : 48.859;
    this.geoService.getAddressFromCoordinates(
      `https://api-adresse.data.gouv.fr/reverse?lon=${lon}&lat=${lat}`)
      .subscribe((coords) => {
        this.reverseAddress = coords.address;
        this.geoService.setPoint(coords.features);
      });
  }

  calculateItinerary = (): void => {
    this.itineraryService.getItinerary(
      `https://wxs.ign.fr/choisirgeoportail/itineraire/rest/route.json?origin=${this.getOrigin()}&destination=${this.getDestination()}&method=DISTANCE&graphName=${this.getTransport()}`
    ).subscribe((itinerary) => {
        this.distance = itinerary.distance;
        this.duration = itinerary.duration;
        this.itineraryService.setItinerary(itinerary.wkt);
      });
  }

  private getSettings(value: string): string {
    return this.settingsForm.value[value];
  }
}
