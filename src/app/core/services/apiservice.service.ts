import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { IRequestTest } from '../models/request.interface';

import { IResponse, ITestResponse } from '../models/response.interface';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) {

    }


    getPing() {
        const url = `${environment.backendForFrontendUrl}/ping`;
        return this.http
            .get(url, { responseType: 'text' })
            .pipe();
    }

    getConectorPing() {
        const url = `${environment.backendForFrontendUrl}/conector/ping`;
        return this.http
            .get(url, { responseType: 'text' })
            .pipe();
    }

    getTest() {
        const url ='assets/json/test.json';
        return this.http
            .get<ITestResponse>(url, this.headers)
            .pipe();
    }

    postTest(param: IRequestTest) { 
        const url = `${environment.backendForFrontendUrl}/test`;
        return this.http.post<any[]>(url, param, this.headers);
    }

    get headers() {
        return {
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

}




