import { sendEmail } from "@/lib/sendEmail";
import { getCollection } from "./TicketActions";

export async function getUsers() {
    try {
        const users = (await getCollection("user")).find({}).toArray();
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
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
    }
}
