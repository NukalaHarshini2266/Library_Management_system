package com.example.LibraryManagementSoftware.repository;

import com.example.LibraryManagementSoftware.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByEmail(String email);
}
