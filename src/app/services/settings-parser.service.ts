import { Injectable } from '@angular/core';
import { Settings } from '../types/Settings';
import { PlaceholderType } from '../types/PlaceholderType';

import secrets from '../../assets/default-secrets.json';
import settings from '../../assets/default-settings.json';

@Injectable({
  providedIn: 'root'
})
export class SettingsParserService {
  private settings: Settings;
  private secrets: Map<string, string>;

  static transformToMap = (object: any): Map<string, string> => {
    const out = new Map<string, string>();
    Object.entries(object).forEach((entry) => {
      out.set(entry[0], entry[1] + '');
    });
    return out;
  };

  constructor() {
    this.secrets = this.updateSecrets(secrets);
    this.settings = this.updateSettings(settings);
  }

  public getSettings = (): Settings => {
    return this.settings;
  }

  public updateSecrets = (newSecrets: any) => {
    this.secrets = SettingsParserService.transformToMap(newSecrets);
    return this.secrets;
  }

  public updateSettings = (newSettings: Settings) => {
    this.settings = this.resolveSecrets(this.secrets, newSettings);
    return this.settings;
  }

  resolveSecrets = (newSecrets: Map<string, string>, newSettings: Settings):
    Settings => {
    let settingsString = JSON.stringify(newSettings);
    settingsString = this.resolve(
      settingsString,
      PlaceholderType.Secret,
      newSecrets
    );
    return JSON.parse(settingsString);
  };

  resolveVariables = (toResolve: string, variables: Map<string, string>):
    string => {
    return this.resolve(toResolve, PlaceholderType.Variable, variables);
  };

  /** Resolve the variables inside the defined placeholder */
  private resolve = (
    toResolve: string,
    placeholder: PlaceholderType,
    variables: Map<string, string>
  ):
    string => {
    switch (placeholder) {
      case PlaceholderType.Secret:
        variables.forEach((value, key) => {
          // @ts-ignore
          toResolve = toResolve.replaceAll(`((${ key }))`, value);
        });
        break;
      case PlaceholderType.Variable:
        variables.forEach((value, key) => {
          // @ts-ignore
          toResolve = toResolve.replaceAll(`{{${ key }}}`, value);
        });
        break;
    }
    return toResolve;
  };
}
