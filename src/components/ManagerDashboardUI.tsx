"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { deleteUser, updateUserRole } from "@/actions/UserActions";
import { deleteTicket, assignTicketToTechnician } from "@/actions/TicketActions";
import type { TicketType } from "@/models/TicketModel";
import type { UserType } from "@/models/UserModel";

export default function ManagerDashboardUI({
    tickets,
    users,
    technicians,
}: {
    tickets: TicketType[];
    users: UserType[];
    technicians: UserType[];
}) {
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [newRole, setNewRole] = useState<UserType["role"]>("user");
    const [showPopup, setShowPopup] = useState(false);
    // Ticket assign popup state
    const [assignTicket, setAssignTicket] = useState<TicketType | null>(null);
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedTechnician, setSelectedTechnician] =
        useState<UserType | null>(null);
    const [assignUserId, setAssignUserId] = useState<string>("");
    const [showAssignPopup, setShowAssignPopup] = useState(false);

    // Kullanıcı silme
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    async function handleDeleteUser(userId: string) {
        setDeleteUserId(userId);
    }
    async function confirmDeleteUser() {
        if (!deleteUserId) return;
        const res = await deleteUser(deleteUserId);
        if (res && res.success) toast.success("Kullanıcı başarıyla silindi.");
        else toast.error("Kullanıcı silinemedi.");
        setDeleteUserId(null);
    }
    async function cancelDeleteUser() {
        setDeleteUserId(null);
    }
    // Ticket silme
    const [deleteTicketId, setDeleteTicketId] = useState<string | null>(null);
    async function handleDeleteTicket(ticketId: string) {
        setDeleteTicketId(ticketId);
    }
    async function confirmDeleteTicket() {
        if (!deleteTicketId) return;
        const res = await deleteTicket(deleteTicketId);
        if (res && res.success) toast.success("Ticket başarıyla silindi.");
        else toast.error("Ticket silinemedi.");
        setDeleteTicketId(null);
    }
    async function cancelDeleteTicket() {
        setDeleteTicketId(null);
    }

    function handleUserClick(user: UserType) {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowPopup(true);
    }

    function handleClose() {
        setShowPopup(false);
        setSelectedUser(null);
    }

    async function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setNewRole(e.target.value as UserType["role"]);
        if (!selectedUser) return;
        const res = await updateUserRole(selectedUser?.id, e.target.value);
        if (res && res.success)
            toast.success("Kullanıcı rolü başarıyla değiştirildi.");
        else toast.error("Kullanıcı rolü güncellenemedi.");
    }

    function handleAssignClick(ticket: TicketType) {
        setAssignTicket(ticket);
        setAssignUserId("");
        setShowAssignPopup(true);
    }
    async function handleAssignUserChange(
        e: React.ChangeEvent<HTMLSelectElement>
    ) {
        setAssignUserId(e.target.value);
    }
    async function handleAssignSave() {
        if (!assignTicket || !assignUserId) return;
        if (!selectedTechnician) return;
        const res = await assignTicketToTechnician(
            assignTicket._id!,
            assignTicket.subject,
            assignTicket.description,
            assignUserId,
            selectedTechnician.email,
            selectedTechnician.name
        );
        setShowAssignPopup(false);
        setAssignTicket(null);
        setAssignUserId("");
        if (res && res.success) toast.success("Ticket başarıyla atandı.");
        else toast.error(res.message);
    }
    async function handleAssignClose() {
        setShowAssignPopup(false);
        setAssignTicket(null);
        setAssignUserId("");
    }

    // Kullanıcılar tablosu render fonksiyonu
    function renderUsersTable() {
        return (
            <table className="w-full text-left text-sm sm:text-base min-w-[400px]">
                <thead>
                    <tr>
                        <th>Ad</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Aksiyon</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    onClick={() => handleUserClick(user)}
                                    className="text-blue-600 hover:underline mr-2"
                                >
                                    Rol Değiştir
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Sil
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
    // Ticketlar tablosu render fonksiyonu
    function renderTicketsTable() {
        return (
            <div className="space-y-4 max-w-3xl mx-auto">
                {tickets.map((ticket) => (
                    <div
                        key={ticket._id}
                        className="flex justify-between items-center bg-white dark:bg-neutral-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div>
                            <h1 className="text-sm text-gray-500 dark:text-gray-200">
                                Created by: {ticket.user}
                            </h1>
                            <h3 className="text-sm mt-2 text-gray-500 dark:text-gray-200">
                                Assigned To:{" "}
                                {ticket.assignInfo?.assignedTechnicianName ||
                                    "no one"}
                            </h3>
                            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-300">
                                {ticket.subject}
                            </h2>
                        </div>
                        <div className="text-right space-y-2">
                            <div className="text-sm text-gray-500 dark:text-gray-200">
                                Priority: <span>{ticket.priority}</span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-200">
                                Department: <span>{ticket.department}</span>
                            </div>
                            <button
                                onClick={() => handleAssignClick(ticket)}
                                className="inline-block mt-2 text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Ata
                            </button>
                            <button
                                onClick={() => handleDeleteTicket(ticket._id!)}
                                className="inline-block mt-2 text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 ml-2"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-50 dark:bg-neutral-900 p-4 sm:p-8 transition-colors duration-300 flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Left: Users Table */}
            <div className="w-full lg:w-1/3 bg-white dark:bg-neutral-800 rounded-lg shadow p-3 sm:p-4 h-fit mb-4 lg:mb-0 overflow-x-auto">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-700 dark:text-blue-200">
                    Kullanıcılar
                </h2>
                {renderUsersTable()}
            </div>
            {/* Right: Tickets */}
            <div className="flex-1 w-full max-w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300 mb-6 sm:mb-8 text-center transition-colors duration-300">
                    Support Tickets
                </h1>
                {tickets.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-200">
                        No Tickets Yet
                    </p>
                ) : (
                    renderTicketsTable()
                )}
            </div>
            {/* Popup for user role change */}
            {showPopup && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Rol Değiştir</h2>
                        <select
                            value={newRole}
                            onChange={handleRoleChange}
                            className="w-full p-2 mb-4 border rounded"
                        >
                            <option value="user">User</option>
                            <option value="technician">Technician</option>
                            <option value="manager">Manager</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 rounded bg-gray-300"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Ticket Assign Popup */}
            {showAssignPopup && assignTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Teknisyen Ata</h2>
                        <select
                            value={assignUserId}
                            onChange={handleAssignUserChange}
                            className="w-full p-2 mb-4 border rounded"
                        >
                            <option value="">Teknisyen Seç</option>
                            {technicians.map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                    {tech.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleAssignSave}
                                className="px-4 py-2 rounded bg-blue-600 text-white"
                            >
                                Kaydet
                            </button>
                            <button
                                onClick={handleAssignClose}
                                className="px-4 py-2 rounded bg-gray-300"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Kullanıcı silme onay popup */}
            {deleteUserId && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Kullanıcıyı Sil</h2>
                        <p>Bu kullanıcıyı silmek istediğinize emin misiniz?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={confirmDeleteUser}
                                className="px-4 py-2 rounded bg-red-600 text-white"
                            >
                                Sil
                            </button>
                            <button
                                onClick={cancelDeleteUser}
                                className="px-4 py-2 rounded bg-gray-300"
                            >
                                Vazgeç
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Ticket silme onay popup */}
            {deleteTicketId && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Ticket Sil</h2>
                        <p>Bu ticketı silmek istediğinize emin misiniz?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={confirmDeleteTicket}
                                className="px-4 py-2 rounded bg-red-600 text-white"
                            >
                                Sil
                            </button>
                            <button
                                onClick={cancelDeleteTicket}
                                className="px-4 py-2 rounded bg-gray-300"
                            >
                                Vazgeç
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
