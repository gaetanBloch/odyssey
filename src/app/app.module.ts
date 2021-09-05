import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponentModule } from './body/body.component.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [BrowserModule, AppRoutingModule, BodyComponentModule ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
