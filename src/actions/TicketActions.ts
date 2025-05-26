"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { clientDB } from "@/lib/dbClient";
import { TicketType, validateTicket } from "@/models/TicketModel";
import { ObjectId } from "mongodb";
import { notifyTechnician } from "./UserActions";

export async function getCollection(collectionName: string) {
    const db = await clientDB();
    const collection = db.collection(collectionName);
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
        if (validateTicket(ticket)) {
            (await getCollection("tickets")).insertOne({
                subject,
                user: createdBy,
                description,
                department,
                assignInfo: {
                    assignedTo: "",
                    assignedTechnicianName: "",
                    assignedAt: null,
                },
                assignedTo: "",
                priority,
                status: "Open",
                createdAt: new Date(),
                userId,
            });
            revalidatePath("/tickets");
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
            await getCollection("tickets")
        ).findOne({ _id: objectId })) as unknown as TicketType;
        return ticket;
    } catch (error) {
        console.error("Error fetching ticket by ID:", error);
        throw new Error("Failed to fetch ticket");
    }
}

export async function getTickets(isAttendant: boolean) {
    let tickets;
    try {
        if (!isAttendant) {
            const userId = await getUserId();
            tickets = (await getCollection("tickets"))
                .find({ userId })
                .sort({ createdAt: -1 })
                .toArray();
        } else
            tickets = (await getCollection("tickets"))
                .find({})
                .sort({ createdAt: -1 })
                .toArray();
        return tickets as unknown as TicketType[];
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw new Error("Failed to fetch tickets");
    }
}

export async function getAssignedTickets(technicianId: string) {
    try {
        let tickets = await (await getCollection("tickets"))
            .find({ "assignInfo.assignedTo": technicianId })
            .sort({ createdAt: -1 })
            .toArray();
        return tickets as unknown as TicketType[];
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
        )
            return {
                success: false,
                message: "Ticket ID and Technician ID are required!",
            };

        const objectId = new ObjectId(ticketId);
        const ticket = (await getCollection("tickets")).findOne({
            _id: objectId,
        });
        if (!ticket) return { success: false, message: "Ticket not found!" };

        (await getCollection("tickets")).updateOne(
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
        const ticket = (await getCollection("tickets")).findOne({
            _id: objectId,
        });
        if (!ticket) return { success: false, message: "Ticket not found!" };

        (await getCollection("tickets")).updateOne(
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
        const ticket = (await getCollection("tickets")).findOne({
            _id: objectId,
        });
        if (!ticket) return { success: false, message: "Ticket not found!" };

        (await getCollection("tickets")).deleteOne({ _id: objectId });
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
