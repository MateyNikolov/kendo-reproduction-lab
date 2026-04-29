import { Component } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { 
  CancelEvent, 
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

@Component({
  selector: "app-root",
  standalone: true,
  imports: [GridModule, AsyncPipe, FormsModule], 
  providers: [OrdersService],
  templateUrl: './app.component.html'
})
export class AppComponent {
  public state: State = { skip: 0, take: 50 };
  private stateChange = new BehaviorSubject<State>(this.state);
  public query: Observable<GridDataResult>;
  public loading: boolean = false;

  constructor(private service: OrdersService) {
    this.query = this.stateChange.pipe(
      tap(state => this.state = state),
      switchMap(state => this.service.fetch(state, 1000))
    );
  }

  public pageChange(event: PageChangeEvent): void {
    this.stateChange.next(event);
  }

  public addHandler({ sender }: AddEvent): void {
    sender.addRow({ OrderID: 0, ShipName: "", ShipCity: "" });
  }

  public saveHandler({ dataItem, isNew }: SaveEvent): void {
    if (isNew) { this.service.addRecord(dataItem); }
    this.stateChange.next({ ...this.state });
  }

  public cancelHandler({ sender, rowIndex }: CancelEvent): void {
    sender.closeRow(rowIndex);
  }
}