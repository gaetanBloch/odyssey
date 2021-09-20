import { NgModule } from '@angular/core';
import { BodyComponent } from './body.component';
import { MapSettingsComponent } from './map-settings/map-settings.component';
import { BodyRoutingModule } from './body-routing.module';
import { MapLandingComponent } from './map-landing/map-landing.component';
import { MapOlContainerModule } from './map-ol-container/map-ol-container.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FileUploaderComponent } from '../components/file-uploader/file-uploader.component';

@NgModule({
  imports: [
    CommonModule,
    BodyRoutingModule,
    MapOlContainerModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [],
  declarations: [
    BodyComponent,
    MapSettingsComponent,
    MapLandingComponent,
    FileUploaderComponent
  ],
  providers: [],
})
export class BodyModule {
}
