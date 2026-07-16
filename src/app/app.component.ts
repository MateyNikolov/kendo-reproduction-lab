import { Component, ViewChild } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  CancelEvent,
  GridComponent,
  GridModule,
  SaveEvent,
  GridDataResult,
  PageChangeEvent,
  AddEvent
} from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { BehaviorSubject, Observable } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { OrdersService } from "./service";

interface OrderItem {
  OrderID: number;
  ShipName: string;
  ShipCity: string;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [GridModule, AsyncPipe, FormsModule],
  providers: [OrdersService],
  templateUrl: "./app.component.html"
})
export class AppComponent {
  @ViewChild("grid") private grid?: GridComponent;

  public state: State = { skip: 0, take: 50 };
  private stateChange = new BehaviorSubject<State>(this.state);
  public query: Observable<GridDataResult>;
  public loading = false;

  private draftItem: OrderItem | null = null;
  private draftOpen = false;

  constructor(private service: OrdersService) {
    this.query = this.stateChange.pipe(
      tap((state) => {
        this.state = state;
      }),
      switchMap((state) => this.service.fetch(state, 1000))
    );
  }

  public pageChange(event: PageChangeEvent): void {
    this.stateChange.next(event);

    if (this.draftOpen && event.skip > 0) {
      this.grid?.closeRow();
      this.draftOpen = false;
      return;
    }

    if (!this.draftOpen && this.draftItem && event.skip === 0) {
      queueMicrotask(() => {
        this.grid?.addRow(this.draftItem!);
        this.draftOpen = true;
      });
    }
  }

  public addHandler({ sender }: AddEvent): void {
    this.draftItem ??= {
      OrderID: 0,
      ShipName: "",
      ShipCity: ""
    };

    sender.addRow(this.draftItem);
    this.draftOpen = true;
  }

  public saveHandler({ dataItem, isNew, sender }: SaveEvent): void {
    if (isNew) {
      this.service.addRecord(dataItem);
      this.draftItem = null;
      this.draftOpen = false;
      sender.closeRow();
    }

    this.stateChange.next({ ...this.state });
  }

  public cancelHandler({ sender, rowIndex, isNew }: CancelEvent): void {
    sender.closeRow(rowIndex);

    if (isNew) {
      this.draftItem = null;
      this.draftOpen = false;
    }
  }
}