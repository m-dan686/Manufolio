package com.manufolio;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.manufolio.response.ApiResponse;
import com.manufolio.request.ContactRequest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ManufolioApplicationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void contextLoads() {
    }

    @Test
    void testContactSubmitValidation() {
        ContactRequest request = new ContactRequest();
        request.setName("A"); // too short (min 2)
        request.setEmail("invalid-email");
        request.setPhone("12345"); // invalid Indian number
        request.setMessage("Short"); // too short (min 10)

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/api/contact/submit", request, ApiResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isFalse();
    }

    @Test
    void testContactSubmitSuccessWithPhone() {
        ContactRequest request = new ContactRequest();
        request.setName("Manu Test");
        request.setEmail("valid@example.com");
        request.setPhone("9876543210");
        request.setMessage("This is a valid test message with phone");

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/api/contact/submit", request, ApiResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void testContactSubmitSuccessWithoutPhone() {
        ContactRequest request = new ContactRequest();
        request.setName("Manu Test");
        request.setEmail("valid@example.com");
        request.setPhone(""); // Empty phone is allowed
        request.setMessage("This is a valid test message without phone");

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/api/contact/submit", request, ApiResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void testContactSubmitSuccessWhitespacePhone() {
        ContactRequest request = new ContactRequest();
        request.setName("Manu Test");
        request.setEmail("valid@example.com");
        request.setPhone("   "); // Whitespace phone gets trimmed and allowed
        request.setMessage("This is a valid test message with whitespace phone");

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/api/contact/submit", request, ApiResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void testContactSubmitInvalidPhonePrefix() {
        ContactRequest request = new ContactRequest();
        request.setName("Manu Test");
        request.setEmail("valid@example.com");
        request.setPhone("1234567890"); // Starts with 1 (invalid prefix)
        request.setMessage("This is an invalid test message with bad phone prefix");

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity("/api/contact/submit", request, ApiResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
