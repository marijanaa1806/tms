package com.example.demo.model;

import com.example.demo.enums.TransactionStatus;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
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
    @PastOrPresent(message = "Date cannot be in the future")
    private LocalDate date;
    @Pattern(regexp = "^\\d{4}-\\d{4}-\\d{4}$", message = "Format must be XXXX-XXXX-XXXX")
    private String accountNumber;
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "Name can only contain letters")
    private String accountHolderName;
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;
    private TransactionStatus status;

}
