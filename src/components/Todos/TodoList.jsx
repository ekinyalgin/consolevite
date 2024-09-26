// components/Todos/TodoList.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Check, Plus, NotebookPen, ExternalLink, ArrowRight } from 'lucide-react';
import tableClasses from '../../utils/tableClasses';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateForDisplay } from './dateUtils';
import { Link } from 'react-router-dom';

const TodoList = ({ todos, onEdit, onDelete, onToggleDone, onDateChange, notReviewedUrls, sites }) => {
    const [expandedRows, setExpandedRows] = useState([]);
    const [editingDate, setEditingDate] = useState(null);
    const datePickerRefs = useRef({});

    useEffect(() => {
        if (editingDate && datePickerRefs.current[editingDate]) {
            datePickerRefs.current[editingDate].setOpen(true);
        }
    }, [editingDate]);

    const getDomainsWithNotReviewed = (todoTitle) => {
        return sites
            .filter(site => site.category === todoTitle && site.not_reviewed_pages > 0)
            .map(site => site.domain_name);
    };

    const toggleNote = (id) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleDateClick = (id) => {
        setEditingDate(id);
    };

    const getRandomDomains = (category) => {
        const filteredUrls = notReviewedUrls.filter(url => url.category === category);
        const randomUrls = filteredUrls.sort(() => 0.5 - Math.random()).slice(0, 5);
        return randomUrls.map(url => url.domain_name);
    };

    const handleDelete = (id, title) => {
        if (window.confirm(`"${title}" görevini silmek istediğinizden emin misiniz?`)) {
            onDelete(id);
        }
    };

    return (
        <div className="overflow-x-auto w-full">
        <table className={tableClasses.table}>
            <thead className={tableClasses.tableHeader}>
                <tr>
                    <th className={tableClasses.tableHeader + " w-1/12"}>Done</th>
                    <th className={tableClasses.tableHeader + " w-3/12 text-left px-2"}>Title</th>
                    <th className={tableClasses.tableHeader + " w-1/12"}>Note</th>
                    <th className={tableClasses.tableHeader + " w-2/12"}>Date</th>
                    <th className={tableClasses.tableHeader + " w-1/12 text-left px-2"}>Links</th>
                    <th className={tableClasses.tableHeader + " w-2/12 text-left px-2"}>Blog</th>
                    <th className={tableClasses.tableHeader + " w-2/12"}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {todos.map((todo) => (
                    <React.Fragment key={todo.id}>
                        <tr className={tableClasses.tableRow}>
                            <td className={tableClasses.tableCell + " text-center"}>
                                <button onClick={() => onToggleDone(todo.id, todo.date)}>
                                <Check className={tableClasses.checkIcon} strokeWidth={3} />

                                </button>
                            </td>
                            <td className={tableClasses.tableTitle}>{todo.title}</td>
                            <td className={tableClasses.tableCell}>
                                {todo.note && (
                                    <button onClick={() => toggleNote(todo.id)} className={tableClasses.iconButton}>
                                        <NotebookPen className={tableClasses.noteIcon} strokeWidth={2} />
                                    </button>
                                )}
                            </td>
                            <td
                                className={tableClasses.tableCell + " text-xs"}
                                onClick={() => handleDateClick(todo.id)}
                            >
                                {editingDate === todo.id ? (
                                    <DatePicker
                                        selected={todo.date ? new Date(todo.date) : null}
                                        onChange={(date) => {
                                            onDateChange(todo.id, date);
                                            setEditingDate(null);
                                        }}
                                        dateFormat="dd.MM.yyyy"
                                        className="text-center bg-transparent"
                                        ref={(el) => datePickerRefs.current[todo.id] = el}
                                        onClickOutside={() => setEditingDate(null)}
                                    />
                                ) : (
                                    formatDateForDisplay(todo.date)
                                )}
                            </td>
                            <td className={tableClasses.tableCell}>
                                <div className="flex items-center space-x-2">
                                    
                                {Array.isArray(todo.links) && todo.links.map((link, index) => (
                                    
    <a 
      key={index} 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer"
      dangerouslySetInnerHTML={{ __html: link.icon }}
    />
  ))}

                                </div>
                            </td>

                            <td className={tableClasses.tableCell}>
                                <div className="flex items-center space-x-2">
                                    {getDomainsWithNotReviewed(todo.title).map((domain, index) => (
                                        <Link key={index} to={`/url-review/${domain}`} className="text-black flex items-center justify-center">
                                            <ArrowRight className="text-gray-600 hover:text-green-800 w-4" strokeWidth={2} />
                                        </Link>
                                    ))}
                                </div>
                            </td>

                            <td className={tableClasses.tableCell}>
                                <div className="flex items-center justify-center space-x-2 h-full">
                                    <button onClick={() => onEdit(todo)} className={tableClasses.iconButton}>
                                        <Edit className={tableClasses.editIcon} strokeWidth={2} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(todo.id, todo.title)} 
                                        className={tableClasses.iconButton}
                                        title="Görevi sil"
                                    >
                                        <Trash2 className={tableClasses.deleteIcon} strokeWidth={2} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        {expandedRows.includes(todo.id) && (
                            <tr>
                                <td colSpan="7" className={tableClasses.tableCellExpanded}>
                                    {todo.note}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
        </div>
    );
};

export default TodoList;
