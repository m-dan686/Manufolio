package com.manufolio.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

/**
 * Domain event published when a contact message is successfully committed to MySQL.
 */
@Getter
public class ContactSubmittedEvent extends ApplicationEvent {

    private final Long contactId;

    public ContactSubmittedEvent(Object source, Long contactId) {
        super(source);
        this.contactId = contactId;
    }
}
