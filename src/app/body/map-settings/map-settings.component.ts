import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FeatureType } from '../../types/FeatureType';
import { ActivatedRoute, Router } from '@angular/router';
import { GeolocationService } from '../../services/geolocation.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private geoService: GeolocationService
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
        this.calculateIt();
        break;
    }
  };

  getFeatureType = (): string => {
    return this.settingsForm.value.featureType;
  };

  getGeoAddress = (): string => {
    return this.settingsForm.value.geoAddress;
  };

  getReverseLon = (): string => {
    return this.settingsForm.value.reverseLongitude;
  };

  getReverseLat = (): string => {
    return this.settingsForm.value.reverseLatitude;
  };

  getOrigin = (): string => {
    return this.settingsForm.value.origin;
  };

  getDestination = (): string => {
    return this.settingsForm.value.destination;
  };

  getTransport = (): string => {
    return this.settingsForm.value.transportType;
  };

  geolocalize = (): void => {
    this.geoService.getCoordinatesFromAddress(
      `https://api-adresse.data.gouv.fr/search?q=${this.getGeoAddress()}&limit=1`)
      .subscribe((coords) => {
        this.geoLongitude = coords.longitude;
        this.geoLatitude = coords.latitude;
        this.geoService.setPoint(coords.features);
      });
  }

  reverse = (): void => {
    const lon = this.getReverseLon().trim() ? this.getReverseLon() : 2.347;
    const lat = this.getReverseLat().trim() ? this.getReverseLat() : 48.859;
    this.geoService.getAddressFromCoordinates(
      `https://api-adresse.data.gouv.fr/reverse?lon=${lon}&lat=${lat}`)
      .subscribe((coords) => {
        this.reverseAddress = coords.address;
        this.geoService.setPoint(coords.features);
      });
  }

  calculateIt = (): void => {
    this.geoService.getIti(
      `http://wxs.ign.fr/choisirgeoportail/itineraire/rest/route.json?origin=${this.getOrigin()}&destination=${this.getDestination()}&method=DISTANCE&graphName=${this.getTransport()}`
    ).subscribe((itinerary) => {
        this.distance = itinerary.distance;
        this.duration = itinerary.duration;
        this.geoService.setIti(itinerary.wkt);
      });
  }
}
