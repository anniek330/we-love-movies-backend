const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { is_showing } = req.query;
  if (is_showing) {
    const data = await service.listShowings();
    res.status(200).json({ data });
  } else {
    const data = await service.list();
    res.status(200).json({ data });
  }
}
async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

function read(req, res) {
  const { movie: data } = res.locals;
  res.send({ data });
}

async function listTheaters(req, res) {
  const movieId = res.locals.movie.movie_id;
  const data = await service.listTheaters(movieId);
  res.send({ data });
}
async function listReviews(req, res) {
  const movieId = res.locals.movie.movie_id;
  const data = await service.listReviews(movieId);
  res.send({ data });
}
module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  listTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheaters),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
};
