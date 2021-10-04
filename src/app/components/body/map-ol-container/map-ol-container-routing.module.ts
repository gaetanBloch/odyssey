import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapOlContainerComponent } from './map-ol-container.component';

const routes: Routes = [
  { path: '', component: MapOlContainerComponent, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapOlContainerRoutingModule {
}
