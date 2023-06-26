"""empty message

Revision ID: b2267cc96525
Revises: 63ffc20b5985
Create Date: 2023-06-26 09:22:38.893036

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2267cc96525'
down_revision = '63ffc20b5985'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('image', schema=None) as batch_op:
        batch_op.add_column(sa.Column('existing_licence', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('applied_licence', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('payed', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('image', schema=None) as batch_op:
        batch_op.drop_column('payed')
        batch_op.drop_column('applied_licence')
        batch_op.drop_column('existing_licence')

    # ### end Alembic commands ###