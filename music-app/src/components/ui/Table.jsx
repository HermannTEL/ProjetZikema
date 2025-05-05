import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";
import { Button } from "./Button";
import { useTheme } from "../../utils/hooks";

const Table = React.forwardRef(({ 
  className, 
  data, 
  columns, 
  pageSize = 10, 
  enablePagination = true,
  searchQuery = '',
  searchKeys = [],
  handleRowClick
}, ref) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtrage des données basé sur la recherche
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter(row => 
      searchKeys.some(key => 
        row[key] && 
        row[key].toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery, searchKeys]);

  // Tri des données
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = enablePagination 
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize) 
    : sortedData;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const totalResultats = filteredData.length;

  // Réinitialiser la page courante si les données filtrées changent
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, data]);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <table className={cn(
        "w-full border-collapse",
        theme === "dark" ? "text-gray-200" : "text-gray-900"
      )}>
        <TableHeader theme={theme}>
          <tr>
            {columns.map(column => (
              <TableHead 
                key={column.key} 
                onClick={() => handleSort(column.key)}
                className={cn(
                  "cursor-pointer",
                  theme === "dark" 
                    ? "hover:bg-gray-700" 
                    : "hover:bg-gray-200"
                )}
              >
                {column.title}
                {sortConfig.key === column.key && 
                  (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </TableHead>
            ))}
          </tr>
        </TableHeader>
        <TableBody theme={theme}>
          {paginatedData.map((row, index) => (
            <TableRow 
              key={index} 
              onClick={() => handleRowClick && handleRowClick(row)}
              theme={theme}
            >
              {columns.map(column => (
                <TableCell key={column.key} theme={theme}>
                  {row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>
      {enablePagination && (
        <div className="flex justify-between items-center mt-4">
          <div className={cn(
            "text-sm",
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          )}>
            {totalResultats} résultat(s) trouvé(s)
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant={theme === "dark" ? "outline" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={cn(
                "px-4 py-2 rounded",
                theme === "dark" 
                  ? "bg-gray-700 text-gray-200 border-gray-600 disabled:opacity-50" 
                  : "bg-gray-200 text-gray-900 disabled:opacity-50"
              )}
            >
              Précédent
            </Button>
            <span className={theme === "dark" ? "text-sm text-gray-300" : "text-sm"}>
              Page {currentPage} sur {Math.max(1, Math.ceil(sortedData.length / pageSize))}
            </span>
            <Button 
              variant={theme === "dark" ? "outline" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(prev => 
                paginatedData.length === pageSize ? prev + 1 : prev
              )}
              disabled={paginatedData.length < pageSize}
              className={cn(
                "px-4 py-2 rounded",
                theme === "dark" 
                  ? "bg-gray-700 text-gray-200 border-gray-600 disabled:opacity-50" 
                  : "bg-gray-200 text-gray-900 disabled:opacity-50"
              )}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
      {paginatedData.length === 0 && (
        <div className={cn(
          "text-center py-4",
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        )}>
          Aucun résultat ne correspond à votre recherche.
        </div>
      )}
    </div>
  );
});

Table.displayName = "Table";
Table.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })).isRequired,
  pageSize: PropTypes.number,
  onRowClick: PropTypes.func,
  enablePagination: PropTypes.bool,
  searchQuery: PropTypes.string,
  searchKeys: PropTypes.arrayOf(PropTypes.string),
  handleRowClick: PropTypes.func
};

const TableHeader = React.forwardRef(({ className, theme, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      theme === "dark" ? "bg-gray-800" : "bg-gray-100", 
      className
    )} 
    {...props} 
  />
));

TableHeader.displayName = "TableHeader";
TableHeader.propTypes = { 
  className: PropTypes.string,
  theme: PropTypes.string
};

const TableBody = React.forwardRef(({ className, theme, ...props }, ref) => (
  <tbody 
    ref={ref} 
    className={cn(
      theme === "dark" ? "divide-y divide-gray-700" : "divide-y", 
      className
    )} 
    {...props} 
  />
));

TableBody.displayName = "TableBody";
TableBody.propTypes = { 
  className: PropTypes.string,
  theme: PropTypes.string
};

const TableRow = React.forwardRef(({ className, theme, ...props }, ref) => (
  <tr 
    ref={ref} 
    className={cn(
      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100", 
      className
    )} 
    {...props} 
  />
));

TableRow.displayName = "TableRow";
TableRow.propTypes = { 
  className: PropTypes.string,
  theme: PropTypes.string
};

const TableHead = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  
  return (
    <th 
      ref={ref} 
      className={cn(
        "p-3 text-left text-sm font-medium",
        theme === "dark" ? "text-gray-300" : "text-gray-700",
        className
      )} 
      {...props} 
    />
  );
});

TableHead.displayName = "TableHead";
TableHead.propTypes = { 
  className: PropTypes.string 
};

const TableCell = React.forwardRef(({ className, theme, ...props }, ref) => (
  <td 
    ref={ref} 
    className={cn(
      "p-3 text-sm",
      theme === "dark" ? "text-gray-300" : "text-gray-700",
      className
    )} 
    {...props} 
  />
));

TableCell.displayName = "TableCell";
TableCell.propTypes = { 
  className: PropTypes.string,
  theme: PropTypes.string
};

export { Table, TableHeader, TableBody, TableRow, TableCell, TableHead };