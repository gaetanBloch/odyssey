import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOlContainerComponent } from './map-ol-container.component';

describe('MapContainerComponent', () => {
  let component: MapOlContainerComponent;
  let fixture: ComponentFixture<MapOlContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapOlContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOlContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
