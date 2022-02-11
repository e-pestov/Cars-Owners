import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {ICarOwnersService} from "../services/icar-owners.service";
import {ICar, IPerson} from "../../interfaces/IPerson";
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
  public persons: IPerson[] = [];
  public personId: number | undefined;
  public carNumber: string[] = [];
  public currentCar: string[] = [];

  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(private iCarsOwnersService: ICarOwnersService, private fb: FormBuilder, private activeRouter: ActivatedRoute) {
    if (this.activeRouter.snapshot.params['id']) {
      this.personId = +this.activeRouter.snapshot.params['id'];
    }
  }

  ngOnInit() {
    this.numberCar();
    this.initForm();

  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  private initForm() {
    this.form = this.fb.group({
      "surName": ["", [Validators.required, Validators.pattern('[a-zA-Zа-яА-Я-]*')]],
      "firstName": ["", [Validators.required, Validators.pattern('[a-zA-Zа-яА-Я-]*')]],
      "patronymic": ["", [Validators.required, Validators.pattern('[a-zA-Zа-яА-Я-]*')]],
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
          if (!this.person?.car) {
            this.addCar()
            return;
          }

          this.person.car.forEach(item => {
            const car = this.fb.group({
              "number": [item.number, [Validators.required, Validators.pattern('[A-ZА-Я-][A-ZА-Я-][0-9-][0-9-][0-9-][0-9-][A-ZА-Я-][A-ZА-Я-]'), Validators.maxLength(8), this.validNumber(this.carNumber)]],
              "brand": [item.brand, [Validators.required, Validators.pattern('[A-Za-zА-Яа-я]*')]],
              "model": [item.model, [Validators.required, Validators.pattern('[A-Za-zА-Яа-я0-9]*')]],
              "year": [item.year, [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^(19|20)[0-9]{2}')]]
            })
            this.getFormControls().push(car)
          })
        })
      return;
    }
    this.addCar()
  }

  private validNumber(carNumber: string[]): ValidatorFn {
    return (control: AbstractControl): ({ [key: string]: boolean } | null) => {
      this.currentCar = this.form.controls['car'].value .map((item: ICar) => item.number);
      console.log(carNumber);
      console.log(this.currentCar);
      let noValue = this.carNumber.filter((i) => !this.currentCar.includes(i));
      console.log(noValue);
      if (!noValue) {
        return {'numError': true};
      }
      return null;
    };
  }

  public numberCar() {
    this.iCarsOwnersService.getOwners()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.persons = res;
        this.carNumber = this.persons
          .flatMap((item) => item.car)
          .map((item) => item.number);
        this.form.controls['car'].setValidators(this.validNumber(this.carNumber));
      });
  }

  public addCar() {
    const newCar = this.fb.group({
      "number": ['', [Validators.required, Validators.pattern('[A-ZА-Я-][A-ZА-Я-][0-9-][0-9-][0-9-][0-9-][A-ZА-Я-][A-ZА-Я-]'), Validators.maxLength(8),this.validNumber(this.carNumber)]],
      "brand": ['', [Validators.required, Validators.pattern('[A-Za-zА-Яа-я]*')]],
      "model": ['', [Validators.required, Validators.pattern('[A-Za-zА-Яа-я0-9]*')]],
      "year": ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^(19|20)[0-9]{2}')]]
    });
    this.getFormControls().push(newCar);

   }

  public getFormControls(): FormArray {
    return <FormArray>this.form.controls['car'];
  }


  public submit() {
    this.iCarsOwnersService.getOwners()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => this.persons = res
      )
    if (this.personId) {

      this.iCarsOwnersService.putOwner({...this.form.value, id: this.personId})
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
      return;
    }
    this.iCarsOwnersService.postOwner(this.form.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
    this.initForm();
  }

  public removeCar(i: number) {
    (this.form.controls['car'] as FormArray).removeAt(i);
  }
}
