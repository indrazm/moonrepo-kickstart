#!/usr/bin/env python3
"""
Django-style createsuperuser command for creating admin users.

Usage:
    moon run api:createsuperuser
"""

import asyncio
import sys
from getpass import getpass

from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.settings import settings
from app.models.user import UserRole
from app.modules.auth.service import check_user_exists, create_user


async def create_superuser():
    """Interactive CLI to create a superuser/admin."""
    print("=" * 50)
    print("Create Superuser (Admin)")
    print("=" * 50)
    print()

    # Get user input
    email = input("Email address: ").strip()
    if not email:
        print("Error: Email is required")
        sys.exit(1)

    username = input("Username: ").strip()
    if not username:
        print("Error: Username is required")
        sys.exit(1)

    password = getpass("Password: ")
    if not password:
        print("Error: Password is required")
        sys.exit(1)

    password_confirm = getpass("Password (again): ")
    if password != password_confirm:
        print("Error: Passwords don't match")
        sys.exit(1)

    # Create database connection
    engine = create_async_engine(settings.database_url, echo=False)

    async with AsyncSession(engine) as db:
        # Check if user exists
        if await check_user_exists(db, email, username):
            print(
                f"Error: User with email '{email}' or username '{username}' already exists"
            )
            sys.exit(1)

        # Create admin user
        try:
            user = await create_user(
                db,
                email=email,
                username=username,
                password=password,
                role=UserRole.ADMIN,
            )
            print()
            print("=" * 50)
            print("✓ Superuser created successfully!")
            print(f"  ID: {user.id}")
            print(f"  Email: {user.email}")
            print(f"  Username: {user.username}")
            print(f"  Role: {user.role.value}")
            print("=" * 50)
        except Exception as e:
            print(f"Error creating superuser: {e}")
            sys.exit(1)

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(create_superuser())
