const assert = require("assert");
const {
  validateBlockId,
  validateText,
  getCharacterLimitErrorMessage,
} = require("../GenericValidators");

exports.actionsValidator = (elements, blockId) => {
  assert(
    Array.isArray(elements),
    `Expected elements to be an array. Received ${typeof elements}`
  );
  assert(elements.length > 0, "Expected elements to be a non-empty array");
  assert(
    elements.length <= 25,
    `Cannot have more than 25 array elements in an actions block. Current elements size: ${elements.length}`
  );
  validateBlockId(blockId);
};

exports.contextValidator = (text, blockId) => {
  if (typeof text === "string") {
    validateText({ text });
  } else if (Array.isArray(text)) {
    text.forEach((_text, index) => {
      if (typeof _text === "string") {
        validateText({ text: _text, position: index });
      } else if (typeof _text === "object") {
        validateText({ text: _text.text, position: index });
      }
    });
  }
  validateBlockId(blockId);
};

exports.dividerValidator = (blockId) => validateBlockId(blockId);

exports.headerValidator = (text, blockId) => {
  validateText({ text, limit: 150 });
  validateBlockId(blockId);
};

exports.imageValidator = ({ url, alt, title, blockId }) => {
  validateText({
    text: url,
    message: getCharacterLimitErrorMessage({
      field: "url",
      limit: 3000,
      item: url,
    }),
  });
  validateText({
    text: alt,
    limit: 2000,
    message: getCharacterLimitErrorMessage({
      field: "alt",
      limit: 2000,
      item: alt,
    }),
  });
  if (title) {
    validateText({
      text: title,
      limit: 2000,
      message: getCharacterLimitErrorMessage({
        field: "title",
        limit: 2000,
        item: title,
      }),
    });
  }
  validateBlockId(blockId);
};

exports.markdownValidator = (text, blockId) => {
  validateText({ text, limit: 3000 });
  validateBlockId(blockId);
};

exports.sectionFieldsValidator = (fields, blockId) => {
  assert(
    Array.isArray(fields),
    `Expected fields to be an array. Received ${typeof fields}`
  );
  assert(
    fields.length <= 10,
    `Cannot have more than 10 fields in a section block. Current fields size: ${fields.length}`
  );
  fields.forEach((field, index) => {
    validateText({
      text: field,
      limit: 2000,
      message: getCharacterLimitErrorMessage({
        field: "field",
        limit: 2000,
        item: field,
        position: index,
      }),
    });
  });
  validateBlockId(blockId);
};

exports.richTextValidator = (elements, blockId) => {
  assert(
    Array.isArray(elements),
    `Expected elements to be an array. Received ${typeof elements}`
  );
  validateBlockId(blockId);
};
