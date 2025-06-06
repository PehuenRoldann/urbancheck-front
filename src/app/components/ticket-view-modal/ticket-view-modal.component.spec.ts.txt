import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketViewModalComponent } from './ticket-view-modal.component';

describe('TicketViewModalComponent', () => {
  let component: TicketViewModalComponent;
  let fixture: ComponentFixture<TicketViewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketViewModalComponent]
    });
    fixture = TestBed.createComponent(TicketViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
