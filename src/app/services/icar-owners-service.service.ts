import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IPerson} from "../../interfaces/IPerson";

@Injectable({
  providedIn: 'root'
})
export class ICarOwnersServiceService {
  server: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getOwners(): Observable<IPerson[]> {
    return this.http.get<IPerson[]>(`${this.server}/persons`)
  }

  getPersonId(id: number) {
    return this.http.get<IPerson>(`${this.server}/persons/${id}`);
  }

  putOwner(person: IPerson) {
    return this.http.put(`${this.server}/persons/${person.id}`, person);
  }

  postOwner(person: IPerson){
    return this.http.post(`${this.server}/persons`, person);
  }

  deleteOwner(id: number){
   return this.http.delete(`${this.server}/persons/${id}`);
  }
}

