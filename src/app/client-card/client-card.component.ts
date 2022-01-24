import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ICarOwnersService} from "../services/icar-owners.service";
import {IPerson} from "../../interfaces/IPerson";
import {ActivatedRoute} from "@angular/router";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.css']
})
export class ClientCardComponent implements OnInit, OnDestroy {


  public form: FormGroup = new FormGroup({});
  public person: IPerson | null = null;
  public newCar: FormGroup = new FormGroup({});

  private personId: number | undefined;
  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(private iCarsOwnersService: ICarOwnersService, private fb: FormBuilder, private activeRouter: ActivatedRoute) {
    if (this.activeRouter.snapshot.params['id']) {
      this.personId = +this.activeRouter.snapshot.params['id'];
    }
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  private initForm() {
    this.form = this.fb.group({
      "surName": ["", [Validators.required]],
      "firstName": ["", [Validators.required]],
      "patronymic": ["", [Validators.required]],
      "car": this.fb.array([])
    });
    this.mappingForm();
  }

  private mappingForm() {
    if (this.personId) {
      this.iCarsOwnersService.getPersonId(this.activeRouter.snapshot.params['id'])
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: IPerson) => {
          this.person = res;

          this.form.patchValue({
            'surName': this.person.surName,
            'firstName': this.person.firstName,
            'patronymic': this.person.patronymic,
          })
          if (!this.person?.car && !this.person.car?.length) {
            this.addCar()
            return
          }

          this.person.car.forEach(item => {
            const car = this.fb.group({
              "number": [item.number, [Validators.required]],
              "brand": [item.brand, [Validators.required]],
              "model": [item.model, [Validators.required]],
              "year": [item.year, [Validators.required]]
            })
            this.getFormControls().push(car)
          })
        })
      return;
    }
    this.addCar()
  }

  public addCar() {
    const newCar = this.fb.group({
      "number": (''),
      "brand": (''),
      "model": (''),
      "year": ('')
    });
    this.getFormControls().push(newCar);
  }

  public getFormControls(): FormArray {
    return <FormArray>this.form.controls['car'];
  }

  public submit() {
    if (this.personId) {
      this.iCarsOwnersService.putOwner({...this.form.value, id: this.personId})
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
      return;
    }
    this.iCarsOwnersService.postOwner(this.form.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  public removeCar(i: any) {
    (this.form.controls['car'] as FormArray).removeAt(i);
  }
}
