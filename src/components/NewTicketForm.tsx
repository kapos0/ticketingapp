"use client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createTicket } from "@/actions/TicketActions";

export default function NewTicketForm({ user }: { user: string }) {
    const [state, formAction] = useActionState(createTicket, {
        success: false,
        message: "",
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast.success("Ticket submitted successfully!");
            router.push("/tickets");
        }
    }, [state.success, router]);

    const inputClass =
        "w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 dark:bg-black dark:text-gray-100 dark:border-gray-700";
    return (
        <div className="w-full max-w-md shadow-md rounded-lg p-8 border border-gray-200 bg-white text-gray-700 dark:bg-black dark:text-gray-100 dark:border-gray-700">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
                Submit a Support Ticket
            </h1>
            {state.message && !state.success && (
                <p className="text-red-500 mb-4 text-center dark:text-red-400">
                    {state.message}
                </p>
            )}
            <form action={formAction} className="space-y-4">
                <input hidden type="text" name="createdBy" defaultValue={user} />
                <input
                    className={inputClass}
                    type="text"
                    name="subject"
                    placeholder="Subject"
                />
                <textarea
                    className={inputClass}
                    name="description"
                    placeholder="Describe your issue"
                    rows={4}
                />
                <select
                    className={inputClass}
                    name="priority"
                    defaultValue="Low"
                >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                </select>
                <select
                    className={inputClass}
                    name="department"
                    defaultValue="General"
                >
                    <option value="General">General</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                </select>
                <button
                    className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
