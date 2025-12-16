package com.example.LibraryManagementSoftware.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    @Column(name = "contact")
    private String contactNumber;
    private String planType; // STANDARD, PREMIUM, GOLD
    private int durationMonths; // 3, 6, or 9
    private int monthlyLimit; // 1, 3, 5, or 10 books
    private int booksBorrowedThisMonth = 0;
    private LocalDate joinDate;
    private LocalDate expiryDate;
    @ManyToOne // or @OneToOne if each member maps to exactly one user
    @JoinColumn(name = "user_id")
    private User user;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contact) { this.contactNumber = contact; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public int getDurationMonths() { return durationMonths; }
    public void setDurationMonths(int durationMonths) { this.durationMonths = durationMonths; }

    public int getMonthlyLimit() { return monthlyLimit; }
    public void setMonthlyLimit(int monthlyLimit) { this.monthlyLimit = monthlyLimit; }

    public int getBooksBorrowedThisMonth() { return booksBorrowedThisMonth; }
    public void setBooksBorrowedThisMonth(int booksBorrowedThisMonth) { this.booksBorrowedThisMonth = booksBorrowedThisMonth; }

    public LocalDate getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDate joinDate) { this.joinDate = joinDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    // ------------------ Convenience Getter ------------------
    @Transient
    public Long getUserId() {
        return (user != null) ? user.getId() : null;
    }
}
