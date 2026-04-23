from datetime import datetime, timezone

from flask_login import UserMixin
from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)

from extensions import db


class Movie(db.Model):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String, nullable=False, unique=True)
    title = Column(String)
    imdb_id = Column(String)
    tmdb_id = Column(Integer)
    description = Column(Text)
    release_date = Column(String)
    poster_url = Column(String)
    nps_score = Column(String)
    genres = Column(Text)
    runtime = Column(Integer)
    cast = Column("cast", Text)
    error = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    distributions = db.relationship(
        "MovieDistribution", back_populates="movie", cascade="all, delete-orphan"
    )


class MovieDistribution(db.Model):
    __tablename__ = "movie_distributions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    bucket = Column(Integer, nullable=False)
    percentage = Column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint("bucket BETWEEN 1 AND 10", name="bucket_range"),
        CheckConstraint("percentage BETWEEN 0 AND 100", name="percentage_range"),
        UniqueConstraint("movie_id", "bucket", name="uq_movie_bucket"),
    )

    movie = db.relationship("Movie", back_populates="distributions")


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), unique=True)
    email = Column(String(255), unique=True)
    password = Column(String(255))

    reviews = db.relationship("Review", back_populates="user", cascade="all, delete-orphan")


class Review(db.Model):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_type = Column(String, nullable=False)
    target_id = Column(Integer, nullable=False)
    rating = Column(Integer)
    body = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        CheckConstraint("target_type IN ('movie')", name="target_type_check"),
        CheckConstraint("rating BETWEEN 1 AND 10", name="rating_range"),
        UniqueConstraint("user_id", "target_type", "target_id", name="uq_user_review"),
    )

    user = db.relationship("User", back_populates="reviews")


def setup_database() -> None:
    db.create_all()
