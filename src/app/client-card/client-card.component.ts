import {Component, OnInit} from '@angular/core';
import {ICar} from "../../interfaces/ICar";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {ICarOwnersServiceService} from "../services/icar-owners-service.service";
import {IPersons} from "../../interfaces/IPersons";

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.css']
})
export class ClientCardComponent implements OnInit {
  public carsData: ICar[] = [];
  public form: FormGroup = new FormGroup({});
  public person: IPersons[] = [];
  public car: FormArray = new FormArray([]);
  public newCar: boolean = false;

  constructor(private iCarsOwnersService: ICarOwnersServiceService) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      "surName": new FormControl(''),
      "firstName": new FormControl(''),
      "patronymic": new FormControl(''),
      car: new FormArray([

      ])
  });


    this.iCarsOwnersService.getOwners().subscribe((res) => this.person = res);
    this.form.valueChanges.subscribe((value) => this.person = value);
    this.addCar();
  }

  addCar() {
   const newCar = new FormGroup({
     "number": new FormControl(''),
     "brand": new FormControl(''),
     "model": new FormControl(''),
     "year": new FormControl('')
   });
    (this.form.controls['car'] as FormArray).push(newCar);

  }


  getFormControls(): FormArray {
    return  <FormArray> this.form.controls['car'];
  }

  submit() {
    console.log(this.form)
    this.iCarsOwnersService.postOwners(this.person).subscribe();
  }

  removeCar(i: any) {
    console.log(i);
      (this.form.controls['car'] as FormArray).removeAt(i);

  }
}
