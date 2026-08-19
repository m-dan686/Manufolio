package com.manufolio.service;

import com.manufolio.entity.Contact;
import com.manufolio.enums.NotificationStatus;
import com.manufolio.repository.ContactRepository;
import com.manufolio.service.impl.EmailNotificationServiceImpl;
import jakarta.mail.Address;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Properties;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailNotificationServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private JavaMailSender mailSender;

    private EmailNotificationServiceImpl emailNotificationService;

    @BeforeEach
    void setUp() {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        lenient().when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailNotificationService = new EmailNotificationServiceImpl(
                contactRepository,
                mailSender,
                "noreply@manufolio.com",
                "Manufolio",
                "manuanandan686@gmail.com"
        );
    }

    @Test
    void testSendNotificationSmtpSuccess() throws Exception {
        Contact contact = Contact.builder()
                .id(1L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .phone("9876543210")
                .message("Hello Manu!")
                .sentAt(LocalDateTime.now())
                .build();

        when(contactRepository.findById(1L)).thenReturn(Optional.of(contact));

        emailNotificationService.sendContactNotificationAsync(1L);

        ArgumentCaptor<MimeMessage> messageCaptor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(messageCaptor.capture());

        MimeMessage sentMessage = messageCaptor.getValue();

        // Inspect MimeMessage headers and contents
        assertThat(sentMessage.getSubject()).isEqualTo("New Manufolio Contact Message — Visitor Name");

        Address[] fromAddresses = sentMessage.getFrom();
        assertThat(fromAddresses).isNotNull().hasSize(1);
        assertThat(((InternetAddress) fromAddresses[0]).getAddress()).isEqualTo("noreply@manufolio.com");
        assertThat(((InternetAddress) fromAddresses[0]).getPersonal()).isEqualTo("Manufolio");

        Address[] toAddresses = sentMessage.getRecipients(MimeMessage.RecipientType.TO);
        assertThat(toAddresses).isNotNull().hasSize(1);
        assertThat(((InternetAddress) toAddresses[0]).getAddress()).isEqualTo("manuanandan686@gmail.com");

        Address[] replyToAddresses = sentMessage.getReplyTo();
        assertThat(replyToAddresses).isNotNull().hasSize(1);
        assertThat(((InternetAddress) replyToAddresses[0]).getAddress()).isEqualTo("visitor@example.com");

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        sentMessage.writeTo(baos);
        String rawEmailContent = baos.toString("UTF-8");
        assertThat(rawEmailContent).contains("Visitor Name");
        assertThat(rawEmailContent).contains("Hello Manu!");

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.SENT);
        assertThat(saved.getEmailNotificationSentAt()).isNotNull();
        assertThat(saved.getEmailNotificationError()).isNull();
    }

    @Test
    void testSendNotificationSmtpFailureIsolation() {
        Contact contact = Contact.builder()
                .id(2L)
                .name("Visitor Name")
                .email("visitor@example.com")
                .message("Hello Manu!")
                .build();

        when(contactRepository.findById(2L)).thenReturn(Optional.of(contact));

        doThrow(new MailSendException("SMTP Authentication Failed 535"))
                .when(mailSender).send(any(MimeMessage.class));

        assertThatCode(() -> emailNotificationService.sendContactNotificationAsync(2L))
                .doesNotThrowAnyException();

        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepository, times(1)).save(contactCaptor.capture());

        Contact saved = contactCaptor.getValue();
        assertThat(saved.getEmailNotificationStatus()).isEqualTo(NotificationStatus.FAILED);
        assertThat(saved.getEmailNotificationError()).contains("MailSendException");
        assertThat(saved.getEmailNotificationError()).contains("SMTP Authentication Failed 535");
    }

    @Test
    void testSendNotificationSkippedWhenUnconfigured() {
        EmailNotificationServiceImpl unconfiguredService = new EmailNotificationServiceImpl(
                contactRepository,
                mailSender,
                "",
                "Manufolio",
                ""
        );

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
        assertThat(saved.getEmailNotificationError()).contains("not configured");
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    void testHtmlEscapingOfVisitorInput() throws Exception {
        Contact contact = Contact.builder()
                .id(4L)
                .name("<script>alert('xss')</script>")
                .email("visitor@example.com")
                .message("<img src=x onerror=alert('hack')>")
                .build();

        when(contactRepository.findById(4L)).thenReturn(Optional.of(contact));

        emailNotificationService.sendContactNotificationAsync(4L);

        ArgumentCaptor<MimeMessage> messageCaptor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(messageCaptor.capture());

        MimeMessage sentMessage = messageCaptor.getValue();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        sentMessage.writeTo(baos);
        String rawEmailContent = baos.toString("UTF-8").replaceAll("=\\r?\\n", "");

        String htmlPart = rawEmailContent.substring(rawEmailContent.indexOf("Content-Type: text/html"));

        assertThat(htmlPart).contains("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");
        assertThat(htmlPart).contains("&lt;img src=3Dx onerror=3Dalert(&#39;hack&#39;)&gt;");
        assertThat(htmlPart).doesNotContain("<script>alert('xss')</script>");
    }

    @Test
    void testReplyToHeaderMatchesVisitorEmail() throws Exception {
        Contact contact = Contact.builder()
                .id(5L)
                .name("John Doe")
                .email("john.doe@example.com")
                .message("Testing Reply-To functionality")
                .build();

        when(contactRepository.findById(5L)).thenReturn(Optional.of(contact));

        emailNotificationService.sendContactNotificationAsync(5L);

        ArgumentCaptor<MimeMessage> messageCaptor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(1)).send(messageCaptor.capture());

        MimeMessage sentMessage = messageCaptor.getValue();
        Address[] replyTo = sentMessage.getReplyTo();

        assertThat(replyTo).isNotNull().hasSize(1);
        InternetAddress replyToAddress = (InternetAddress) replyTo[0];
        assertThat(replyToAddress.getAddress()).isEqualTo("john.doe@example.com");
        assertThat(replyToAddress.getPersonal()).isEqualTo("John Doe");
    }
}
