package com.focusflow.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductivityInsightsResult {
    private Integer productivityScore;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
    private String motivation;
}
