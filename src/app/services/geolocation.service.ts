import { Injectable } from '@angular/core';
import { Coordinates } from '../types/Coordinates';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Settings } from '../types/Settings';

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
        return {
          longitude: data.features[0].geometry.coordinates[0],
          latitude: data.features[0].geometry.coordinates[1],
          features: data
        };
      }))
  }

  public getAddressFromCoordinates = (getRequest: string):
    Observable<Coordinates> => {
    return this.http.get<any>(getRequest)
      .pipe(map((data) => {
        return {
          address: data.features[0].properties.label,
          features: data
        };
      }))
  }

  public setPoint = (point: any): void => {
    console.log(point);
    this.currentPoint.next(point);
  }

  public onPointSet = (): Observable<any> => {
    return this.currentPoint.asObservable();
  }
}

