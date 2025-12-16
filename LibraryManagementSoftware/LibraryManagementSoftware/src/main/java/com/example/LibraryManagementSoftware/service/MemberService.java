package com.example.LibraryManagementSoftware.service;

import com.example.LibraryManagementSoftware.entity.User;
import com.example.LibraryManagementSoftware.entity.Member;
import com.example.LibraryManagementSoftware.repository.MemberRepository;
import com.example.LibraryManagementSoftware.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private UserRepository userRepository;

    // Static inner DTO class
    public static class MemberDTO {
        private Long id;
        private String name;
        private String email;
        private String contactNumber;
        private String planType;
        private int durationMonths;
        private int monthlyLimit;
        private int booksBorrowedThisMonth;
        private LocalDate joinDate;
        private LocalDate expiryDate;

        public MemberDTO(Member m) {
            this.id = m.getId();
            this.name = m.getName();
            this.email = m.getEmail();
            this.contactNumber = m.getContactNumber();
            this.planType = m.getPlanType();
            this.durationMonths = m.getDurationMonths();
            this.monthlyLimit = m.getMonthlyLimit();
            this.joinDate = m.getJoinDate();
            this.expiryDate = m.getExpiryDate();
            this.booksBorrowedThisMonth=m.getBooksBorrowedThisMonth();
        }

        // Getters
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getContactNumber() { return contactNumber; }
        public String getPlanType() { return planType; }
        public int getDurationMonths() { return durationMonths; }
        public int getMonthlyLimit() { return monthlyLimit; }
        public LocalDate getJoinDate() { return joinDate; }
        public LocalDate getExpiryDate() { return expiryDate; }

        public int getBooksBorrowedThisMonth() { return booksBorrowedThisMonth; }
    }

    // Fees per plan per month
    private double getPlanFee(String planType) {
        switch (planType.toUpperCase()) {
            case "STANDARD": return 100;
            case "PREMIUM":  return 200;
            case "GOLD":     return 300;
            default:         return 50;
        }
    }

    public List<MemberDTO> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(MemberDTO::new)
                .collect(Collectors.toList());
    }

    public MemberDTO getMemberById(Long id) {
        Member m = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return new MemberDTO(m);
    }
//
//    public MemberDTO addMember(Member member) {
//
//        // ✅ Find the user by email (or any unique identifier)
//        Optional<User> userOpt = userRepository.findByEmail(member.getEmail());
//        if (!userOpt.isPresent()) {
//            throw new RuntimeException("User not found for email: " + member.getEmail());
//        }
//        User user = userOpt.get();
//
//        // ✅ Set the user in the Member object
//        member.setUser(user);
//
//
//        List<Member> existing = memberRepository.findByUserEmail(member.getEmail());
//        boolean hasSamePlan = existing.stream()
//                .anyMatch(m -> m.getPlanType().equalsIgnoreCase(member.getPlanType())
//                        && m.getExpiryDate() != null
//                        && m.getExpiryDate().isAfter(LocalDate.now()));
//
//        if (hasSamePlan) {
//            throw new RuntimeException("User already has an active membership of this plan.");
//        }
//
//        member.setJoinDate(LocalDate.now());
//        member.setExpiryDate(LocalDate.now().plusMonths(member.getDurationMonths()));
//
//        switch (member.getPlanType().toUpperCase()) {
//            case "STANDARD": member.setMonthlyLimit(3); break;
//            case "PREMIUM":  member.setMonthlyLimit(5); break;
//            case "GOLD":     member.setMonthlyLimit(10); break;
//            default:         member.setMonthlyLimit(1); break;
//        }
//
//        double totalFee = getPlanFee(member.getPlanType()) * member.getDurationMonths();
//        System.out.println("Total fee for membership: ₹" + totalFee);
//
//        Member saved = memberRepository.save(member);
//        return new MemberDTO(saved);
//    }
public MemberDTO addMember(Member member) {
    try {
        Optional<User> userOpt = userRepository.findByEmail(member.getEmail());
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found for email: " + member.getEmail());
        }
        User user = userOpt.get();
        member.setUser(user);

        List<Member> existing = memberRepository.findByUserEmail(member.getEmail());
        boolean hasSamePlan = existing.stream()
                .anyMatch(m -> m.getPlanType().equalsIgnoreCase(member.getPlanType())
                        && m.getExpiryDate() != null
                        && m.getExpiryDate().isAfter(LocalDate.now()));

        if (hasSamePlan) {
            throw new RuntimeException("User already has an active membership of this plan.");
        }

        member.setJoinDate(LocalDate.now());
        member.setExpiryDate(LocalDate.now().plusMonths(member.getDurationMonths()));

        switch (member.getPlanType().toUpperCase()) {
            case "STANDARD": member.setMonthlyLimit(3); break;
            case "PREMIUM":  member.setMonthlyLimit(5); break;
            case "GOLD":     member.setMonthlyLimit(10); break;
            default:         member.setMonthlyLimit(1); break;
        }

        double totalFee = getPlanFee(member.getPlanType()) * member.getDurationMonths();
        System.out.println("Total fee for membership: ₹" + totalFee);

        Member saved = memberRepository.save(member);
        return new MemberDTO(saved);

    } catch (Exception e) {
        // print error and throw a clean message instead of raw error
        System.err.println("Error adding member: " + e.getMessage());
        throw new RuntimeException("Error: " + e.getMessage());
    }
}


    public MemberDTO updateMember(Long id, Member updated) {
        Member existing = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        existing.setPlanType(updated.getPlanType());
        existing.setDurationMonths(updated.getDurationMonths());
        existing.setExpiryDate(LocalDate.now().plusMonths(updated.getDurationMonths()));

        switch (existing.getPlanType().toUpperCase()) {
            case "STANDARD": existing.setMonthlyLimit(3); break;
            case "PREMIUM":  existing.setMonthlyLimit(5); break;
            case "GOLD":     existing.setMonthlyLimit(10); break;
        }

        double totalFee = getPlanFee(existing.getPlanType()) * existing.getDurationMonths();
        System.out.println("Updated membership total fee: ₹" + totalFee);

        return new MemberDTO(memberRepository.save(existing));
    }

    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }

    public void resetMonthlyBorrowCounts() {
        List<Member> members = memberRepository.findAll();
        members.forEach(m -> m.setBooksBorrowedThisMonth(0));
        memberRepository.saveAll(members);
    }

    public List<MemberDTO> getMembersByEmail(String email) {
        List<Member> memberships = memberRepository.findByUserEmail(email);
        if (memberships.isEmpty()) {
            throw new RuntimeException("No memberships found for this user");
        }
        return memberships.stream().map(MemberDTO::new).collect(Collectors.toList());
    }
}
