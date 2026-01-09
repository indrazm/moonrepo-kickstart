"""add oauth fields to users

Revision ID: 2ec4f07d95bc
Revises: 9a7b13193908
Create Date: 2026-01-09 13:30:34.051219

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2ec4f07d95bc"
down_revision: Union[str, Sequence[str], None] = "9a7b13193908"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("users", sa.Column("oauth_provider", sa.String(), nullable=True))
    op.add_column("users", sa.Column("oauth_provider_id", sa.String(), nullable=True))
    op.add_column("users", sa.Column("avatar_url", sa.String(), nullable=True))
    op.add_column("users", sa.Column("full_name", sa.String(), nullable=True))
    op.create_index(
        op.f("ix_users_oauth_provider_id"), "users", ["oauth_provider_id"], unique=False
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_users_oauth_provider_id"), table_name="users")
    op.drop_column("users", "full_name")
    op.drop_column("users", "avatar_url")
    op.drop_column("users", "oauth_provider_id")
    op.drop_column("users", "oauth_provider")
