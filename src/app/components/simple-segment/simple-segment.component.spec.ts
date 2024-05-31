/* Copyright(c) David Rueter All rights reserved. This program is made available under the
terms of the AGPLv3 license. See the LICENSE file in the project root for more information. */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SimpleSegmentComponent } from './simple-segment.component';

describe('SimpleSegmentComponent', () => {
  let component: SimpleSegmentComponent;
  let fixture: ComponentFixture<SimpleSegmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleSegmentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
