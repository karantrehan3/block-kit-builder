const assert = require("assert");
const dayjs = require("dayjs");
const {
  validateText,
  validateBlockId,
  actionIdValidator,
  optionsValidator,
  validateUsersSelect,
  validateStaticSelect,
  getCharacterLimitErrorMessage,
} = require("../GenericValidators");

exports.validateUsersSelect = validateUsersSelect;
exports.validateStaticSelect = validateStaticSelect;

// Uses same validation rules of users select
exports.validateEmailInput = validateUsersSelect;

// Uses same validation rules of users select
exports.validateExternalSelect = validateUsersSelect;

exports.validateDatePickerSelect = (placeholder, actionId, initialDate) => {
  // Uses same validation rules of users select for these two params
  this.validateUsersSelect(placeholder, actionId);

  // initialDate validation
  if (initialDate) {
    assert(
      dayjs(initialDate, "YYYY-MM-DD", true).isValid(),
      "Expected initialDate to be a valid date in format YYYY-MM-DD"
    );
  }
};

exports.validateCheckBoxInput = (actionId, options) => {
  // actionId validation
  actionIdValidator(actionId);

  //options validation
  optionsValidator(options, 10);
};

exports.validateRadioButtonInput = (actionId, options) =>
  this.validateCheckBoxInput(actionId, options);

exports.validateConversationsSelectInput = (placeholder, actionId, filter) => {
  // Uses same validation rules of users select for these two params
  this.validateUsersSelect(placeholder, actionId);

  if (filter) {
    const validFilters = ["im", "mpim", "private", "public"];
    assert(
      Array.isArray(filter),
      `Expected filter to be an array. Received ${typeof filter}`
    );
    assert(filter.length > 0, "Expected at least one filter to be present");
    filter.forEach((filter, index) => {
      assert(
        validFilters.includes(filter),
        `Expected filter of index: ${index} to be one of ${validFilters.join(
          ", "
        )}. Received: ${filter}}`
      );
    });
  }
};

exports.validatePlainTextInput = (placeholder, actionId, minLength) => {
  if (typeof minLength === "number") {
    assert(
      minLength <= 3000,
      `Expected minLength to be less than 3000. Received ${minLength}`
    );
  }

  // Uses same validation rules of users select for these two params
  this.validateUsersSelect(placeholder, actionId);
};

exports.validateInput = ({ blockId, hint, element, label }) => {
  // Validate block id
  validateBlockId(blockId);

  // validate hint
  validateText({
    text: hint,
    limit: 2000,
    optional: true,
    message: getCharacterLimitErrorMessage({
      field: "hint",
      limit: 2000,
      item: hint,
    }),
  });

  // validate element
  assert(element, "Element is required");

  // validate label
  validateText({
    text: label,
    limit: 2000,
    optional: true,
    message: getCharacterLimitErrorMessage({
      field: "label",
      limit: 2000,
      item: label,
    }),
  });
};
