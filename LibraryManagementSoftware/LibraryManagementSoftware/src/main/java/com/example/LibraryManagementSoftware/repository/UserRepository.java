//package com.example.LibraryManagementSoftware.repository;
//
//import com.example.LibraryManagementSoftware.entity.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import java.util.Optional;
//
//public interface UserRepository extends JpaRepository<User, Long> {
//    Optional<User> findByEmail(String email);
//    // UserRepository.java
//    Optional<User> findById(Long id);
//
//
//}


package com.example.LibraryManagementSoftware.repository;

import com.example.LibraryManagementSoftware.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role); // fetch all admins, librarians, or users

}
