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
    error: Optional[str]


class MovieDistributionSchema(TypedDict):
    movie_id: int
    bucket: int
    percentage: int
