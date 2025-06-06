import { Component, Input, Output, EventEmitter } from '@angular/core';
import MunicipalDependencies from 'src/app/models/municipalDependencie';
import { Ticket } from 'src/app/models/ticket';

@Component({
  selector: 'app-ticket-creation-modal',
  templateUrl: './ticket-creation-modal.component.html',
  styleUrls: ['./ticket-creation-modal.component.css'],
})
export class TicketCreationModalComponent {
  @Input({ required: true }) modalId!: string;

  public readonly maxLengthDesc: number = 250;
  public processStep: number = 0;
  public ticket = new Ticket();

  public cancelCreation = new EventEmitter();

  /**
   * returns an array with the names of the dependencies
   */
  get MunicipalDependenciesArr() {
    let dependenciesArr: string[] = [];

    for (let dependency of Object.values(MunicipalDependencies)) {
      dependenciesArr.push(dependency);
    }

    return dependenciesArr;
  }

  setDependency(selectedValue: string) {
    const key = Object.keys(MunicipalDependencies).find(
      (k) =>
        MunicipalDependencies[k as keyof typeof MunicipalDependencies] ===
        selectedValue
    );

    if (key) {
      this.ticket.dependency = key as MunicipalDependencies;
    }
  }

  nextStep() {
    this.processStep++;
    this.ticket.dateTime = Date.now();
  }
  prevStep() {
    this.processStep--;
  }

  CancelTicket() {
    this.ticket = new Ticket();
    this.processStep = 0;
    this.cancelCreation.emit();
  }

  formatDateTime(timestamp: number): string {
    const date = new Date(timestamp);

    const day = ('0' + date.getDate()).slice(-2); // Día con ceros a la izquierda
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Mes con ceros a la izquierda
    const year = date.getFullYear(); // Año
    const hours = ('0' + date.getHours()).slice(-2); // Horas con ceros a la izquierda
    const minutes = ('0' + date.getMinutes()).slice(-2); // Minutos con ceros a la izquierda

    return `${day}/${month}/${year} ${hours}:${minutes}`; // Retorna el formato deseado
  }
}
