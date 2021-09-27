import { Injectable } from '@angular/core';
import { Coordinates } from '../types/Coordinates';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Settings } from '../types/Settings';

// @ts-ignore
import jp from 'jsonpath'

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private currentPoint = new Subject<any>();

  constructor(private http: HttpClient) {
  }

  public getCoordinatesFromAddress = (getRequest: string, settings: Settings):
    Observable<Coordinates> => {
    return this.http.get<any>(getRequest)
      .pipe(map((data) => {
        if(!data.features.length)
          throw new Error("No result was found for request: " + getRequest)
        const geolocation = settings.features.ol.geolocation[0];
        return {
          longitude: jp.query(data, '$' + geolocation.longitudeFieldPath)[0],
          latitude: jp.query(data, '$' + geolocation.latitudeFieldPath)[0],
          features: jp.query(data, '$' + geolocation.featuresFieldPath)[0],
        };
      }))
  }

  public getAddressFromCoordinates = (getRequest: string):
    Observable<Coordinates> => {
    return this.http.get<any>(getRequest)
      .pipe(map((data) => {
        if(!data.features.length)
          throw new Error("No result was found for request: " + getRequest)
        return {
          address: data.features[0].properties.label,
          features: data
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

