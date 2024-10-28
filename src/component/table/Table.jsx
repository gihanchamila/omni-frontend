import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Button from "../button/Button.jsx";

const Table = ({ data, columns, onSort, onAction }) => {
  return (
    <table className="table-auto w-full border-collapse border border-slate-400 rounded-lg lg:text-sm sm:text-xs">
      <thead className="sticky top-0 bg-gray-100 z-10 rounded-lg">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className="tableTh"
              onClick={() => onSort && onSort(column.key)}
            >
              {column.label}
            </th>
          ))}
          {onAction && <th className="tableTh">Action</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id} className="border border-slate-300 hover:bg-gray-50">
            {columns.map((column) => (
              <td key={column.key} className="tableTd">
                {column.key === "createdAt"
                  ? moment(item[column.key]).format("YYYY-MM-DD HH:mm:ss")
                  : item[column.key] || "Not updated"}
              </td>
            ))}
            {onAction && (
              <td className="border border-slate-300 px-2 lg:px-4 py-2 text-center">
                <Button
                  variant="error"
                  onClick={() => onAction(item._id)}
                >
                  Delete
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onSort: PropTypes.func,
  onAction: PropTypes.func,
};

export default Table;
