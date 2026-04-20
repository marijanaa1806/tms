import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { AddTransactionDialog } from '../../components/add-transaction-dialog/add-transaction-dialog';
import { MatButtonModule } from '@angular/material/button';
import { TransactionList } from '../../components/transaction-list/transaction-list';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TransactionList],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css'],
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('list') list!: TransactionList;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}


  openDialog() {
    const ref = this.dialog.open(AddTransactionDialog, {
      height: '600px',
      width: '420px',
      maxWidth: '90vw',
      disableClose: false
    });

    ref.afterClosed().subscribe(result => {
      if (result && this.list) {
        this.list.load();
      }
    });
  }
}
