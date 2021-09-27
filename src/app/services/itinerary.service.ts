import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Itinerary } from '../types/Itinerary';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// @ts-ignore
import jp from 'jsonpath'
import { SettingsParserService } from './settings-parser.service';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private itinerary = new Subject<any>();

  constructor(private http: HttpClient, private settingsService: SettingsParserService) { }

  public getItinerary = (request: string):
    Observable<Itinerary> => {
    const itinerary = this.settingsService.getSettings().features.ol.itinerary[0];
    return this.http.get<any>(request)
      .pipe(map((data) => {
      return {
        wkt: jp.query(data, '$' + itinerary.drawFieldPath)[0],
        distance: jp.query(data, '$' + itinerary.distanceFieldPath)[0],
        duration: jp.query(data, '$' + itinerary.durationFieldPath)[0],
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
