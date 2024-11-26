const assert = require("assert");

exports.getCharacterLimitErrorMessage = ({ field, limit, position, item }) => {
  let message = `Expected ${field} to be less than ${limit} characters. Received: ${item?.length}`;
  if (typeof position === "number") {
    message += `. Position: ${position}`;
  }
  return message;
};

exports.validateBlockId = (blockId) => {
  if (blockId) {
    assert(
      typeof blockId === "string",
      `Expected blockId to be a string. Received ${typeof blockId}`
    );
    assert(
      blockId.length <= 255,
      this.getCharacterLimitErrorMessage({
        field: "blockId",
        limit: 255,
        item: blockId,
      })
    );
  }
};

exports.validateText = ({ text, message, optional = false, limit = 3000 }) => {
  if (optional && !text) {
    return;
  }
  assert(typeof text === "string", `Expected string. Received ${typeof text}`);
  assert(
    text.length !== 0,
    "Expected text content to have at least one character"
  );
  assert(text.length <= limit, message);
};

exports.areBlockIdsUnique = (blocks) => {
  const blockIds = new Set();
  for (const block of blocks) {
    if (block.block_id) {
      this.validateBlockId(block.block_id);
      assert(
        !blockIds.has(block.block_id),
        `Found a duplicate blockId: ${block.block_id}`
      );
      blockIds.add(block.block_id);
    }
  }
  return true; // No duplicate blockId found, it is unique
};

exports.actionIdValidator = (actionId, optional = false) =>
  this.validateText({ text: actionId, limit: 255, optional });

exports.validateIndividualOption = (option, index) => {
  assert(option.text, `Expected option ${index} to have a text property`);
  assert(option.value, `Expected option ${index} to have a value property`);
  this.validateText({
    text: option.text,
    limit: 150,
    message: this.getCharacterLimitErrorMessage({
      field: "option.text",
      limit: 150,
      item: option.text,
    }),
    position: index,
  });
  this.validateText({
    text: option.value,
    limit: 150,
    message: this.getCharacterLimitErrorMessage({
      field: "option.value",
      limit: 150,
      item: option.value,
    }),
    position: index,
  });
  this.validateText({
    text: option.description,
    limit: 150,
    position: index,
    optional: true,
    message: this.getCharacterLimitErrorMessage({
      field: "description",
      limit: 150,
      item: option.description,
    }),
  });
  this.validateText({
    text: option.url,
    limit: 3000,
    position: index,
    optional: true,
    message: this.getCharacterLimitErrorMessage({
      field: "url",
      limit: 3000,
      item: option.url,
    }),
  });
}

exports.optionsValidator = (options, limit = 100) => {
  assert(
    Array.isArray(options),
    `Expected options to be an array. Received ${typeof options}`
  );
  assert(options.length > 0, "Expected at least one option to be present");
  assert(
    options.length <= limit,
    this.getCharacterLimitErrorMessage({
      field: "options",
      limit,
      item: options,
    })
  );
  options.forEach((option, index) => {
    // This case if for handling time zone picker and select country
    if (option.options?.length) {
      option.options.forEach((_option, _index) => {
        this.validateIndividualOption(_option, _index);
      });
    } else {
      this.validateIndividualOption(option, index);
    }
  });
};

exports.validateButton = ({ text, url, actionId, value, dialog = {} }) => {
  // validate text
  this.validateText({ text, limit: 75 });

  // validate url
  this.validateText({
    text: url,
    limit: 3000,
    optional: true,
    message: this.getCharacterLimitErrorMessage({
      field: "url",
      limit: 3000,
      item: url,
    }),
  });

  // validate actionId
  this.actionIdValidator(actionId, true);

  // validate value
  if (typeof value === "string") {
    this.validateText({
      text: value,
      limit: 2000,
      optional: true,
      message: this.getCharacterLimitErrorMessage({
        field: "value",
        limit: 2000,
        item: value,
      }),
    });
  } else if (typeof value === "object") {
    this.validateText({
      text: JSON.stringify(value),
      limit: 2000,
      optional: true,
      message: this.getCharacterLimitErrorMessage({
        field: "value",
        limit: 2000,
        item: JSON.stringify(value),
      }),
    });
  }

  if (Object.keys(dialog).length) {
    const { title, description, confirmText, cancelText } = dialog;
    this.validateText({
      text: title,
      limit: 100,
      message: this.getCharacterLimitErrorMessage({
        field: "confirmation title",
        limit: 100,
        item: title,
      }),
    });
    this.validateText({
      text: description,
      limit: 300,
      message: `Expected confirmation text to be less than 300 characters. Received: ${description.length} characters.`,
    });
    this.validateText({
      text: confirmText,
      limit: 30,
      message: this.getCharacterLimitErrorMessage({
        field: "confirmation confirmText",
        limit: 30,
        item: confirmText,
      }),
    });
    this.validateText({
      text: cancelText,
      limit: 30,
      message: this.getCharacterLimitErrorMessage({
        field: "confirmation cancelText",
        limit: 30,
        item: cancelText,
      }),
    });
  }
};

exports.validateUsersSelect = (placeholder, actionId) => {
  // placeholder validation
  this.validateText({
    text: placeholder,
    limit: 150,
    optional: true,
    message: this.getCharacterLimitErrorMessage({
      field: "placeholder",
      limit: 150,
      item: placeholder,
    }),
  });

  // actionId validation
  this.actionIdValidator(actionId);
};

exports.validateStaticSelect = ({ placeholder, actionId, options }) => {
  // placeholder validation
  this.validateText({
    text: placeholder,
    limit: 150,
    optional: true,
    message: this.getCharacterLimitErrorMessage({
      field: "placeholder",
      limit: 150,
      item: placeholder,
    }),
  });

  // actionId validation
  this.actionIdValidator(actionId);

  //options validation
  this.optionsValidator(options);
};
