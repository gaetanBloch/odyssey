import { Injectable } from '@angular/core';
import { Coordinates } from '../types/Coordinates';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsParserService } from './settings-parser.service';

// @ts-ignore
import jp from 'jsonpath';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private currentLocation = new Subject<any>();
  private currentPoint = new Subject<any>();

  constructor(private http: HttpClient, private settingsService: SettingsParserService) {
  }

  public getCoordinatesFromAddress = (request: string):
    Observable<Coordinates> => {
    const geolocation = this.settingsService.getSettings().features.ol.geolocation[0];
    let headers = new HttpHeaders();
    if (geolocation.headers) {
      geolocation.headers.forEach((h) => headers = headers.append(h.key, h.value));
    }
    return this.http.get<any>(request, { headers })
      .pipe(map((data) => {
        if (!data.features.length) {
          throw new Error('No result was found for request: ' + request);
        }
        return {
          longitude: jp.query(data, '$' + geolocation.longitudeFieldPath)[0],
          latitude: jp.query(data, '$' + geolocation.latitudeFieldPath)[0],
          features: jp.query(data, '$' + geolocation.featuresFieldPath)[0]
        };
      }));
  };

  public getAddressFromCoordinates = (request: string):
    Observable<Coordinates> => {
    const reverse = this.settingsService.getSettings().features.ol.reverseGeolocation[0];
    let headers = new HttpHeaders();
    if (reverse.headers) {
      reverse.headers.forEach((h) => headers = headers.append(h.key, h.value));
    }
    return this.http.get<any>(request, { headers })
      .pipe(map((data) => {
        if (!data.features.length) {
          throw new Error('No result was found for request: ' + reverse.requestUrl);
        }
        return {
          address: jp.query(data, '$' + reverse.addressFieldPath)[0],
          features: jp.query(data, '$' + reverse.featuresFieldPath)[0]
        };
      }));
  };

  public setLocation = (point: any): void => {
    this.currentLocation.next(point);
  };

  public onLocationSet = (): Observable<any> => {
    return this.currentLocation.asObservable();
  };

  public setPoint = (point: any): void => {
    this.currentPoint.next(point);
  };

  public onPointSet = (): Observable<any> => {
    return this.currentPoint.asObservable();
  };
}

