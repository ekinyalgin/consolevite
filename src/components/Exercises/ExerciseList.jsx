// components/Exercises/ExerciseList.jsx
import React, { useState } from 'react';
import { Edit, Trash2, NotebookPen } from 'lucide-react';
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
      <thead className={tableClasses.tableHeader}>
        <tr>
          <th className={tableClasses.tableHeader + " w-1/12"}>Select</th>
          <th className={tableClasses.tableHeader + " w-5/12"}>Title</th>
          <th className={tableClasses.tableHeader + " w-2/12"}>Duration</th>
          <th className={tableClasses.tableHeader + " w-1/12"}>Desc</th>
          <th className={tableClasses.tableHeader + " w-3/12"}>Actions</th>
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
              <td className={tableClasses.tableTitle}>{truncateTitle(exercise.title)}</td>
              <td className={tableClasses.tableCell}>{exercise.duration}</td>
              <td className={tableClasses.tableCell}>
                {exercise.description && (




                  <button onClick={() => toggleDescription(exercise.id)} className={tableClasses.iconButton}>
                    <NotebookPen className={tableClasses.noteIcon} 
                                            strokeWidth={2}
                                        />
                  </button>
                )}
              </td>
              <td className={tableClasses.tableCell}>
              <div className="flex items-center justify-center space-x-2 h-full">
                <button onClick={() => onEdit(exercise)}>
                <Edit className={tableClasses.editIcon} strokeWidth={2}  />
                </button>
                <button onClick={() => onDelete(exercise.id)}>
                <Trash2 className={tableClasses.deleteIcon} strokeWidth={2}  />
                </button>
                 </div>
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
