import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketFilterInput } from '@app/graphql/types/ticket.types';
import { Ticket } from '@app/interfaces/ticket.interface';
import {
  TICKET_SERVICE_INTERFACE_TOKEN,
  TicketServiceInterface,
} from '@app/interfaces/ticket.service.interface';
import { TicketStatus } from '@app/interfaces/ticket_status.interface';
import { User } from '@app/interfaces/user.interface';
import { TicketSatusService } from '@app/services/ticket-satus.service';
import { UserService } from '@app/services/user.service';
@Component({
  selector: 'app-ticket-administartion-panel',
  templateUrl: './ticket-administartion-panel.component.html',
  styleUrls: ['./ticket-administartion-panel.component.css'],
})
export class TicketAdministartionPanelComponent implements OnInit {
  minimized_ticket_id(arg0: string) {
    return arg0.split('-')[0];
  }
  selectedTicketId: any;
  selectTicket(arg0: string) {
    this.selectedTicketId = arg0;
  }
  public user!: User;
  public searchTicktId: string = '';
  public ticketList: Ticket[] = [];
  private statusList: TicketStatus[] = [];
  public showSpinner: boolean = true;
  public maxPagesCount: number = -1;
  public currentPageNumber: number = 1;
  public tableRowsLimit: number = 12;
  public filter: TicketFilterInput = {
    page: this.currentPageNumber,
    limit: this.tableRowsLimit,
    ticket_id: this.searchTicktId ? this.searchTicktId : undefined,
  };
  get currentRolId() {
    return Number(this.user.role?.id) ?? -1;
  }
  constructor(
    @Inject(TICKET_SERVICE_INTERFACE_TOKEN)
    private ticketDataService: TicketServiceInterface,
    private userService: UserService,
    private router: Router,
    private ticketSatusService: TicketSatusService
  ) {}
  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getUserData();
    this.ticketDataService.ticketCounter$.subscribe((max_tickets) => {
      this.maxPagesCount = Math.ceil(max_tickets / this.tableRowsLimit);
    });
    this.ticketDataService.ticketList$.subscribe((ticketList) => {
      this.ticketList = ticketList;
      this.showSpinner = false;
    });
    this.showSpinner = true;
    this.ticketDataService.UpdateTicketList(this.filter);
    this.ticketDataService.UpdateTicketCounter(this.filter);
  }
  goToMap() {
    this.router.navigate(['/map']);
  }
  formatDate(date: Date): string {
    const dateStr = date.toString();
    return dateStr.split('T')[0];
  }
  changePageTo(pageNumber: number) {
    this.showSpinner = true;
    if (pageNumber < 1) return;
    if (pageNumber > this.maxPagesCount) return;
    this.filter.page = pageNumber;
    this.currentPageNumber = pageNumber;
    this.ticketDataService.UpdateTicketList(this.filter);
  }
  get currentPagesNavigator(): number[] {
    if (this.currentPageNumber == 1 || this.currentPageNumber == 2) {
      const toReturn = [];
      for (let i = 0; i < 3; i++) {
        if (i + 1 <= this.maxPagesCount) toReturn.push(i + 1);
      }
      return toReturn;
    } else if (
      this.currentPageNumber == this.maxPagesCount ||
      this.currentPageNumber == this.maxPagesCount - 1
    ) {
      return [
        this.maxPagesCount - 2,
        this.maxPagesCount - 1,
        this.maxPagesCount,
      ];
    }
    return [
      this.currentPageNumber - 1,
      this.currentPageNumber,
      this.currentPageNumber + 1,
    ];
  }
  onTicketUpdated($event: Event) {
    console.log('Ticket updated');
  }
  searchTicketById() {
    this.showSpinner = true;
    this.filter.page = 1;
    this.currentPageNumber = 1;
    this.filter.ticket_id = this.searchTicktId ? this.searchTicktId : undefined;
    this.ticketDataService.UpdateTicketList(this.filter);
    this.ticketDataService.UpdateTicketCounter(this.filter);
  }
}
