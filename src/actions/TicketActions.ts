"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { clientDB } from "@/lib/dbClient";
import { TicketType, validateTicket } from "@/models/TicketModel";
import { ObjectId } from "mongodb";
import { notifyTechnician } from "./UserActions";

const TICKETS_COLLECTION = "tickets";

export async function getCollection(collectionName: string) {
    const db = await clientDB();
    return db.collection(collectionName);
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
        const department = formData.get("department")?.toString().trim();
        if (!subject || !description || !priority || !createdBy || !department)
            return { success: false, message: "All fields are required!" };

        const userId = await getUserId();
        const ticket: TicketType = {
            user: createdBy,
            subject,
            description,
            department,
            priority: priority as "Low" | "Medium" | "High",
            status: "Open",
            assignInfo: {
                assignedTo: "",
                assignedTechnicianName: "",
                assignedAt: new Date(),
            },
            createdAt: new Date(),
            userId,
        };
        if (!validateTicket(ticket)) {
            return { success: false, message: "Invalid ticket data!" };
        }
        const ticketsCol = await getCollection(TICKETS_COLLECTION);
        // _id alanını ekleme, MongoDB kendisi oluşturacak

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...ticketData } = ticket;
        await ticketsCol.insertOne(ticketData);
        revalidatePath("/tickets");
        return { success: true, message: "Ticket Created Successfully!" };
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
        const ticketsCol = await getCollection(TICKETS_COLLECTION);
        const ticket = await ticketsCol.findOne({ _id: objectId });
        return ticket ? (ticket as unknown as TicketType) : null;
    } catch (error) {
        console.error("Error fetching ticket by ID:", error);
        throw new Error("Failed to fetch ticket");
    }
}

export async function getTickets(isAttendant: boolean) {
    try {
        const ticketsCol = await getCollection(TICKETS_COLLECTION);
        let query = {};
        if (!isAttendant) {
            const userId = await getUserId();
            query = { userId };
        }
        const tickets = await ticketsCol
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
        return (tickets as unknown) as TicketType[];
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw new Error("Failed to fetch tickets");
    }
}

export async function getAssignedTickets(technicianId: string) {
    try {
        const ticketsCol = await getCollection(TICKETS_COLLECTION);
        const tickets = await ticketsCol
            .find({ "assignInfo.assignedTo": technicianId })
            .sort({ createdAt: -1 })
            .toArray();
        return (tickets as unknown) as TicketType[];
    } catch (error) {
        console.error("Error fetching assigned tickets:", error);
        throw new Error("Failed to fetch assigned tickets");
    }
}

export async function assignTicketToTechnician(
    ticketId: string,
    ticketSubject: string,
    ticketDescription: string,
    technicianId: string,
    technicianEmail: string,
    technicianName: string
) {
    try {
        if (
            !ticketId ||
            !technicianId ||
            !technicianName ||
            !technicianEmail ||
            !ticketSubject ||
            !ticketDescription
        ) {
            return {
                success: false,
                message: "Ticket ID and Technician ID are required!",
            };
        }
        const objectId = new ObjectId(ticketId);
        const ticketsCol = await getCollection(TICKETS_COLLECTION);
        const ticket = await ticketsCol.findOne({ _id: objectId });
        if (!ticket) return { success: false, message: "Ticket not found!" };

        await ticketsCol.updateOne(
            { _id: objectId },
            {
                $set: {
                    assignInfo: {
                        assignedTo: technicianId,
                        assignedTechnicianName: technicianName,
                        assignedAt: new Date(),
                    },
                },
            }
        );
        revalidatePath("/tickets");
        await notifyTechnician(
            technicianEmail,
            ticketSubject,
            ticketDescription
        );
        return { success: true, message: "Ticket Assigned Successfully!" };
    } catch (error) {
        console.error("Error assigning ticket:", error);
        return {
            success: false,
            message: "An error occurred while assigning the ticket.",
        };
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
        const ticketsCol = await getCollection(TICKETS_COLLECTION);
        const ticket = await ticketsCol.findOne({ _id: objectId });
        if (!ticket) return { success: false, message: "Ticket not found!" };

        await ticketsCol.updateOne(
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
        const ticketsCol = await getCollection(TICKETS_COLLECTION);
        const ticket = await ticketsCol.findOne({ _id: objectId });
        if (!ticket) return { success: false, message: "Ticket not found!" };

        await ticketsCol.deleteOne({ _id: objectId });
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
