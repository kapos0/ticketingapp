"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { clientDB } from "@/lib/dbClient";
import { TicketType, validateTicket } from "@/models/TicketModel";
import { ObjectId } from "mongodb";
import { notifyManager } from "./UserActions";

async function getCollection() {
    const db = await clientDB();
    const collection = db.collection("tickets");
    return collection;
}

async function getUserId() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) throw new Error("User not authenticated");

    return session.user.id;
}

export async function createTicket(
    prevState: { success: boolean; message: string },
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    try {
        const subject = formData.get("subject")?.toString().trim();
        const description = formData.get("description")?.toString().trim();
        const priority = formData.get("priority")?.toString();
        const createdBy = formData.get("createdBy")?.toString().trim();
        if (!subject || !description || !priority || !createdBy)
            return { success: false, message: "All fields are required!" };

        const userId = await getUserId();

        const ticket: TicketType = {
            user: createdBy,
            subject,
            description,
            priority: priority as "Low" | "Medium" | "High",
            status: "Open",
            createdAt: new Date(),
            userId,
        };
        if (validateTicket(ticket)) {
            (await getCollection()).insertOne({
                subject,
                user: createdBy,
                description,
                priority,
                status: "Open",
                createdAt: new Date(),
                userId,
            });
            revalidatePath("/tickets");
            await notifyManager(description);
            return { success: true, message: "Ticket Created Succesfully!" };
        } else return { success: false, message: "Invalid ticket data!" };
    } catch (error) {
        console.error("Error creating ticket:", error);
        return {
            success: false,
            message: "An error occurred while creating the ticket.",
        };
    }
}

export async function getTicketById(id: string) {
    try {
        const objectId = new ObjectId(id);
        const ticket = (await (
            await getCollection()
        ).findOne({ _id: objectId })) as unknown as TicketType;
        return ticket;
    } catch (error) {
        console.error("Error fetching ticket by ID:", error);
        throw new Error("Failed to fetch ticket");
    }
}

export async function getTickets(isTechnician: boolean) {
    let tickets;
    try {
        if (!isTechnician) {
            const userId = await getUserId();
            tickets = (await getCollection())
                .find({ userId })
                .sort({ createdAt: -1 })
                .toArray();
        } else
            tickets = (await getCollection())
                .find({})
                .sort({ createdAt: -1 })
                .toArray();
        return tickets as unknown as TicketType[];
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw new Error("Failed to fetch tickets");
    }
}

export async function closeTicket(
    prevState: { success: boolean; message: string },
    formData: FormData
): Promise<{ success: boolean; message: string }> {
    try {
        const ticketId = formData.get("ticketId")?.toString();
        if (!ticketId)
            return { success: false, message: "Ticket ID is required!" };
        const objectId = new ObjectId(ticketId);
        const ticket = (await getCollection()).findOne({ _id: objectId });
        if (!ticket) return { success: false, message: "Ticket not found!" };

        (await getCollection()).updateOne(
            { _id: objectId },
            { $set: { status: "Closed" } }
        );
        revalidatePath("/tickets");
        return { success: true, message: "Ticket Closed Successfully!" };
    } catch (error) {
        console.error("Error closing ticket:", error);
        return {
            success: false,
            message: "An error occurred while closing the ticket.",
        };
    }
}

export async function deleteTicket(id: string) {
    try {
        const objectId = new ObjectId(id);
        const ticket = (await getCollection()).findOne({ _id: objectId });
        if (!ticket) return { success: false, message: "Ticket not found!" };

        (await getCollection()).deleteOne({ _id: objectId });
        revalidatePath("/tickets");
        return { success: true, message: "Ticket Deleted Successfully!" };
    } catch (error) {
        console.error("Error deleting ticket:", error);
        return {
            success: false,
            message: "An error occurred while deleting the ticket.",
        };
    }
}
