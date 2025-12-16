

package com.example.LibraryManagementSoftware.repository;

import com.example.LibraryManagementSoftware.entity.BorrowRecord;
import com.example.LibraryManagementSoftware.entity.Book;
import com.example.LibraryManagementSoftware.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    // count active records for a member (REQUESTED + BORROWED)
    long countByMemberIdAndStatusIn(Long memberId, List<String> statuses);

    // count active records for a user (when no membership)
    long countByUserAndStatusIn(User user, List<String> statuses);

    // find pending requests
    List<BorrowRecord> findByStatus(String status);

    List<BorrowRecord> findByMemberId(Long memberId);

    List<BorrowRecord> findByUserId(Long userId);

    void deleteAllByBook(Book book);

    void deleteAllByBookId(String bookId);

    List<BorrowRecord> findByStatusAndDueDateTime(String status, LocalDateTime dueDate);
    List<BorrowRecord> findByStatusAndDueDateTimeBefore(String status, LocalDateTime date);


    List<BorrowRecord> findByUser_EmailAndStatusAndDueDateTimeBefore(String email, String status, LocalDateTime dateTime);

    List<BorrowRecord> findByUser_EmailAndStatusAndDueDateTimeBetween(String email, String status, LocalDateTime start, LocalDateTime end);

    List<BorrowRecord> findByUser_EmailAndPaymentStatus(String email, String paymentStatus);




}
