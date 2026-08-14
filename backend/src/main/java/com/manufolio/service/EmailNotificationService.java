package com.manufolio.service;

/**
 * Service for sending asynchronous email notifications for portfolio contact submissions.
 */
public interface EmailNotificationService {

    /**
     * Send email notification asynchronously for a given contactId.
     * Guaranteed never to throw an exception to the caller.
     *
     * @param contactId ID of the persisted Contact record
     */
    void sendContactNotificationAsync(Long contactId);
}
