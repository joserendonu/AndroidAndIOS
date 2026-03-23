import { Injectable } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {

  constructor(private remoteConfig: RemoteConfig) { }

  async init() {
    try {
      // 🔥 FORZAR ACTUALIZACIÓN (sin cache)
      this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
      await fetchAndActivate(this.remoteConfig);
      console.log('Remote Config cargado');
    } catch (error) {
      console.error('Error Remote Config', error);
    }
  }

  getBoolean(key: string): boolean {
    return getValue(this.remoteConfig, key).asBoolean();
  }

  getString(key: string): string {
    return getValue(this.remoteConfig, key).asString();
  }
}