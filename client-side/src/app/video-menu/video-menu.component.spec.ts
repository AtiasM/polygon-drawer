import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoMenuComponent } from './video-menu.component';

describe('VideoMenuComponent', () => {
  let component: VideoMenuComponent;
  let fixture: ComponentFixture<VideoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
