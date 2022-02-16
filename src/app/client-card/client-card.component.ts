import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup, ValidatorFn,
  Validators
} from "@angular/forms";
import {ICarOwnersService} from "../services/icar-owners.service";
import {IPerson} from "../interfaces/IPerson";
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
  public users: IPerson[] = [];
  public personId: number | undefined;
  public carNumber: string[] = [];
  public validNum: string = '[A-ZА-Я-]{2}[0-9-]{4}[A-ZА-Я-]{2}';
  public validBrand: string = '[A-Za-zА-Яа-я]*';
  public validModel: string = '[A-Za-zА-Яа-я0-9]*';
  public validYear: string = '^(19|20)[0-9]{2}';
  public validName: string = '[a-zA-Zа-яА-Я-]*';

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
      "surName": ["", [Validators.required, Validators.pattern(this.validName)]],
      "firstName": ["", [Validators.required, Validators.pattern(this.validName)]],
      "patronymic": ["", [Validators.required, Validators.pattern(this.validName)]],
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
          !this.person?.car ? this.addCar() : this.setCar();
        })
      return;
    }
    this.addCar()
  }

  private validNumber(): ValidatorFn {
    return (control: AbstractControl): ({ [key: string]: boolean } | null) => {
      if (this.carNumber.includes(control.value)) {
        return {'numError': true};
      }
      return null;
    };
  }

  private numberCar() {
    this.iCarsOwnersService.getOwners()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.users = res;
        this.carNumber = this.users
          .flatMap((item) => item.car)
          .map((item) => item.number);
      });
  }

  private setCar(){
    this.person?.car.forEach(item => {
      const car = this.fb.group({
        "number": [item.number, [Validators.required, Validators.pattern(this.validNum), Validators.maxLength(8)]],
        "brand": [item.brand, [Validators.required, Validators.pattern(this.validBrand)]],
        "model": [item.model, [Validators.required, Validators.pattern(this.validModel)]],
        "year": [item.year, [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(this.validYear)]]
      })
      this.getFormControls().push(car)
    })
  }

  public addCar() {
    this.form.controls['car'].removeValidators(this.validNumber);
    const newCar = this.fb.group({
      "number": ['', [Validators.required, Validators.pattern(this.validNum), Validators.maxLength(8), this.validNumber()]],
      "brand": ['', [Validators.required, Validators.pattern(this.validBrand)]],
      "model": ['', [Validators.required, Validators.pattern(this.validModel)]],
      "year": ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(this.validYear)]]
    });
    this.getFormControls().push(newCar);
  }

  public getFormControls(): FormArray {
    return <FormArray>this.form.controls['car'];
  }

  public submit() {
    this.iCarsOwnersService.getOwners()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => this.users = res
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
