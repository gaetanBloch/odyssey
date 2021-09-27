import { Injectable } from '@angular/core';
import { Coordinates } from '../types/Coordinates';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

// @ts-ignore
import jp from 'jsonpath'
import { SettingsParserService } from './settings-parser.service';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private currentPoint = new Subject<any>();

  constructor(private http: HttpClient, private settingsService: SettingsParserService) {
  }

  public getCoordinatesFromAddress = (request:string):
    Observable<Coordinates> => {
    const geolocation = this.settingsService.getSettings().features.ol.geolocation[0];
    return this.http.get<any>(request)
      .pipe(map((data) => {
        if(!data.features.length) {
          throw new Error("No result was found for request: " + request);
        }
        return {
          longitude: jp.query(data, '$' + geolocation.longitudeFieldPath)[0],
          latitude: jp.query(data, '$' + geolocation.latitudeFieldPath)[0],
          features: jp.query(data, '$' + geolocation.featuresFieldPath)[0],
        };
      }))
  }

  public getAddressFromCoordinates = (request:string):
    Observable<Coordinates> => {
    const reverse = this.settingsService.getSettings().features.ol.reverseGeolocation[0];
    return this.http.get<any>(request)
      .pipe(map((data) => {
        if(!data.features.length) {
          throw new Error("No result was found for request: " + reverse.requestUrl)
        }
        return {
          address: jp.query(data, '$' + reverse.addressFieldPath)[0],
          features: jp.query(data, '$' + reverse.featuresFieldPath)[0],
        };
      }))
  }

  public setPoint = (point: any): void => {
    this.currentPoint.next(point);
  }

  public onPointSet = (): Observable<any> => {
    return this.currentPoint.asObservable();
  }
}

