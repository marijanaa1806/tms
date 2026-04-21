package com.example.demo.enums;

public enum TransactionStatus {
    Pending,
    Settled,
    Failed;

    public boolean isSuccessful() {
        return this == Settled;
    }

    public boolean isFailed() {
        return this == Failed;
    }
    public boolean isPending() {
        return this == Pending;
    }
}
