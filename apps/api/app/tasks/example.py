import logging

from app.core.celery import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="send_email")
def send_email(email: str, subject: str, message: str) -> dict:
    """
    Example task to send an email.

    Args:
        email: Recipient email address
        subject: Email subject
        message: Email message body

    Returns:
        dict with status and message
    """
    logger.info(f"Sending email to {email} with subject: {subject}")

    # Simulate email sending
    # In production, you would use a real email service here

    logger.info(f"Email sent successfully to {email}")

    return {
        "status": "success",
        "email": email,
        "subject": subject,
    }
