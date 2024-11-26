const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const timezonePlugin = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
const timezones = require("./timezones.json");
const countries = require("./countries.json");
const validators = require("./validators");

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezonePlugin);

class Input {
  /**
   * Private Input block
   * @param {Object} element input element
   * @param {String} label label text
   * @param {String} [blockId] optional block id
   * @param {Boolean} [optional] optional user input
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String|null} [hint] optional hint text
   * @return {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  #input({
    element,
    label,
    blockId,
    optional = false,
    dispatchAction = false,
    hint = null,
  }) {
    validators.validateInput({ blockId, label, hint, element });
    const input = {
      type: "input",
      element,
      label: {
        type: "plain_text",
        text: label,
        emoji: true,
      },
      optional,
      dispatch_action: dispatchAction,
    };
    if (blockId) {
      input.block_id = blockId;
    }
    if (hint) {
      input.hint = {
        type: "plain_text",
        text: hint,
        emoji: true,
      };
    }
    return input;
  }

  /**
   * Get options from provided list
   * @param {{label: String, options: Array<{text:String, value:String}>}|Array<{text:String, value:String}>} options options to be shown
   * @param {Boolean} useGroup - Use option groups instead of options
   * @returns {*} Options to be displayed as group or otherwise.
   */
  getOptions(options, useGroup) {
    let _options;
    if (useGroup) {
      _options = options.map((og) => ({
        label: { type: "plain_text", text: og.label },
        options: og.options.map((o) => ({
          text: { type: "plain_text", text: o.text },
          value: o.value,
        })),
      }));
    } else {
      _options = options.map((o) => ({
        text: { type: "plain_text", text: o.text, emoji: true },
        value: o.value,
      }));
    }
    return _options;
  }

  /**
   * Get initial option(s) for select menu
   * @param {Array<Object>} options list of options
   * @param {String|Array<String>} initialOptions initial options to be selected
   * @param {Boolean} useGroup use group option
   * @param {Boolean} multi allow multi select
   * @return {String|Array<Object>} initial options for select menu
   */
  getInitialOption(options, initialOptions, useGroup, multi) {
    let _options = options;
    let iniOpt;
    if (useGroup) {
      if (multi && initialOptions?.length) {
        iniOpt = _options
          .reduce((list, og) => [...list, ...og.options], [])
          .filter((o) =>
            initialOptions.map((v) => v.toString()).includes(o.value.toString())
          );
      } else if (typeof initialOptions === "string") {
        iniOpt = _options
          .reduce((list, og) => [...list, ...og.options], [])
          .filter((o) => o.value.toString() === initialOptions.toString())
          .map((o) => ({ text: o.text, value: o.value }))[0];
      }
    } else {
      if (multi && initialOptions?.length) {
        iniOpt = _options.filter((o) =>
          initialOptions.map((v) => v.toString()).includes(o.value.toString())
        );
      } else if (typeof initialOptions === "string") {
        iniOpt = _options
          .filter((o) => o.value.toString() === initialOptions.toString())
          .map((o) => ({ text: o.text, value: o.value }))[0];
      }
    }
    return iniOpt;
  }

  /**
   * Text input block
   * @param {String} label text input label
   * @param {String} placeholder placeholder text
   * @param {Number} [minLength] minimum length of input text
   * @param {Number} [maxLength] maximum length of input text
   * @param {String} [blockId] optional block id
   * @param {String} [actionId] optional action id
   * @param {Boolean} [optional] if the input is optional. Defaults to false.
   * @param {String} [initialValue] initial value to be set
   * @param {Boolean} [multiline] if input is multi-line. Defaults to false.
   * @param {Boolean} [dispatchAction] if action should be triggered on pressing enter. Defaults to false.
   * @param {Boolean} [focusOnLoad] if input field should be kept in focus. Defaults to false.
   * @param {String} [hint] optional hint text
   * @return {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  text({
    label,
    placeholder,
    minLength,
    maxLength,
    blockId,
    actionId,
    optional,
    initialValue,
    multiline = false,
    dispatchAction = false,
    focusOnLoad = false,
    hint = null,
  }) {
    validators.validatePlainTextInput(placeholder, actionId, minLength);
    const element = {
      type: "plain_text_input",
      placeholder: {
        type: "plain_text",
        text: placeholder,
      },
      multiline,
    };
    if (actionId) {
      element.action_id = actionId;
    }
    if (initialValue) {
      element.initial_value = initialValue;
    }
    if (minLength) {
      element.min_length = minLength;
    }
    if (maxLength) {
      element.max_length = maxLength;
    }
    if (dispatchAction) {
      element.dispatch_action_config = {
        trigger_actions_on: ["on_enter_pressed"],
      };
    }
    if (focusOnLoad) {
      element.focus_on_load = focusOnLoad;
    }

    return this.#input({
      element,
      label,
      blockId,
      optional,
      dispatchAction,
      hint,
    });
  }

  /**
   * Conversation select block
   * @param {String} label conversation select label
   * @param {String} placeholder placeholder text
   * @param {Boolean} multi allow selection of multiple conversations. Defaults to false.
   * @param {String} [blockId] optional block id
   * @param {String} [actionId] optional action id
   * @param {Boolean} [optional] if the input is optional. Defaults to false.
   * @param {String|Array<String>} [initialConversations] initial conversations to be selected. conversation ids
   * @param {Array<('public'|'private'|'im'|'mpim')>} [filter] list of conversation types to show
   * @param {Boolean} [excludeBotUsers] exclude bot users from the list. Defaults to true.
   * @param {Boolean} [excludeExternalSharedChannels] exclude external shared channels from the list. Defaults to true.
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String} [hint] optional hint text
   * @return {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  conversationSelect({
    label,
    placeholder,
    blockId,
    actionId,
    optional,
    initialConversations,
    filter = ["public", "private"],
    multi = false,
    excludeBotUsers = true,
    excludeExternalSharedChannels = true,
    dispatchAction = false,
    hint = null,
  }) {
    validators.validateConversationsSelectInput(placeholder, actionId, filter);
    const element = {
      type: multi ? "multi_conversations_select" : "conversations_select",
      placeholder: {
        type: "plain_text",
        text: placeholder,
      },
      filter: {
        include: filter,
        exclude_bot_users: excludeBotUsers,
        exclude_external_shared_channels: excludeExternalSharedChannels,
      },
    };
    if (actionId) {
      element.action_id = actionId;
    }
    if (multi && initialConversations) {
      element.initial_conversations = initialConversations;
    } else if (initialConversations) {
      element.initial_conversation = initialConversations;
    }
    return this.#input({
      element,
      label,
      blockId,
      optional,
      dispatchAction,
      hint,
    });
  }

  /**
   * Static select input
   * @param {String} label static select label
   * @param {String} placeholder placeholder text
   * @param {String} [blockId] optional block id
   * @param {String} [actionId] optional action id
   * @param {Boolean} [optional] if the input is optional. Defaults to false.
   * @param {Boolean} [useGroup] if option groups need to be used. Defaults to false.
   * @param {String|Array<String>} [initialOptions] initial options to be selected.
   * @param {{label: String, options: Array<{text:String, value:String}>}|Array<{text:String, value:String}>} options options to be shown
   * @param {Boolean} [multi] allow selection of multiple options. Defaults to false.
   * @param {Number} [maxSelectedItems] maximum number of selected items. Defaults to 1.
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String} [hint] optional hint text
   * @return {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  staticSelect({
    label,
    placeholder,
    blockId,
    actionId,
    optional,
    useGroup = false,
    initialOptions,
    options,
    multi = false,
    maxSelectedItems,
    dispatchAction = false,
    hint = null,
  }) {
    validators.validateStaticSelect({ placeholder, options, actionId });
    const _options = this.getOptions(options, useGroup);
    const iniOpt = this.getInitialOption(
      _options,
      initialOptions,
      useGroup,
      multi
    );

    const element = {
      type: multi ? "multi_static_select" : "static_select",
      placeholder: {
        type: "plain_text",
        text: placeholder,
      },
      [useGroup ? "option_groups" : "options"]: _options,
    };
    if (multi && iniOpt) {
      element.initial_options = iniOpt;
    } else if (iniOpt) {
      element.initial_option = iniOpt;
    }
    if (actionId) {
      element.action_id = actionId;
    }
    if (maxSelectedItems) {
      element.max_selected_items = maxSelectedItems;
    }

    return this.#input({
      element,
      label,
      blockId,
      optional,
      dispatchAction,
      hint,
    });
  }

  /**
   * Radio select input
   * @param {String} label radio select label
   * @param {Array<{text:String, value:String}>} options options to be shown
   * @param {String} initialOption initial option to be selected.
   * @param {String} [blockId] optional block id
   * @param {String} [actionId] optional action id
   * @param {Boolean} [optional] if the input is optional. Defaults to false.
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String} [hint] optional hint text
   * @return {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  radioSelect({
    label,
    options,
    initialOption,
    blockId,
    actionId,
    optional,
    dispatchAction = false,
    hint = null,
  }) {
    validators.validateRadioButtonInput(actionId, options);
    let initOpt;
    if (initialOption) {
      initOpt = options
        .filter((o) => o.value === initialOption)
        .map((o) => ({
          text: { type: "plain_text", text: o.text },
          value: o.value,
        }))[0];
    }
    const element = {
      type: "radio_buttons",
      options: options.map((o) => ({
        text: { type: "plain_text", text: o.text },
        value: o.value,
      })),
    };
    if (initOpt) {
      element.initial_option = initOpt;
    }
    if (actionId) {
      element.action_id = actionId;
    }
    return this.#input({
      element,
      label,
      blockId,
      optional,
      dispatchAction,
      hint,
    });
  }

  /**
   * Checkboxes input
   * @param {Array<{text:String, value:String, [description]:String}>} options options to be shown
   * @param {String} [actionId] optional action id
   * @param {Array<String>} initialOptions initial options to be selected.
   * @param {Boolean} [asInput] if the checkboxes are returned with input object wrapped around it. Defaults to true.
   * @param {String} [blockId] optional block id
   * @param {String} [label] radio select label. Required if asInput is true.
   * @param {Boolean} [optional] if the input is optional. Defaults to false.
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String} [hint] optional hint text
   * @return {{options: *, type: string}}
   */
  checkboxes({
    options,
    actionId,
    initialOptions,
    label,
    blockId,
    optional,
    asInput = true,
    dispatchAction = false,
    hint = null,
  }) {
    validators.validateCheckBoxInput(actionId, options);
    const _options = options.map((o) => {
      const obj = { text: { type: "mrkdwn", text: o.text }, value: o.value };
      if (o.description) {
        obj.description = { type: "mrkdwn", text: o.description };
      }
      return obj;
    });
    const initOpts = initialOptions
      ? _options.filter((o) => initialOptions.includes(o.value))
      : undefined;
    const element = {
      type: "checkboxes",
      options: _options,
    };
    if (actionId) {
      element.action_id = actionId;
    }
    if (initOpts) {
      element.initial_options = initOpts;
    }
    if (asInput) {
      return this.#input({
        element,
        label,
        blockId,
        optional,
        dispatchAction,
        hint,
      });
    }
    return element;
  }

  /**
   * Date picker input
   * @param {String} label date picker label
   * @param {String} placeholder date picker placeholder
   * @param {String} [blockId] optional block id
   * @param {String} [actionId] optional action id
   * @param {String} [initialDate] initial date to be selected in YYYY-MM-DD format.
   * @param {String} [timezone] timezone to be used. Defaults to 'UTC'.
   * @param {Boolean} [optional] if the input is optional. Defaults to false.
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String} [hint] optional hint text
   * @return {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  datepicker({
    label,
    placeholder,
    blockId,
    actionId,
    initialDate,
    optional,
    dispatchAction = false,
    hint = null,
  }) {
    validators.validateDatePickerSelect(placeholder, actionId, initialDate);
    const element = {
      type: "datepicker",
      placeholder: { type: "plain_text", text: placeholder, emoji: true },
    };
    if (actionId) {
      element.action_id = actionId;
    }
    if (initialDate) {
      element.initial_date = initialDate;
    }
    return this.#input({
      element,
      label,
      blockId,
      optional,
      dispatchAction,
      hint,
    });
  }

  /**
   * Timepicker input
   * @param {String} label time picker label
   * @param {String} placeholder time picker placeholder
   * @param {String} [blockId] optional block id
   * @param {String} [actionId] optional action id
   * @param {String} [initialTime] initial time in hh:mm a format
   * @param {String} [timezone] timezone to be used. Defaults to 'UTC'.
   * @param {Boolean} [optional] if the input is optional. Defaults to false.
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String} [hint] optional hint text
   * @return {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  timepicker({
    label,
    placeholder,
    blockId,
    actionId,
    initialTime,
    timezone,
    optional,
    dispatchAction = false,
    hint = null,
  }) {
    let time;
    if (!initialTime && timezone) {
      const minsToAdd = 5 - (dayjs().tz(timezone).minute() % 5);
      time = dayjs().tz(timezone).add(minsToAdd, "minute").format("HH:mm");
    } else if (!initialTime) {
      const minsToAdd = 5 - (dayjs().minute() % 5);
      time = dayjs().add(minsToAdd, "minute").format("HH:mm");
    } else {
      time = dayjs(initialTime, "hh:mm a").format("HH:mm");
    }
    const element = {
      type: "timepicker",
      placeholder: { type: "plain_text", text: placeholder, emoji: true },
    };
    if (actionId) {
      element.action_id = actionId;
    }
    if (time) {
      element.initial_time = time;
    }
    return this.#input({
      element,
      label,
      blockId,
      optional,
      dispatchAction,
      hint,
    });
  }

  #getGroupedTimezones() {
    const tzGroups = {};
    timezones.forEach(({ zoneName }) => {
      const prefix = zoneName.split("/")[0];
      if (!tzGroups[prefix]) {
        tzGroups[prefix] = [];
      }
      tzGroups[prefix].push({ text: zoneName, value: zoneName });
    });
    const tzOptions = [];
    Object.keys(tzGroups).forEach((prefix) => {
      if (tzGroups[prefix].length > 100) {
        const zone1 = tzGroups[prefix].slice(0, 100);
        const zone2 = tzGroups[prefix].slice(100);
        tzOptions.push(
          { label: `${prefix}-1`, options: zone1 },
          { label: `${prefix}-2`, options: zone2 }
        );
      } else {
        tzOptions.push({ label: prefix, options: tzGroups[prefix] });
      }
    });
    return tzOptions;
  }

  /**
   * Static select input
   * @param {String} label static select label
   * @param {String} placeholder placeholder text
   * @param {String} [blockId] optional block id
   * @param {String} [actionId] optional action id
   * @param {Boolean} [optional] if the input is optional. Defaults to false.
   * @param {String} [initialTimezone] initial timezone to be selected.
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String} [hint] optional hint text
   * @return {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  timezonePicker({
    label,
    placeholder,
    blockId,
    actionId,
    initialTimezone,
    optional,
    dispatchAction = false,
    hint = null,
  }) {
    const options = this.#getGroupedTimezones();
    return this.staticSelect({
      label,
      placeholder,
      blockId,
      actionId,
      optional,
      useGroup: true,
      initialOptions: initialTimezone,
      options,
      dispatchAction,
      hint,
    });
  }

  /**
   * External data source select menu.
   * @param {String} label menu label
   * @param {String} placeholder placeholder text
   * @param {String} blockId block id
   * @param {String} actionId action id
   * @param {Boolean} [optional] optional field. Defaults to false.
   * @param {Boolean} [multi] allow multi select. Defaults to false.
   * @param {Number} [minimumQueryLength] minimum query length. Defaults to 1.
   * @param {Boolean} [focusOnLoad] focus on load. Defaults to true.
   * @param {Number} [maxSelectedItems] maximum number of items that can be selected.
   * @param {{text:String, value:String}|Array<text:String, value:String>} [initialOptions] initial options to be selected on menu load.
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String} [hint] optional hint text
   * @return {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  externalSelect({
    label,
    placeholder,
    blockId,
    actionId,
    optional = false,
    multi = false,
    minimumQueryLength,
    maxSelectedItems,
    initialOptions,
    dispatchAction = false,
    hint = null,
  }) {
    validators.validateExternalSelect(placeholder, actionId);
    const element = {
      type: multi ? "multi_external_select" : "external_select",
      placeholder: {
        type: "plain_text",
        text: placeholder,
      },
      min_query_length: minimumQueryLength,
    };
    if (initialOptions) {
      element.initial_options = initialOptions;
    }
    if (maxSelectedItems) {
      element.max_selected_items = maxSelectedItems;
    }
    if (actionId) {
      element.action_id = actionId;
    }
    return this.#input({
      element,
      label,
      blockId,
      optional,
      dispatchAction,
      hint,
    });
  }

  /**
   * Users select menu.
   * @param {String} label menu label
   * @param {String} placeholder placeholder text
   * @param {String} [blockId] block id
   * @param {String} [actionId] action id
   * @param {Boolean} [optional] optional field. Defaults to false.
   * @param {Boolean} [multi] allow multi select. Defaults to false.
   * @param {String|Array[String]} [initialOptions] initial options to be selected on menu load.
   * @param {Boolean} [focusOnLoad] focus on load. Defaults to false.
   * @param {Number} [maxSelectedItems] maximum number of items that can be selected.
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String} [hint] optional hint text
   * @returns {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  userSelect({
    label,
    placeholder,
    blockId,
    actionId,
    optional = false,
    multi = false,
    initialOptions,
    focusOnLoad = false,
    maxSelectedItems,
    dispatchAction = false,
    hint = null,
  }) {
    validators.validateUsersSelect(placeholder, actionId);
    const element = {
      type: multi ? "multi_users_select" : "users_select",
      placeholder: {
        type: "plain_text",
        text: placeholder,
      },
    };
    if (initialOptions) {
      if (multi) {
        element.initial_users = initialOptions;
      } else {
        element.initial_user = initialOptions[0] ?? initialOptions;
      }
    }
    if (actionId) {
      element.action_id = actionId;
    }
    if (focusOnLoad) {
      element.focus_on_load = focusOnLoad;
    }
    if (multi && maxSelectedItems) {
      element.max_selected_items = maxSelectedItems;
    }
    return this.#input({
      element,
      label,
      blockId,
      optional,
      dispatchAction,
      hint,
    });
  }

  /**
   * Email input field
   * @param {String} label input label
   * @param {String} placeholder placeholder text
   * @param {String} [blockId] optional block id
   * @param {String} [actionId] optional action id
   * @param {Boolean} [optional] if the input is optional. Defaults to false.
   * @param {String} [initialValue] initial value to be set on input load.
   * @param {Boolean} [focusOnLoad] focus on load. Defaults to false.
   * @param {Boolean} [dispatchAction] optional dispatch action
   * @param {String} [hint] optional hint text
   * @returns {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  email({
    label,
    placeholder,
    blockId,
    actionId,
    optional = false,
    initialValue = null,
    focusOnLoad = false,
    dispatchAction = false,
    hint = null,
  }) {
    validators.validateEmailInput(placeholder, initialValue);
    const element = {
      type: "email_text_input",
      placeholder: { type: "plain_text", text: placeholder, emoji: true },
    };
    if (initialValue) {
      element.initial_value = initialValue;
    }
    if (actionId) {
      element.action_id = actionId;
    }
    if (focusOnLoad) {
      element.focus_on_load = focusOnLoad;
    }
    return this.#input({
      element,
      label,
      blockId,
      optional,
      dispatchAction,
      hint,
    });
  }

  #getGroupedCountries() {
    const countryOptions = [];
    countries.forEach(({ id, value }) => {
      let countryIndex = -1;
      switch (true) {
        case /[a-c]/.test(value[0].toLowerCase()):
          countryIndex = countryOptions.findIndex(
            (option) => option.label === "A-C"
          );
          if (countryIndex > -1) {
            countryOptions[countryIndex].options.push({
              text: value,
              value: id,
            });
          } else {
            countryOptions.push({
              label: "A-C",
              options: [{ text: value, value: id }],
            });
          }
          break;
        case /[d-j]/.test(value[0].toLowerCase()):
          countryIndex = countryOptions.findIndex(
            (option) => option.label === "D-J"
          );
          if (countryIndex > -1) {
            countryOptions[countryIndex].options.push({
              text: value,
              value: id,
            });
          } else {
            countryOptions.push({
              label: "D-J",
              options: [{ text: value, value: id }],
            });
          }
          break;
        case /[k-o]/.test(value[0].toLowerCase()):
          countryIndex = countryOptions.findIndex(
            (option) => option.label === "K-O"
          );
          if (countryIndex > -1) {
            countryOptions[countryIndex].options.push({
              text: value,
              value: id,
            });
          } else {
            countryOptions.push({
              label: "K-O",
              options: [{ text: value, value: id }],
            });
          }
          break;
        case /[p-s]/.test(value[0].toLowerCase()):
          countryIndex = countryOptions.findIndex(
            (option) => option.label === "P-S"
          );
          if (countryIndex > -1) {
            countryOptions[countryIndex].options.push({
              text: value,
              value: id,
            });
          } else {
            countryOptions.push({
              label: "P-S",
              options: [{ text: value, value: id }],
            });
          }
          break;
        case /[t-z]/.test(value[0].toLowerCase()):
          countryIndex = countryOptions.findIndex(
            (option) => option.label === "T-Z"
          );
          if (countryIndex > -1) {
            countryOptions[countryIndex].options.push({
              text: value,
              value: id,
            });
          } else {
            countryOptions.push({
              label: "T-Z",
              options: [{ text: value, value: id }],
            });
          }
          break;
      }
    });
    return countryOptions;
  }

  /**
   * Country select field
   * @param {String} label input label
   * @param {String} placeholder placeholder text
   * @param {String} [blockId] optional block id
   * @param {String} [actionId] optional action id
   * @param {String} [initialCountry] initial country to be set on input load.
   * @param {Boolean} [optional] if the input is optional. Defaults to false.
   * @param {Boolean} [dispatchAction=false] optional dispatch action
   * @param {String} [hint=null] optional hint text
   * @returns {{optional: boolean, label: {emoji: boolean, text, type: string}, type: string, element}}
   */
  countrySelect({
    label,
    placeholder,
    blockId,
    actionId,
    initialCountry,
    optional,
    dispatchAction = false,
    hint = null,
  }) {
    const options = this.#getGroupedCountries();
    return this.staticSelect({
      label,
      placeholder,
      blockId,
      actionId,
      optional,
      useGroup: true,
      initialOptions: initialCountry,
      options,
      dispatchAction,
      hint,
    });
  }
}

module.exports = new Input();
