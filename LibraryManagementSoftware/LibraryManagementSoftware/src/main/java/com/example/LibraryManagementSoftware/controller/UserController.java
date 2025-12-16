//
//
//package com.example.LibraryManagementSoftware.controller;
//
//import com.example.LibraryManagementSoftware.entity.User;
//import com.example.LibraryManagementSoftware.service.UserService;
//import com.example.LibraryManagementSoftware.security.JwtUtil;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/users")
//@CrossOrigin(origins = "http://localhost:3000")
//public class UserController {
//
//    private final UserService userService;
//    private final JwtUtil jwtUtil;
//
//    // 🔐 Predefined credentials
//    private static final String ADMIN_EMAIL = "r210203@rguktrkv.ac.in";
//    private static final String ADMIN_PASSWORD = "Admin@123";
//    private static final String ADMIN_SECRET_KEY = "my_super_secure_admin_secret_key_123456";
//
//    private static final String LIBRARIAN_EMAIL = "r210203@rguktrkv.ac.in";
//    private static final String LIBRARIAN_PASSWORD = "Librarian@123";
//    private static final String LIBRARIAN_SECRET_KEY = "my_super_secure_librarian_secret_key_123456";
//
//    public UserController(UserService userService, JwtUtil jwtUtil) {
//        this.userService = userService;
//        this.jwtUtil = jwtUtil;
//    }
//
//    // ---------------- Register ----------------
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody User user) {
//        boolean registered = userService.register(user);
//        if (registered)
//            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
//        else
//            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
//    }
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
//        String email = loginRequest.get("email");
//        String password = loginRequest.get("password");
//        String secretKey = loginRequest.get("secretkey"); // optional for normal users
//
//        // Admin login
//        if (ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password) &&
//                ADMIN_SECRET_KEY.equals(secretKey)) {
//            String token = jwtUtil.generateToken(email, ADMIN_SECRET_KEY);
//            return ResponseEntity.ok(Map.of(
//                    "token", "Bearer " + token,
//                    "role", "ADMIN",
//                    "name", "Admin" // hardcoded or from config
//            ));
//        }
//
//        // Librarian login
//        if (LIBRARIAN_EMAIL.equals(email) && LIBRARIAN_PASSWORD.equals(password) &&
//                LIBRARIAN_SECRET_KEY.equals(secretKey)) {
//            String token = jwtUtil.generateToken(email, LIBRARIAN_SECRET_KEY);
//            return ResponseEntity.ok(Map.of(
//                    "token", "Bearer " + token,
//                    "role", "LIBRARIAN",
//                    "name", "Librarian" // hardcoded or from config
//            ));
//        }
//
//        // Normal user login
//        return userService.login(email, password)
//                .map(u -> {
//                    String token = jwtUtil.generateToken(email); // normal user secret
//                    return ResponseEntity.ok(Map.of(
//                            "token", "Bearer " + token,
//                            "role", "USER",
//                            "name", u.getName(),
//                            "id",u.getId()// return user's name from DB
//                    ));
//                })
//                .orElse(ResponseEntity.badRequest().body(Map.of(
//                        "message", "Invalid email or password"
//                )));
//    }
//
//
//    // ---------------- Forgot Password ----------------
//    @PostMapping("/forgot-password")
//    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
//        boolean sent = userService.sendOtp(request.get("email"));
//        if (sent) return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
//        else return ResponseEntity.badRequest().body(Map.of("message", "Email not registered"));
//    }
//
//    // ---------------- Verify OTP ----------------
//    @PostMapping("/verify-otp")
//    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
//        boolean verified = userService.verifyOtp(request.get("email"), request.get("otp"));
//        if (verified) return ResponseEntity.ok(Map.of("message", "OTP verified"));
//        else return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP"));
//    }
//
//    // ---------------- Reset Password ----------------
//    @PostMapping("/reset-password")
//    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
//        boolean reset = userService.resetPassword(request.get("email"), request.get("newPassword"));
//        if (reset) return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
//        else return ResponseEntity.badRequest().body(Map.of("message", "Failed to reset password"));
//    }
//
//    // ---------------- Logout ----------------
//    @PostMapping("/logout")
//    public ResponseEntity<?> logout() {
//        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
//    }
//
//    // ---------------- Get All Users ----------------
//    @GetMapping
//    public ResponseEntity<?> getAllUsers() {
//        return ResponseEntity.ok(userService.getAllUsers());
//    }
//}

package com.example.LibraryManagementSoftware.controller;

import com.example.LibraryManagementSoftware.entity.User;
import com.example.LibraryManagementSoftware.service.UserService;
import com.example.LibraryManagementSoftware.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // ✅ REGISTER (Role-based add control)
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user,
            @RequestHeader(value = "role", required = false) String creatorRole // optional
    ) {
        boolean registered = userService.register(user,
                creatorRole != null ? creatorRole.toUpperCase() : null);

        if (registered)
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        else
            return ResponseEntity.badRequest().body(Map.of("message", "Not allowed or email already exists"));
    }


    // ✅ LOGIN (All roles)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        return userService.login(email, password)
                .map(u -> {
                    String token = jwtUtil.generateToken(email);

                    return ResponseEntity.ok(Map.of(
                            "token", "Bearer " + token,
                            "role", u.getRole(),
                            "name", u.getName(),
                            "id", u.getId()
                    ));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password")));
    }

    // ✅ GET ALL USERS
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ GET USERS BY ROLE
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        return userService.getUsersByRole(role.toUpperCase());
    }

    // ✅ SEARCH USERS
    @GetMapping("/search")
    public List<User> searchUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String role
    ) {
        return userService.searchUsers(name, email, role != null ? role.toUpperCase() : null);
    }

    // ✅ DELETE USER (Role-based delete control)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            @RequestHeader("role") String requesterRole
    ) {
        boolean deleted = userService.deleteUser(id, requesterRole.toUpperCase());

        if (deleted)
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        else
            return ResponseEntity.badRequest().body(Map.of("message", "Delete not allowed"));
    }

    // ✅ FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        boolean sent = userService.sendOtp(request.get("email"));

        if (sent)
            return ResponseEntity.ok(Map.of("message", "OTP sent"));
        else
            return ResponseEntity.badRequest().body(Map.of("message", "Email not registered"));
    }

    // ✅ VERIFY OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        boolean verified = userService.verifyOtp(request.get("email"), request.get("otp"));

        if (verified)
            return ResponseEntity.ok(Map.of("message", "OTP verified"));
        else
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP"));
    }

    // ✅ RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        boolean reset = userService.resetPassword(request.get("email"), request.get("newPassword"));

        if (reset)
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        else
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to reset password"));
    }
}
