package com.example.LibraryManagementSoftware.service;

import com.example.LibraryManagementSoftware.entity.BorrowRecord;
import com.example.LibraryManagementSoftware.entity.Book;
import com.example.LibraryManagementSoftware.entity.Member;
import com.example.LibraryManagementSoftware.entity.User;
import com.example.LibraryManagementSoftware.repository.BorrowRecordRepository;
import com.example.LibraryManagementSoftware.repository.BookRepository;
import com.example.LibraryManagementSoftware.repository.MemberRepository;
import com.example.LibraryManagementSoftware.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowRecordService {

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;

    // ---------- REQUEST ----------
    public BorrowRecord requestBook(Long userId, String bookId) {

        // Validate user
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        User user = userOpt.get();

        // Validate book
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (!bookOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        }
        Book book = bookOpt.get();

        // Get memberships for user (without lambda)
        List<Member> memberships = memberRepository.findByUser(user);
        Member highest = null;

        if (memberships != null && !memberships.isEmpty()) {
            int highestRank = -1;
            for (Member m : memberships) {
                int rank = getRank(m.getPlanType());
                if (rank > highestRank) {
                    highestRank = rank;
                    highest = m;
                }
            }
        }

        int borrowLimit = 1; // Default non-member
        Long memberIdToUse = null;
        if (highest != null) {
            memberIdToUse = highest.getId();
            String planType = highest.getPlanType();
            if (planType != null) {
                String upperPlan = planType.toUpperCase();
                if (upperPlan.equals("STANDARD")) borrowLimit = 3;
                else if (upperPlan.equals("PREMIUM")) borrowLimit = 5;
                else if (upperPlan.equals("GOLD")) borrowLimit = 10;
            }
        }

        // Check active borrows
        List<String> activeStatuses = List.of("REQUESTED", "BORROWED");
        long activeCount = 0;

        if (memberIdToUse != null) {
            activeCount = borrowRecordRepository.countByMemberIdAndStatusIn(memberIdToUse, activeStatuses);
        } else {
            activeCount = borrowRecordRepository.countByUserAndStatusIn(user, activeStatuses);
        }

        if (activeCount >= borrowLimit) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot borrow/request more books. Your limit is " + borrowLimit);
        }

        // Create borrow record
        BorrowRecord rec = new BorrowRecord();
        rec.setUser(user);
        rec.setUsername(user.getName());
        rec.setMemberId(memberIdToUse);
        rec.setBook(book);
        rec.setStatus("REQUESTED");
        rec.setBorrowDateTime(null);
        rec.setDueDateTime(null);
        rec.setReturnDateTime(null);
        rec.setPenalty(0);

        BorrowRecord saved = borrowRecordRepository.save(rec);

        // Send email notification
        sendEmail(
                user.getEmail(),
                "Book Request Received",
                "Hi " + user.getName() + ",\n\n" +"Your request for '" + book.getTitle() +
                        "' has been received and is pending admin approval.\n" +
                        "Note: Keep the book safe once approved.\n" +
                        "We will update you soon once the request is reviewed.\n\n" +
                        "Best regards,\nMy Library Team"
        );


        return saved;
    }

    // ---------- APPROVE ----------
    public BorrowRecord approveRequest(Long borrowId) {
        Optional<BorrowRecord> recOpt = borrowRecordRepository.findById(borrowId);
        if (!recOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found");
        }
        BorrowRecord rec = recOpt.get();

        if (!"REQUESTED".equalsIgnoreCase(rec.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only REQUESTED records can be approved");
        }

        Optional<Book> bookOpt = bookRepository.findById(rec.getBook().getId());
        if (!bookOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        }
        Book book = bookOpt.get();

//        if (book.getAvailableCopies() <= 0) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No copies available for book: " + book.getTitle());
//        }
//
//        // Approve and update
//        book.setAvailableCopies(book.getAvailableCopies() - 1);
//        bookRepository.save(book);
        // ⭐ Do NOT decrement if this borrow came from reservation
        if (!rec.isFromReservation()) {

            if (book.getAvailableCopies() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "No copies available for book: " + book.getTitle());
            }

            book.setAvailableCopies(book.getAvailableCopies() - 1);
            bookRepository.save(book);
        }


        rec.setStatus("BORROWED");
        rec.setBorrowDateTime(LocalDateTime.now());
        rec.setDueDateTime(LocalDateTime.now().plusWeeks(2));

        BorrowRecord saved = borrowRecordRepository.save(rec);

        // Increment booksBorrowedThisMonth for the member if exists
        if (rec.getMemberId() != null) {
            Optional<Member> memberOpt = memberRepository.findById(rec.getMemberId());
            if (memberOpt.isPresent()) {
                Member member = memberOpt.get();
                // Increment by 1
                member.setBooksBorrowedThisMonth(member.getBooksBorrowedThisMonth() + 1);
                memberRepository.save(member);
            }
        }

        // Send mail manually without lambda
        Optional<User> userOpt = userRepository.findById(rec.getUser().getId());
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            sendEmail(
                    u.getEmail(),
                    "Book Borrow Approved",
                    "Hi " + u.getName() + ",\n\n" +
                            "Your request for '" + book.getTitle() +
                            "' has been approved. Please keep the book safe and return it on time.\n\n" +
                            "Best regards,\nMy Library Team"
            );
        }


        return saved;
    }

    // ---------- RETURN ----------
    public BorrowRecord returnBook(Long borrowId) {
        Optional<BorrowRecord> recOpt = borrowRecordRepository.findById(borrowId);
        if (!recOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found");
        }
        BorrowRecord rec = recOpt.get();

        if (!"BORROWED".equalsIgnoreCase(rec.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only BORROWED records can be returned");
        }

        Optional<Book> bookOpt = bookRepository.findById(rec.getBook().getId());
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);
        }

        double penalty = 0.0;
        LocalDateTime now = LocalDateTime.now();

        if (rec.getDueDateTime() != null && now.isAfter(rec.getDueDateTime())) {
            long daysLate = Duration.between(rec.getDueDateTime(), now).toDays();
            int grace = 0;

            if (rec.getMemberId() != null) {
                Optional<Member> memberOpt = memberRepository.findById(rec.getMemberId());
                if (memberOpt.isPresent()) {
                    Member m = memberOpt.get();
                    String plan = m.getPlanType();
                    if (plan != null) {
                        String upper = plan.toUpperCase();
                        if (upper.equals("STANDARD")) grace = 3;
                        else if (upper.equals("PREMIUM")) grace = 5;
                        else if (upper.equals("GOLD")) grace = 10;
                    }
                }
            }

            if (daysLate > 0) {
                if (daysLate <= grace) penalty = daysLate * 5;
                else penalty = (grace * 5) + ((daysLate - grace) * 10);
            }
        }

        rec.setReturnDateTime(now);
        rec.setPenalty(penalty);
        rec.setStatus("RETURNED");

        BorrowRecord saved = borrowRecordRepository.save(rec);

        Optional<User> userOpt2 = userRepository.findById(rec.getUser().getId());
        if (userOpt2.isPresent()) {
            User u = userOpt2.get();
            sendEmail(
                    u.getEmail(),
                    "Book Returned",
                    "Hi " + u.getName() + ",\n\n" +
                            "Thank you for returning the book.\n" +
                            "Penalty: ₹" + penalty + " (paid)\n\n" +
                            "Best regards,\nMy Library Team"
            );

        }

        return saved;
    }
    // ---------- RETURN FLOW ----------

    // Step 1: User requests a return
    public BorrowRecord requestReturn(Long borrowId) {
        BorrowRecord rec = borrowRecordRepository.findById(borrowId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found"));

        if (!"BORROWED".equalsIgnoreCase(rec.getStatus()) &&
                !"RENEWED".equalsIgnoreCase(rec.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only BORROWED books can request return");
        }

        rec.setStatus("RETURN_REQUESTED");
        rec.setReturnRequestDate(LocalDateTime.now());
        BorrowRecord saved = borrowRecordRepository.save(rec);

        // Notify admin and librarian
        List<String> notifyEmails = userService.getEmailsByRoles("ADMIN", "LIBRARIAN");
        String[] recipients = notifyEmails.toArray(new String[0]);
        sendEmail(
                recipients,
                "Return Requested",
                "A new book return request has been submitted.\n\n" +
                        "User: " + rec.getUser().getName() + "\n" +
                        "Book: " + rec.getBook().getTitle() + "\n\n" +
                        "Please inspect the book condition and update the return status accordingly.\n\n" +
                        "Thank you,\nMy Library Team"
        );

        return saved;
    }

    // Step 2: Admin inspects the book
    public BorrowRecord inspectReturn(Long borrowId, boolean damaged, String damageNotes, double damageFee) {
        BorrowRecord rec = borrowRecordRepository.findById(borrowId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found"));

        if (!"RETURN_REQUESTED".equalsIgnoreCase(rec.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Return must be requested first");
        }

        // Set damage info
        rec.setDamaged(damaged);
        rec.setDamageNotes(damageNotes);
        rec.setDamageFee(damageFee);

        // Calculate overdue penalty
        double overduePenalty = 0.0;
        LocalDateTime now = LocalDateTime.now();
        if (rec.getDueDateTime() != null && now.isAfter(rec.getDueDateTime())) {
            long daysLate = Duration.between(rec.getDueDateTime(), now).toDays();
            int grace = 0;
            if (rec.getMemberId() != null) {
                Optional<Member> memberOpt = memberRepository.findById(rec.getMemberId());
                if (memberOpt.isPresent()) {
                    Member m = memberOpt.get();
                    String plan = m.getPlanType();
                    if (plan != null) {
                        switch (plan.toUpperCase()) {
                            case "STANDARD" -> grace = 3;
                            case "PREMIUM" -> grace = 5;
                            case "GOLD" -> grace = 10;
                        }
                    }
                }
            }
            if (daysLate > 0) {
                overduePenalty = (daysLate <= grace) ? daysLate * 5 : (grace * 5) + ((daysLate - grace) * 10);
            }
        }

        rec.setPenalty(overduePenalty + damageFee);
        rec.setStatus("RETURN_INSPECTED");
        rec.setReturnDateTime(now);

        BorrowRecord saved = borrowRecordRepository.save(rec);

        // Notify user
        sendEmail(
                rec.getUser().getEmail(),
                "Return Inspected",
                "Hi " + rec.getUser().getName() + ",\n\n" +
                        "Your returned book '" + rec.getBook().getTitle() + "' has been inspected.\n" +
                        "Total penalty: ₹" + rec.getPenalty() + "\n\n" +
                        "Please proceed with the payment to complete the return process.\n\n" +
                        "Best regards,\nMy Library Team"
        );

        return saved;
    }

    // Step 3: User completes payment (if any) → finalize return
    public BorrowRecord completeReturn(Long borrowId) {
        BorrowRecord rec = borrowRecordRepository.findById(borrowId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found"));

        if (!"RETURN_INSPECTED".equalsIgnoreCase(rec.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Return not inspected yet");
        }

        // Update book stock
        Book book = bookRepository.findById(rec.getBook().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        book.setAvailableCopies(book.getAvailableCopies() + 1);
        if (rec.getDamaged()) {
            book.setDamagedCopies(book.getDamagedCopies() + 1);
        }
        bookRepository.save(book);

        if (rec.getPenalty() > 0) {
            rec.setPaymentStatus("PAID");   // <-- Added line
        } else {
            rec.setPaymentStatus("NO_PENALTY"); // optional
        }

        rec.setStatus("RETURNED");
        BorrowRecord saved = borrowRecordRepository.save(rec);
        reservationService.notifyNextPendingUser(book);


        // Notify user
        sendEmail(
                rec.getUser().getEmail(),
                "Return Completed",
                "Hi " + rec.getUser().getName() + ",\n\n" +
                        "Your return process for the book '" + rec.getBook().getTitle() + "' has been successfully completed.\n" +
                        "Penalty paid: ₹" + rec.getPenalty() + "\n\n" +
                        "Thank you for returning the book. We appreciate your cooperation.\n\n" +
                        "Best regards,\nMy Library Team"
        );

        return saved;
    }




    // ---------- Utility ----------
    private int getRank(String plan) {
        if (plan == null) return 0;
        String p = plan.toUpperCase();
        if (p.equals("GOLD")) return 3;
        if (p.equals("PREMIUM")) return 2;
        if (p.equals("STANDARD")) return 1;
        return 0;
    }



    // ---------- Retrieval ----------
    public List<BorrowRecord> getAllBorrowRecords() {
        return borrowRecordRepository.findAll();
    }

    public List<BorrowRecord> getPendingRequests() {
        return borrowRecordRepository.findByStatus("REQUESTED");
    }


    public List<BorrowRecord> getUserBorrowRecords(Long userId) {
        return borrowRecordRepository.findByUserId(userId);
    }

    // ---------- REJECT ----------
    public BorrowRecord rejectRequest(Long borrowId) {
        Optional<BorrowRecord> recOpt = borrowRecordRepository.findById(borrowId);
        if (!recOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found");
        }
        BorrowRecord rec = recOpt.get();

        if (!"REQUESTED".equalsIgnoreCase(rec.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only REQUESTED records can be rejected");
        }

        rec.setStatus("REJECTED");
        BorrowRecord saved = borrowRecordRepository.save(rec);

        // Send email to user
        Optional<User> userOpt = userRepository.findById(rec.getUser().getId());
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            sendEmail(
                    u.getEmail(),
                    "Book Request Rejected",
                    "Hi " + u.getName() + ",\n\n" +
                            "Your request for the book '" + rec.getBook().getTitle() + "' has been rejected.\n" +
                            "If you have any questions or would like to request another book, feel free to contact us.\n\n" +
                            "Best regards,\nMy Library Team"
            );
        }

        return saved;
    }


    public double calculatePenalty(Long borrowId) throws Exception {
        Optional<BorrowRecord> recordOpt = borrowRecordRepository.findById(borrowId);
        if (recordOpt.isEmpty()) throw new Exception("Borrow record not found");

        BorrowRecord record = recordOpt.get();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime due = record.getDueDateTime(); // use borrow's due date
        if (due == null) return 0;
        Long userId = record.getUser().getId();      // userId

        // Get all memberships for this user
        List<Member> memberships = memberRepository.findByUser(record.getUser());
        String planType = "standard"; // default plan

        if (memberships != null && !memberships.isEmpty()) {
            int highestRank = -1;
            for (Member m : memberships) {
                int rank = getRank(m.getPlanType()); // your method to assign rank
                if (rank > highestRank) {
                    highestRank = rank;
                    planType = m.getPlanType(); // use highest planType
                }
            }
        }

        // Calculate overdue days
        long overdueDays = now.isAfter(due) ? ChronoUnit.DAYS.between(due, now) : 0;
        double penalty = 0;

        if (overdueDays > 0) {
            switch (planType.toLowerCase()) {
                case "standard":
                    overdueDays -= 3;
                    break;
                case "premium":
                    overdueDays -= 5;
                    break;
                case "gold":
                    overdueDays -= 10;
                    break;
            }
            if (overdueDays > 0) penalty = overdueDays * 10; // ₹10 per day
        }

        return Math.max(penalty, 0);
    }
    // ---------- RENEWAL REQUEST ----------
    public BorrowRecord requestRenewal(Long borrowId) {
        Optional<BorrowRecord> recOpt = borrowRecordRepository.findById(borrowId);
        if (recOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found");
        }

        BorrowRecord rec = recOpt.get();

        // ✅ Only BORROWED books can request renewal
        if (!"BORROWED".equalsIgnoreCase(rec.getStatus()) &&
                !"RENEWED".equalsIgnoreCase(rec.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only borrowed books can request renewal");
        }

        // Update status
        rec.setStatus("RENEW_REQUESTED");
        BorrowRecord saved = borrowRecordRepository.save(rec);

        // ✅ Notify borrower
        Optional<User> userOpt = userRepository.findById(rec.getUser().getId());
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            sendEmail(
                    u.getEmail(),
                    "Renewal Request Submitted",
                    "Hi " + u.getName() + ",\n\n" +
                            "Your renewal request for the book '" + rec.getBook().getTitle() + "' " +
                            "has been submitted successfully and is now pending admin approval.\n\n" +
                            "Thank you!\n\n"+
                            "Best regards,\nMy Library Team"
            );

        }

        // ✅ Notify admin
        List<String> notifyEmails = userService.getEmailsByRoles("ADMIN", "LIBRARIAN");
        String[] recipients = notifyEmails.toArray(new String[0]);
        sendEmail(
                recipients,
                "Book Renewal Request Received",
                "A renewal request has been submitted for the book '" +
                        rec.getBook().getTitle() + "'.\n\n" +
                        "Best regards,\nMy Library Team"
        );

        return saved;
    }
    // ---------- RENEWAL APPROVAL ----------
    public BorrowRecord approveRenewal(Long borrowId) {
        Optional<BorrowRecord> recOpt = borrowRecordRepository.findById(borrowId);
        if (recOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found");
        }

        BorrowRecord rec = recOpt.get();

        // ✅ Only RENEW_REQUESTED records can be approved
        if (!"RENEW_REQUESTED".equalsIgnoreCase(rec.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only renewal-requested books can be approved. Current status: " + rec.getStatus());
        }

        // ✅ Extend due date by 1 week and update status
        rec.setDueDateTime(rec.getDueDateTime().plusWeeks(1));
        rec.setStatus("RENEWED");
        Integer currentCount = rec.getRenewCount();
        if (currentCount == null) {
            currentCount = 0;
        }
        rec.setRenewCount(currentCount + 1);


        BorrowRecord saved = borrowRecordRepository.save(rec);

        // ✅ Notify borrower
        Optional<User> userOpt = userRepository.findById(rec.getUser().getId());
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            sendEmail(
                    u.getEmail(),
                    "Renewal Approved",
                    "Hi " + u.getName() + ",\n\n" +
                            "Your renewal request for the book '" + rec.getBook().getTitle() +
                            "' has been approved.\n" +
                            "New due date: " + rec.getDueDateTime() + "\n\n" +
                            "Please make sure to return the book on time.\n\n" +
                            "Best regards,\nMy Library Team"
            );

        }

        return saved;
    }
    // ---------- RENEWAL REJECTION ----------
    public BorrowRecord rejectRenewal(Long borrowId) {
        Optional<BorrowRecord> recOpt = borrowRecordRepository.findById(borrowId);
        if (recOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found");
        }

        BorrowRecord rec = recOpt.get();

        // ✅ Only RENEW_REQUESTED can be rejected
        if (!"RENEW_REQUESTED".equalsIgnoreCase(rec.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only renewal-requested books can be rejected. Current status: " + rec.getStatus());
        }

        rec.setStatus("BORROWED"); // revert to borrowed, keep original due date
        BorrowRecord saved = borrowRecordRepository.save(rec);

        // ✅ Notify borrower
        Optional<User> userOpt = userRepository.findById(rec.getUser().getId());
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            sendEmail(
                    u.getEmail(),
                    "Renewal Rejected",
                    "Hi " + u.getName() + ",\n\n" +
                            "Your renewal request for the book '" + rec.getBook().getTitle() +
                            "' has been rejected.\n" +
                            "Please return the book by the current due date: " + rec.getDueDateTime() + ".\n\n" +
                            "Best regards,\nMy Library Team"
            );

        }

        return saved;
    }
    public BorrowRecord getById(Long id) {
        return borrowRecordRepository.findById(id).orElse(null);
    }


    // Single recipient
    private void sendEmail(String to, String subject, String text) {
        sendEmail(new String[]{to}, subject, text);
    }

    // Multiple recipients
    private void sendEmail(String[] to, String subject, String text) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(text);
            mailSender.send(mail);
            System.out.println("✅ Email sent to: " + String.join(", ", to));
        } catch (Exception e) {
            System.err.println("Email send failed: " + e.getMessage());
        }
    }

}
