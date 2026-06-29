package com.focusflow.repository;

import com.focusflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for managing User persistence.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find a user by their unique email address.
     *
     * @param email The email address to look up.
     * @return An Optional containing the User if found, or empty if not.
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user already exists with the given email address.
     *
     * @param email The email to check.
     * @return true if a user exists, false otherwise.
     */
    boolean existsByEmail(String email);
}
