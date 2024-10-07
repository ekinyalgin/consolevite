import React, { useState } from 'react';
import TableComponent from '../common/TableComponent';
import { StickyNote  } from 'lucide-react';

const ExerciseList = ({ exercises, selectedIds, setSelectedIds, onEdit, onDelete, showOnlySelected }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleDescription = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredExercises = showOnlySelected 
    ? exercises.filter(exercise => selectedIds.includes(exercise.id))
    : exercises;

  const columns = [
    { 
      key: 'title', 
      label: 'Title',
      render: (value) => (
        <span className="font-semibold text-sm">{value.length > 40 ? `${value.substring(0, 40)}...` : value}</span>
      ),
    },
    { key: 'duration', label: 'Duration', 
      render: (value, item) => (
        <div className="text-center text-xs">
          {value}
        </div>
      ),
    },
    { 
      key: 'description', 
      label: 'Description', 
      render: (value, item) => (
        value && (
          <button onClick={() => toggleDescription(item.id)} className="flex justify-center w-full">
            <StickyNote  className="w-4 h-4 text-gray-500 hover:text-gray-700 text-center" />
          </button>
        )
      )
    },
  ];

  return (
    <TableComponent
      columns={columns}
      data={filteredExercises}
      keyField="id"
      onEdit={onEdit}
      onDelete={onDelete}
      selectable={true}
      selectedItems={selectedIds}
      onSelectChange={setSelectedIds}
      expandedRows={expandedRows}
      expandedContent={(item) => item.description}
    />
  );
};

export default ExerciseList;
