import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import { ErrorResponse } from '@app/interfaces/error_response.interface';
import { Issue } from '@app/interfaces/issue.interface';
import { IssuesService } from '@app/services/issues.service';
import { PhotoManagerService } from '@app/services/photo-manager.service';
import { UserService } from '@app/services/user.service';
import { delay } from 'rxjs';
import {
  MAP_SERVICE_INTERFACE_TOKEN,
  MapServiceInterface,
} from 'src/app/interfaces/map.service.interface';
import {
  TICKET_SERVICE_INTERFACE_TOKEN,
  TicketServiceInterface,
} from 'src/app/interfaces/ticket.service.interface';
import MunicipalIssues, {
  DEPENDENCIES_MAP_IDS,
  getDependencyId,
} from 'src/app/models/municipalDependencie';
import { Ticket } from 'src/app/models/ticket';

interface CreateTicketInputInterface {
  description: string;
  latitude: number | null;
  longitude: number | null;
  issueId: number | null;
  imageUrl: string | null;
  statusId: number | null;
  priorityId: number | null;
}

@Component({
  selector: 'app-ticket-creation-modal',
  templateUrl: './ticket-creation-modal.component.html',
  styleUrls: ['./ticket-creation-modal.component.css'],
})
export class TicketCreationModalComponent implements OnInit {
  @Input({ required: true }) modalId!: string;
  @Output() ticketCreated: EventEmitter<any> = new EventEmitter();

  public readonly maxLengthDesc: number = 250;

  public StepEnum = {
    SelectProblem: 0,
    DescribeIssue: 1,
    AddPhoto: 2,
    Confirm: 3,
    Result: 4,
  };

  public ticketCreationInput: CreateTicketInputInterface = {
    description: '',
    latitude: null,
    longitude: null,
    issueId: null,
    imageUrl: null,
    statusId: null, // Asignar un valor predeterminado
    priorityId: null, // Asignar un valor predeterminado
  };

  public issuesList: Issue[] = [];

  public processStep: number = this.StepEnum.SelectProblem;
  // public ticket = new Ticket(); BORRAR

  public res = {
    exito: '',
    mensaje: '',
    src: '',
  };

  /// Photo upload
  public previewUrls: string[] = [];
  public files: File[] = []; // originales para subir
  public maxFiles = 1; // opcional
  public maxSizeMB = 200; // opcional

  public cancelCreation = new EventEmitter();
  searchTerm: string = '';

  constructor(
    @Inject(TICKET_SERVICE_INTERFACE_TOKEN)
    private ticketService: TicketServiceInterface,
    @Inject(MAP_SERVICE_INTERFACE_TOKEN)
    private mapService: MapServiceInterface,
    private photoManager: PhotoManagerService,
    private userService: UserService,
    private issueService: IssuesService
  ) {}

  ngOnInit(): void {
    this.mapService.lastCoords$.subscribe((coords) => {
      this.ticketCreationInput.latitude = coords.lat;
      this.ticketCreationInput.longitude = coords.lng;
    });

    this.issueService.issuesList$.subscribe((issues) => {
      this.issuesList = issues;
    });

    this.issueService.updateIssuesData();
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
    const description = this.ticketCreationInput.description;
    const longitud = this.ticketCreationInput.longitude;
    const latitud = this.ticketCreationInput.latitude;

    let ticketImgUrl: string = '';

    try {
      const userData = await this.userService.getUserData();

      delay(2000); // DEBUG
      const photo =
        this.previewUrls.length > 0
          ? await this.photoManager.fetchFileFromUrl(this.previewUrls[0])
          : null;

      if (photo) {
        ticketImgUrl = await this.photoManager.uploadImage(photo, userData.id);
      }

      delay(4000); // DEBUG

      const result = await this.ticketService.AddTicket(
        description,
        parseInt(this.ticketCreationInput.issueId?.toString() ?? '1'),
        longitud!,
        latitud!,
        ticketImgUrl
      );

      if ('id' in result && 'timestamp' in result) {
        this.res.exito = '¡Reclamo registrado exitosamente!';
        this.res.mensaje =
          'Su reclamo se registró correctamente. ' +
          '\n Será validado por un operador de la municipalidad' +
          ' y se le notificará cualquier actualización.';

        this.res.src = 'assets/images/urbancheck.png';

        this.ticketCreated.emit({
          success: true,
          message: 'Ticket creado exitosamente.',
        });
      } else {
        const error = result as ErrorResponse;
        console.error('Error en la creación del ticket:', error.message);

        this.res.exito = 'Error!';
        this.res.mensaje = error.message;
        this.res.src = 'assets/images/emoji-sad-svgrepo-com.svg';

        this.ticketCreated.emit({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      console.error('Error inesperado al crear el ticket:', error);

      this.res.exito = 'Error!';
      this.res.mensaje =
        'Ha ocurrido un error al intentar crear el ticket. Prueba otra vez...';
      this.res.src = 'assets/images/emoji-sad-svgrepo-com.svg';

      this.ticketCreated.emit({
        success: false,
        message:
          'Error al crear el ticket, pruebe otra vez o contacte con soporte.',
      });
    } finally {
      ticketImgUrl = '';
      this.previewUrls = [];
    }

    this.nextStep();
  }

  setIssue(selectedValue: Issue) {
    this.ticketCreationInput.issueId = selectedValue.id;
  }

  nextStep() {
    this.processStep++;
    // this.ticket.dateTime = Date.now();
  }
  prevStep() {
    this.processStep--;
  }

  CancelTicket() {
    this.ticketCreationInput = {
      description: '',
      latitude: null,
      longitude: null,
      issueId: null,
      imageUrl: null,
      statusId: null, // Asignar un valor predeterminado
      priorityId: null, // Asignar un valor predeterminado
    };

    this.clearAllFiles();

    // this.ticket = new Ticket(); BORRAR
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

  getMunicipalDependencyLabel(key: string): string {
    return MunicipalIssues[key as keyof typeof MunicipalIssues] || key;
  }

  CanContinue(): boolean {
    if (this.processStep == 0 && this.ticketCreationInput.issueId == null) {
      return false;
    } else if (
      this.processStep == 1 &&
      this.ticketCreationInput.description.length < 20
    ) {
      return false;
    } else {
      return true;
    }
  }

  onFileRemoved() {
    this.previewUrls = [];
  }
  onFileAdded($event: string) {
    this.previewUrls.push($event);
  }

  get selectedIssue(): Issue | null {
    if (this.ticketCreationInput.issueId == null) return null;

    const foundIssue = this.issuesList.find(
      (issue) => issue.id === this.ticketCreationInput.issueId
    );
    return foundIssue || null;
  }

  private async toDataURL(file: File): Promise<string> {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res(String((e?.target as any).result));
      reader.readAsDataURL(file);
    });
  }

  removeAt(i: number) {
    this.files.splice(i, 1);
    this.previewUrls.splice(i, 1);
  }

  clearAllFiles() {
    this.files = [];
    this.previewUrls = [];
  }

  async onFilesSelected(newFiles: File[]) {
    // Validaciones opcionales
    const valid = newFiles.filter(
      (f) =>
        f.type.startsWith('image/') && f.size <= this.maxSizeMB * 1024 * 1024
    );

    // Limitar cantidad total
    const room = Math.max(0, this.maxFiles - this.files.length);
    const toAdd = valid.slice(0, room);

    // Guardar originales
    this.files.push(...toAdd);

    // Generar previews (DataURL)
    for (const f of toAdd) {
      const dataUrl = await this.toDataURL(f);
      this.previewUrls.push(dataUrl);
    }
  }
}
