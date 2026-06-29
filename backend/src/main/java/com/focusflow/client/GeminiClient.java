package com.focusflow.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Component
public class GeminiClient {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.model:gemini-3.5-flash}")
    private String model;

    private final RestTemplate restTemplate;

    public GeminiClient() {
        this.restTemplate = new RestTemplate();
    }

    public String generateContent(String prompt, String systemInstruction) {
        if (apiKey == null || apiKey.trim().isEmpty() || "MY_GEMINI_API_KEY".equals(apiKey)) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable is missing or invalid. Please configure it in Settings > Secrets.");
        }

        String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                model, apiKey
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("User-Agent", "aistudio-build");

        Part promptPart = new Part(prompt);
        Content content = new Content(Collections.singletonList(promptPart));
        List<Content> contents = Collections.singletonList(content);

        GeminiRequest request = new GeminiRequest();
        request.setContents(contents);

        if (systemInstruction != null && !systemInstruction.trim().isEmpty()) {
            Part systemPart = new Part(systemInstruction);
            Content systemContent = new Content(Collections.singletonList(systemPart));
            request.setSystemInstruction(systemContent);
        }

        GenerationConfig config = new GenerationConfig();
        config.setTemperature(0.1);
        config.setResponseMimeType("application/json");
        request.setGenerationConfig(config);

        HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);

        int maxRetries = 3;
        int attempt = 0;
        Exception lastException = null;

        while (attempt < maxRetries) {
            try {
                ResponseEntity<GeminiResponse> responseEntity = restTemplate.postForEntity(url, entity, GeminiResponse.class);
                if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                    GeminiResponse response = responseEntity.getBody();
                    if (response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                        GeminiResponse.Candidate candidate = response.getCandidates().get(0);
                        if (candidate.getContent() != null && candidate.getContent().getParts() != null && !candidate.getContent().getParts().isEmpty()) {
                            String rawText = candidate.getContent().getParts().get(0).getText();
                            if (rawText != null) {
                                rawText = rawText.trim();
                                if (rawText.startsWith("```json")) {
                                    rawText = rawText.substring(7);
                                } else if (rawText.startsWith("```")) {
                                    rawText = rawText.substring(3);
                                }
                                if (rawText.endsWith("```")) {
                                    rawText = rawText.substring(0, rawText.length() - 3);
                                }
                                rawText = rawText.trim();
                            }
                            return rawText;
                        }
                    }
                }
                throw new RuntimeException("Empty or invalid response structure received from Gemini API");
            } catch (Exception e) {
                attempt++;
                lastException = e;
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(1000L * attempt); // exponential backoff
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Gemini generation interrupted during backoff", ie);
                    }
                }
            }
        }
        throw new RuntimeException("Gemini API call failed after " + maxRetries + " attempts. Last error: " + (lastException != null ? lastException.getMessage() : "Unknown"));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeminiRequest {
        private List<Content> contents;
        private Content systemInstruction;
        private GenerationConfig generationConfig;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private List<Part> parts;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        private String text;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenerationConfig {
        private Double temperature;
        private String responseMimeType;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeminiResponse {
        private List<Candidate> candidates;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Candidate {
            private Content content;
            private String finishReason;
        }
    }
}
