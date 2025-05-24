"use client";
import React, { useState } from "react";
import { TicketType } from "@/models/TicketModel";
import TicketItem from "@/components/TicketItem";
import { User } from "better-auth";

type exceededUserType = User & {
    role: "user" | "technician" | "manager";
};

export default function ManagerDashboardUI({
    tickets,
    users,
    technicians,
}: {
    tickets: TicketType[];
    users: exceededUserType[];
    technicians: exceededUserType[];
}) {
    const roles: exceededUserType["role"][] = ["user", "technician", "manager"];

    const [selectedUser, setSelectedUser] = useState<exceededUserType | null>(
        null
    );
    const [newRole, setNewRole] = useState<exceededUserType["role"]>("user");
    const [showPopup, setShowPopup] = useState(false);
    // Ticket assign popup state
    const [assignTicket, setAssignTicket] = useState<TicketType | null>(null);
    const [assignUserId, setAssignUserId] = useState<string>("");
    const [showAssignPopup, setShowAssignPopup] = useState(false);

    // Kullanıcı silme
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    const handleDeleteUser = (userId: string) => {
        setDeleteUserId(userId);
    };
    const confirmDeleteUser = () => {
        alert(`Kullanıcı silindi (Mock): ${deleteUserId}`);
        setDeleteUserId(null);
    };
    const cancelDeleteUser = () => {
        setDeleteUserId(null);
    };
    // Ticket silme
    const [deleteTicketId, setDeleteTicketId] = useState<string | null>(null);
    const handleDeleteTicket = (ticketId: string) => {
        setDeleteTicketId(ticketId);
    };
    const confirmDeleteTicket = () => {
        alert(`Ticket silindi (Mock): ${deleteTicketId}`);
        setDeleteTicketId(null);
    };
    const cancelDeleteTicket = () => {
        setDeleteTicketId(null);
    };

    const handleUserClick = (user: exceededUserType) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowPopup(true);
    };

    const handleClose = () => {
        setShowPopup(false);
        setSelectedUser(null);
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewRole(e.target.value as exceededUserType["role"]);
    };

    // Ticket assign popup handlers
    const handleAssignClick = (ticket: TicketType) => {
        setAssignTicket(ticket);
        setAssignUserId("");
        setShowAssignPopup(true);
    };
    const handleAssignUserChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setAssignUserId(e.target.value);
    };
    const handleAssignSave = () => {
        setShowAssignPopup(false);
        setAssignTicket(null);
        setAssignUserId("");
    };
    const handleAssignClose = () => {
        setShowAssignPopup(false);
        setAssignTicket(null);
        setAssignUserId("");
    };

    return (
        <div className="min-h-screen bg-blue-50 dark:bg-neutral-900 p-4 sm:p-8 transition-colors duration-300 flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Left: Users Table */}
            <div className="w-full lg:w-1/3 bg-white dark:bg-neutral-800 rounded-lg shadow p-3 sm:p-4 h-fit mb-4 lg:mb-0 overflow-x-auto">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-700 dark:text-blue-200">
                    Kullanıcılar
                </h2>
                <table className="w-full text-left text-sm sm:text-base min-w-[400px]">
                    <thead>
                        <tr className="border-b border-blue-100 dark:border-neutral-700">
                            <th className="py-2">Ad</th>
                            <th className="py-2">Email</th>
                            <th className="py-2">Rol</th>
                            <th className="py-2 text-center">Sil</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            // Ensure user has a role property for exceededUserType
                            const userWithRole = {
                                ...user,
                                role: (user as any).role ?? "user",
                            } as exceededUserType;
                            return (
                                <tr
                                    key={user.id}
                                    className="hover:bg-blue-100 dark:hover:bg-neutral-700 cursor-pointer group"
                                    onClick={() =>
                                        handleUserClick(userWithRole)
                                    }
                                >
                                    <td className="py-2 break-words max-w-[120px]">
                                        {user.name}
                                    </td>
                                    <td className="py-2 break-all max-w-[140px]">
                                        {user.email}
                                    </td>
                                    <td className="py-2 capitalize">
                                        {userWithRole.role}
                                    </td>
                                    <td className="py-2 text-center">
                                        <button
                                            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow transition text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteUser(user.id);
                                            }}
                                            title="Kullanıcıyı Sil"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Right: Tickets */}
            <div className="flex-1 w-full max-w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300 mb-6 sm:mb-8 text-center transition-colors duration-300">
                    Support Tickets
                </h1>
                {tickets.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-200 transition-colors duration-300">
                        No Tickets Yet
                    </p>
                ) : (
                    <div className="space-y-3 sm:space-y-4 max-w-full sm:max-w-3xl mx-auto">
                        {tickets.map((ticket: TicketType) => {
                            return (
                                <div
                                    key={ticket._id}
                                    className="relative bg-white dark:bg-neutral-800 rounded-lg shadow p-4 flex items-center justify-between gap-4 group"
                                >
                                    <div className="flex-1">
                                        <TicketItem ticket={ticket} />
                                        {/* Atanan admin gösterimi */}
                                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                                            Atanan:{" "}
                                            {ticket.assignInfo?.assignedTo
                                                ? `${ticket.assignInfo.assignedTechnicianName}`
                                                : "Atanmamış"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <button
                                            className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                                            onClick={() =>
                                                handleAssignClick(ticket)
                                            }
                                        >
                                            Ata
                                        </button>
                                        <button
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow transition text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                                            onClick={() =>
                                                handleDeleteTicket(ticket._id!)
                                            }
                                            title="Ticketı Sil"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Popup for user role change */}
            {showPopup && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 sm:p-8 min-w-[90vw] max-w-[95vw] sm:min-w-[320px] sm:max-w-[400px] w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
                            onClick={handleClose}
                        >
                            ×
                        </button>
                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-blue-700 dark:text-blue-200">
                            Yetki Değiştir
                        </h3>
                        <div className="mb-3 sm:mb-4">
                            <div className="font-semibold">
                                {selectedUser.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                                {selectedUser.email}
                            </div>
                        </div>
                        <label className="block mb-2 text-xs sm:text-sm font-medium">
                            Rol Seç
                        </label>
                        <select
                            className="w-full p-2 rounded border border-blue-200 dark:border-neutral-700 bg-blue-50 dark:bg-neutral-900"
                            value={newRole}
                            onChange={handleRoleChange}
                        >
                            {roles.map((role) => (
                                <option
                                    key={role}
                                    value={role}
                                    className="capitalize"
                                >
                                    {role}
                                </option>
                            ))}
                        </select>
                        <button
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                            onClick={handleClose}
                        >
                            Kaydet (Mock)
                        </button>
                    </div>
                </div>
            )}

            {/* Ticket Assign Popup */}
            {showAssignPopup && assignTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 sm:p-8 min-w-[90vw] max-w-[95vw] sm:min-w-[320px] sm:max-w-[400px] w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
                            onClick={handleAssignClose}
                        >
                            ×
                        </button>
                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-blue-700 dark:text-blue-200">
                            Ticket Ata
                        </h3>
                        <div className="mb-3 sm:mb-4">
                            <div className="font-semibold">
                                {assignTicket.subject}
                            </div>
                        </div>
                        <label className="block mb-2 text-xs sm:text-sm font-medium">
                            Kullanıcı Seç
                        </label>
                        <select
                            className="w-full p-2 rounded border border-blue-200 dark:border-neutral-700 bg-blue-50 dark:bg-neutral-900"
                            value={assignUserId}
                            onChange={handleAssignUserChange}
                        >
                            <option value="">Kullanıcı seçin</option>
                            {technicians.map((user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                    className="capitalize"
                                >
                                    {user.name} ({user.role})
                                </option>
                            ))}
                        </select>
                        <button
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                            onClick={handleAssignSave}
                            disabled={!assignUserId}
                        >
                            Kaydet (Mock)
                        </button>
                    </div>
                </div>
            )}

            {/* Kullanıcı silme onay popup */}
            {deleteUserId && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 sm:p-8 min-w-[90vw] max-w-[95vw] sm:min-w-[320px] sm:max-w-[400px] w-full relative flex flex-col items-center">
                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-red-700 dark:text-red-300">
                            Kullanıcıyı Sil
                        </h3>
                        <p className="mb-6 text-gray-700 dark:text-gray-200 text-xs sm:text-base">
                            Bu kullanıcıyı silmek istediğinize emin misiniz?
                        </p>
                        <div className="flex gap-2 sm:gap-4 w-full justify-center">
                            <button
                                className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs sm:text-base"
                                onClick={confirmDeleteUser}
                            >
                                Evet, Sil
                            </button>
                            <button
                                className="px-3 sm:px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-bold text-xs sm:text-base"
                                onClick={cancelDeleteUser}
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
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 sm:p-8 min-w-[90vw] max-w-[95vw] sm:min-w-[320px] sm:max-w-[400px] w-full relative flex flex-col items-center">
                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-red-700 dark:text-red-300">
                            Ticketı Sil
                        </h3>
                        <p className="mb-6 text-gray-700 dark:text-gray-200 text-xs sm:text-base">
                            Bu ticketı silmek istediğinize emin misiniz?
                        </p>
                        <div className="flex gap-2 sm:gap-4 w-full justify-center">
                            <button
                                className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs sm:text-base"
                                onClick={confirmDeleteTicket}
                            >
                                Evet, Sil
                            </button>
                            <button
                                className="px-3 sm:px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-bold text-xs sm:text-base"
                                onClick={cancelDeleteTicket}
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
