import {Component, OnDestroy, OnInit} from '@angular/core';
import {IPerson} from "../interfaces/IPerson";
import {ICarOwnersService} from "../services/icar-owners.service";
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

  public users: IPerson[] = [];
  public person: IPerson[] = [];
  public selectId: any;

  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(private iCarsOwnersService: ICarOwnersService, private router: Router) {
  }

  ngOnInit() {
    this.iCarsOwnersService
      .getOwners()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => this.users = res);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  public selectItem(id: number) {
    this.selectId = id;
  }

  public viewUser(id: number) {
    this.router.navigate([`/view/${id}`]);
  }

  public delete(id: number) {
    this.iCarsOwnersService.deleteOwner(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => this.users = this.users.filter(item => item.id !== id));
  }
}
