import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  OnInit,
} from "@angular/core";
import { ErrorResponse } from "@app/interfaces/error_response.interface";
import {
  MAP_SERVICE_INTERFACE_TOKEN,
  MapServiceInterface,
} from "src/app/interfaces/map.service.interface";
import {
  TICKET_SERVICE_INTERFACE_TOKEN,
  TicketServiceInterface,
} from "src/app/interfaces/ticket.service.interface";
import MunicipalIssues, {
  DEPENDENCIES_MAP_IDS,
  getDependencyId,
} from "src/app/models/municipalDependencie";
import { Ticket } from "src/app/models/ticket";

@Component({
  selector: "app-ticket-creation-modal",
  templateUrl: "./ticket-creation-modal.component.html",
  styleUrls: ["./ticket-creation-modal.component.css"],
})
export class TicketCreationModalComponent implements OnInit {
  @Input({ required: true }) modalId!: string;
  @Output() ticketCreated: EventEmitter<any> = new EventEmitter();

  public readonly maxLengthDesc: number = 250;
  public processStep: number = 0;
  public ticket = new Ticket();
  public res = {
    exito: "",
    mensaje: "",
    src: "",
  };

  public cancelCreation = new EventEmitter();

  constructor(
    @Inject(TICKET_SERVICE_INTERFACE_TOKEN)
    private ticketService: TicketServiceInterface,
    @Inject(MAP_SERVICE_INTERFACE_TOKEN)
    private mapService: MapServiceInterface,
  ) {}

  ngOnInit(): void {
    this.mapService.lastCoords$.subscribe((coords) => {
      this.ticket.lat = coords.lat;
      this.ticket.lng = coords.lng;
    });
  }

  /**
   * returns an array with the names of the dependencies
   */
  get MunicipalDependenciesArr() {
    let dependenciesArr: string[] = [];

    for (let dependency of Object.values(MunicipalIssues)) {
      dependenciesArr.push(dependency);
    }

    return dependenciesArr;
  }


  async AddTicket(): Promise<void> {
    const description = this.ticket.description;
    const longitud = this.ticket.lng;
    const latitud = this.ticket.lat;
    const dependencyId = getDependencyId(this.ticket.dependency) || 1;

    try {
      const result = await this.ticketService.AddTicket(
        description,
        dependencyId,
        longitud,
        latitud,
      );

      if ("id" in result && "timestamp" in result) {

        this.res.exito = "¡Éxito!";
        this.res.mensaje = "Ticket creado exitosamente!";
        this.res.src = "assets/images/like-svgrepo-com.svg";

        this.ticketCreated.emit({
          success: true,
          message: "Ticket creado exitosamente.",
        });
      } else {
        const error = result as ErrorResponse;
        console.error("Error en la creación del ticket:", error.message);

        this.res.exito = "Error!";
        this.res.mensaje = error.message;
        this.res.src = "assets/images/emoji-sad-svgrepo-com.svg";

        this.ticketCreated.emit({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      console.error("Error inesperado al crear el ticket:", error);

      this.res.exito = "Error!";
      this.res.mensaje =
        "Ha ocurrido un error al intentar crear el ticket. Prueba otra vez...";
      this.res.src = "assets/images/emoji-sad-svgrepo-com.svg";

      this.ticketCreated.emit({
        success: false,
        message:
          "Error al crear el ticket, pruebe otra vez o contacte con soporte.",
      });
    }

    this.nextStep();
  }

  setDependency(selectedValue: string) {
    const key = Object.keys(MunicipalIssues).find(
      (k) =>
        MunicipalIssues[k as keyof typeof MunicipalIssues] ===
        selectedValue,
    );

    if (key) {
      this.ticket.dependency = key as MunicipalIssues;
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

    const day = ("0" + date.getDate()).slice(-2); // Día con ceros a la izquierda
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Mes con ceros a la izquierda
    const year = date.getFullYear(); // Año
    const hours = ("0" + date.getHours()).slice(-2); // Horas con ceros a la izquierda
    const minutes = ("0" + date.getMinutes()).slice(-2); // Minutos con ceros a la izquierda

    return `${day}/${month}/${year} ${hours}:${minutes}`; // Retorna el formato deseado
  }

  getMunicipalDependencyLabel(key: string): string {
    return (
      MunicipalIssues[key as keyof typeof MunicipalIssues] || key
    );
  }

  CanContinue(): boolean {
    if (this.processStep == 0 && this.ticket.dependency == null) {
      return false;
    } else if (this.processStep == 1 && this.ticket.description.length < 20) {
      return false;
    } else {
      return true;
    }
  }
}
