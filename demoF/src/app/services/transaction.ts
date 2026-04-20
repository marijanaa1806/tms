import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private api = environment.apiUrl ;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.api);
  }

  add(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.api, transaction);
  }
}
