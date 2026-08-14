package com.manufolio.service;

import com.manufolio.entity.Contact;
import com.manufolio.enums.NotificationStatus;
import com.manufolio.repository.ContactRepository;
import com.manufolio.service.impl.EmailNotificationServiceImpl;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailNotificationServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    private EmailNotificationServiceImpl emailNotificationService;

    @BeforeEach
    void setUp() {
        emailNotificationService = new EmailNotificationServiceImpl(contactRepository, mailSender);
        ReflectionTestUtils.setField(emailNotificationService, "mailUsername", "admin@gmail.com");
        ReflectionTestUtils.setField(emailNotificationService, "mailPassword", "app-password");
        ReflectionTestUtils.setField(emailNotificationService, "mailTo", "dest@gmail.com");
    }

    @Test
    void testSendNotificationSuccess() {
        Contact contact = Contact.builder()
                .id(1L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .message("Hello Manu!")
                .sentAt(LocalDateTime.now())
                .build();

        when(contactRepository.findById(1L)).thenReturn(Optional.of(contact));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailNotificationService.sendContactNotificationAsync(1L);

        verify(mailSender, times(1)).send(any(MimeMessage.class));

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.SENT);
        assertThat(saved.getEmailNotificationSentAt()).isNotNull();
        assertThat(saved.getEmailNotificationError()).isNull();
    }

    @Test
    void testSendNotificationSmtpFailureDoesNotThrowException() {
        Contact contact = Contact.builder()
                .id(2L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .message("Hello Manu!")
                .sentAt(LocalDateTime.now())
                .build();

        when(contactRepository.findById(2L)).thenReturn(Optional.of(contact));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new MailSendException("SMTP connection failed")).when(mailSender).send(any(MimeMessage.class));

        assertThatCode(() -> emailNotificationService.sendContactNotificationAsync(2L))
                .doesNotThrowAnyException();

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.FAILED);
        assertThat(saved.getEmailNotificationError()).contains("MailSendException");
    }

    @Test
    void testSendNotificationSkippedWhenUnconfigured() {
        EmailNotificationServiceImpl unconfiguredService =
                new EmailNotificationServiceImpl(contactRepository, null);

        Contact contact = Contact.builder()
                .id(3L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .message("Hello Manu!")
                .build();

        when(contactRepository.findById(3L)).thenReturn(Optional.of(contact));

        unconfiguredService.sendContactNotificationAsync(3L);

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.SKIPPED);
    }
}
