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
    private static final String FILE_PATH = "src/data/transactions.csv";
    private static final String CSV_HEADER = "Transaction Date,Account Number,Account Holder Name,Amount,Status";

    public TransactionService() {
        initCsvFile();
    }

    private void initCsvFile() {
        try {
            File file = new File(FILE_PATH);

            if (file.getParentFile() != null) {
                file.getParentFile().mkdirs();
            }

            if (!file.exists()) {
                Files.write(Paths.get(FILE_PATH), (CSV_HEADER + System.lineSeparator()).getBytes());
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize CSV file", e);
        }
    }

    public List<Transaction> getAllTransactions() {
        try (var lines = Files.lines(Paths.get(FILE_PATH))) {
            return lines.skip(1)
                    .filter(line -> line != null && !line.trim().isEmpty())
                    .map(this::mapLine)
                    .filter(java.util.Objects::nonNull)
                    .toList();
        } catch (IOException e) {
            throw new RuntimeException("Error reading CSV file", e);
        }
    }

    private Transaction mapLine(String line) {
        try {
            String[] parts = line.split(",");
            if (parts.length < 5) return null;

            Transaction transaction = new Transaction();
            transaction.setDate(LocalDate.parse(parts[0].trim()));
            transaction.setAccountNumber(parts[1].trim());
            transaction.setAccountHolderName(parts[2].trim());
            transaction.setAmount(new BigDecimal(parts[3].trim()));
            transaction.setStatus(TransactionStatus.valueOf(parts[4].trim()));
            return transaction;
        } catch (Exception e) {
            throw new RuntimeException("Skipping malformed CSV line: " + line);

        }
    }


    public synchronized Transaction addTransaction(Transaction transaction) {
        transaction.setStatus(getRandomStatus());
        writeToCsv(transaction);
        return transaction;
    }

    private void writeToCsv(Transaction transaction) {
        try {
            String line = String.format("%s,%s,%s,%s,%s%n",
                    transaction.getDate(),
                    transaction.getAccountNumber(),
                    transaction.getAccountHolderName(),
                    transaction.getAmount(),
                    transaction.getStatus());

            Files.write(
                    Paths.get(FILE_PATH),
                    line.getBytes(),
                    StandardOpenOption.APPEND
            );
        } catch (IOException e) {
            throw new RuntimeException("Error writing to CSV", e);
        }
    }

    private TransactionStatus getRandomStatus() {
        TransactionStatus[] statuses = TransactionStatus.values();
        return statuses[new java.util.Random().nextInt(statuses.length)];
    }
}