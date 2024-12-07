"use client"

import * as React from "react"
import Image from "next/image"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { data } from "./Mockdata" // remove once we have actual data

// remove export once we have actual data
export type Market = {
  contractAddress: string
  tokenName: string
  tokenTicker: string
  pairToken: string
  marketCap: number
  price: number
  liquidity: number
  volume: number
  buys: number
  sells: number
  created: number
}

export const columns: ColumnDef<Market>[] = [
  {
    accessorKey: "pairInfo",
    header: "Pair Info",
    cell: ({ row }) => (
      <div className="flex flex-col w-[200px]">
        <span className="font-medium">{row.original.tokenName} ({row.original.tokenTicker})</span>
        <a 
          href={`https://solscan.io/token/${row.original.contractAddress}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-lime-400 hover:underline"
        >
          {row.original.contractAddress.slice(0, 10)}...
        </a>
      </div>
    ),
  },
  {
    accessorKey: "marketCap",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left font-medium m-0 p-0"
      >
        Market Cap
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>${row.original.marketCap.toLocaleString()}</span>
        <span className="text-sm text-muted-foreground">${row.original.price.toFixed(2)}</span>
      </div>
    ),
  },
  {
    accessorKey: "liquidity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left font-medium m-0 p-0"
      >
        Liquidity
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>${row.original.liquidity.toLocaleString()}</div>,
  },
  {
    accessorKey: "volume",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left font-medium m-0 p-0"
      >
        Volume
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>${row.original.volume.toLocaleString()}</div>,
  },
  {
    accessorKey: "transactions",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left font-medium m-0 p-0"
      >
        Txns
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <span className="text-green-500">{row.original.buys.toLocaleString()}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-red-500">{row.original.sells.toLocaleString()}</span>
      </div>
    ),
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.created * 1000);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
        // TODO: add contract call to buy 
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Image src="/images/tokens/solana.svg" alt="SOL" width={16} height={16} />
        1 SOL
      </Button>
    ),
  },
]

export function MarketTable() {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search markets..."
          value={(table.getColumn("pairInfo")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("pairInfo")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/pair/${row.original.contractAddress}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
