import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TransactionService } from '../../services/transaction';
import { MatDialogRef } from '@angular/material/dialog';
import { Transaction } from '../../models/transaction';
import {MatButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-transaction-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './add-transaction-dialog.html',
  styleUrls: ['./add-transaction-dialog.css'],
})
export class AddTransactionDialog implements OnInit {
  form!: FormGroup;
  maxDate = new Date();
  constructor(
    private fb: FormBuilder,
    private service: TransactionService,
    private dialogRef: MatDialogRef<AddTransactionDialog>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      date: [null, [Validators.required, this.futureDateValidator]],
      accountNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{4}-\d{4}$/)
      ]],
      accountHolderName: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]],
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }
  futureDateValidator(control: any) {
    if (!control.value) return null;

    const selected = new Date(control.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    return selected > today ? { futureDate: true } : null;
  }


  formatAccountNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 12) value = value.substring(0, 12);
    const sections = value.match(/.{1,4}/g);
    if (sections) {
      this.form.get('accountNumber')?.setValue(sections.join('-'), { emitEvent: false });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const v = this.form.value as {
      date: Date;
      accountNumber: string;
      accountHolderName: string;
      amount: number;
    };
    const selectedDate = new Date(v.date);
    const today = new Date();

    selectedDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    if (selectedDate > today) {
      this.snackBar.open('Future dates are not allowed', 'Close', {
        duration: 4000,
        verticalPosition: 'top'
      });
      return;
    }

    const d = v.date;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`;



    const payload: Transaction = {
      date: formatted,
      accountNumber: v.accountNumber,
      accountHolderName: v.accountHolderName,
      amount: Number(v.amount),
      status:null
    };

    this.service.add(payload).subscribe({
      next: (res) => {

        this.snackBar.open('Transaction added successfully!', 'Close', { duration: 10000 });
        this.dialogRef.close(res);
      },
      error: (err) => {

        console.error('Error adding transaction:', err);
        this.snackBar.open(err.error.message, 'Close', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
