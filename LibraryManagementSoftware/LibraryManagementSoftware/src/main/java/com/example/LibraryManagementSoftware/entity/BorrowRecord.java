

package com.example.LibraryManagementSoftware.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_record")
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long borrowId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // we store primitive ids/strings to avoid relationship mapping problems
    private String username;
    private Long memberId;    // nullable if user has no membership
    //private String bookId;
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(name = "renew_count")
    private Integer renewCount = 0;

    private LocalDateTime borrowDateTime; // when actually borrowed
    private LocalDateTime dueDateTime;
    private LocalDateTime returnDateTime; // when returned

    private double penalty;

    // ---------- NEW FIELDS ----------
    // When user requested the return
    private LocalDateTime returnRequestDate;
    @Column(name = "damaged")
    private Boolean damaged = false; // default false


    // Damage notes entered by admin
    @Column(length = 1000)
    private String damageNotes;

    // Fee charged for damage (entered by admin or calculated)
    private double damageFee = 0.0;
    // --------------------------------


    // REQUESTED, APPROVED, BORROWED, RETURNED, CANCELLED
    private String status;

    private boolean fromReservation = false;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus = "NOT_PAID";



    public BorrowRecord() {}

    // getters & setters
    public Long getBorrowId() { return borrowId; }
    public void setBorrowId(Long borrowId) { this.borrowId = borrowId; }


    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public LocalDateTime getBorrowDateTime() { return borrowDateTime; }
    public void setBorrowDateTime(LocalDateTime borrowDateTime) { this.borrowDateTime = borrowDateTime; }

    public LocalDateTime getDueDateTime() { return dueDateTime; }
    public void setDueDateTime(LocalDateTime dueDateTime) { this.dueDateTime = dueDateTime; }

    public LocalDateTime getReturnDateTime() { return returnDateTime; }
    public void setReturnDateTime(LocalDateTime returnDateTime) { this.returnDateTime = returnDateTime; }

    public double getPenalty() { return penalty; }
    public void setPenalty(double penalty) { this.penalty = penalty; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getRenewCount() {
        return renewCount;
    }

    public void setRenewCount(Integer renewCount) {
        this.renewCount = renewCount;
    }

    public LocalDateTime getReturnRequestDate() { return returnRequestDate; }
    public void setReturnRequestDate(LocalDateTime returnRequestDate) { this.returnRequestDate = returnRequestDate; }

    public Boolean getDamaged() {
        return damaged;
    }

    public void setDamaged(Boolean damaged) {
        this.damaged = damaged;
    }


    public String getDamageNotes() { return damageNotes; }
    public void setDamageNotes(String damageNotes) { this.damageNotes = damageNotes; }

    public double getDamageFee() { return damageFee; }
    public void setDamageFee(double damageFee) { this.damageFee = damageFee; }

    public boolean isFromReservation() {
        return fromReservation;
    }

    public void setFromReservation(boolean fromReservation) {
        this.fromReservation = fromReservation;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }




}
