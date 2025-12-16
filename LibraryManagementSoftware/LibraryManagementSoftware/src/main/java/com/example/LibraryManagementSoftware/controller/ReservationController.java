package com.example.LibraryManagementSoftware.controller;

import com.example.LibraryManagementSoftware.entity.Reservation;
import com.example.LibraryManagementSoftware.entity.User;
import com.example.LibraryManagementSoftware.repository.ReservationRepository;
import com.example.LibraryManagementSoftware.repository.UserRepository;
import com.example.LibraryManagementSoftware.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public ReservationController(ReservationService reservationService, ReservationRepository reservationRepository,
                                 UserRepository userRepository) {
        this.reservationService = reservationService;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    // Create reservation
    @PostMapping("/add")
    public ResponseEntity<?> addReservation(@RequestParam Long userId,
                                            @RequestParam String bookId,
                                            @RequestParam(required = false) String notes) {
        try {
            Reservation r = reservationService.createReservation(userId, bookId, notes);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // Admin: list pending for a book
    @GetMapping("/book/{bookId}/pending-notified")
    public ResponseEntity<?> getPendingAndNotifiedForBook(@PathVariable String bookId) {
        try {
            List<Reservation> list = reservationService.listPendingAndNotifiedForBook(bookId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }


    // User collects book (after being notified) — mark completed
    @PostMapping("/complete")
    public ResponseEntity<?> completeReservation(@RequestParam Long reservationId) {
        try {
            Reservation r = reservationService.completeReservation(reservationId);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancel(@RequestParam Long reservationId) {
        try {
            Reservation r = reservationService.cancelReservation(reservationId);
            return ResponseEntity.ok(r);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkReservation(@RequestParam Long userId,
                                              @RequestParam String bookId) {
        Optional<Reservation> r = reservationService.findActiveReservation(userId, bookId);

        if (r.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "hasReserved", true,
                    "reservationId", r.get().getId()
            ));
        }

        return ResponseEntity.ok(Map.of("hasReserved", false));
    }
    // ⭐ Admin: get all pending reservations
    @GetMapping("/admin/pending")
    public ResponseEntity<?> getPending() {
        try {
            return ResponseEntity.ok(reservationService.getPendingReservations());
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ⭐ Admin: get all notified reservations
    @GetMapping("/admin/notified")
    public ResponseEntity<?> getNotified() {
        try {
            return ResponseEntity.ok(reservationService.getNotifiedReservations());
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/active/{userId}/{bookId}")
    public ResponseEntity<?> checkActiveReservation(
            @PathVariable Long userId,
            @PathVariable String bookId) {

        Optional<Reservation> res =
                reservationService.findActiveReservation(userId, bookId);

        if (res.isEmpty()) {
            return ResponseEntity.ok(null);
        }

        return ResponseEntity.ok(res.get());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Reservation>> getPendingReservationsByEmail(@RequestParam String email) {
        try {
            List<Reservation> pendingReservations = reservationService.getPendingReservationsByEmail(email);
            return ResponseEntity.ok(pendingReservations);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(List.of()); // return empty list if user not found
        }
    }

    @GetMapping("/updates")
    public ResponseEntity<List<Reservation>> getAllReservationsByEmail(@RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // fetch all reservations for the user regardless of status
            List<Reservation> reservations = reservationRepository.findByUser(user);

            return ResponseEntity.ok(reservations);
        } catch (RuntimeException e) {
            // return empty list instead of 404
            return ResponseEntity.ok(List.of());
        }
    }




}
