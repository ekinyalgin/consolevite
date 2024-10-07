// components/Todos/TodoList.jsx
import React, { useState } from 'react';
import TableComponent from '../common/TableComponent';
import { Edit, Trash2, CheckCircle, XCircle, Check, Plus, NotebookPen, ExternalLink, ArrowRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateForDisplay } from './dateUtils';
import { Link } from 'react-router-dom';

const TodoList = ({ todos, onEdit, onDelete, onToggleDone, onDateChange, notReviewedUrls, sites }) => {
    const [expandedRows, setExpandedRows] = useState([]);
    const [editingDate, setEditingDate] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]); // Yeni state

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

    const handleDelete = (id, title) => {
        if (window.confirm(`"${title}" görevini silmek istediğinizden emin misiniz?`)) {
            onDelete(id);
        }
    };

    const columns = [
        {
            key: 'done',
            label: 'Done',
            className: 'w-1/12 text-center',
            render: (_, item) => (
                <button className="flex w-full" onClick={() => onToggleDone(item.id, item.date)}>
                    <Check className={`mx-auto w-5 h-5 ${item.done ? 'text-green-500' : 'text-green-500 hover:text-green-700 transition'}`} strokeWidth={3} />
                </button>
            ),
        },
        { key: 'title', label: 'Title', className: 'w-4/12', render: (value) => <span className="font-semibold">{value}</span> },
        {
            key: 'note',
            label: 'Note',
            className: 'w-1/12 text-center ',
            render: (value, item) => (
                value && (
                    <button className="flex w-full" onClick={() => toggleNote(item.id)}>
                        <NotebookPen className="mx-auto w-4 h-4 text-gray-500" strokeWidth={2} />
                    </button>
                )
            ),
        },
        {
            key: 'date',
            label: 'Date',
            className: 'w-1/12',
            render: (value, item) => (
                editingDate === item.id ? (
                    <DatePicker
                        selected={value ? new Date(value) : null}
                        onChange={(date) => {
                            onDateChange(item.id, date);
                            setEditingDate(null);
                        }}
                        dateFormat="dd.MM.yyyy"
                        className="text-xs text-center bg-transparent"
                        onClickOutside={() => setEditingDate(null)}
                    />
                ) : (
                    <span className="text-xs" onClick={() => handleDateClick(item.id)}>
                        {formatDateForDisplay(value)}
                    </span>
                )
            ),
        },
        {
            key: 'links',
            label: 'Links',
            className: 'w-2/12',
            render: (links) => (
                <div className="flex items-center space-x-2">
                    {Array.isArray(links) && links.map((link, index) => (
                        <a 
                            key={index} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            dangerouslySetInnerHTML={{ __html: link.icon }}
                        />
                    ))}
                </div>
            ),
        },
        {
            key: 'blog',
            label: 'Blog',
            className: 'w-2/12',
            render: (_, item) => (
                <div className="flex items-center space-x-2">
                    {getDomainsWithNotReviewed(item.title).map((domain, index) => (
                        <Link key={index} to={`/url-review/${domain}`} className="text-black flex items-center justify-center">
                            <ArrowRight className="text-gray-600 hover:text-green-800 w-4" strokeWidth={2} />
                        </Link>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <TableComponent
            columns={columns}
            data={todos}
            keyField="id"
            onEdit={onEdit}
            onDelete={(id) => handleDelete(id, todos.find(todo => todo.id === id)?.title)}
            expandedRows={expandedRows}
            expandedContent={(item) => item.note}
            selectable={false}
            selectedItems={selectedItems}
            onSelectChange={setSelectedItems}
        />
    );
};

export default TodoList;