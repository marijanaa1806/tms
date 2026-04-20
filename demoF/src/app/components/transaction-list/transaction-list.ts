import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Transaction} from '../../models/transaction';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {TransactionService} from '../../services/transaction';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.css'],
})
export class TransactionList implements OnInit , AfterViewInit {
  transactions: Transaction[] = [];
  displayedColumns: (keyof Transaction)[] = ['date', 'accountNumber', 'accountHolderName', 'amount', 'status'];
  dataSource = new MatTableDataSource<Transaction>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
    this.service.getAll().subscribe(res => {
      console.log(res);
      this.transactions = res;
      this.dataSource.data = res;

      if (this.paginator && this.dataSource.paginator !== this.paginator) {
        this.dataSource.paginator = this.paginator;
      }

      if (this.paginator) {
        this.paginator.firstPage();
        this.paginator.pageSize = 10;
      }
    });
  }
}
