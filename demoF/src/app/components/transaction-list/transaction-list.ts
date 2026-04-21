import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Transaction} from '../../models/transaction';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {TransactionService} from '../../services/transaction';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButton],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.css'],
})
export class TransactionList implements OnInit , AfterViewInit {
  transactions: Transaction[] = [];
  displayedColumns: (keyof Transaction)[] = ['date', 'accountNumber', 'accountHolderName', 'amount', 'status'];
  dataSource = new MatTableDataSource<Transaction>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  errorMessage: string | null = null;

  constructor(private service: TransactionService){}
  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    if (this.paginator) {
      this.paginator.pageSize = 10;
    }
  }

  load() {
    this.service.getAll().subscribe(
      {
        next: (res: Transaction[]) => {
          console.log(res);
          this.errorMessage = null;
          this.transactions = res;
          this.dataSource.data = res;

          if (this.paginator && this.dataSource.paginator !== this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

          if (this.paginator) {
            this.paginator.firstPage();
            this.paginator.pageSize = 10;
          }
        },
        error: (err) => {

          console.dir(err);
          let msg: string | null = null;
          const e: any = err;
          const inner = e?.error;

          if (inner) {
            if (typeof inner === 'string') {
              msg = inner;
            } else if (typeof inner?.message === 'string') {
              msg = inner.message;
            } else if (Array.isArray(inner?.errors) && inner.errors.length) {
              msg = inner.errors.join('; ');
            } else if (typeof inner?.detail === 'string') {
              msg = inner.detail;
            } else if (typeof inner?.error === 'string') {
              msg = inner.error;
            }
          }

          if (!msg && typeof e?.message === 'string') {
            msg = e.message;
          }
          if (!msg && (e?.status || e?.statusText)) {
            const status = e?.status ? `(${e.status})` : '';
            const statusText = e?.statusText ?? '';
            const combined = `${status} ${statusText}`.trim();
            if (combined) {
              msg = `Failed to load transactions ${combined}`;
            }
          }
          if (!msg && e?.status === 400) {
            msg = 'Bad Request: The server could not process the request.';
          }

          this.errorMessage = msg ?? 'The server is having trouble processing the transaction file.';

          this.transactions = [];
          this.dataSource.data = [];
        }
      }
    );
  }
}
