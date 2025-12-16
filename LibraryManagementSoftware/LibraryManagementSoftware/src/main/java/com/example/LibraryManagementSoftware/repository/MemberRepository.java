package com.example.LibraryManagementSoftware.repository;

import com.example.LibraryManagementSoftware.entity.Member;
import com.example.LibraryManagementSoftware.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // Find all memberships for a given user
    List<Member> findByUser(User user);

    // Find all memberships by email
    List<Member> findByUserEmail(String email);

}

