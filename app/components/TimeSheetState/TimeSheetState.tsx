import React from "react";

export default function TimeSheetState({ sheet_state }: { sheet_state: string }) {
    let badgeClasses = 'px-2 py-1 inline-block rounded-full ';

    if (sheet_state === 'pending') {
        badgeClasses += 'bg-yellow-300 text-white';
    } else if (sheet_state === 'approved') {
        badgeClasses += 'bg-green-300 text-white';
    } else if (sheet_state === 'declined') {
        badgeClasses += 'bg-red-300 text-white';
    }

    return (
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={badgeClasses}>
                {sheet_state}
            </span>
        </td>
    );
}
