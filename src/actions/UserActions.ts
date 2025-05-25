"use server";
import { sendEmail } from "@/lib/sendEmail";
import { getCollection } from "./TicketActions";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export async function getUsers() {
    try {
        const users = (await getCollection("user")).find({}).toArray();
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, message: "Error fetching users." };
    }
}

export async function getlAllTechnicians() {
    try {
        const technicians = (await getCollection("user"))
            .find({ role: "technician" })
            .toArray();
        return technicians;
    } catch (error) {
        console.error("Error fetching technicians:", error);
        return { success: false, message: "Error fetching technicians." };
    }
}

export async function deleteUser(userId: string) {
    try {
        if (!userId) return { success: false, message: "User ID is required." };

        await (
            await getCollection("user")
        ).deleteOne({ _id: new ObjectId(userId) });

        //deleting the tickets which created by this user
        await (
            await getCollection("tickets")
        ).deleteMany({
            userId: userId,
        });
        console.log(`User with ID ${userId} deleted successfully.`);
        revalidatePath("/");
        return {
            success: true,
            message: `User with ID ${userId} deleted successfully.`,
        };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: "Error deleting user." };
    }
}

export async function updateUserRole(userId: string, newRole: string) {
    try {
        if (!userId || !newRole)
            return {
                success: false,
                message: "User ID and new role are required.",
            };

        const result = await (
            await getCollection("user")
        ).updateOne({ _id: new ObjectId(userId) }, { $set: { role: newRole } });
        if (result.modifiedCount > 0) {
            console.log(`User with ID ${userId} updated to role ${newRole}.`);
            revalidatePath("/");
            return {
                success: true,
                message: `User with ID ${userId} updated to role ${newRole}.`,
            };
        } else {
            console.error(
                `No user found with ID ${userId} or role is unchanged.`
            );
            return {
                success: false,
                message: `No user found with ID ${userId} or role is unchanged.`,
            };
        }
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, message: "Error updating user role." };
    }
}

export async function notifyTechnician(
    technicianEmail: string,
    ticketSubject: string,
    ticketDescription: string
) {
    try {
        const res = await sendEmail({
            to: technicianEmail,
            subject: `New Ticket Assigned: ${ticketSubject}`,
            content: `A new ticket has been assigned to you.\n\nSubject: ${ticketSubject}\nDescription: ${ticketDescription}\n\nPlease check the dashboard for more details.`,
        });
        if (res.success) {
            console.log("Notification sent successfully to technician.");
            return {
                success: true,
                message: "Notification sent successfully.",
            };
        } else {
            console.error("Failed to send notification:", res.message);
            return { success: false, message: res.message };
        }
    } catch (error) {
        console.error("Error notifying technician:", error);
        return { success: false, message: "Error notifying technician." };
    }
}
