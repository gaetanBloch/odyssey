import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapOlContainerComponent } from './map-ol-container.component';
import { MapOlContainerRoutingModule } from './map-ol-container-routing.module';

@NgModule({
  declarations: [MapOlContainerComponent],
  imports: [
    CommonModule, MapOlContainerRoutingModule
  ]
})
export class MapOlContainerModule {
}
