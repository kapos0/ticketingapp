import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./UserModel";

export interface ITicket extends Document {
    subject: string;
    description: string;
    priority: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    userId: Types.ObjectId;
    user: IUser | Types.ObjectId;
}

const TicketSchema: Schema = new Schema<ITicket>(
    {
        subject: { type: String, required: true },
        description: { type: String, required: true },
        priority: { type: String, required: true },
        status: { type: String, default: "Open" },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models?.Ticket ||
    mongoose.model<ITicket>("Ticket", TicketSchema);
