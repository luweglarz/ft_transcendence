import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthCallbackComponent } from './oauth-callback.component';

describe('OauthComponent', () => {
  let component: OauthCallbackComponent;
  let fixture: ComponentFixture<OauthCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OauthCallbackComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
