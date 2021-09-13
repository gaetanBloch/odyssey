import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Itinerary } from '../types/Itinerary';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private itinerary = new Subject<any>();

  constructor(private http: HttpClient) { }

  public getItinerary = (getRequest: string): Observable<Itinerary> => {
    return this.http.get<any>(getRequest).pipe(map((data) => {
      return {
        wkt: data.geometryWkt,
        distance: data.distance,
        duration: data.duration
      };
    }))
  }

  public setItinerary = (wkt: any): void => {
    this.itinerary.next(wkt);
  }

  public onItinerarySet = (): Observable<any> => {
    return this.itinerary.asObservable();
  }
}
