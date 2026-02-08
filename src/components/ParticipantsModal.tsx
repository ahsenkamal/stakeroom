"use client";
import { useState, useEffect } from "react";
import { Participant } from "../types";
import { resolveEnsName, truncateAddress } from "../utils/ens";

interface Props {
    participants: Participant[];
    eventTitle: string;
    onClose: () => void;
}

interface ParticipantWithEns extends Participant {
    ensName: string | null;
    isLoading: boolean;
}

export default function ParticipantsModal({ participants, eventTitle, onClose }: Props) {
    const [participantsWithEns, setParticipantsWithEns] = useState<ParticipantWithEns[]>(
        participants.map(p => ({ ...p, ensName: null, isLoading: true }))
    );

    useEffect(() => {
        const resolveNames = async () => {
            const resolved = await Promise.all(
                participants.map(async (p) => {
                    const ensName = await resolveEnsName(p.user_address);
                    return { ...p, ensName, isLoading: false };
                })
            );
            setParticipantsWithEns(resolved);
        };

        resolveNames();
    }, [participants]);

    const getSideColor = (side: string | null) => {
        switch (side) {
            case 'YES': return 'text-green-400 bg-green-500/20';
            case 'NO': return 'text-red-400 bg-red-500/20';
            case 'STAKE': return 'text-purple-400 bg-purple-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-6 rounded-3xl relative max-h-[80vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-white mb-1">Participants</h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-1">{eventTitle}</p>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {participantsWithEns.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No participants yet
                        </div>
                    ) : (
                        participantsWithEns.map((participant) => (
                            <div
                                key={participant.id}
                                className="bg-black/40 border border-gray-800 rounded-xl p-4 flex items-center justify-between"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        {participant.isLoading ? (
                                            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                                        ) : (
                                            <span className="text-white font-mono text-sm truncate">
                                                {participant.ensName || truncateAddress(participant.user_address)}
                                            </span>
                                        )}
                                        {participant.ensName && (
                                            <span className="text-gray-500 text-xs font-mono">
                                                ({truncateAddress(participant.user_address)})
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-gray-400 text-xs mt-1">
                                        {participant.amount} ETH
                                    </div>
                                </div>

                                {participant.side && (
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${getSideColor(participant.side)}`}>
                                        {participant.side}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
