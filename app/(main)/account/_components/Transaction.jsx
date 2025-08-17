// 'use client'
// import { Badge } from '@/components/ui/badge'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
// import { categoryColors } from '@/data/categories'
// import { format } from 'date-fns'
// import { Clock } from 'lucide-react'
// import React from 'react'

// const TransactionTable = ({ transactions }) => {

//     const filteredAndSortedTransactions = transactions;

//     const handleSort = () => {

//     }

//     return (
//         <div className='space-y-4'>
//             {/* filters   */}

//             {/* transactions  */}



//             <div className='rouded-md border'>
//                 <Table>
//                     <TableHeader>
//                         <TableRow>


//                             <TableHead className="w-[50px]">
//                                 <Checkbox />
//                             </TableHead>



//                             <TableHead
//                                 onClick={() => handleSort("date")}
//                                 className="cursor-pointer">

//                                 <div className='flex items-center'>
//                                     Date
//                                 </div>
//                             </TableHead>


//                             <TableHead>Description</TableHead>


//                             <TableHead
//                                 onClick={() => handleSort("category")}
//                                 className="cursor-pointer">
//                                 <div className='flex items-center'>
//                                     Category
//                                 </div>
//                             </TableHead>


//                             <TableHead
//                                 onClick={() => handleSort("amount")}
//                                 className="cursor-pointer">
//                                 <div className='flex items-center'>
//                                     Amount
//                                 </div>
//                             </TableHead>

//                             <TableHead>Recurring</TableHead>

//                             <TableHead className='w-[50px]' />


//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>

//                         {filteredAndSortedTransactions.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan={7} className="text-center text-muted-foreground">
//                                     No transactions found.
//                                 </TableCell>
//                             </TableRow>
//                         )
//                             :
//                             (

//                                 filteredAndSortedTransactions.map((transaction) => (

//                                     <TableRow key={transaction.id}>
//                                         <TableCell>
//                                             <Checkbox />
//                                         </TableCell>
//                                         <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
//                                         <TableCell>{transaction.description}</TableCell>
//                                         <TableCell className='capitalize'>
//                                             <span style={{
//                                                 background: categoryColors[transaction.category],
//                                             }}
//                                                 className='px-2 py-1 rounded text-white text-sm'
//                                             >
//                                                 {transaction.category}
//                                             </span>
//                                         </TableCell>
//                                         <TableCell className="text-right font-medium"
//                                             style={{
//                                                 color: transaction.type === "EXPENSE" ? 'red' : 'green',

//                                             }}
//                                         >
//                                             {transaction.type === "EXPENSE" ? '-' : '+'}
//                                             {transaction.amount.toFixed(2)}
//                                         </TableCell>

//                                         <TableCell>{transaction.isRecurring ? (
//                                             <Tooltip>
//                                                 <TooltipTrigger> <Badge variant='outline' className='gap-1'>
//                                                     <Clock className='h-3 w-3' />
//                                                 </Badge></TooltipTrigger>
//                                                 <TooltipContent>
//                                                     <p>Add to library</p>
//                                                 </TooltipContent>
//                                             </Tooltip>
//                                         )
//                                             :
//                                             (
//                                                 <Badge variant='outline' className='gap-1'>
//                                                     <Clock className='h-3 w-3' /> One-Time
//                                                 </Badge>
//                                             )}</TableCell>

//                                     </TableRow>


//                                 ))
//                             )}
//                     </TableBody>
//                 </Table>
//             </div>

//         </div>
//     )
// }

// export default TransactionTable



'use client'
import { bulkDeleteTransactions } from '@/actions/accounts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { categoryColors } from '@/data/categories'
import useFetch from '@/hooks/use-fetch'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCcw, RefreshCw, Search, SearchIcon, Trash, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'

const TransactionTable = ({ transactions }) => {


    const [selectedIds, setSelectedIds] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        field: "date",
        direction: "desc",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");

    const {
        loading: deleteLoading,
        fn: deleteFn,
        data: deleted,
    } = useFetch(bulkDeleteTransactions)

    const RECURRING_INTERVALS = {
        DAILY: "Daily",
        WEEKLY: "Weekly",
        MONTHLY: "Monthly",
        YEARLY: "Yearly"
    };

    const handleSort = (field) => {
        setSortConfig((current) => ({
            field,
            direction: current.field == field && current.direction === "asc" ? "desc" : "asc"
        }));
    }

    const handleSelect = (id) => {
        setSelectedIds(current => current.includes(id) ? current.filter(item => item != id) : [...current, id]);
    };

    const handleSelectAll = () => {
        setSelectedIds(current => current.length === filteredAndSortedTransactions.length
            ? []
            : filteredAndSortedTransactions.map(t => t.id)

        );
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(
            `Are you sure you want to delete ${selectedIds.length} transactions?`
        )) {
            return;
        }
        deleteFn(selectedIds);
    };

    useEffect(() => {
        if (deleted && !deleteLoading) {
            toast.error("Transactions deleted successfully")
        }
    }, [deleted, deleteLoading]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setTypeFilter("");
        setRecurringFilter("");
        setSelectedIds("");
    };

    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions];

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((transaction) =>
                transaction.description?.toLowerCase().includes(searchLower)
            );
        };

        if (recurringFilter) {
            result = result.filter((transaction) => {
                if (recurringFilter === 'recurring') return transaction.isRecurring;
                return !transaction.isRecurring;
            });
        };

        if (typeFilter) {
            result = result.filter((transaction) => transaction.type === typeFilter);
        };

        result.sort((a, b) => {
            let comparison = 0;

            switch (sortConfig.field) {
                case "date":
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case "amount":
                    comparison = a.amount - b.amount;
                    break;
                case "category":
                    comparison = a.category.localeCompare(b.category);
                    break;

                default:
                    comparison = 0;
                    break;
            };

            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });

        return result;
    },
        [
            transactions,
            searchTerm,
            typeFilter,
            recurringFilter,
            sortConfig
        ]);

    const router = useRouter();

    return (
        <div className='space-y-4'>

            {deleteLoading && <BarLoader className='mt-4' width={"100%"} color='#9333ea' />}
            {/* filters */}

            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder="Search transactions..."
                        className='pl-8 '
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}

                    />
                </div>

                <div className='flex gap-2'>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className='cursor-pointer'>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={recurringFilter} onValueChange={(value) => setRecurringFilter(value)}>
                        <SelectTrigger className='w-[140px] cursor-pointer'>
                            <SelectValue placeholder="All Transactions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recurring">Recurring Only</SelectItem>
                            <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
                        </SelectContent>
                    </Select>

                    {selectedIds.length > 0 && (
                        <div>
                            <Button size='sm' onClick={handleBulkDelete} variant='destructive'>
                                <Trash className='h-4 w-4 mr-2' />
                                Deleted Selected ({selectedIds.length})
                            </Button>
                        </div>
                    )}

                    {(searchTerm || typeFilter || recurringFilter) && (
                        <Button variant={'outline'} size={'icon'} onClick={handleClearFilters} title="Clear Filters">
                            <X className='h-4 w-4 cursor-pointer' />
                        </Button>
                    )}

                </div>

            </div>

            {/* transactions */}

            <div className='rouded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox onCheckedChange={handleSelectAll} className='cursor-pointer' />
                            </TableHead>

                            <TableHead
                                onClick={() => handleSort("date")}
                                className="cursor-pointer"
                            >
                                <div className="flex items-center">
                                    Date
                                    {sortConfig.field === 'date' && (
                                        sortConfig.direction === 'asc' ? (
                                            <ChevronUp className="ml-1 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        )
                                    )}
                                </div>
                            </TableHead>

                            <TableHead>Description</TableHead>

                            <TableHead
                                onClick={() => handleSort("category")}
                                className="cursor-pointer"
                            >
                                <div className='flex items-center'>
                                    Category
                                    {sortConfig.field === 'category' && (
                                        sortConfig.direction === 'asc' ? (
                                            <ChevronUp className="ml-1 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        )
                                    )}
                                </div>
                            </TableHead>

                            <TableHead
                                onClick={() => handleSort("amount")}
                                className="cursor-pointer"
                            >
                                <div className='flex items-center'>
                                    Amount
                                    {sortConfig.field === 'amount' && (
                                        sortConfig.direction === 'asc' ? (
                                            <ChevronUp className="ml-1 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        )
                                    )}
                                </div>
                            </TableHead>

                            <TableHead>Recurring</TableHead>
                            <TableHead className='w-[50px]' />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredAndSortedTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <Checkbox
                                            onCheckedChange={() => handleSelect(transaction.id)}
                                            checked={selectedIds.includes(transaction.id)}
                                            className='cursor-pointer' />
                                    </TableCell>

                                    <TableCell>
                                        {format(new Date(transaction.date), 'PP')}
                                    </TableCell>

                                    <TableCell>{transaction.description}</TableCell>

                                    <TableCell className='capitalize'>
                                        <span
                                            style={{
                                                background: categoryColors[transaction.category],
                                            }}
                                            className='px-2 py-1 rounded text-white text-sm'
                                        >
                                            {transaction.category}
                                        </span>
                                    </TableCell>

                                    <TableCell
                                        className="text-right font-medium"
                                        style={{
                                            color: transaction.type === "EXPENSE" ? 'red' : 'green',
                                        }}
                                    >
                                        {transaction.type === "EXPENSE" ? '-' : '+'}
                                        {transaction.amount.toFixed(2)}
                                    </TableCell>

                                    <TableCell>
                                        {transaction.isRecurring ? (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Badge variant='outline' className='gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200'>
                                                        <RefreshCw className='h-3 w-3' />
                                                        {RECURRING_INTERVALS[transaction.recurringInterval]}
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className='text-sm'>
                                                        <div className='font-medium'>Next Date : </div>
                                                        <div>{format(new Date(transaction.nextRecurringDate), "PP")}</div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Badge variant='outline' className='gap-1'>
                                                <Clock className='h-3 w-3' /> One-Time
                                            </Badge>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                                    <MoreHorizontal className='h-4 w-4' />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onClick={() => router.push(
                                                        `/transaction/create?edit=${transaction.id}`
                                                    )}
                                                >Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className='text-destructive'
                                                onClick={() => deleteFn([transaction.id])}
                                                >Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default TransactionTable



