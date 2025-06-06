import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCommonComponent } from './map-common.component';

describe('MapCommonComponent', () => {
  let component: MapCommonComponent;
  let fixture: ComponentFixture<MapCommonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapCommonComponent]
    });
    fixture = TestBed.createComponent(MapCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
