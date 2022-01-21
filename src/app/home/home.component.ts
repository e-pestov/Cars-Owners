import { Component, OnInit } from '@angular/core';
import {IPersons} from "../../interfaces/IPersons";
import {ICarOwnersServiceService} from "../services/icar-owners-service.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {



  public persons: IPersons[] = [];
  constructor(private iCarsOwnersService: ICarOwnersServiceService ) {}

  ngOnInit(): void {
    this.iCarsOwnersService
      .getOwners().subscribe((res)=>this.persons=res)
  }
}
