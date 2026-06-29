package com.focusflow.repository;

import com.focusflow.entity.AIRecommendation;
import com.focusflow.entity.RecommendationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing AIRecommendation persistence.
 */
@Repository
public interface AIRecommendationRepository extends JpaRepository<AIRecommendation, Long> {

    /**
     * Retrieve all recommendations belonging to a specific user.
     *
     * @param userId The ID of the owner user.
     * @return List of matched recommendations.
     */
    List<AIRecommendation> findByUserId(Long userId);

    /**
     * Retrieve recommendations for a specific user filtered by type.
     *
     * @param userId             The ID of the owner user.
     * @param recommendationType The type of AI recommendation.
     * @return List of matched recommendations.
     */
    List<AIRecommendation> findByUserIdAndRecommendationType(Long userId, RecommendationType recommendationType);

    /**
     * Retrieve all recommendations generated for a specific task.
     *
     * @param taskId The ID of the task.
     * @return List of matched recommendations.
     */
    List<AIRecommendation> findByTaskId(Long taskId);
}
