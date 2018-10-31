import { Injectable } from '@angular/core';
import {Http, RequestOptions} from "@angular/http";
import {AuthService} from "../core/services/auth.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/do"
import { environment } from "../../../environments/environment"

@Injectable()
export class DataManagementService {

    constructor(private http: Http, private authService: AuthService) {}

    private getCredentials(): RequestOptions{
        return this.authService.getCredentials();
    }

    init(force: boolean): Observable<any> {
        const creds = this.getCredentials();
        return this.http.post(`${environment.api}/data/init/`,{ force }, creds ).map(res => res.json())
    }

    hasBeenInitialized(): Observable<any> {
        const creds = this.getCredentials();
        return this.http.get(`${environment.api}/data/has-been-initialized/`, creds )
            .map(res => res.json().hasBeenInitialized)
    }

    downloadData(): Observable<any> {
        const creds = this.getCredentials();
        return this.http.get(`${environment.api}/data/backup`, creds )
            .map( (res: any) => new Blob([res._body], {type : 'application/json'}))
    }

    upload(stringifiedData): Observable<any> {
        const data = JSON.parse(stringifiedData);
        const creds = this.getCredentials();
        return this.http.post(`${environment.api}/data/upload`,  { ...data } , creds).map(res => res.json())
    }
}
