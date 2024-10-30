import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { FC, useMemo } from "react";

export type TableLoaderProps = {
  rows?: number;
  cols?: number;
  withHeader?: boolean;
};

export const TableLoader: FC<TableLoaderProps> = ({
  rows,
  cols,
  withHeader = false,
}) => {
  const nbrRows = useMemo(() => {
    return Array.from({ length: rows || 5 });
  }, [rows]);

  const nbrCols = useMemo(() => {
    return Array.from({ length: cols || 4 });
  }, [cols]);

  return (
    <TableBody className={cn("")}>
      {nbrRows.map((_item, i) => (
        <TableRow key={`item-${i}`}>
          <TableCell>
            <Skeleton className="h-3 w-[150px]" />
          </TableCell>
          {nbrCols.map((_item, j) => (
            <TableCell key={`row-col-${j}`}>
              <Skeleton className="h-3 w-[80px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};
