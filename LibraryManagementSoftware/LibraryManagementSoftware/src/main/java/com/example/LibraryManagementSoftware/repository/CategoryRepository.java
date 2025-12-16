package com.example.LibraryManagementSoftware.repository;

import com.example.LibraryManagementSoftware.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name);
    Category findByNameIgnoreCase(String name);
}
