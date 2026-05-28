const { nanoid } = require('nanoid');
const Url = require('../models/Url');

/**
 * Generate a unique short code
 * @param {number} length Length of the generated code
 * @returns {Promise<string>} Unique short code
 */
const generateShortCode = async (length = 6) => {
  let isUnique = false;
  let shortCode;

  while (!isUnique) {
    shortCode = nanoid(length);
    const existingUrl = await Url.findOne({ shortCode });
    if (!existingUrl) {
      isUnique = true;
    }
  }

  return shortCode;
};

module.exports = { generateShortCode };
