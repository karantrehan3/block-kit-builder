const Accessory = require("./Accessory");
const Attachment = require("./Attachment");
const Blocks = require("./Blocks");
const Button = require("./Button");
const Elements = require("./Elements");
const Input = require("./Input");
const RichText = require("./RichText");
const Select = require("./Select");
const View = require("./View");

const blocks = {
  Accessory,
  Attachment,
  Blocks,
  Button,
  Elements,
  Input,
  RichText,
  Select,
  View,
};

exports = module.exports = blocks;
exports.BlockKitBuilder = blocks;
