import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import {UserRole} from "../utilities/enums/userRole";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId,
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  cartId?: mongoose.Types.ObjectId
  createdAt: Date;
  updatedAt: Date

  comparePassword(userPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
     lastName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User
    },
    cartId:{ type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: false },
  },
  { timestamps: true }
);

/**
 * Hash password before saving
 */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare raw password with hashed one
 */
UserSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
