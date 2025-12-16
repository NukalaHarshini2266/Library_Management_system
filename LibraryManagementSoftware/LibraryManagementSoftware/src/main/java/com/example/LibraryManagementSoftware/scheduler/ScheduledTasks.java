// Temporary test – runs every 10 seconds
//    @Scheduled(fixedRate = 10000)
//    public void testScheduler() {
//        System.out.println("Scheduler is working: " + java.time.LocalDateTime.now());
//    }

package com.example.LibraryManagementSoftware.scheduler;

import com.example.LibraryManagementSoftware.service.ReservationService;
import com.example.LibraryManagementSoftware.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {

    private final NotificationService notificationService;
    private final ReservationService reservationService;

    // ✅ FIX: Both services must be injected here
    public ScheduledTasks(NotificationService notificationService,
                          ReservationService reservationService) {
        this.notificationService = notificationService;
        this.reservationService = reservationService; // <-- IMPORTANT
    }

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void performDailyChecks() {

        // 1️⃣ Upcoming due dates 2 days before
        notificationService.sendUpcomingDueDateNotifications();

        // 2️⃣ Overdue reminders
        notificationService.sendOverdueNotifications();

        // 3️⃣ Stock alerts
        notificationService.sendLowStockAlerts();
    }

    // Check reservation expiry every 10 minutes
    @Scheduled(fixedRate = 600000)
    public void checkReservationExpiry() {
        reservationService.expireOldNotifications();
    }
}
