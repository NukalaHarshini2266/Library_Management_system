//
//
//
//package com.example.LibraryManagementSoftware.entity;
//
//import jakarta.persistence.*;
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import java.util.*;
//
//@Entity
//@Table(name = "users")
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String name;
//    private String email;
//    private String password;
//    private String newPassword;
//    private String otp;
//    private boolean otpVerified;
//
//    @ManyToOne
//    @JoinColumn(name = "role_id")
//    private Role role;
//
//    // ✅ Correct OneToMany mapping with BorrowRecord
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    @JsonIgnore
//    private List<BorrowRecord> borrowRecords = new ArrayList<>();
//
//
//    // Getters and Setters
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public String getName() { return name; }
//    public void setName(String name) { this.name = name; }
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//
//    public String getPassword() { return password; }
//    public void setPassword(String password) { this.password = password; }
//
//    public String getNewPassword() { return newPassword; }
//    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
//
//    public String getOtp() { return otp; }
//    public void setOtp(String otp) { this.otp = otp; }
//
//    public boolean isOtpVerified() { return otpVerified; }
//    public void setOtpVerified(boolean otpVerified) { this.otpVerified = otpVerified; }
//
//    public Role getRole() { return role; }
//    public void setRole(Role role) { this.role = role; }
//
//    public List<BorrowRecord> getBorrowRecords() { return borrowRecords; }
//    public void setBorrowRecords(List<BorrowRecord> borrowRecords) { this.borrowRecords = borrowRecords; }
//
//
//}
//


package com.example.LibraryManagementSoftware.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String newPassword;
    private String otp;
    private boolean otpVerified;

    // Role stored as string: ADMIN, LIBRARIAN, USER
    private String role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<BorrowRecord> borrowRecords = new ArrayList<>();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public boolean isOtpVerified() { return otpVerified; }
    public void setOtpVerified(boolean otpVerified) { this.otpVerified = otpVerified; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<BorrowRecord> getBorrowRecords() { return borrowRecords; }
    public void setBorrowRecords(List<BorrowRecord> borrowRecords) { this.borrowRecords = borrowRecords; }
}
