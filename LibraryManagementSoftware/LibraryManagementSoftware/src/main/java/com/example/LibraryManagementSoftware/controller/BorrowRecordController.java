
package com.example.LibraryManagementSoftware.controller;

import com.example.LibraryManagementSoftware.entity.BorrowRecord;
import com.example.LibraryManagementSoftware.service.BorrowRecordService;
import com.example.LibraryManagementSoftware.repository.BorrowRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow")
public class BorrowRecordController {

    @Autowired
    private BorrowRecordService borrowRecordService;

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;


    // Request: userId and bookId are required
    @PostMapping("/request")
    public ResponseEntity<?> requestBook(@RequestParam Long userId, @RequestParam String bookId) {
        try {
            BorrowRecord r = borrowRecordService.requestBook(userId, bookId);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    // Admin approves (converts REQUESTED -> BORROWED, updates copies)
    @PostMapping("/approve")
    public ResponseEntity<?> approveRequest(@RequestParam Long borrowId) {
        try {
            BorrowRecord r = borrowRecordService.approveRequest(borrowId);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    // Return endpoint
//    @PostMapping("/return")
//    public ResponseEntity<?> returnBook(@RequestParam Long borrowId) {
//        try {
//            BorrowRecord r = borrowRecordService.returnBook(borrowId);
//            return ResponseEntity.ok(r);
//        } catch (Exception e) {
//            return ResponseEntity.status(400).body(java.util.Map.of("error", e.getMessage()));
//        }
//    }
    // User creates a return request (no stock change)
    @PostMapping("/return/request")
    public ResponseEntity<?> requestReturn(@RequestParam Long borrowId) {
        try {
            BorrowRecord r = borrowRecordService.requestReturn(borrowId);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
    @PostMapping("/return/inspect")
    public ResponseEntity<?> inspectReturn(@RequestParam Long borrowId,
                                           @RequestBody Map<String, Object> body) {
        try {
            boolean damaged = body.getOrDefault("damaged", false) instanceof Boolean
                    ? (Boolean) body.getOrDefault("damaged", false)
                    : Boolean.parseBoolean(body.getOrDefault("damaged", "false").toString());

            String damageNotes = (String) body.getOrDefault("damageNotes", "");
            double damageFee = 0.0;
            if (body.get("damageFee") != null) {
                damageFee = Double.parseDouble(body.get("damageFee").toString());
            }

            BorrowRecord r = borrowRecordService.inspectReturn(borrowId, damaged, damageNotes, damageFee);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
    @PostMapping("/return/complete")
    public ResponseEntity<?> completeReturn(@RequestParam Long borrowId) {
        try {
            BorrowRecord r = borrowRecordService.completeReturn(borrowId);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }



    @GetMapping("/all")
    public ResponseEntity<List<BorrowRecord>> getAll() {
        return ResponseEntity.ok(borrowRecordService.getAllBorrowRecords());
    }

    @GetMapping("/requests")
    public ResponseEntity<List<BorrowRecord>> pendingRequests() {
        return ResponseEntity.ok(borrowRecordService.getPendingRequests());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowRecord>> getUserBorrowRecords(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowRecordService.getUserBorrowRecords(userId));
    }

    // Reject endpoint
    @PostMapping("/reject")
    public ResponseEntity<?> rejectRequest(@RequestParam Long borrowId) {
        try {
            BorrowRecord r = borrowRecordService.rejectRequest(borrowId);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/checkPenalty")
    public ResponseEntity<?> checkPenalty(@RequestParam Long borrowId) {
        try {
            double penalty = borrowRecordService.calculatePenalty(borrowId);
            return ResponseEntity.ok(Map.of("penalty", penalty));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }



    // Request renewal by borrower
    @PutMapping("/renew/request/{borrowId}")
    public BorrowRecord requestRenewal(@PathVariable Long borrowId) {
        return borrowRecordService.requestRenewal(borrowId);
    }

    // Approve renewal by admin
    @PutMapping("/renew/approve/{borrowId}")
    public BorrowRecord approveRenewal(@PathVariable Long borrowId) {
        return borrowRecordService.approveRenewal(borrowId);
    }

    // Reject renewal by admin
    @PutMapping("/renew/reject/{borrowId}")
    public BorrowRecord rejectRenewal(@PathVariable Long borrowId) {
        return borrowRecordService.rejectRenewal(borrowId);
    }

    @GetMapping("/{borrowId}")
    public ResponseEntity<?> getBorrowById(@PathVariable Long borrowId) {
        BorrowRecord record = borrowRecordService.getById(borrowId);
        if (record == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Borrow record not found"));
        }
        return ResponseEntity.ok(record);
    }

    @GetMapping("/notifications/overdue")
    public ResponseEntity<List<BorrowRecord>> getOverdueBooks(@RequestParam String email) {
        List<BorrowRecord> overdue = borrowRecordRepository
                .findByUser_EmailAndStatusAndDueDateTimeBefore(email, "BORROWED", LocalDateTime.now());
        return ResponseEntity.ok(overdue);
    }

    @GetMapping("/notifications/due-soon")
    public ResponseEntity<List<BorrowRecord>> getDueSoonBooks(@RequestParam String email) {
        LocalDateTime twoDaysLater = LocalDateTime.now().plusDays(2);
        LocalDateTime now = LocalDateTime.now();

        List<BorrowRecord> dueSoon = borrowRecordRepository
                .findByUser_EmailAndStatusAndDueDateTimeBetween(email, "BORROWED", now, twoDaysLater);

        return ResponseEntity.ok(dueSoon);
    }

    @GetMapping("/notifications/paid")
    public ResponseEntity<List<BorrowRecord>> getPaidBooks(@RequestParam String email) {
        List<BorrowRecord> paid = borrowRecordRepository
                .findByUser_EmailAndPaymentStatus(email, "PAID");
        return ResponseEntity.ok(paid);
    }



}
