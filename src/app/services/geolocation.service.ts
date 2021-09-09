import { Injectable } from '@angular/core';
import { Coordinates } from '../types/Coordinates';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Itinerary } from '../types/Itinerary';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private currentPoint = new Subject<any>();
  private iti = new Subject<any>();

  constructor(private http: HttpClient) {
  }

  public getCoordinatesFromAddress = (getRequest: string):
    Observable<Coordinates> => {
    return this.http.get<any>(getRequest)
      .pipe(map((data) => {
        console.log(data);
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
        console.log(data);
        return {
          address: data.features[0].properties.label,
          features: data
        };
      }))
  }

  public getIti = (getRequest: string): Observable<Itinerary> => {
    return this.http.get<any>(getRequest).pipe(map((data) => {
        console.log(data);
        return {
          wkt: data.geometryWkt,
          distance: data.distance,
          duration: data.duration
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

  public setIti = (wkt: any): void => {
    console.log(wkt);
    this.iti.next(wkt);
  }

  public onitiSet = (): Observable<any> => {
    return this.iti.asObservable();
  }
}

