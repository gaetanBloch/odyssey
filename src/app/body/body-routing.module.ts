import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './body.component';
import { MapLandingComponent } from './map-landing/map-landing.component';

const routes: Routes = [
  {
    path: '',
    component: BodyComponent,
    children: [
      { path: '', component: MapLandingComponent },
      {
        path: 'ol',
        loadChildren: () => import('./map-ol-container/map-ol-container.module')
          .then(m => m.MapOlContainerModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BodyRoutingModule {
}
