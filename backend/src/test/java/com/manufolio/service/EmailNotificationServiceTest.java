package com.manufolio.service;

import com.manufolio.entity.Contact;
import com.manufolio.enums.NotificationStatus;
import com.manufolio.repository.ContactRepository;
import com.manufolio.service.impl.EmailNotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

@ExtendWith(MockitoExtension.class)
class EmailNotificationServiceTest {

    @Mock
    private ContactRepository contactRepository;

    private RestTemplate restTemplate;
    private MockRestServiceServer mockServer;
    private EmailNotificationServiceImpl emailNotificationService;

    @BeforeEach
    void setUp() {
        restTemplate = new RestTemplate();
        mockServer = MockRestServiceServer.createServer(restTemplate);
        emailNotificationService = new EmailNotificationServiceImpl(contactRepository, restTemplate);

        ReflectionTestUtils.setField(emailNotificationService, "brevoApiKey", "xkeysib-fake-test-key-12345");
        ReflectionTestUtils.setField(emailNotificationService, "brevoApiUrl", "https://api.brevo.com/v3/smtp/email");
        ReflectionTestUtils.setField(emailNotificationService, "brevoSenderEmail", "sender@example.com");
        ReflectionTestUtils.setField(emailNotificationService, "brevoSenderName", "Manufolio");
        ReflectionTestUtils.setField(emailNotificationService, "brevoToEmail", "dest@example.com");
    }

    @Test
    void testSendNotificationBrevoSuccess201() {
        Contact contact = Contact.builder()
                .id(1L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .phone("9876543210")
                .message("Hello Manu!")
                .sentAt(LocalDateTime.now())
                .build();

        when(contactRepository.findById(1L)).thenReturn(Optional.of(contact));

        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("api-key", "xkeysib-fake-test-key-12345"))
                .andExpect(header("Content-Type", MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.sender.email").value("sender@example.com"))
                .andExpect(jsonPath("$.to[0].email").value("dest@example.com"))
                .andExpect(jsonPath("$.replyTo.email").value("visitor@example.com"))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"messageId\":\"<20260814.12345@brevo.com>\"}"));

        emailNotificationService.sendContactNotificationAsync(1L);

        mockServer.verify();

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.SENT);
        assertThat(saved.getEmailNotificationSentAt()).isNotNull();
        assertThat(saved.getEmailNotificationError()).isNull();
    }

    @Test
    void testSendNotificationBrevo401Unauthorized() {
        Contact contact = Contact.builder()
                .id(2L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .message("Hello Manu!")
                .build();

        when(contactRepository.findById(2L)).thenReturn(Optional.of(contact));

        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED)
                        .body("{\"code\":\"unauthorized\",\"message\":\"Key not found\"}"));

        assertThatCode(() -> emailNotificationService.sendContactNotificationAsync(2L))
                .doesNotThrowAnyException();

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.FAILED);
        assertThat(saved.getEmailNotificationError()).contains("401");
    }

    @Test
    void testSendNotificationBrevo403Forbidden() {
        Contact contact = Contact.builder()
                .id(3L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .message("Hello Manu!")
                .build();

        when(contactRepository.findById(3L)).thenReturn(Optional.of(contact));

        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andRespond(withStatus(HttpStatus.FORBIDDEN)
                        .body("{\"code\":\"forbidden\",\"message\":\"Account suspended\"}"));

        emailNotificationService.sendContactNotificationAsync(3L);

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.FAILED);
        assertThat(saved.getEmailNotificationError()).contains("403");
    }

    @Test
    void testSendNotificationBrevo400BadRequest() {
        Contact contact = Contact.builder()
                .id(4L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .message("Hello Manu!")
                .build();

        when(contactRepository.findById(4L)).thenReturn(Optional.of(contact));

        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andRespond(withStatus(HttpStatus.BAD_REQUEST)
                        .body("{\"code\":\"invalid_parameter\",\"message\":\"Invalid sender email\"}"));

        emailNotificationService.sendContactNotificationAsync(4L);

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.FAILED);
        assertThat(saved.getEmailNotificationError()).contains("400");
    }

    @Test
    void testSendNotificationBrevo429RateLimit() {
        Contact contact = Contact.builder()
                .id(5L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .message("Hello Manu!")
                .build();

        when(contactRepository.findById(5L)).thenReturn(Optional.of(contact));

        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS)
                        .body("{\"code\":\"rate_limit\",\"message\":\"Too many requests\"}"));

        emailNotificationService.sendContactNotificationAsync(5L);

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.FAILED);
        assertThat(saved.getEmailNotificationError()).contains("429");
    }

    @Test
    void testSendNotificationBrevo500ServerError() {
        Contact contact = Contact.builder()
                .id(6L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .message("Hello Manu!")
                .build();

        when(contactRepository.findById(6L)).thenReturn(Optional.of(contact));

        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andRespond(withServerError());

        emailNotificationService.sendContactNotificationAsync(6L);

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.FAILED);
        assertThat(saved.getEmailNotificationError()).contains("500");
    }

    @Test
    void testSendNotificationSkippedWhenUnconfigured() {
        EmailNotificationServiceImpl unconfiguredService =
                new EmailNotificationServiceImpl(contactRepository, restTemplate);

        Contact contact = Contact.builder()
                .id(7L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .message("Hello Manu!")
                .build();

        when(contactRepository.findById(7L)).thenReturn(Optional.of(contact));

        unconfiguredService.sendContactNotificationAsync(7L);

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.SKIPPED);
    }

    @Test
    void testHtmlEscapingOfVisitorInput() {
        Contact contact = Contact.builder()
                .id(8L)
                .name("<script>alert('xss')</script>")
                .email("visitor@example.com")
                .message("<img src=x onerror=alert('hack')>")
                .build();

        when(contactRepository.findById(8L)).thenReturn(Optional.of(contact));

        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andExpect(jsonPath("$.htmlContent").value(org.hamcrest.Matchers.containsString("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;")))
                .andExpect(jsonPath("$.htmlContent").value(org.hamcrest.Matchers.containsString("&lt;img src=x onerror=alert(&#39;hack&#39;)&gt;")))
                .andRespond(withStatus(HttpStatus.CREATED));

        emailNotificationService.sendContactNotificationAsync(8L);

        mockServer.verify();
    }
}
