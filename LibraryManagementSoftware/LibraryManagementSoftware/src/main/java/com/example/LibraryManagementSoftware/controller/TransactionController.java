package com.example.LibraryManagementSoftware.controller;

import com.example.LibraryManagementSoftware.entity.Transaction;
import com.example.LibraryManagementSoftware.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // ➕ Add new transaction
    @PostMapping("/add")
    public Transaction addTransaction(@RequestBody Transaction t) {
        return transactionService.saveTransaction(t);
    }

    // 📋 Get all transactions
    @GetMapping("/all")
    public List<Transaction> getAll() {
        return transactionService.getAllTransactions();
    }

    // 🔍 Get transactions for a specific user
    @GetMapping("/user/{email}")
    public List<Transaction> getByEmail(@PathVariable String email) {
        return transactionService.getTransactionsByEmail(email);
    }
}
