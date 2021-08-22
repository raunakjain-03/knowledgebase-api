const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Knowledge = require('../models/Knowledge');

// @desc        Get all Knowledges
// @route       GET /api/v1/knowledges
// @access      Public
exports.getKnowledges = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get single knowledge
// @route       GET /api/v1/knowledges/:id
// @access      Public
exports.getKnowledge = asyncHandler(async (req, res, next) => {
  const knowledge = await Knowledge.findById(req.params.id);

  if (!knowledge) {
    return next(
      new ErrorResponse(`Knowledge not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: knowledge });
});

// @desc        Create new knowledge
// @route       POST /api/v1/knowledges
// @access      Private
exports.createKnowledge = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for knowledge
  const publishedKnowledge = await Knowledge.findOne({ user: req.user.id });

  // If the user already has knowledge with same name, then cannot be added
  if (publishedKnowledge?.name === req.body.name) {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already knowledge with name ${req.body.name}`,
        400
      )
    );
  }

  const knowledge = await Knowledge.create(req.body);

  res.status(201).json({
    success: true,
    data: knowledge,
  });
});

// @desc        Update knowledge
// @route       PUT /api/v1/knowledges/:id
// @access      Private
exports.updateKnowledge = asyncHandler(async (req, res, next) => {
  let knowledge = await Knowledge.findById(req.params.id);

  if (!knowledge) {
    return next(
      new ErrorResponse(`Knowledge not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is knowledge owner
  if (knowledge.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this knowledge`,
        401
      )
    );
  }

  knowledge = await Knowledge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: knowledge });
});

// @desc        Delete knowledge
// @route       DELETE /api/v1/knowledges/:id
// @access      Private
exports.deleteKnowledge = asyncHandler(async (req, res, next) => {
  const knowledge = await Knowledge.findById(req.params.id);

  if (!knowledge) {
    return next(
      new ErrorResponse(`Knowledge not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is knowledge owner
  if (knowledge.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this knowledge`,
        401
      )
    );
  }

  knowledge.remove();

  res.status(200).json({ success: true, data: {} });
});
