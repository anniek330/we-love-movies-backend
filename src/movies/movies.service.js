const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function list() {
  return knex("movies").select("*");
}
function listShowings() {
  return knex("movies")
    .distinct()
    .join("movies_theaters as m_t", "movies.movie_id", "m_t.movie_id")
    .select("movies.*")
    .where({ "m_t.is_showing": true });
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function listTheaters(movie_id) {
  return knex("movies as m")
    .join("movies_theaters as m_t", "m.movie_id", "m_t.movie_id")
    .join("theaters as t", "t.theater_id", "m_t.theater_id")
    .select("t.*", "m.movie_id", "m_t.is_showing")
    .where({ "m.movie_id": movie_id, "m_t.is_showing": true });
}

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

function listReviews(movie_id) {
  return knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("r.*", "c.*")
    .where({ "m.movie_id": movie_id })
    .then((reviews) => reviews.map((review) => addCritic(review)));
}

module.exports = {
  list,
  listShowings,
  read,
  listTheaters,
  listReviews,
};
