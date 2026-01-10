import json
import logging
import time
from redis import Redis

from app.core.celery import celery_app
from app.core.settings import settings

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


@celery_app.task(name="process_background_task")
def process_background_task(client_id: str, task_name: str, data: str) -> dict:
    """
    Process background task and publish result to WebSocket via Redis Pub/Sub.

    This task demonstrates the full flow:
    1. Celery worker receives task from frontend (via WebSocket)
    2. Processes the task (simulated with sleep)
    3. Publishes result to Redis Pub/Sub channel
    4. ConnectionManager (in FastAPI process) forwards to WebSocket client

    Args:
        client_id: WebSocket client identifier
        task_name: Name of the task to process
        data: Task data/payload

    Returns:
        dict with task result
    """
    logger.info(f"Processing background task '{task_name}' for client {client_id}")

    # Connect to Redis for Pub/Sub publishing
    redis_client = Redis.from_url(settings.redis_url, decode_responses=True)

    try:
        # Send progress update - task started
        progress_message = json.dumps(
            {
                "type": "task_progress",
                "task_name": task_name,
                "progress": 0,
                "status": "started",
                "message": f"Task '{task_name}' started processing",
            }
        )
        redis_client.publish(f"ws:{client_id}", progress_message)
        logger.info(f"Published task started message for client {client_id}")

        # Simulate processing work
        total_steps = 5
        for step in range(1, total_steps + 1):
            time.sleep(1)  # Simulate work

            # Send progress update
            progress = (step / total_steps) * 100
            progress_message = json.dumps(
                {
                    "type": "task_progress",
                    "task_name": task_name,
                    "progress": progress,
                    "status": "processing",
                    "message": f"Processing step {step}/{total_steps}",
                }
            )
            redis_client.publish(f"ws:{client_id}", progress_message)
            logger.info(f"Published progress {progress}% for client {client_id}")

        # Task completed - send final result
        result = {
            "type": "task_completed",
            "task_name": task_name,
            "status": "success",
            "data": {
                "input": data,
                "output": f"Processed: {data}",
                "processed_at": time.time(),
                "steps_completed": total_steps,
            },
        }

        result_message = json.dumps(result)
        redis_client.publish(f"ws:{client_id}", result_message)
        logger.info(f"Published task completed message for client {client_id}")

        return result

    except Exception as e:
        logger.error(f"Error processing task for client {client_id}: {e}")

        # Send error message
        error_message = json.dumps(
            {
                "type": "task_error",
                "task_name": task_name,
                "status": "error",
                "message": str(e),
            }
        )
        redis_client.publish(f"ws:{client_id}", error_message)

        raise

    finally:
        # Cleanup Redis connection
        redis_client.close()
