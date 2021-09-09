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
  });
  geoLongitude? = ' ';
  geoLatitude? = ' ';
  reverseAddress? = ' ';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private geoService: GeolocationService
  ) {
  }

  ngOnInit(): void {
  }

  // Getting all values of Feature enum
  getFeatures = (): (FeatureType | string)[] =>
    Object.keys(FeatureType).filter((item) => isNaN(Number(item)));

  onSubmit = (): void => {
    this.router.navigate(['ol']);
    switch (this.getFeatureType()) {
      case 'geolocation':
        this.geolocalize();
        break;
      case 'reverseGeolocation':
        this.reverse();
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
}
