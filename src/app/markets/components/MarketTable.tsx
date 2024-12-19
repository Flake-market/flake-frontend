"use client"

import {useState, useEffect, useMemo} from "react"
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
import { ArrowDownWideNarrow, Search, Zap } from "lucide-react"
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

import { MarketService } from "@/services/marketService"
import { PairData } from "@/app/markets/types/MarketTypes"
import { formatLamports } from "@/lib/utils"

export const columns: ColumnDef<PairData>[] = [
  {
    id: "pairInfo",
    header: "PAIR",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Image
          src={row.original.tokenImage}
          alt="Token logo"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name} ({row.original.ticker}/SOL)</span>
          <a 
            href={`https://solscan.io/token/${row.original.pairId}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-lime-400 hover:underline"
          >
            {row.original.pairKey.slice(0, 10)}...
          </a>
        </div>
      </div>
    ),
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return (
        row.original.name.toLowerCase().includes(value.toLowerCase()) ||
        row.original.ticker.toLowerCase().includes(value.toLowerCase()) ||
        row.original.pairKey.toLowerCase().includes(value.toLowerCase())
      )
    },
  },
  {
    accessorKey: "marketCap",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left font-medium m-0 p-0 hover:bg-transparent hover:text-lime-400"
      >
        MARKET CAP
        <ArrowDownWideNarrow 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            column.getIsSorted() === "asc" ? "rotate-180" : 
            column.getIsSorted() === "desc" ? "" : "opacity-50"
          }`}
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col w-[140px]">
        <span>{formatLamports(row.original.marketCap).toPrecision(3)} SOL</span>
        <span className="text-sm text-muted-foreground">{Number(formatLamports(row.original.price).toPrecision(3))} SOL</span>
      </div>
    ),
  },
  {
    accessorKey: "liquidity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left font-medium m-0 p-0 hover:bg-transparent hover:text-lime-400"
      >
        LIQUIDITY
        <ArrowDownWideNarrow 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            column.getIsSorted() === "asc" ? "rotate-180" : 
            column.getIsSorted() === "desc" ? "" : "opacity-50"
          }`}
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="w-[140px] flex items-center gap-1">
        <Image src="/images/tokens/solana.svg" alt="SOL" width={16} height={16} />
        {formatLamports(row.original.liquidity).toPrecision(3)} SOL
      </div>
    ),
  },
  {
    accessorKey: "volume",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left font-medium m-0 p-0 hover:bg-transparent hover:text-lime-400"
      >
        VOLUME
        <ArrowDownWideNarrow 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            column.getIsSorted() === "asc" ? "rotate-180" : 
            column.getIsSorted() === "desc" ? "" : "opacity-50"
          }`}
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="w-[140px] flex items-center gap-1">
        <Image src="/images/tokens/solana.svg" alt="SOL" width={16} height={16} />
        {formatLamports(row.original.volume).toPrecision(3)} SOL
      </div>
    ),
  },
  {
    accessorKey: "transactions",
    header: ({  }) => (
      <div className="text-left font-medium">TXNS</div>
      
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1 w-[100px]">
        <span className="text-green-500">{row.original.buys.toLocaleString()}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-red-500">{row.original.sells.toLocaleString()}</span>
      </div>
    ),
  },
  {
    accessorKey: "created",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left font-medium m-0 p-0 hover:bg-transparent hover:text-lime-400"
      >
        CREATED
        <ArrowDownWideNarrow 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            column.getIsSorted() === "asc" ? "rotate-180" : 
            column.getIsSorted() === "desc" ? "" : "opacity-50"
          }`}
        />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <div className="w-[120px]">{date.toLocaleDateString()}</div>;
    },
  }
]

export function MarketTable() {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const marketService = useMemo(() => new MarketService(), [])
  const [data, setData] = useState<PairData[]>([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketData = await marketService.fetchMarketData();
        setData(marketData.pairs)
        console.log('Fetched market data:', marketData);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };
    fetchData();
  }, [marketService]);


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
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-[50%] h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={(table.getColumn("pairInfo")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("pairInfo")?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
      </div>
      <div className="rounded-md border-t border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                  onClick={() => router.push(`/pair/${row.original.pairKey}`)}
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

      {/* TODO: Determine if we need pagination or infinite scroll based on:
          - Expected number of markets (initial and growth)
          - Performance impact of loading large datasets
          - UX preference for market discovery
          Current implementation uses basic pagination, consider:
          - Infinite scroll for smoother browsing experience
          - Virtual scrolling for better performance with large datasets
          - Server-side pagination if dataset becomes too large
      */}
      <div className="flex items-center justify-end space-x-2 py-4">
        {table.getCanPreviousPage() && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
        )}
        {table.getCanNextPage() && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
