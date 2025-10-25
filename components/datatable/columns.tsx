"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { CasesInterface } from "@/controllers/interfaces"

export const columns: ColumnDef<CasesInterface>[] = [
    // Checkbox select
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    // Columns in requested order
    {
        accessorKey: "caseId",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0"
            >
                Case ID
                <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="w-[100px] truncate">{row.getValue("caseId")}</div>
        ),
    },
    {
        accessorKey: "rn",
        header: "RN",
    },
    {
        accessorKey: "mtt",
        header: "MTT",
    },
    {
        accessorKey: "primaryMedicalHome",
        header: "Primary MH",
    },
    {
        accessorKey: "coverageType",
        header: "Coverage",
    },
    {
        accessorKey: "vendorName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Facility
                <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="truncate max-w-[200px]">{row.getValue("vendorName")}</div>
        ),
    },
    {
        accessorKey: "admitDate",
        header: "Admit Date",
    },
    {
        accessorKey: "los",
        header: "LOS",
    },
    {
        accessorKey: "levelOfCare",
        header: "Level of Care",
    },
    {
        accessorKey: "reviewOutcome",
        header: "Review Outcome",
    },
    // Actions dropdown
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const caseItem = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(caseItem.caseId)}
                        >
                            Copy Case ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
