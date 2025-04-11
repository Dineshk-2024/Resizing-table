// ResizableTable.js
import React, { useState, useRef, useEffect } from "react";
import "./styles.css";

const initialColumns = [
  { id: 1, label: "Name", width: 200 },
  { id: 2, label: "Age", width: 100 },
  { id: 3, label: "Email", width: 300 }
];

const data = [
  { name: "Dinesh", age: 25, email: "dinesh@example.com" },
  { name: "Ganesh", age: 30, email: "Ganesh@example.com" },
  { name: "Charlie", age: 28, email: "charlie@example.com" }
];

const ResizableTable = () => {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("columnWidths");
    return saved ? JSON.parse(saved) : initialColumns;
  });

  const tableRef = useRef(null);
  const colRefs = useRef([]);
  const isResizing = useRef(false);
  const resizingColIndex = useRef(null);
  const startX = useRef(null);
  const startWidth = useRef(null);

  const handleMouseDown = (index, e) => {
    isResizing.current = true;
    resizingColIndex.current = index;
    startX.current = e.clientX;
    startWidth.current = columns[index].width;
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    const newWidth = startWidth.current + e.clientX - startX.current;
    setColumns((prev) => {
      const updated = [...prev];
      updated[resizingColIndex.current].width = newWidth > 50 ? newWidth : 50;
      return updated;
    });
  };

  const handleMouseUp = () => {
    if (isResizing.current) {
      localStorage.setItem("columnWidths", JSON.stringify(columns));
    }
    isResizing.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [columns]);

  return (
    <div className="table-container" ref={tableRef}>
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.id}
                style={{ width: col.width }}
                ref={(el) => (colRefs.current[index] = el)}
              >
                <div className="header-content">
                  {col.label}
                  <div
                    className="resizer"
                    onMouseDown={(e) => handleMouseDown(index, e)}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.name}</td>
              <td>{row.age}</td>
              <td>{row.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResizableTable;