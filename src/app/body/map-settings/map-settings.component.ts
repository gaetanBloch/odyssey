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
    geoAddress: new FormControl('')
  });
  geoLongitude = ' ';
  geoLatitude = ' ';

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
    }
  };

  getFeatureType = (): string => {
    return this.settingsForm.value.featureType;
  };

  getGeoAddress = (): string => {
    return this.settingsForm.value.geoAddress;
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
}
