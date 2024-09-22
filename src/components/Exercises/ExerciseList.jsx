// components/Exercises/ExerciseList.jsx
import React, { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import tableClasses from '../../utils/tableClasses';

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

  const truncateTitle = (title, maxLength = 50) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <table className={tableClasses.table}>
      <thead>
        <tr className={tableClasses.tableHeaderRow}>
          <th className={tableClasses.tableHeaderCell}>Select</th>
          <th className={tableClasses.tableHeaderCell}>Title</th>
          <th className={tableClasses.tableHeaderCell}>Duration</th>
          <th className={tableClasses.tableHeaderCell}>Description</th>
          <th className={tableClasses.tableHeaderCell}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredExercises.map((exercise) => (
          <React.Fragment key={exercise.id}>
            <tr className={tableClasses.tableRow}>
              <td className={tableClasses.tableCell}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(exercise.id)}
                  onChange={() => handleCheckboxChange(exercise.id)}
                />
              </td>
              <td className={tableClasses.tableCell}>{truncateTitle(exercise.title)}</td>
              <td className={tableClasses.tableCell}>{exercise.duration}</td>
              <td className={tableClasses.tableCell}>
                {exercise.description && (
                  <button onClick={() => toggleDescription(exercise.id)} className={tableClasses.iconButton}>
                    <Plus />
                  </button>
                )}
              </td>
              <td className={tableClasses.tableCell}>
                <button onClick={() => onEdit(exercise)} className={tableClasses.iconButton}>
                  <Edit />
                </button>
                <button onClick={() => onDelete(exercise.id)} className={tableClasses.iconButton}>
                  <Trash2 />
                </button>
              </td>
            </tr>
            {expandedRows.includes(exercise.id) && (
              <tr>
                <td colSpan="5" className={tableClasses.tableCellExpanded}>
                  {exercise.description}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default ExerciseList;
