const {
  actionIdValidator,
  optionsValidator,
  validateStaticSelect,
  validateButton,
} = require("../GenericValidators");
const {
  validateConversationsSelectInput,
  validateDatePickerSelect,
  validateUsersSelect,
} = require("../Input/validators");

exports.validateStaticSelect = validateStaticSelect;
exports.validateButton = validateButton;

exports.validateConversationSelect = validateConversationsSelectInput;
exports.validateDatePicker = validateDatePickerSelect;
exports.validateUsersSelect = validateUsersSelect;

exports.validateOverflow = ({ options, actionId }) => {
  // actionId validation
  actionIdValidator(actionId);

  //options validation
  optionsValidator(options, 5);
};
