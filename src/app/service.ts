import { Injectable } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable()
export class OrdersService {
  private data: any[] = Array.from({ length: 1000 }, (_, i) => ({
    OrderID: i + 1,
    ShipName: `Customer ${i + 1}`,
    ShipCity: i % 2 === 0 ? "Berlin" : "London"
  }));

  public fetch(state: State, msec: number = 600): Observable<GridDataResult> {
    const result = process(this.data, state);
    return of(result).pipe(delay(msec));
  }

  public addRecord(item: any): void {
    this.data = [item, ...this.data];
  }
}