
package com.example.LibraryManagementSoftware.controller;

import com.example.LibraryManagementSoftware.entity.Book;
import com.example.LibraryManagementSoftware.repository.BookRepository;
import com.example.LibraryManagementSoftware.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    private final BookService bookService;
    private final BookRepository bookRepository;

    public BookController(BookService bookService,BookRepository bookRepository) {
        this.bookService = bookService;
        this.bookRepository=bookRepository;
    }

    // ➕ Add book
    @PostMapping("/add")
    public ResponseEntity<?> addBook(@RequestBody BookDTO bookDTO) {
        try {
            Book saved = bookService.addBookWithCategories(bookDTO);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }



    // ✏️ Update book
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateBook(@PathVariable String id, @RequestBody BookDTO bookDTO) {
        try {
            Book updated = bookService.updateBookWithCategories(id, bookDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 📚 Get all books
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String keyword) {
        List<Book> results = bookService.searchBooks(keyword);
        return ResponseEntity.ok(results);
    }


    // 🔍 Search by category
    @GetMapping("/search/category")
    public ResponseEntity<List<Book>> searchByCategory(@RequestParam String category) {
        return ResponseEntity.ok(bookService.searchByCategory(category));
    }

    // 🗑️ Delete book
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok("Book deleted successfully");
    }
    @GetMapping("/availability")
    public ResponseEntity<List<Book>> getBooksByAvailability(@RequestParam boolean available) {
        List<Book> books;
        if (available) {
            books = bookService.findAvailableBooks(); // availableCopies > 0
        } else {
            books = bookService.findUnavailableBooks(); // availableCopies == 0
        }
        return ResponseEntity.ok(books);
    }

    @GetMapping("/low-stock")
    public List<Book> getLowStockBooks() {
        return bookRepository.findByAvailableCopiesLessThan(2);
    }
    @GetMapping("/damaged")
    public List<Book> getDamagedBooks() {
        return bookService.getDamagedBooks();
    }

    @PostMapping("/repair")
    public ResponseEntity<?> repairBook(
            @RequestParam String bookId,
            @RequestParam int repairedCount) {

        bookService.repairBook(bookId, repairedCount);
        return ResponseEntity.ok("Repaired successfully");
    }






    // ===== DTO classes =====
    public static class BookDTO {
        private String title;
        private String author;
        private String imageUrl;
        private double price;
        private int availableCopies;
        private List<Long> categoryIds;  // <-- use IDs only
        private String publisher;


        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getAuthor() { return author; }
        public void setAuthor(String author) { this.author = author; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }

        public int getAvailableCopies() { return availableCopies; }
        public void setAvailableCopies(int availableCopies) { this.availableCopies = availableCopies; }

        public List<Long> getCategoryIds() { return categoryIds; }
        public void setCategoryIds(List<Long> categoryIds) { this.categoryIds = categoryIds; }

        public String getPublisher() { return publisher; }
        public void setPublisher(String publisher) { this.publisher = publisher; }
    }

}
