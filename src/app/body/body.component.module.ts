import { NgModule } from '@angular/core';
import { BodyComponent } from './body.component';
import { MapContainerComponent } from './map-container/map-container.component';
import { MapSettingsComponent } from './map-settings/map-settings.component';

@NgModule({
  imports: [],
  exports: [BodyComponent, MapContainerComponent, MapSettingsComponent],
  declarations: [BodyComponent, MapContainerComponent, MapSettingsComponent],
  providers: [],
})

export class BodyComponentModule {
}
