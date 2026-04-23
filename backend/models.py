from typing import Optional, TypedDict


class MovieSchema(TypedDict):
    title: Optional[str]
    slug: str
    imdb_id: Optional[str]
    distribution: dict[int, int]
    nps_score: Optional[float]
    description: Optional[str]
    release_date: Optional[str]
    poster_url: Optional[str]
    tmdb_id: Optional[int]
    genres: Optional[list[str]]
    runtime: Optional[int]
    cast: Optional[list[dict]]
    error: Optional[str]


class MovieDistributionSchema(TypedDict):
    movie_id: int
    bucket: int
    percentage: int


class ReviewSchema(TypedDict):
    id: int
    user_id: int
    target_type: str
    target_id: int
    rating: Optional[int]
    body: Optional[str]
    created_at: str
    updated_at: str
