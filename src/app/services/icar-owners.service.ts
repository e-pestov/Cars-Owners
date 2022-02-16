import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IPerson} from "../interfaces/IPerson";

@Injectable({
  providedIn: 'root'
})
export class ICarOwnersService {
  server: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getOwners(): Observable<IPerson[]> {
    return this.http.get<IPerson[]>(`${this.server}/persons`)
  }

  getPersonId(id: number): Observable<IPerson> {
    return this.http.get<IPerson>(`${this.server}/persons/${id}`);
  }

  putOwner(person: IPerson): Observable<any> {
    return this.http.put(`${this.server}/persons/${person.id}`, person);
  }

  postOwner(person: IPerson): Observable<any>{
    return this.http.post(`${this.server}/persons`, person);
  }

  deleteOwner(id: number): Observable<any>{
   return this.http.delete(`${this.server}/persons/${id}`);
  }
}

