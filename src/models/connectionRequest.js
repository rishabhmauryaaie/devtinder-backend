const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "rejected"],
        message: `{VALUE} should be either "interested" or "rejected"`,
      },
    },
  },
  { timestamps: true },
);

connectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You can't send connection request to yourself!");
  }
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
