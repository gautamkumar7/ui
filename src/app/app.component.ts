import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, of, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule,
    ReactiveFormsModule,
    HttpClientModule,
    AsyncPipe,
    MatAutocompleteModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'opt_In_Out';
  data: [] | any = [];
  benefitId: string[] = [];
  employeeId: string[] = [];
  filteredBenefits: Observable<string[]> = new Observable<string[]>();
  filteredEmployees: Observable<string[]> = new Observable<string[]>();

  myControl = new FormControl('');
  form: FormGroup = new FormGroup({
    employeeId: new FormControl(''),
    benefitId: new FormControl(-1),
    data: new FormControl('2030'),
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();

    this.myControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => this._filter(value || '')),
        map((filteredValues) => of(filteredValues)) // Fix: Convert the filtered values to an Observable
      )
      .subscribe((filteredValues) => {
        this.filteredBenefits = filteredValues;
        this.filteredEmployees = filteredValues;
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    return this.benefitId;
    return this.employeeId;
  }

  fetchData() {
    console.log('Fetching data');
    this.http
      .get('http://localhost:8080/employee-benefits/all')
      .subscribe((response) => {
        this.data = response;
        this.benefitId = this.data.map(
          (benefit: any) => (benefit = benefit.benefitId)
        );
        this.employeeId = this.data.map(
          (employee: any) => (employee = employee.employeeId)
        );
        console.log('benefitId', this.benefitId);

        console.log('data', this.data);
        this.filteredBenefits = this.data.benefits;
      });
  }

  submitForm() {
    this.http
      .post('http://localhost:8080/employee-benefits/create', this.form.value)
      .subscribe((response) => {
        console.log('opted out', response);
      });
  }
}
