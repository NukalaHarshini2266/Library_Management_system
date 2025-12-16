package com.example.LibraryManagementSoftware.service;

import com.example.LibraryManagementSoftware.entity.Reservation;
import com.example.LibraryManagementSoftware.entity.Book;
import com.example.LibraryManagementSoftware.entity.User;
import com.example.LibraryManagementSoftware.repository.ReservationRepository;
import com.example.LibraryManagementSoftware.repository.BookRepository;
import com.example.LibraryManagementSoftware.repository.UserRepository;
import com.example.LibraryManagementSoftware.entity.BorrowRecord;
import com.example.LibraryManagementSoftware.repository.BorrowRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final BorrowRecordRepository borrowRecordRepository;

    // hold duration hours (configurable)
    private static final long HOLD_HOURS = 48;

    public ReservationService(ReservationRepository reservationRepository,
                              BookRepository bookRepository,
                              UserRepository userRepository,
                              NotificationService notificationService,
                              BorrowRecordRepository borrowRecordRepository) {
        this.reservationRepository = reservationRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    // User creates reservation
    @Transactional
    public Reservation createReservation(Long userId, String bookId, String notes) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isEmpty()) throw new RuntimeException("Book not found");
        Book book = bookOpt.get();

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");
        User user = userOpt.get();

        // If copies available, user should borrow instead of reserving
        if (book.getAvailableCopies() > 0) {
            throw new RuntimeException("Book available now. You can borrow it directly.");
        }

        Reservation r = new Reservation();
        r.setBook(book);
        r.setUser(user);
        r.setNotes(notes);
        r.setStatus("PENDING");
        r.setReservationDate(LocalDateTime.now());

        return reservationRepository.save(r);
    }

    // Called when a book becomes available — notify next pending user (if any)
    @Transactional
    public void notifyNextPendingUser(Book book) {
        List<Reservation> pending = reservationRepository.findByBookAndStatusOrderByReservationDateAsc(book, "PENDING");
        if (pending == null || pending.isEmpty()) return;

        Reservation next = pending.get(0);
        // set NOTIFIED and hold book: decrement availableCopies to represent hold
        next.setStatus("NOTIFIED");
        LocalDateTime now = LocalDateTime.now();
        next.setNotificationDate(now);
        next.setExpiryDate(now.plusHours(HOLD_HOURS));
        reservationRepository.save(next);

        // reduce availableCopies by 1 to hold it for the notified user
        book.setAvailableCopies(Math.max(0, book.getAvailableCopies() - 1));
        bookRepository.save(book);

        // Send email to user
        String subject = "Book Available for Pickup: " + book.getTitle();
        String body = "Hi " + next.getUser().getName() + ",\n\n"
                + "The book '" + book.getTitle() + "' is available for you.\n"
                + "Please collect it before " + next.getExpiryDate() + ".\n\nThanks!"
                +"\n\nBest regards, \n My Library team.";
        notificationService.sendEmail(next.getUser().getEmail(), subject, body);
    }

    // User collects the book after being notified: mark COMPLETED and create BorrowRecord externally
    @Transactional
    public Reservation completeReservation(Long reservationId) {
        Reservation r = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (!"NOTIFIED".equalsIgnoreCase(r.getStatus())) {
            throw new RuntimeException("Reservation not in NOTIFIED state");
        }

        r.setStatus("COMPLETED");
        reservationRepository.save(r);

        // ⭐ CREATE BORROW REQUEST FOR ADMIN APPROVAL
        BorrowRecord br = new BorrowRecord();
        br.setUser(r.getUser());
        br.setBook(r.getBook());
        br.setStatus("REQUESTED");
        br.setFromReservation(true);   // ⭐ VERY IMPORTANT ⭐

        borrowRecordRepository.save(br);

        return r;
    }


    // Admin or user cancels reservation
    @Transactional
    public Reservation cancelReservation(Long reservationId) {
        Optional<Reservation> rOpt = reservationRepository.findById(reservationId);
        if (rOpt.isEmpty()) throw new RuntimeException("Reservation not found");
        Reservation r = rOpt.get();
        boolean wasNotified = "NOTIFIED".equalsIgnoreCase(r.getStatus());
        r.setStatus("CANCELLED");
        reservationRepository.save(r);

        // if it was holding a copy, release it
        if (wasNotified) {
            Book book = r.getBook();
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);
            // notify next
            notifyNextPendingUser(book);
        }

        return r;
    }

    // Scheduler: expire NOTIFIED reservations whose expiryDate < now
    @Transactional
    public void expireOldNotifications() {
        List<Reservation> expired = reservationRepository.findByStatusAndExpiryDateBefore("NOTIFIED", LocalDateTime.now());
        for (Reservation r : expired) {
            r.setStatus("EXPIRED");
            reservationRepository.save(r);

            // release hold
            Book book = r.getBook();
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);

            // notify next pending user
            notifyNextPendingUser(book);
        }
    }

    @Transactional
    public void notifyMultiplePendingUsers(Book book, int count) {

        List<Reservation> pending = reservationRepository
                .findByBookAndStatusOrderByReservationDateAsc(book, "PENDING");

        if (pending.isEmpty()) return;

        for (int i = 0; i < count && i < pending.size(); i++) {
            Reservation next = pending.get(i);

            next.setStatus("NOTIFIED");
            LocalDateTime now = LocalDateTime.now();
            next.setNotificationDate(now);
            next.setExpiryDate(now.plusHours(HOLD_HOURS));
            reservationRepository.save(next);

            // hold 1 copy
            book.setAvailableCopies(Math.max(0, book.getAvailableCopies() - 1));
            bookRepository.save(book);

            // send email
            notificationService.sendEmail(
                    next.getUser().getEmail(),
                    "Book Available for Pickup: " + book.getTitle(),
                    "Hi " + next.getUser().getName() + ",\n\n"
                            + "The book '" + book.getTitle() + "' is available for you.\n"
                            + "Please collect it before " + next.getExpiryDate() + ".\n\nThanks!"
                            +"\n\nBest Regards,\nMy Library Team."
            );
        }
    }

    // helper: list pending reservations for admin
    public List<Reservation> listPendingAndNotifiedForBook(String bookId) {
        return reservationRepository.findByBookIdAndStatusIn(
                bookId, List.of("PENDING", "NOTIFIED")
        );
    }


    public Optional<Reservation> findActiveReservation(Long userId, String bookId) {
        List<String> activeStatuses = List.of("PENDING", "NOTIFIED");
        return reservationRepository.findFirstByUser_IdAndBook_IdAndStatusIn(userId, bookId, activeStatuses);
    }


    public List<Reservation> getPendingReservations() {
        return reservationRepository.findByStatus("PENDING");
    }

    public List<Reservation> getNotifiedReservations() {
        return reservationRepository.findByStatus("NOTIFIED");
    }
    public List<Reservation> getPendingReservationsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reservationRepository.findByUserAndStatus(user, "PENDING");
    }


}
