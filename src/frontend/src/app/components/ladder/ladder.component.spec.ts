import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LadderComponent } from './ladder.component';

describe('LadderComponent', () => {
  let component: LadderComponent;
  let fixture: ComponentFixture<LadderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LadderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LadderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
