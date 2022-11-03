import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeammatchComponent } from './teammatch.component';

describe('TeammatchComponent', () => {
  let component: TeammatchComponent;
  let fixture: ComponentFixture<TeammatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeammatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeammatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
