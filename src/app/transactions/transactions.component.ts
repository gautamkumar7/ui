import { AsyncPipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { SelectionModel } from '@angular/cdk/collections';

export interface auditTable {
  id: string;
  action: string;
  employeeId: string;
  benefitId: string;
  date: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    MatRadioModule,
    MatTableModule,
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
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  labelPosition: string = 'after';
  title = 'opt_In_Out';
  data1: [] | any = [];
  data2: [] | any = [];
  selectedFile: File | null = null;
  benefitId: string[] = [];
  employeeId: string[] = [];
  dataSource = new MatTableDataSource<auditTable>();
  filteredBenefits: Observable<string[]> = new Observable<string[]>();
  filteredEmployees: Observable<string[]> = new Observable<string[]>();
  users: any[] = [];
  form: FormGroup;
  dataSource1 = new MatTableDataSource<auditTable>();
  selection = new SelectionModel<auditTable>(true, []);

  constructor(private _snackBar: MatSnackBar, private http: HttpClient) {
    this.form = new FormGroup({
      employeeId: new FormControl(''),
      benefitId: new FormControl(),
    });
  }
  displayedColumns: string[] = [
    'id',
    'employeeId',
    'benefitId',
    'action',
    'date',
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue', filterValue);

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchAudit() {
    console.log('Fetching audit data');
    this.http
      .get<auditTable[]>('http://localhost:8080/history/all')
      .subscribe((response: auditTable[]) => {
        this.dataSource.data = response;
        console.log('audit data', this.dataSource);
      });
  }

  ngOnInit() {
    this.fetchData();
    this.fetchEmployee();
    this.fetchAudit();

    this.filteredBenefits = this.form.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_benefits(value || ''))
    );

    this.filteredEmployees = this.form.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_employees(value || ''))
    );
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) {
      console.log('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    console.log('file uploaded', formData);

    this.http.post('http://localhost:8080/upload?', formData).subscribe(
      (response) => {
        console.log('File uploaded successfully:', response);
        // Handle the response from the backend as needed
      },
      (error) => {
        console.error('Error uploading file:', error);
        // Handle error if upload fails
      }
    );
  }

  private _filter_benefits(value: string): string[] {
    const filterValue = value;
    return this.benefitId.filter((option) =>
      option.toString().toLowerCase().includes(filterValue)
    );
  }

  private _filter_employees(value: string): string[] {
    const filterValue = value;
    return this.employeeId.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  fetchData() {
    console.log('Fetching data');
    this.http
      .get('http://localhost:8080/benefits/all')
      .subscribe((response) => {
        this.data1 = response;
        this.benefitId = this.data1.map(
          (benefit: any) => (benefit = benefit.benefitId)
        );

        console.log('data1', this.data1);
      });
  }

  fetchEmployee() {
    console.log('Fetching employee data');
    this.http.get('http://localhost:8080/details/all').subscribe((response) => {
      this.data2 = response;
      this.employeeId = this.data2.map(
        (employee: any) => (employee = employee.name)
      );
      console.log('employeeId', this.employeeId);
      console.log('data2', this.data2);
    });
  }

  fetchByBenefitId(id: string) {
    console.log('Fetching by benefitId:', id);
    const fetchData = this.http
      .get<auditTable[]>(`http://localhost:8080/history/benefit/${id}`)
      .subscribe((response: auditTable[]) => {
        this.dataSource1.data = response;
      });

    console.log('fetchData', fetchData);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: auditTable): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.action + 1
    }`;
  }

  openSnackBar(action: string) {
    this._snackBar.open('opted out', action);
  }

  submitForm() {
    this.http
      .post('http://localhost:8080/benefits/optout', this.form.value)
      .subscribe((response) => {
        console.log('opted out', response);
      });
  }
}
