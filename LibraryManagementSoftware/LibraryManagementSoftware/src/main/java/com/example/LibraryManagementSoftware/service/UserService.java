//package com.example.LibraryManagementSoftware.service;
//
//import com.example.LibraryManagementSoftware.entity.User;
//import com.example.LibraryManagementSoftware.repository.UserRepository;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.Random;
//
//@Service
//public class UserService {
//
//    private final UserRepository userRepository;
//    private final JavaMailSender mailSender;
//    private final PasswordEncoder passwordEncoder;
//
//    public UserService(UserRepository userRepository, JavaMailSender mailSender, PasswordEncoder passwordEncoder) {
//        this.userRepository = userRepository;
//        this.mailSender = mailSender;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    // ---------------- Register ----------------
//    public boolean register(User user) {
//        if (userRepository.findByEmail(user.getEmail()).isPresent()) return false;
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        userRepository.save(user);
//        return true;
//    }
//
//    // ---------------- Login ----------------
//    public Optional<User> login(String email, String password) {
//        Optional<User> userOpt = userRepository.findByEmail(email);
//        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
//            return userOpt;
//        }
//        return Optional.empty();
//    }
//
//    // ---------------- Fetch all users ----------------
//    public List<User> getAllUsers() {
//        return userRepository.findAll();
//    }
//
//    // ---------------- OTP ----------------
//    public boolean sendOtp(String email) {
//        Optional<User> userOpt = userRepository.findByEmail(email);
//        if (userOpt.isEmpty()) return false;
//        User user = userOpt.get();
//
//        String otp = String.valueOf(new Random().nextInt(899999) + 100000);
//        user.setOtp(otp);
//        userRepository.save(user);
//
//        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setTo(email);
//            message.setSubject("Your OTP Code");
//            message.setText("Your OTP is: " + otp);
//            mailSender.send(message);
//            return true;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return false;
//        }
//    }
//
//    public boolean verifyOtp(String email, String otp) {
//        Optional<User> userOpt = userRepository.findByEmail(email);
//        if (userOpt.isPresent() && otp.equals(userOpt.get().getOtp())) {
//            User user = userOpt.get();
//            user.setOtpVerified(true);
//            userRepository.save(user);
//            return true;
//        }
//        return false;
//    }
//
//    public boolean resetPassword(String email, String newPassword) {
//        Optional<User> userOpt = userRepository.findByEmail(email);
//        if (userOpt.isPresent() && userOpt.get().isOtpVerified()) {
//            User user = userOpt.get();
//            user.setPassword(passwordEncoder.encode(newPassword));
//            user.setOtp(null);
//            user.setOtpVerified(false);
//            userRepository.save(user);
//            return true;
//        }
//        return false;
//    }
//}

package com.example.LibraryManagementSoftware.service;

import com.example.LibraryManagementSoftware.entity.User;
import com.example.LibraryManagementSoftware.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ROLE-BASED REGISTER (updated with BCrypt)
    public boolean register(User user, String creatorRole) {

        if (userRepository.findByEmail(user.getEmail()).isPresent())
            return false;

        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Self-registration: no creatorRole passed
        if (creatorRole == null) {
            user.setRole("USER"); // default role
            userRepository.save(user);
            return true;
        }

        String targetRole = user.getRole().toUpperCase();

        // ADMIN → ADMIN, LIBRARIAN, USER
        if (creatorRole.equals("ADMIN")) {
            userRepository.save(user);
            return true;
        }

        // LIBRARIAN → USER only
        if (creatorRole.equals("LIBRARIAN")) {
            if (!targetRole.equals("USER")) return false;
            userRepository.save(user);
            return true;
        }

        // USER cannot create anyone
        return false;
    }

    // LOGIN (updated with BCrypt)
    public Optional<User> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()));
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET USERS BY ROLE
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role.toUpperCase());
    }

    // SEARCH USERS
    public List<User> searchUsers(String name, String email, String role) {
        List<User> allUsers = getAllUsers();

        return allUsers.stream()
                .filter(u -> name == null || u.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(u -> email == null || u.getEmail().equalsIgnoreCase(email))
                .filter(u -> role == null || u.getRole().equalsIgnoreCase(role))
                .toList();
    }

    // ROLE-BASED DELETE
    public boolean deleteUser(Long id, String requesterRole) {

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return false;

        User targetUser = userOpt.get();

        // ADMIN cannot be deleted
        if (targetUser.getRole().equalsIgnoreCase("ADMIN"))
            return false;

        // ADMIN → delete USER & LIBRARIAN
        if (requesterRole.equals("ADMIN")) {
            userRepository.deleteById(id);
            return true;
        }

        // LIBRARIAN → delete USER only
        if (requesterRole.equals("LIBRARIAN") &&
                targetUser.getRole().equalsIgnoreCase("USER")) {
            userRepository.deleteById(id);
            return true;
        }

        return false;
    }

    // OTP SEND
    public boolean sendOtp(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        user.setOtp(otp);
        userRepository.save(user);
        return true;
    }

    // OTP VERIFY
    public boolean verifyOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        if (otp.equals(user.getOtp())) {
            user.setOtpVerified(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    // RESET PASSWORD (updated with BCrypt)
    public boolean resetPassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setNewPassword(null);
        userRepository.save(user);
        return true;
    }

    // MULTI-ROLE EMAIL FETCH
//    public String getEmailsByRoles(String... roles) {
//
//        return Stream.of(roles)
//                .map(role -> {
//                    List<User> users = userRepository.findByRole(role);
//                    if (users == null || users.isEmpty()) return "";
//                    return users.stream()
//                            .map(User::getEmail)
//                            .collect(Collectors.joining(","));
//                })
//                .filter(s -> !s.isEmpty())
//                .collect(Collectors.joining(","));
//    }
    public List<String> getEmailsByRoles(String... roles) {
        return Stream.of(roles)
                .flatMap(role -> userRepository.findByRole(role).stream())
                .map(User::getEmail)
                .collect(Collectors.toList());
    }

}
