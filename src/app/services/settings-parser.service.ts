import { Injectable } from '@angular/core';
import { Settings } from '../types/Settings';
import { PlaceholderType } from '../types/PlaceholderType';

@Injectable({
  providedIn: 'root'
})
export class SettingsParserService {
  private readonly SECRET_PLACHOLDER = /.+\(\(([^)]+)\)\).*/g;
  private readonly VARIABLE_PLACEHOLDER = /({{.+}})/ig;

  resolveSecrets = (settings: Settings): Settings => {
    let settingsString = JSON.stringify(settings);
    settingsString = this.resolve(
      settingsString,
      this.SECRET_PLACHOLDER,
      settings.secrets
    );
    return JSON.parse(settingsString);
  };

  resolveVariables = (toResolve: string, values: any): string => {
    return this.resolve(toResolve, this.VARIABLE_PLACEHOLDER, values);
  };

  /** Resolve the variables inside the defined placeholder */
  private resolve = (toResolve: string, placeholder: PlaceholderType, values: any):
    string => {
    switch (placeholder) {
      case PlaceholderType.Secret:
        return toResolve.replaceAll()
    }
    console.log(toResolve.replace(
      placeholder,
      (all) => {
        const match = placeholder.exec(toResolve);
        if(!match) return all;
        console.log(values[all]);
        console.log(match[1]);
        console.log(all);
        return values[all] ? match[1] : all
      }
    ));
    return ';';
    // return toResolve.replace(
    //   placeholder,
    //   (all) => values[all] ? match[i++] : all
    // );
  };
}
