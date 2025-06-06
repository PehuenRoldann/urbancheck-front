import MunicipalDependencies from "./municipalDependencie";
import { TicketStates } from "./ticketStates";

export class Ticket {
  private _id: string = '';
  private _description: string = '';
  private _descriptionLength: number = 250;
  private _lat: number = 0;
  private _lng: number = 0;
  private _finalCost: number = 0;
  private _dateTime: number = Date.now();
  private _dependency!: MunicipalDependencies;
  private _createdBy: string = '';
  private _modifiedBy: string = '';
  private _state: TicketStates = TicketStates.Creado;
  private _imgUrl: string = '';

  constructor(data?: Partial<Ticket>) {
    if (data) {
      this.id = data.id ?? this._id;
      this.description = data.description ?? this._description;
      this.descriptionLength =
        data.descriptionLength ?? this._descriptionLength;
      this.lat = data.lat ?? this._lat;
      this.lng = data.lng ?? this._lng;
      this.finalCost = data.finalCost ?? this._finalCost;
      this.dateTime = data.dateTime ?? this._dateTime;
      this.dependency = data.dependency ?? this._dependency;
      this.createdBy = data.createdBy ?? this._createdBy;
      this.modifiedBy = data.modifiedBy ?? this._modifiedBy;
      this.state = data.state ?? this._state;
      this.imgUrl = data.imgUrl ?? this._imgUrl;
    }
  }

  // Métodos de acceso (getters y setters)
  get id() {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get description() {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get descriptionLength() {
    return this._descriptionLength;
  }
  set descriptionLength(value: number) {
    this._descriptionLength = value;
  }

  get lat() {
    return this._lat;
  }
  set lat(value: number) {
    this._lat = value;
  }

  get lng() {
    return this._lng;
  }
  set lng(value: number) {
    this._lng = value;
  }

  get finalCost() {
    return this._finalCost;
  }
  set finalCost(value: number) {
    this._finalCost = value;
  }

  get dateTime() {
    return this._dateTime;
  }
  set dateTime(value: number) {
    this._dateTime = value;
  }

  get dependency() {
    return this._dependency;
  }
  set dependency(value: MunicipalDependencies) {
    this._dependency = value;
  }

  get createdBy() {
    return this._createdBy;
  }
  set createdBy(value: string) {
    this._createdBy = value;
  }

  get modifiedBy() {
    return this._modifiedBy;
  }
  set modifiedBy(value: string) {
    this._modifiedBy = value;
  }

  get state() {
    return this._state;
  }
  set state(value: TicketStates) {
    this._state = value;
  }

  get imgUrl() {
    return this._imgUrl;
  }
  set imgUrl(value: string) {
    this._imgUrl = value;
  }
}
