import { Rating } from '../models/Rating.js';

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find();

    return res.status(200).json({
      ratings,
    });
  
    // TODO
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    return res.status(200).json({
      rating,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    const rating = await Rating.create(req.body);

    return res.status(201).json({
      rating,
    });
  } catch (err) {next(err); }
}

// GET /api/ratings/summary?movieCode=MV101
// TODO: implement per README.md section 3.
export const getRatingSummary = async (req, res, next) => {
  try {
    const { movieCode } = req.query;

    if (!movieCode) {
      return res.status(400).json({
        message: "movieCode is required",
      });
    }

    const summary = await Rating.aggregate([
      {
        $match: {
          movieCode,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
          ratingCount: {
            $sum: 1,
          },
        },
      },
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        movieCode,
        averageRating: 0,
        ratingCount: 0,
      });
    }

    return res.status(200).json({
      movieCode,
      averageRating: summary[0].averageRating,
      ratingCount: summary[0].ratingCount,
    });
  } catch (err) {
    next(err);
  }
};
