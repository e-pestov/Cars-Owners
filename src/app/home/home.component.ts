import {Component, OnDestroy, OnInit} from '@angular/core';
import {IPerson} from "../../interfaces/IPerson";
import {ICarOwnersService} from "../services/icar-owners.service";
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

  public persons: IPerson[] = [];
  public person: IPerson[] = [];
  public selectId: any;

  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(private iCarsOwnersService: ICarOwnersService, private router: Router) {
  }

  ngOnInit() {
    this.iCarsOwnersService
      .getOwners()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => this.persons = res)
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  selectItem(id: number) {
    this.selectId = id;
  }

  viewUser(id: number) {
    this.router.navigate([`/view/${id}`]);
  }

  delete(id: number) {
    this.iCarsOwnersService.deleteOwner(id)
      .subscribe((res) => this.persons = this.persons.filter(item => item.id !== id));
  }
}
