package com.example.LibraryManagementSoftware.service;

import com.example.LibraryManagementSoftware.entity.Book;
import com.example.LibraryManagementSoftware.entity.BorrowRecord;
import com.example.LibraryManagementSoftware.repository.BookRepository;
import com.example.LibraryManagementSoftware.repository.BorrowRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserService userService;

    // ---------------- SCHEDULING ----------------

    // Run once when backend starts
    @PostConstruct
    public void runOnStartup() {
        System.out.println("Sending all notifications on startup at: " + LocalDateTime.now());
        sendAllNotifications();
    }

    // Run every day at 9 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void runDaily() {
        System.out.println("Sending all notifications daily at: " + LocalDateTime.now());
        sendAllNotifications();
    }

    // Helper to call all notifications
    private void sendAllNotifications() {
        sendUpcomingDueDateNotifications();
        sendOverdueNotifications();
        sendLowStockAlerts();
    }

    // ---------- FOR BORROWERS ----------
    public void sendUpcomingDueDateNotifications() {
        LocalDateTime target = LocalDateTime.now().plusDays(2);

        List<BorrowRecord> list = borrowRecordRepository
                .findByStatusAndDueDateTime("BORROWED", target.toLocalDate().atStartOfDay());

        for (BorrowRecord rec : list) {
            sendEmail(
                    rec.getUser().getEmail(),
                    "Reminder: Book Due in 2 Days",
                    "Hi " + rec.getUser().getName() + ",\n\n" +
                            "Your borrowed book '" + rec.getBook().getTitle() +
                            "' is due on " + rec.getDueDateTime() + ".\n" +
                            "Please return the book on time to avoid penalties.\n\n" +
                            "Best regards,\nMy Library Team"
            );
        }
    }

    public void sendOverdueNotifications() {
        LocalDateTime now = LocalDateTime.now();

        List<BorrowRecord> overdue = borrowRecordRepository
                .findByStatusAndDueDateTimeBefore("BORROWED", now);

        for (BorrowRecord rec : overdue) {
            sendEmail(
                    rec.getUser().getEmail(),
                    "Book Overdue Notice",
                    "Your borrowed book '" + rec.getBook().getTitle() +
                            "' is overdue. Please return it as soon as possible.\n\nBest Regards,\nMy Library Team"
            );
        }
    }

    // ---------- ADMIN ALERTS ----------
    public void sendLowStockAlerts() {
        List<Book> books = bookRepository.findAll();
        List<String> notifyEmails = userService.getEmailsByRoles("ADMIN", "LIBRARIAN");

        if (notifyEmails.isEmpty()) return;

        String[] to = notifyEmails.toArray(new String[0]); // convert list to array

        for (Book b : books) {
            if (b.getAvailableCopies() <= 2) { // threshold
                sendEmail(
                        to,
                        "Low Stock Alert",
                        "The book '" + b.getTitle() + "' is running low on stock. Only "
                                + b.getAvailableCopies() + " copies left."
                );
            }
        }
    }

    // Single recipient
    public void sendEmail(String to, String subject, String text) {
        sendEmail(new String[]{to}, subject, text);
    }
    // Multiple recipient
    public void sendEmail(String[] to, String subject, String text) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(to); // now supports multiple emails
            msg.setSubject(subject);
            msg.setText(text);
            mailSender.send(msg);
            System.out.println("✅ Email sent to: " + String.join(", ", to));
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }
    }

}
