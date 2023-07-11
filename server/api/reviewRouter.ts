import express from 'express';
const router = express.Router({ mergeParams: true });
import {
  IUserVote,
  Product,
  Review,
  UserVote,
  User,
  IReview,
  Order,
  IOrder,
} from '../database/index';
import { z } from 'zod';
import mongoose from 'mongoose';
import { checkAuthenticated, sameUserOrAdmin } from './authMiddleware';
import { zodReview } from '../utils';

// ! CALLED FROM PRODUCT ROUTER (/api/product/:productId/review/...)

const zodCreateReview = zodReview.strict();
const zodUpdateReview = zodReview
  .strict()
  .deepPartial()
  .refine(
    (data) => {
      return (
        data.title !== undefined ||
        data.content !== undefined ||
        data.rating !== undefined ||
        data.nickname !== undefined ||
        data.location !== undefined
      );
    },
    { message: 'Update at least one of the fields' }
  );

type TZodReview = z.infer<typeof zodReview>;

const zodProductId = z.string().refine(
  (productId) => {
    return mongoose.Types.ObjectId.isValid(productId);
  },
  { message: 'Invalid productID' }
);

const zodReviewId = z.string().refine(
  (reviewId) => {
    return mongoose.Types.ObjectId.isValid(reviewId);
  },
  {
    message: 'Invalid reviewID',
  }
);

router.get('/', async (req, res, next) => {
  try {
    const { productId } = req.params as { productId: string };
    const validProductId = zodProductId.parse(productId);

    let allReviews: (Omit<
      Omit<
        mongoose.Document<unknown, {}, IReview> &
          Omit<
            IReview & {
              _id: mongoose.Types.ObjectId;
            },
            never
          >,
        never
      >,
      never
    > & { userVote?: 'upvote' | 'downvote' })[] = await Review.find({
      product: productId,
    })
      .populate({
        path: 'product',
        populate: 'tags',
      })
      .populate('user', ['skinConcerns', 'voteCount', 'reviewCount']);

    if (!allReviews)
      return res.status(404).send('No reviews available for this product');

    // find & append upvotes/downvotes for logged-in user for this product
    if (req.user?._id) {
      allReviews = await addUserVotesToReviews(
        JSON.parse(JSON.stringify(allReviews)), // json cycle to strip out mongoose stuff & allow new 'userVote' prop
        req.user._id
      );
    }

    res.status(200).json(allReviews);
  } catch (err) {
    next(err);
  }
});

async function addUserVotesToReviews(
  allReviews: (Omit<
    Omit<
      mongoose.Document<unknown, {}, IReview> &
        Omit<
          IReview & {
            _id: mongoose.Types.ObjectId;
          },
          never
        >,
      never
    >,
    never
  > & {
    userVote?: 'upvote' | 'downvote' | undefined;
  })[],
  userId: string
) {
  if (userId) {
    let votedReviews: IUserVote[] = await UserVote.find({
      userId: userId,
      reviewId: { $in: allReviews.map((review) => review._id) },
    });
    let mappedVotes: Iterable<readonly [string, 'upvote' | 'downvote']> =
      votedReviews.map((vote) => [vote.reviewId.toString(), vote.voteChoice]);
    let voteMap: Map<string, 'upvote' | 'downvote'> = new Map(mappedVotes);

    for (let review of allReviews) {
      if (voteMap.has(review._id.toString())) {
        review.userVote = voteMap.get(review._id.toString());
      }
    }
  }

  return allReviews;
}

router.post('/', checkAuthenticated, async (req, res, next) => {
  try {
    const parsedBody: TZodReview & {
      product?: string;
      user?: string;
      verifiedPurchase?: boolean;
    } = zodCreateReview.parse(req.body);

    const { productId } = req.params;
    const validProductId = zodProductId.parse(productId);
    const product = await Product.findById(validProductId);
    parsedBody.product = productId;
    parsedBody.user = req.userId;
    if (!product)
      return res
        .status(404)
        .send('Product you are searching for does not exist');

    const checkExistingReview = await Review.find({
      product: validProductId,
      user: req.userId,
    });

    if (checkExistingReview.length >= 1)
      return res.status(409).send('Cannot create duplicate review');

    // Check for product in user's order history
    const orderHistory = (await Order.find({
      'user.userId': req.userId,
    })) as IOrder[];
    const orderProducts = new Set<string>();
    orderHistory.forEach((order) => {
      order.orderDetails.forEach((detailLine) => {
        orderProducts.add(detailLine.productId.toString());
      });
    });
    if (orderProducts.has(productId)) {
      parsedBody.verifiedPurchase = true;
    } else {
      parsedBody.verifiedPurchase = false;
    }

    const newReview = await Review.create(parsedBody);
    const allReviews = await Review.find({ product: productId })
      .populate({
        path: 'product',
        populate: 'tags',
      })
      .populate('user', ['skinConcerns', 'voteCount', 'reviewCount']);

    res.status(201).json(allReviews);
  } catch (err) {
    next(err);
  }
});

/**
 * * UPVOTE
 */
router.post('/:reviewId/upvote', checkAuthenticated, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const validReviewId = zodReviewId.parse(reviewId);
    const { productId } = req.params;
    const validProductId = zodProductId.parse(productId);
    const userId = req.userId;

    const userUpvote = await UserVote.find({ userId, reviewId });
    let upvoteReview;
    if (userUpvote.length >= 1 && userUpvote[0].voteChoice === 'upvote') {
      upvoteReview = await Review.findOneAndUpdate(
        { _id: reviewId, product: productId },
        { $inc: { upvote: -1 } },
        { new: true }
      );
      await User.findOneAndUpdate({ _id: userId }, { $inc: { voteCount: -1 } });
      await UserVote.findOneAndDelete({ userId, reviewId });
    } else if (
      userUpvote.length >= 1 &&
      userUpvote[0].voteChoice !== 'upvote'
    ) {
      upvoteReview = await Review.findOneAndUpdate(
        { _id: reviewId, product: productId },
        { $inc: { upvote: 1, downvote: -1 } },
        { new: true }
      );
      if (!upvoteReview)
        return res.status(400).send('ProductID and ReviewID do not match');
      await UserVote.findOneAndUpdate(
        { userId, reviewId },
        { voteChoice: 'upvote' }
      );
    } else {
      const userVoteRecord = await UserVote.create({
        userId,
        reviewId,
        voteChoice: 'upvote',
      });
      upvoteReview = await Review.findOneAndUpdate(
        { _id: reviewId },
        { $inc: { upvote: 1 } },
        { new: true }
      );
    }

    let allReviews = await Review.find({ product: productId })
      .populate({
        path: 'product',
        populate: 'tags',
      })
      .populate('user', ['skinConcerns', 'voteCount', 'reviewCount']);

    if (req.user?._id) {
      allReviews = await addUserVotesToReviews(
        JSON.parse(JSON.stringify(allReviews)),
        req.user._id
      );
    }
    res.status(201).json(allReviews);
  } catch (err) {
    next(err);
  }
});

/**
 * * DOWNVOTE
 */
router.post(
  '/:reviewId/downvote',
  checkAuthenticated,
  async (req, res, next) => {
    try {
      const reviewId = zodReviewId.parse(req.params.reviewId);
      const productId = zodProductId.parse(req.params.productId);
      const userId = req.userId;

      let downvoteReview;

      const userDownvote: IUserVote | null = await UserVote.findOne({
        userId,
        reviewId,
      });

      if (!userDownvote) {
        // user has not previously voted on this review
        await UserVote.create({
          userId,
          reviewId,
          voteChoice: 'downvote',
        });

        downvoteReview = await Review.findOneAndUpdate(
          { _id: reviewId },
          { $inc: { downvote: 1 } },
          { new: true }
        );
      } else if (userDownvote.voteChoice === 'upvote') {
        // user had previously upvoted & is changing vote

        downvoteReview = await Review.findOneAndUpdate(
          { _id: reviewId, product: productId },
          { $inc: { upvote: -1, downvote: 1 } },
          { new: true }
        );

        if (!downvoteReview)
          return res
            .status(400)
            .json({ message: 'ProductID and ReviewID do not match' });

        await UserVote.findOneAndUpdate(
          { userId, reviewId },
          { voteChoice: 'downvote' }
        );
      } else if (
        userDownvote.voteChoice.length > 1 &&
        userDownvote.voteChoice === 'downvote'
      ) {
        // user has already downvoted this review
        await User.findOneAndUpdate(
          { _id: userId },
          { $inc: { voteCount: -1 } },
          { new: true }
        );
        await Review.findOneAndUpdate(
          { _id: reviewId },
          { $inc: { downvote: -1 } }
        );
        await UserVote.findOneAndDelete({ userId, reviewId });
      }

      let allReviews = await Review.find({ product: productId })
        .populate({
          path: 'product',
          populate: 'tags',
        })
        .populate('user', ['skinConcerns', 'voteCount', 'reviewCount']);
      if (req.user?._id) {
        allReviews = await addUserVotesToReviews(
          JSON.parse(JSON.stringify(allReviews)),
          req.user._id
        );
      }
      res.status(201).json(allReviews);
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:reviewId', checkAuthenticated, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { productId } = req.params;
    const validReviewId = zodReviewId.parse(reviewId);
    const validProductId = zodProductId.parse(productId);
    const userId = req.userId;

    const parsedBody = zodUpdateReview.parse(req.body);
    const existingReview = await Review.findById(validReviewId);

    if (!existingReview)
      return res
        .status(404)
        .send('Review you are trying to update does not exist');
    if (
      String(existingReview.product) !== validProductId ||
      existingReview.user !== userId
    )
      return res.status(400).send('Cannot update review: invalid credentials ');

    if (parsedBody.rating) {
      if (!parsedBody.rating.overall)
        parsedBody.rating.overall = existingReview.rating.overall;
      if (!parsedBody.rating.quality)
        parsedBody.rating.quality = existingReview.rating.quality;
      if (!parsedBody.rating.value)
        parsedBody.rating.value = existingReview.rating.value;
    }

    const updateReview = await Review.updateOne(
      { _id: validReviewId },
      parsedBody
    );

    res.status(200).json(updateReview);
  } catch (err) {
    next(err);
  }
});

router.delete('/:reviewId', checkAuthenticated, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;
    const validReviewId = zodReviewId.parse(reviewId);
    const existingReview = await Review.findById(validReviewId);
    const { productId } = req.params;

    if (!existingReview)
      return res
        .status(404)
        .send('Cannot delete review: it does not exist in the database');

    if (
      existingReview.user !== userId ||
      String(existingReview.product) !== productId
    )
      return res
        .status(403)
        .send(
          'Cannot delete review: provided userID or productID does not match'
        );

    await Review.softDelete({ _id: validReviewId });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
