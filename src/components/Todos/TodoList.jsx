// components/Todo/TodoList.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Plus, ExternalLink, ArrowRight } from 'lucide-react';
import tableClasses from '../../utils/tableClasses';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateForDisplay } from './dateUtils';

const TodoList = ({ todos, onEdit, onDelete, onToggleDone, onDateChange, categories, notReviewedUrls }) => {
        const [expandedRows, setExpandedRows] = useState([]);
        const [editingDate, setEditingDate] = useState(null);
        const datePickerRefs = useRef({});

        useEffect(() => {
            if (editingDate && datePickerRefs.current[editingDate]) {
                datePickerRefs.current[editingDate].setOpen(true);
            }
        }, [editingDate]);

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

        return (
            <table className={tableClasses.table}>
                <thead>
                    <tr className={tableClasses.tableHeaderRow}>
                        <th className={tableClasses.tableHeaderCell}>Done</th>
                        <th className={tableClasses.tableHeaderCell}>Title</th>
                        <th className={tableClasses.tableHeaderCell}>Note</th>
                        <th className={tableClasses.tableHeaderCell}>Date</th>
                        <th className={tableClasses.tableHeaderCell}>Links</th>
                        <th className={tableClasses.tableHeaderCell}>Blog</th>
                        <th className={tableClasses.tableHeaderCell}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo) => (
                        <React.Fragment key={todo.id}>
                            <tr className={tableClasses.tableRow}>
                                <td className={tableClasses.tableCell}>
                                    <button onClick={() => onToggleDone(todo.id, todo.date)}>
                                        {todo.done ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                                    </button>
                                </td>
                                <td className={tableClasses.tableCell}>{todo.title}</td>
                                <td className={tableClasses.tableCell}>
                                    {todo.note && (
                                        <button onClick={() => toggleNote(todo.id)} className={tableClasses.iconButton}>
                                            <Plus />
                                        </button>
                                    )}
                                </td>
                                <td
                                    className={tableClasses.tableCell}
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
                                            className={tableClasses.formInput}
                                            ref={(el) => datePickerRefs.current[todo.id] = el}
                                            onClickOutside={() => setEditingDate(null)}
                                        />
                                    ) : (
                                        formatDateForDisplay(todo.date)
                                    )}
                                </td>
                                <td className={tableClasses.tableCell}>
                                    {todo.links && todo.links.map((link, index) => (
                                        <a 
                                            key={index} 
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="mr-2"
                                            dangerouslySetInnerHTML={{ __html: link.icon }}
                                        />
                                    ))}
                                </td>
                                <td className={tableClasses.tableCell}>
                                {categories.some(category => category.name === todo.title) && (
								<ArrowRight className="text-blue-500" />
							)}
                                </td>
                                
							
						
                                <td className={tableClasses.tableCell}>
                                    <button onClick={() => onEdit(todo)} className={tableClasses.iconButton}>
                                        <Edit />
                                    </button>
                                    <button onClick={() => onDelete(todo.id)} className={tableClasses.iconButton}>
                                        <Trash2 />
                                    </button>
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
        );
};

export default TodoList;
