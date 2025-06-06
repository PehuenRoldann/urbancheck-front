import { Injectable } from '@angular/core';
import { TicketDataService } from '../interfaces/ticket-data-service';
import mapboxgl, { Marker } from 'mapbox-gl';
import { delay, map, Observable, timer } from 'rxjs';
import { MarkerData } from '../models/markerData';
import { Ticket } from '../models/ticket';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root',
})
export class TicketDataJsonService implements TicketDataService {
  private jsonUrl = 'assets/test_data/';
  constructor(private http: HttpClient) {}

  /* GetTicketData(ticketId: string): Observable<Ticket> {
    let ticketsData = this.http
      .get<Ticket[]>(this.jsonUrl + 'tickets.json')
      .pipe(
        delay(2000), // Añade un delay de 2000 ms (2 segundos)
        map((data) => data.map((ticket) => new Ticket())) // Mapea cada objeto JSON a una instancia de Item
      );

    ticketsData;
  } */

  GetTicketData(ticketId: string): Observable<Ticket | undefined> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
      delay(2000), // Simula el delay para imitar una llamada a API
      map((data) => data.find((item) => item.id === ticketId)), // Encuentra el elemento que coincide con el ID
      map((item) => (item ? new Ticket(item) : undefined)) // Convierte el resultado a instancia de Item o undefined
    );
  }

  // Función para simular una llamada a una API con un retraso
  GetMarkers(): Promise<MarkerData[]> {
    return new Promise((resolve) => {
      // Simulamos un retraso de 2 segundos
      setTimeout(() => {
        resolve(this.DATA);
      }, 2000); // 2000 ms = 2 segundos
    });
  }

  private readonly DATA = [
    {
      id: 1,
      lng: -58.23029921189274,
      lat: -32.485129825270334,
    },
    {
      id: 2,
      lng: -58.22872620255508,
      lat: -32.4840917606197,
    },
    {
      id: 3,
      lng: -58.22860714778599,
      lat: -32.48410636016587,
    },
    {
      id: 4,
      lng: -58.23031949712937,
      lat: -32.493964062197826,
    },
    {
      id: 5,
      lng: -58.22906735700833,
      lat: -32.49627731002452,
    },
    {
      id: 6,
      lng: -58.230820612911835,
      lat: -32.493058507899555,
    },
    {
      id: 7,
      lng: -58.230825518214935,
      lat: -32.48691013063389,
    },
    {
      id: 8,
      lng: -58.228035362856616,
      lat: -32.48750363200155,
    },
    {
      id: 9,
      lng: -58.229257588618744,
      lat: -32.491913474578546,
    },
    {
      id: 10,
      lng: -58.2278057188553,
      lat: -32.48838064524328,
    },
    {
      id: 11,
      lng: -58.22990532553968,
      lat: -32.49005595468341,
    },
    {
      id: 12,
      lng: -58.22889714734307,
      lat: -32.49551183563454,
    },
    {
      id: 13,
      lng: -58.23079447163555,
      lat: -32.49527110133387,
    },
    {
      id: 14,
      lng: -58.22997755867469,
      lat: -32.49080583918474,
    },
    {
      id: 15,
      lng: -58.22976191416809,
      lat: -32.48455170768552,
    },
    {
      id: 16,
      lng: -58.23093598611594,
      lat: -32.484884045693235,
    },
    {
      id: 17,
      lng: -58.23066263392868,
      lat: -32.49552219507906,
    },
    {
      id: 18,
      lng: -58.228700784662415,
      lat: -32.496460012773696,
    },
    {
      id: 19,
      lng: -58.23081296996577,
      lat: -32.48888428828362,
    },
    {
      id: 20,
      lng: -58.22925818128761,
      lat: -32.48940243120068,
    },
    {
      id: 21,
      lng: -58.22755201014256,
      lat: -32.4938075274643,
    },
  ];
}


