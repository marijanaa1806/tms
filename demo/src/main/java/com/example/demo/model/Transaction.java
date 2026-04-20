package com.example.demo.model;

import com.example.demo.enums.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    private LocalDate date;
    private String accountNumber;
    private String accountHolder;
    private BigDecimal amount; //sto big decimal
    private TransactionStatus status;

}
