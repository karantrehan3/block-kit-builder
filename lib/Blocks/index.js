const validators = require("./validators");

class Blocks {
  /**
   * Actions block
   * @param {Object} params
   * @param {Array<Object>} params.elements Array of actions
   * @param {String} [params.blockId] Optional block id
   * @return {{elements: Array<Object>, type: string, block_id?: string}}
   */
  actions({ elements, blockId }) {
    validators.actionsValidator(elements, blockId);
    return {
      type: "actions",
      elements,
      ...(blockId && { block_id: blockId }),
    };
  }

  /**
   * Context block
   * @param {Object} params
   * @param {String|Array<String>|Array<Object>} params.text Text to display
   * @param {String} [params.blockId] Optional block id
   * @return {{type: string, elements: Array<Object>, block_id?: string}}
   */
  context({ text, blockId }) {
    validators.contextValidator(text, blockId);
    const element = { type: "context", ...(blockId && { block_id: blockId }) };

    if (typeof text === "string") {
      element.elements = [{ type: "mrkdwn", text }];
    } else if (Array.isArray(text) && typeof text[0] === "string") {
      element.elements = text.map((t) => ({ type: "mrkdwn", text: t }));
    } else if (Array.isArray(text) && typeof text[0] === "object") {
      element.elements = [];
      text.forEach(({ text, image }) => {
        if (image?.url) {
          element.elements.push({
            type: "image",
            image_url: image.url,
            alt_text: image.alt || "image",
          });
        }
        if (text) {
          element.elements.push({
            type: "mrkdwn",
            text: text,
          });
        }
      });
    }
    return element;
  }

  /**
   * Divider block
   * @param {Object} [params]
   * @param {String} [params.blockId] Optional block id
   * @return {{type: string, block_id?: string}}
   */
  divider({ blockId } = {}) {
    validators.dividerValidator(blockId);
    return {
      type: "divider",
      ...(blockId && { block_id: blockId }),
    };
  }

  /**
   * Fields block
   * @param {Object} params
   * @param {Array<String>} params.fields Field texts
   * @param {String} [params.blockId] Optional block id
   * @return {{type: string, fields: Array<Object>, block_id?: string}}
   */
  fields({ fields, blockId }) {
    validators.fieldsValidator(fields, blockId);
    return {
      type: "section",
      fields: fields.map((f) => ({ type: "mrkdwn", text: f })),
      ...(blockId && { block_id: blockId }),
    };
  }

  /**
   * Header block
   * @param {Object} params
   * @param {String} params.text Header text to display
   * @param {String} [params.blockId] Optional block id
   * @return {{type: string, text: {type: string, text: string}, block_id?: string}}
   */
  header({ text, blockId }) {
    validators.headerValidator(text, blockId);
    return {
      type: "header",
      text: { type: "plain_text", text },
      ...(blockId && { block_id: blockId }),
    };
  }

  /**
   * Image block
   * @param {Object} params
   * @param {String} params.url Valid image URL
   * @param {String} [params.alt="image"] Optional alt text to display if image is unavailable
   * @param {String} [params.blockId] Optional block id
   * @param {String} [params.title] Optional title to display
   * @return {{type: string, image_url: string, alt_text: string, block_id?: string, title?: {type: string, text: string}}}
   */
  image({ url, alt = "image", blockId, title }) {
    validators.imageValidator({ url, alt, blockId, title });
    return {
      type: "image",
      image_url: url,
      alt_text: alt,
      ...(blockId && { block_id: blockId }),
      ...(title && { title: { type: "plain_text", text: title } }),
    };
  }

  /**
   * Markdown text section block
   * @param {Object} params
   * @param {String} params.text Markdown text
   * @param {String} [params.blockId] Optional block id
   * @param {Object} [params.rest] Optional extra fields to add to the markdown, like accessories.
   * @return {{type: string, text: {type: string, text: string}, block_id?: string}}
   */
  markdown({ text, blockId, ...rest }) {
    validators.markdownValidator(text, blockId);
    return {
      type: "section",
      text: {
        type: "mrkdwn",
        text,
      },
      ...(blockId && { block_id: blockId }),
      ...rest,
    };
  }

  /**
   * Plain text section block
   * @param {Object} params
   * @param {String} params.text Plain text
   * @param {String} [params.blockId] Optional block id
   * @return {{type: string, text: {type: string, text: string, emoji: boolean}, block_id?: string}}
   */
  plainText({ text, blockId }) {
    validators.markdownValidator(text, blockId);
    return {
      type: "section",
      text: {
        type: "plain_text",
        text,
        emoji: true,
      },
      ...(blockId && { block_id: blockId }),
    };
  }

  /**
   * Rich text block
   * @param {Array<Object>} elements An array of rich text objects - rich_text_section, rich_text_list, rich_text_preformatted, and rich_text_quote.
   * @param {String} [blockId] optional block id
   * @return {{elements, type: string}}
   */
  richText({ elements, blockId }) {
    validators.richTextValidator(elements, blockId);
    return {
      type: "rich_text",
      elements,
      ...(blockId && { block_id: blockId }),
    };
  }
}

module.exports = new Blocks();
