import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { MapContainerComponent } from './body/map-container/map-container.component';
import { MapSettingsComponent } from './body/map-settings/map-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    MapContainerComponent,
    MapSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
