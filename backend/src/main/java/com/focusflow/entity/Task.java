package com.focusflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA entity representing a productivity Task.
 */
@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    @Column(name = "description", length = 2000)
    private String description;

    @NotNull(message = "Priority is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private TaskPriority priority;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TaskStatus status;

    @NotNull(message = "Deadline is required")
    @Column(name = "deadline", nullable = false)
    private LocalDate deadline;

    @NotNull(message = "Estimated hours are required")
    @Positive(message = "Estimated hours must be greater than zero")
    @Column(name = "estimated_hours", nullable = false)
    private Double estimatedHours;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder.Default
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AIRecommendation> recommendations = new ArrayList<>();
}
