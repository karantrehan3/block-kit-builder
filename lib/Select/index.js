const { getInitialOption, getOptions } = require("../Input");

class Select {
  /**
   * User Select
   * @param {String} [placeholder='Select an user'] - Placeholder text
   * @param {String} [actionId] - Action ID
   * @param {String|Array<String>} [initialUser] - Initial user id
   * @param {Boolean} [focusOnLoad=false] - Focus on load
   * @param {Object} [dialog] - Confirm object. Show confirm dialog on select.
   * @param {Boolean} [multi] - Allow multiple users to be selected
   * @param {Number} [maxSelectedItems] - Maximum number of items that can be selected
   */
  userSelect({
    placeholder = "Select an user",
    actionId,
    initialUser,
    focusOnLoad = false,
    dialog = {},
    multi = false,
    maxSelectedItems = null,
  }) {
    validators.validateUsersSelect(placeholder, actionId);
    const element = {
      type: "users_select",
      placeholder: {
        type: "plain_text",
        text: placeholder,
      },
    };
    if (multi) {
      element.type = "multi_users_select";
    }
    if (actionId) {
      element.action_id = actionId;
    }
    if (initialUser) {
      element.initial_user = initialUser;
      if (multi) {
        delete element.initial_user;
        element.initial_users = initialUser;
      }
    }
    if (focusOnLoad) {
      element.focus_on_load = focusOnLoad;
    }
    if (Object.keys(dialog).length) {
      element.confirm = {
        title: { type: "plain_text", text: dialog.title },
        text: { type: "plain_text", text: dialog.description },
        confirm: { type: "plain_text", text: dialog.confirmText },
        deny: { type: "plain_text", text: dialog.cancelText },
      };
    }
    if (maxSelectedItems) {
      element.max_selected_items = maxSelectedItems;
    }
    return element;
  }

  /**
   * Static Select
   * @param {String} [placeholder='Select an user'] - Placeholder text
   * @param {String} [actionId] - Action ID
   * @param {{label: String, options: Array<{text:String, value:String}>}|Array<{text:String, value:String}>} options options to be shown
   * @param {String} [initialOption] - Value of the initial selected option
   * @param {Boolean} [useGroup=false] - Use option groups instead of options
   * @param {Boolean} [focusOnLoad=false] - Focus on load
   * @param {Object} [dialog] - Confirm object. Show confirm dialog on select.
   */
  staticSelect({
    placeholder = "Select an user",
    actionId,
    options,
    useGroup = false,
    initialOption,
    focusOnLoad = false,
    dialog = {},
  }) {
    validators.validateStaticSelect({ placeholder, actionId, options });
    const _options = getOptions(options, useGroup);
    const element = {
      type: "static_select",
      placeholder: {
        type: "plain_text",
        text: placeholder,
      },
      [useGroup ? "option_groups" : "options"]: _options,
    };
    if (actionId) {
      element.action_id = actionId;
    }
    if (initialOption) {
      element.initial_option = getInitialOption(
        _options,
        initialOption,
        useGroup,
        false
      );
    }
    if (focusOnLoad) {
      element.focus_on_load = focusOnLoad;
    }
    if (Object.keys(dialog).length) {
      element.confirm = {
        title: { type: "plain_text", text: dialog.title },
        text: { type: "plain_text", text: dialog.description },
        confirm: { type: "plain_text", text: dialog.confirmText },
        deny: { type: "plain_text", text: dialog.cancelText },
      };
    }
    return element;
  }
}

module.exports = new Select();
