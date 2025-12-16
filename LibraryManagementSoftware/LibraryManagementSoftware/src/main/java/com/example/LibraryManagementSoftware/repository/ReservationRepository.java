package com.example.LibraryManagementSoftware.repository;
import com.example.LibraryManagementSoftware.entity.User;

import com.example.LibraryManagementSoftware.entity.Reservation;
import com.example.LibraryManagementSoftware.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // FIFO: find pending reservations for a book ordered by reservationDate
    List<Reservation> findByBookAndStatusOrderByReservationDateAsc(Book book, String status);

    List<Reservation> findByStatus(String status);

    // find notifications that expired (expiryDate < now and status = NOTIFIED)
    List<Reservation> findByStatusAndExpiryDateBefore(String status, java.time.LocalDateTime time);

    Optional<Reservation> findFirstByUser_IdAndBook_IdAndStatusIn(Long userId, String bookId, List<String> statusList);

    List<Reservation> findByBookIdAndStatusIn(String bookId, List<String> statuses);

    List<Reservation> findByUserAndStatus(User user, String status);
    // Already should exist
    List<Reservation> findByUser(User user);



}
