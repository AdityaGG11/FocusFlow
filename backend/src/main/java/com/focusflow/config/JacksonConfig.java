package com.focusflow.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.TimeZone;

/**
 * Configuration class to customize Jackson JSON serialization and timezone handling.
 */
@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        
        // Register JavaTimeModule to handle LocalDate and LocalDateTime correctly
        objectMapper.registerModule(new JavaTimeModule());
        
        // Write dates as ISO-8601 strings rather than numeric timestamps
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        // Default to UTC timezone
        objectMapper.setTimeZone(TimeZone.getTimeZone("UTC"));
        
        return objectMapper;
    }
}
