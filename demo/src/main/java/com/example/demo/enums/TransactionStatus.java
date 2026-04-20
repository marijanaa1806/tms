package com.example.demo.enums;

public enum TransactionStatus {
    PENDING,
    SETTLED,
    FAILED;

    public boolean isSuccessful() {
        return this == SETTLED;
    }

    public boolean isFailed() {
        return this == FAILED;
    }
    public boolean isPending() {
        return this == PENDING;
    }
}
