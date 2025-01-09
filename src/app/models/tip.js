const mongoose = require("mongoose");

const TipSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      // required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Tip = mongoose.models.tips || mongoose.model("tips", TipSchema);

export default Tip;
