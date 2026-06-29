package com.focusflow.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Startup validator to verify environment variables are present and secure.
 */
@Component
public class StartupValidator implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(StartupValidator.class);

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    @Override
    public void run(String... args) throws Exception {
        logger.info("=========================================================");
        logger.info("Initializing FocusFlow AI Startup Integrity Checks...");
        logger.info("Active Profile: {}", activeProfile);
        logger.info("Database Connection URL: {}", dbUrl);

        boolean hasErrors = false;

        // 1. Validate JWT Secret
        if (jwtSecret == null || jwtSecret.trim().isEmpty()) {
            logger.error("CRITICAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing.");
            hasErrors = true;
        } else if ("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970".equals(jwtSecret)) {
            logger.warn("SECURITY WARNING: JWT_SECRET is set to the default placeholder. Please supply a secure, custom secret in production.");
        } else if (jwtSecret.length() < 32) {
            logger.warn("SECURITY WARNING: JWT_SECRET is too short (< 32 characters). A longer secret is required for secure HS256 signature signing.");
        }

        // 2. Validate Gemini API Key
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || "MY_GEMINI_API_KEY".equals(geminiApiKey)) {
            logger.warn("INTEGRATION WARNING: GEMINI_API_KEY is missing or set to placeholder. Gemini features will run in Mock/Preview mode until configured.");
        } else {
            logger.info("INTEGRATION SUCCESS: GEMINI_API_KEY detected and loaded.");
        }

        // 3. Database URL check
        if (dbUrl == null || dbUrl.trim().isEmpty()) {
            logger.error("CRITICAL CONFIGURATION ERROR: Database URL is blank.");
            hasErrors = true;
        }

        if (hasErrors) {
            logger.error("FocusFlow AI failed to start due to critical missing configurations.");
            logger.error("Please verify that all environment variables listed in .env.example are properly set.");
            logger.error("=========================================================");
            throw new IllegalStateException("FocusFlow AI startup failed: Critical environment variables are missing.");
        }

        logger.info("FocusFlow AI Startup Validation Completed successfully. System ready.");
        logger.info("=========================================================");
    }
}
