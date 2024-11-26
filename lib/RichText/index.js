class RichText {
  /**
   * Rich text section
   * @param {Object} params
   * @param {Array<Object>} params.elements An array of rich text elements, which can include the following types: channel, emoji, link, text, user, and usergroup.
   * @return {{type: string, elements: Array<Object>}}
   */
  section({ elements }) {
    return { type: "rich_text_section", elements };
  }

  /**
   * Rich text list
   * @param {Object} params
   * @param {Array<Object>} params.elements An array of rich_text_section objects.
   * @param {string} [params.style='bullet'] Either bullet or ordered, the latter meaning a numbered list.
   * @param {number} [params.indent] The number of spaces to indent the list.
   * @param {number} [params.offset] Number of pixels to offset the list.
   * @param {number} [params.border] Number of pixels of border thickness.
   * @returns {{type: string, elements: Array<Object>, style: string, indent?: number, offset?: number, border?: number}}
   */
  list({ elements, style = "bullet", ...rest }) {
    return { type: "rich_text_list", elements, style, ...rest };
  }

  /**
   * Rich text preformatted
   * @param {Object} params
   * @param {Array<Object>} params.elements An array of rich text elements.
   * @param {number} [params.border] Number of pixels of border thickness.
   * @returns {{type: string, elements: Array<Object>, border?: number}}
   */
  preformatted({ elements, ...rest }) {
    return { type: "rich_text_preformatted", elements, ...rest };
  }

  /**
   * Rich text quote
   * @param {Object} params
   * @param {Array<Object>} params.elements An array of rich text elements.
   * @param {number} [params.border] Number of pixels of border thickness.
   * @returns {{type: string, elements: Array<Object>, border?: number}}
   */
  quote({ elements, ...rest }) {
    return { type: "rich_text_quote", elements, ...rest };
  }
}

module.exports = new RichText();
