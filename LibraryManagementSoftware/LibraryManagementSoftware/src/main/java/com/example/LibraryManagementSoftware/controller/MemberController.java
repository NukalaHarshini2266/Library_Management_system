package com.example.LibraryManagementSoftware.controller;

import com.example.LibraryManagementSoftware.entity.Member;
import com.example.LibraryManagementSoftware.service.MemberService;
import com.example.LibraryManagementSoftware.service.MemberService.MemberDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping("/all")
    public List<MemberDTO> getAllMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public MemberDTO getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id);
    }

//    @PostMapping("/add")
//    public MemberDTO addMember(@RequestBody Member member) {
//        return memberService.addMember(member);
//    }
        @PostMapping("/add")
        public ResponseEntity<?> addMember(@RequestBody Member member) {
            try {
                MemberDTO saved = memberService.addMember(member);
                return ResponseEntity.ok(saved);
            } catch (RuntimeException ex) {
                return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
            }
        }


    @PutMapping("/update/{id}")
    public MemberDTO updateMember(@PathVariable Long id, @RequestBody Member member) {
        return memberService.updateMember(id, member);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return "Member deleted successfully!";
    }

    @PostMapping("/reset-monthly-borrow")
    public String resetMonthlyBorrow() {
        memberService.resetMonthlyBorrowCounts();
        return "Monthly borrow counts reset!";
    }

    @GetMapping("/user/{email}")
    public List<MemberDTO> getMembersByEmail(@PathVariable String email) {
        return memberService.getMembersByEmail(email);
    }

    @PostMapping("/calculate-fee")
    public String calculateFee(@RequestBody Member member) {
        int duration = member.getDurationMonths();
        String planType = member.getPlanType();
        double totalFee;

        switch (planType.toUpperCase()) {
            case "STANDARD": totalFee = 100 * duration; break;
            case "PREMIUM":  totalFee = 200 * duration; break;
            case "GOLD":     totalFee = 300 * duration; break;
            default:         totalFee = 50 * duration; break;
        }

        return "Total fee for " + planType + " plan (" + duration + " months): ₹" + totalFee;
    }
}
