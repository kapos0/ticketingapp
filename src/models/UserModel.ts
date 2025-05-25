import { User } from "better-auth";

export type UserType = User & {
    role: "user" | "technician" | "manager";
};
