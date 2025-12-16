package com.example.LibraryManagementSoftware.service;

import com.example.LibraryManagementSoftware.entity.Category;
import com.example.LibraryManagementSoftware.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Add new category if it doesn't exist
    public Category addCategory(String name) {
        Category existing = categoryRepository.findByName(name);
        if(existing != null) {
            return existing;
        }
        Category category = new Category();
        category.setName(name);
        return categoryRepository.save(category);
    }
}
