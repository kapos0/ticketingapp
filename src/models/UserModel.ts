import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    name?: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models?.User ||
    mongoose.model<IUser>("User", UserSchema);
