import React from 'react';
import { Edit, X } from 'lucide-react';

const TableComponent = ({
  columns,
  data,
  keyField = 'id',
  onEdit,
  onDelete,
  selectable = false,
  selectedItems = [],
  onSelectChange,
  expandedRows = [],
  expandedContent = null,
}) => {
  // Seçim checkbox'ı değişikliklerini yönetir
  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      onSelectChange(selectedItems.filter((selectedId) => selectedId !== id));
    } else {
      onSelectChange([...selectedItems, id]);
    }
  };

  return (
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded overflow-hidden">
        <thead className='bg-gray-100	text-black uppercase tracking-wide'>
        <tr className='font-normal text-xs h-10 '>
        {selectable && (
              <th className="px-4 w-1/12 pt-2"> 
              <input
                type="checkbox"
                checked={selectedItems.length === data.length}
                onChange={() =>
                  selectedItems.length === data.length
                    ? onSelectChange([])
                    : onSelectChange(data.map((item) => item[keyField]))
                }
              />
            </th>
          )}
          <th className="px-4 font-normal w-1/12">Edit</th>
          {columns.map((column) => (
           <th key={column.key} className={`px-4 font-normal text-left ${column.className || ''}`}>
              {column.label}
            </th>
          ))}
          <th className="px-4 font-normal w-1/1">Delete</th>
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-100'>

        {data.map((item) => (
          <React.Fragment key={item[keyField]}>
            <tr className="hover:bg-gray-50 h-10 text-sm">
              {selectable && (
                <td className="px-4 items-center text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item[keyField])}
                    onChange={() => handleCheckboxChange(item[keyField])}
                  />
                </td>
              )}
               <td className="flex px-4 pt-2 items-center justify-center w-full">
                  <button onClick={() => onEdit(item)}>
                    <Edit strokeWidth="2.2" className="text-gray-300 hover:text-black transition w-4" />
                  </button>
                  </td>
              {columns.map((column) => (
                <td key={column.key} className="text-sm px-4">
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </td>
              ))}
             
              <td className="text-center items-center">
                  <button className="flex justify-center w-full" onClick={() => onDelete(item[keyField])}>
                    <X strokeWidth="3" className="w-4 h-4 mx-auto text-gray-300 hover:text-red-500" />
                  </button>
              </td>
              
            </tr>
            {expandedRows.includes(item[keyField]) && expandedContent && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4">
                  {expandedContent(item)}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
