package com.focusflow.repository;

import com.focusflow.entity.Task;
import com.focusflow.entity.TaskPriority;
import com.focusflow.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for managing Task persistence.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Retrieve all tasks belonging to a specific user.
     *
     * @param userId The ID of the owner user.
     * @return List of tasks.
     */
    List<Task> findByUserId(Long userId);

    /**
     * Retrieve a paginated list of tasks for a specific user.
     *
     * @param userId   The ID of the owner user.
     * @param pageable Pagination and sorting criteria.
     * @return Paginated tasks.
     */
    Page<Task> findByUserId(Long userId, Pageable pageable);

    /**
     * Retrieve tasks for a user filtered by status.
     *
     * @param userId The ID of the owner user.
     * @param status The status of the tasks.
     * @return List of matched tasks.
     */
    List<Task> findByUserIdAndStatus(Long userId, TaskStatus status);

    /**
     * Retrieve tasks for a user filtered by status and priority.
     *
     * @param userId   The ID of the owner user.
     * @param status   The status of the tasks.
     * @param priority The priority of the tasks.
     * @return List of matched tasks.
     */
    List<Task> findByUserIdAndStatusAndPriority(Long userId, TaskStatus status, TaskPriority priority);

    /**
     * Retrieve tasks for a user due on or before a specific date.
     *
     * @param userId   The ID of the owner user.
     * @param deadline The upper-bound deadline date.
     * @return List of matched tasks.
     */
    List<Task> findByUserIdAndDeadlineLessThanEqual(Long userId, LocalDate deadline);
}
