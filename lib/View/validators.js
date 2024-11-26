const assert = require("assert");
const { areBlockIdsUnique, validateText, getCharacterLimitErrorMessage } = require("../GenericValidators");

module.exports = ({
  title,
  submitText,
  closeText,
  blocks,
  callbackId,
  metadata,
  viewType,
}) => {
  // Validations specific to Modal views
  if (viewType === "modal") {
    // Title validation
    assert(title, "title is required");
    validateText({
      text: title,
      limit: 24,
      message: getCharacterLimitErrorMessage({ field: "title", limit: 24, item: title })
    });

    // closeText validation
    validateText({
      text: closeText,
      limit: 24,
      message: getCharacterLimitErrorMessage({ field: "closeText", limit: 24, item: closeText }),
      optional: true,
    });

    // submitText validation
    validateText({
      text: submitText,
      limit: 24,
      message: getCharacterLimitErrorMessage({ field: "submitText", limit: 24, item: submitText }),
      optional: true,
    });
  }

  // blocks validation
  assert(blocks, "blocks is required");
  assert(Array.isArray(blocks), "blocks must be an array");
  assert(blocks.length > 0, "blocks must not be empty");
  assert(
    blocks.length <= 100,
    `blocks must not be greater than 100. Current blocks size: ${blocks.length}`
  );
  areBlockIdsUnique(blocks);

  // callbackId validation
  if (callbackId) {
    validateText({
      text: callbackId,
      limit: 255,
      message: getCharacterLimitErrorMessage({ field: "callbackId", limit: 255, item: callbackId }),
    });
  }

  //metadata validation
  if (typeof metadata === "object") {
    validateText({
      text: JSON.stringify(metadata),
      optional: true,
      message: getCharacterLimitErrorMessage({ field: "metadata", limit: 3000, item: JSON.stringify(metadata) }),
    });
  } else {
    validateText({
      text: metadata,
      optional: true,
      message: getCharacterLimitErrorMessage({ field: "metadata", limit: 3000, item: metadata }),
    });
  }
};
