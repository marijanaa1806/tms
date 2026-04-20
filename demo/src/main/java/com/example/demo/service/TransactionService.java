package com.example.demo.service;


import com.example.demo.enums.TransactionStatus;
import com.example.demo.model.Transaction;
import org.springframework.stereotype.Service;

import java.io.*;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {
    private static final String FILE_PATH = "data/transactions.csv";
    public List<Transaction> getAllTransactions() {

        try (InputStream input = getClass().getClassLoader()
                .getResourceAsStream(FILE_PATH)) {

            if (input == null) {
                throw new RuntimeException("CSV file not found in resources");
            }

            try (BufferedReader reader =
                         new BufferedReader(new InputStreamReader(input))) {

                return reader.lines()
                        .skip(1)
                        .map(this::mapLine)
                        .toList();
            }

        } catch (IOException e) {
            throw new RuntimeException("Error reading CSV file", e);
        }
    }

    private Transaction mapLine(String line) {
        String[] parts = line.split(",");

        Transaction transaction = new Transaction();

        transaction.setDate(LocalDate.parse(parts[0]));
        transaction.setAccountNumber(parts[1]);
        transaction.setAccountHolder(parts[2]);
        transaction.setAmount(new BigDecimal(parts[3]));
        transaction.setStatus(parseStatus(parts[4]));

        return transaction;
    }

    private TransactionStatus parseStatus(String value) {
        return TransactionStatus.valueOf(value.trim().toUpperCase());
    }
    public Transaction addTransaction(Transaction transaction) throws IOException {

        writeToCsv(transaction);

        return transaction;
    }

    private String toLine(Transaction t) {
        return String.format("%s,%s,%s,%s,%s",
                t.getDate(),
                t.getAccountNumber(),
                t.getAccountHolder(),
                t.getAmount(),
                t.getStatus());
    }

    private void writeToCsv(Transaction transaction) throws IOException {
        try {
            Files.write(
                    Paths.get(FILE_PATH),
                    (toLine(transaction) + System.lineSeparator()).getBytes(),
                    StandardOpenOption.APPEND,
                    StandardOpenOption.CREATE
            );
        } catch (IOException e) {
            throw new RuntimeException("Error writing CSV file", e);
        }
    }
}
