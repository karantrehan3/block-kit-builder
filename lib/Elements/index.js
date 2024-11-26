class Elements {
  /**
   * Rich text channel element
   * @param {Object} params
   * @param {string} params.channelId The ID of the channel to be mentioned.
   * @param {Object} [params.style] An object of optional boolean properties that dictate style: bold, italic, strike, highlight, client_highlight, and unlink.
   * @returns {{channel_id: string, type: string, style?: Object}}
   */
  channel({ channelId, style }) {
    return { type: "channel", channel_id: channelId, ...(style && { style }) };
  }

  /**
   * Rich text emoji element
   * @param {Object} params
   * @param {string} params.name The name of the emoji; i.e. "wave" or "wave::skin-tone-2".
   * @returns {{name: string, type: string}}
   */
  emoji({ name }) {
    return { type: "emoji", name };
  }

  /**
   * Rich text link element
   * @param {Object} params
   * @param {string} params.url The link's url.
   * @param {string} [params.text] The text shown to the user (instead of the url). If no text is provided, the url is used.
   * @param {boolean} [params.unsafe] Indicates whether the link is unsafe.
   * @param {Object} [params.style] An object containing optional boolean properties: bold, italic, strike, and code.
   * @returns {{url: string, type: string, text?: string, unsafe?: boolean, style?: Object}}
   */
  link({ url, ...rest }) {
    return { type: "link", url, ...rest };
  }

  /**
   * Rich text - text element
   * @param {Object} params
   * @param {string} params.text The text content.
   * @param {Object} [params.style] An object containing optional boolean properties: bold, italic, strike, and code.
   * @returns {{type: string, text: string, style?: Object}}
   */
  text({ text, style }) {
    return { type: "text", text, ...(style && { style }) };
  }

  /**
   * Rich text user element to mention a user
   * @param {Object} params
   * @param {string} params.userId The ID of the user to be mentioned.
   * @param {Object} [params.style] An object of optional boolean properties that dictate style: bold, italic, strike, highlight, client_highlight, and unlink.
   * @returns {{user_id: string, type: string, style?: Object}}
   */
  user({ userId, style }) {
    return { type: "user", user_id: userId, ...(style && { style }) };
  }

  /**
   * Rich text user group element to mention a user group
   * @param {Object} params
   * @param {string} params.userGroupId The ID of the user group to be mentioned.
   * @param {Object} [params.style] An object of optional boolean properties that dictate style: bold, italic, strike, highlight, client_highlight, and unlink.
   * @returns {{usergroup_id: string, type: string, style?: Object}}
   */
  usergroup({ userGroupId, style }) {
    return {
      type: "usergroup",
      usergroup_id: userGroupId,
      ...(style && { style }),
    };
  }
}

module.exports = new Elements();
