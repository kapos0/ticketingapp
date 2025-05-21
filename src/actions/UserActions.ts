import { clientDB } from "@/lib/dbClient";
import { sendEmail } from "@/lib/sendEmail";

export async function getManager() {
    try {
        const db = await clientDB();
        const collection = db.collection("user");
        const manager = await collection.findOne({ role: "manager" });
        return manager;
    } catch (error) {
        console.error("Error fetching manager:", error);
        throw new Error("Failed to fetch manager");
    }
}

export async function notifyManager(content: string) {
    const manager = await getManager();
    if (!manager) return { success: false, message: "Manager not found" };
    const email = manager.email;
    await sendEmail({
        to: email,
        subject: "New Ticket",
        content,
    });
}
