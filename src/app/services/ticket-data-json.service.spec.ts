import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Ticket } from '../models/ticket';
import { TicketDataJsonService } from './ticket-data-json.service';

describe('TicketDataJsonService', () => {
  let service: TicketDataJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TicketDataJsonService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TicketDataJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should return a ticket', () => {
    let ticketRetrived: Ticket | undefined
    let idToSearch = '1'
    service.GetTicketData(idToSearch).subscribe((ticket) => {
      ticketRetrived = ticket
    })

    expect(ticketRetrived?.id).toBe(idToSearch)
  })

});
