const Url = require('../models/Url');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateShortCode } = require('../services/shortCodeService');

// @desc    Shorten URL
// @route   POST /api/url/shorten
// @access  Public (Optional Auth)
exports.shortenUrl = asyncHandler(async (req, res, next) => {
  const { originalUrl, customAlias, expiresAt } = req.body;

  let shortCode;

  // Handle Custom Alias
  if (customAlias) {
    const existingAlias = await Url.findOne({ customAlias });
    if (existingAlias) {
      return next(new ApiError(400, 'Custom alias is already in use'));
    }
    shortCode = customAlias;
  } else {
    // Generate unique short code
    shortCode = await generateShortCode();
  }

  const urlData = {
    originalUrl,
    shortCode,
    customAlias: customAlias || undefined,
    expiresAt,
  };

  // Attach user if logged in (middleware optional or checked manually)
  if (req.user) {
    urlData.user = req.user.id;
  }

  const url = await Url.create(urlData);

  res.status(201).json({
    success: true,
    data: url,
  });
});

// @desc    Redirect to original URL
// @route   GET /:shortCode
// @access  Public
exports.redirectUrl = asyncHandler(async (req, res, next) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({
    $or: [{ shortCode }, { customAlias: shortCode }]
  });

  if (!url) {
    return next(new ApiError(404, 'URL not found'));
  }

  if (url.isExpired) {
    return next(new ApiError(410, 'This URL has expired'));
  }

  // Update analytics
  url.clicks += 1;
  url.lastVisited = Date.now();
  await url.save();

  return res.redirect(302, url.originalUrl);
});

// @desc    Get URL Analytics
// @route   GET /api/url/analytics/:shortCode
// @access  Public (or could be Private depending on requirements, assumed Public for now)
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({
    $or: [{ shortCode }, { customAlias: shortCode }]
  }).select('-user -__v');

  if (!url) {
    return next(new ApiError(404, 'URL not found'));
  }

  res.status(200).json({
    success: true,
    data: {
      originalUrl: url.originalUrl,
      totalClicks: url.clicks,
      createdDate: url.createdAt,
      lastVisited: url.lastVisited,
      expirationDate: url.expiresAt,
      shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`
    },
  });
});

// @desc    Get All URLs
// @route   GET /api/url/all
// @access  Public
exports.getAllUrls = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Search by originalUrl
  if (req.query.search) {
    reqQuery.originalUrl = { $regex: req.query.search, $options: 'i' };
  }

  // Filter expired/active (assuming reqQuery.isExpired might be passed as true/false string)
  if (req.query.isExpired === 'true') {
    reqQuery.expiresAt = { $lt: new Date() };
  } else if (req.query.isExpired === 'false') {
    reqQuery.$or = [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }];
  }
  delete reqQuery.isExpired;

  query = Url.find(reqQuery);

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Url.countDocuments(reqQuery);

  query = query.skip(startIndex).limit(limit);

  const urls = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: urls.length,
    pagination,
    data: urls,
  });
});

// @desc    Delete URL
// @route   DELETE /api/url/:id
// @access  Private
exports.deleteUrl = asyncHandler(async (req, res, next) => {
  const url = await Url.findById(req.params.id);

  if (!url) {
    return next(new ApiError(404, 'URL not found'));
  }

  // Ensure user owns the URL (optional but recommended for safety)
  if (url.user && url.user.toString() !== req.user.id) {
    return next(new ApiError(403, 'Not authorized to delete this URL'));
  }

  await url.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
