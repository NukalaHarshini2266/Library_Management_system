package com.example.LibraryManagementSoftware.service;

import com.example.LibraryManagementSoftware.entity.Transaction;
import com.example.LibraryManagementSoftware.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    // Save a new transaction
    public Transaction saveTransaction(Transaction t) {
        t.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return transactionRepository.save(t);
    }

    // Get all transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Get transactions by user email
    public List<Transaction> getTransactionsByEmail(String email) {
        return transactionRepository.findByEmail(email);
    }
}
