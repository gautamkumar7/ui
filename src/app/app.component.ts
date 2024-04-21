import { Component } from '@angular/core';
import { TransactionsComponent } from './transactions/transactions.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TransactionsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
