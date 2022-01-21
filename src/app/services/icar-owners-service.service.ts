import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IPersons} from "../../interfaces/IPersons";
import {ICar} from "../../interfaces/ICar";

@Injectable({
  providedIn: 'root'
})
export class ICarOwnersServiceService {
  server: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getOwners(): Observable<IPersons[]> {
    return this.http.get<IPersons[]>(`${this.server}/persons`)
  }

  getCarsData(): Observable<ICar[]> {
    return this.http.get<ICar[]>(`${this.server}/carData`)
  }

  postOwners(person: IPersons[]) {
    return this.http.post(`${this.server}/persons`, person);
  }
}
