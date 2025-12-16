
package com.example.LibraryManagementSoftware.service;

import com.example.LibraryManagementSoftware.controller.BookController.BookDTO;
import com.example.LibraryManagementSoftware.entity.Book;
import com.example.LibraryManagementSoftware.entity.Category;
import com.example.LibraryManagementSoftware.repository.BookRepository;
import com.example.LibraryManagementSoftware.repository.BorrowRecordRepository; // ✅ import
import com.example.LibraryManagementSoftware.repository.CategoryRepository;
import com.example.LibraryManagementSoftware.entity.BorrowRecord;
import com.example.LibraryManagementSoftware.service.ReservationService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowRecordRepository borrowRecordRepository; // ✅ add field
    private final ReservationService reservationService;

    public BookService(BookRepository bookRepository,
                       CategoryRepository categoryRepository,
                       BorrowRecordRepository borrowRecordRepository,
                       ReservationService reservationService) { // ✅ inject
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.reservationService = reservationService;// ✅ assign
    }

    // ➕ Add book with categories using IDs
    public Book addBookWithCategories(BookDTO dto) {
        Book book = new Book();
        book.setTitle(dto.getTitle().trim());
        book.setAuthor(dto.getAuthor().trim());
        book.setImageUrl(dto.getImageUrl());
        book.setPrice(dto.getPrice());
        book.setPublisher(dto.getPublisher().trim());
        book.setAvailableCopies(dto.getAvailableCopies());
        book.setId((book.getTitle() + book.getAuthor()).replaceAll("\\s",""));

        List<Category> categories = new ArrayList<>();
        if(dto.getCategoryIds() != null) {
            for(Long catId : dto.getCategoryIds()) {
                Category category = categoryRepository.findById(catId)
                        .orElseThrow(() -> new RuntimeException("Category not found with ID: " + catId));
                categories.add(category);
            }
        }
        book.setCategories(categories);

        return bookRepository.save(book);
    }

    // ✏️ Update book with multiple categories
//    public Book updateBookWithCategories(String id, BookDTO dto) {
//        Book book = bookRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + id));
//
//
//        book.setTitle(dto.getTitle().trim());
//        book.setAuthor(dto.getAuthor().trim());
//        book.setPublisher(dto.getPublisher().trim());
//        book.setImageUrl(dto.getImageUrl());
//        book.setPrice(dto.getPrice());
//        book.setAvailableCopies(dto.getAvailableCopies());
//
//        // Update categories
//        List<Category> categories = new ArrayList<>();
//        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
//            for (Long catId : dto.getCategoryIds()) {
//                Category category = categoryRepository.findById(catId)
//                        .orElseThrow(() -> new RuntimeException("Category not found with ID: " + catId));
//                categories.add(category);
//            }
//        }
//        book.setCategories(categories); // replace old categories
//
//        return bookRepository.save(book);
//    }

    public Book updateBookWithCategories(String id, BookDTO dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + id));

        int oldCopies = book.getAvailableCopies(); // save old copies

        book.setTitle(dto.getTitle().trim());
        book.setAuthor(dto.getAuthor().trim());
        book.setPublisher(dto.getPublisher().trim());
        book.setImageUrl(dto.getImageUrl());
        book.setPrice(dto.getPrice());
        book.setAvailableCopies(dto.getAvailableCopies());

        // Update categories
        List<Category> categories = new ArrayList<>();
        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            for (Long catId : dto.getCategoryIds()) {
                Category category = categoryRepository.findById(catId)
                        .orElseThrow(() -> new RuntimeException("Category not found with ID: " + catId));
                categories.add(category);
            }
        }
        book.setCategories(categories);

        Book savedBook = bookRepository.save(book);

        // Notify next pending reservation if availableCopies increased
        int diff = savedBook.getAvailableCopies() - oldCopies;

        if (diff > 0) {
            reservationService.notifyMultiplePendingUsers(savedBook, diff);
        }
        return savedBook;
    }

    // 📚 Get all books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(String id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + id));
    }

    // 🗑️ Delete book
//    public void deleteBook(String id) {
//        Book book = bookRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + id));
//
//        // ✅ Delete dependent borrow records first
//        borrowRecordRepository.deleteAllByBook(book);
//
//        // Now delete book
//        bookRepository.delete(book);
//    }
    @Transactional
    public void deleteBook(String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + id));

        // Delete dependent borrow records
        borrowRecordRepository.deleteAllByBook(book);

        bookRepository.delete(book);
    }
    public List<Book> searchBooks(String keyword) {
        return bookRepository.searchBooks(keyword);
    }

    // 🔍 Search by category name
    public List<Book> searchByCategory(String category) {
        return bookRepository.findByCategories_NameContainingIgnoreCase(category);
    }
    public List<Book> findAvailableBooks() {
        return bookRepository.findByAvailableCopiesGreaterThan(0);
    }

    public List<Book> findUnavailableBooks() {
        return bookRepository.findByAvailableCopiesEquals(0);
    }

    public List<Book> getDamagedBooks() {
        return bookRepository.findByDamagedCopiesGreaterThan(0);
    }


    @Transactional
    public void repairBook(String bookId, int repairedCount) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (repairedCount <= 0) {
            throw new RuntimeException("Invalid repair count");
        }

        if (repairedCount > book.getDamagedCopies()) {
            throw new RuntimeException("Repair exceeds damaged copies");
        }

        book.setDamagedCopies(book.getDamagedCopies() - repairedCount);
        book.setAvailableCopies(book.getAvailableCopies() + repairedCount);

        bookRepository.save(book);
    }



}
