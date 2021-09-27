import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FeatureType } from '../../types/FeatureType';
import { Router } from '@angular/router';
import { GeolocationService } from '../../services/geolocation.service';
import { ItineraryService } from '../../services/itinerary.service';

import { SettingsParserService } from '../../services/settings-parser.service';

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
    transportMethod: new FormControl('time'),
  });
  geoLongitude? = ' ';
  geoLatitude? = ' ';
  reverseAddress? = ' ';
  distance? = ' ';
  duration? = ' ';
  home = true

  constructor(
    private router: Router,
    private geoService: GeolocationService,
    private itineraryService: ItineraryService,
    private settingsParser: SettingsParserService,
  ) {
  }

  ngOnInit(): void {
    this.home = this.router.url === '/';
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

  getMethod = () => this.getSettings('transportMethod');

  geolocalize = (): void => {
    const values = new Map<string, string>();
    values.set('address', this.getGeoAddress());
    const request = this.settingsParser.resolveVariables(
      this.settingsParser.getSettings().features.ol.geolocation[0].requestUrl,
      values
    );
    this.geoService.getCoordinatesFromAddress(request)
      .subscribe((coords) => {
        this.geoLongitude = coords.longitude;
        this.geoLatitude = coords.latitude;
        this.geoService.setPoint(coords.features);
      }, (error) => alert(error.message));
  }

  reverse = (): void => {
    const values = new Map<string, string>();
    values.set('lon', this.getReverseLon() ? this.getReverseLon() : '2.347');
    values.set('lat', this.getReverseLat() ? this.getReverseLat() : '48.859');
    const request = this.settingsParser.resolveVariables(
      this.settingsParser.getSettings().features.ol.reverseGeolocation[0].requestUrl,
      values
    );
    this.geoService.getAddressFromCoordinates(request)
      .subscribe((coords) => {
        this.reverseAddress = coords.address;
        this.geoService.setPoint(coords.features);
      }, (error) => alert(error.message));
  }

  calculateItinerary = (): void => {
    const values = new Map<string, string>();
    values.set('origin', this.getOrigin());
    values.set('destination', this.getDestination());
    values.set('method', this.getMethod());
    values.set('locomotion', this.getTransport());
    const request = this.settingsParser.resolveVariables(
      this.settingsParser.getSettings().features.ol.itinerary[0].requestUrl,
      values
    );
    this.itineraryService.getItinerary(request)
      .subscribe(
      (itinerary) => {
        this.distance = itinerary.distance;
        this.duration = itinerary.duration;
        this.itineraryService.setItinerary(itinerary.wkt);
      }, (error) => alert(error.message)
    );
  }

  private getSettings = (value: string): string => {
    return this.settingsForm.value[value];
  }

  onSecretsUploaded = (file: File): void => {
    this.onFileUploaded(file, (result) => {
      this.settingsParser.updateSecrets(result);
    })
  }

  onSettingsUploaded = (file: File): void => {
    this.onFileUploaded(file, (result) => {
      this.settingsParser.updateSettings(result);
    })
  }

  private onFileUploaded = (file: File, cb: (result: any) => void): void => {
    if(!file) return;
    // Read uploaded file
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      // @ts-ignore
      cb(JSON.parse(fileReader.result))
    }
    fileReader.readAsText(file);
  }
}
