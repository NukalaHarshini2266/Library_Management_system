

package com.example.LibraryManagementSoftware.repository;

import com.example.LibraryManagementSoftware.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface BookRepository extends JpaRepository<Book, String> {
    List<Book> findByAvailableCopiesGreaterThan(int number);
    List<Book> findByAvailableCopiesEquals(int number);
    List<Book> findByCategories_NameContainingIgnoreCase(String categoryName);
    @Query("SELECT b FROM Book b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.publisher) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> searchBooks(@Param("keyword") String keyword);
    List<Book> findByAvailableCopiesLessThan(int copies);
    List<Book> findByDamagedCopiesGreaterThan(int count);





}
