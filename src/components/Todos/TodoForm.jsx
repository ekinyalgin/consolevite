// components/Todo/TodoForm.jsx
import React, { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import tableClasses from '../../utils/tableClasses';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TodoForm = ({ selectedTodo, onSave, onCancel }) => {
  const [form, setForm] = useState({ title: '', note: '', date: null, links: [] });
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (selectedTodo) {
      setForm({
        id: selectedTodo.id,
        title: selectedTodo.title || '',
        note: selectedTodo.note || '',
        date: selectedTodo.date ? new Date(selectedTodo.date) : null,
      });
      setLinks(selectedTodo.links || []);
    } else {
      setForm({ title: '', note: '', date: null });
      setLinks([]);
    }
  }, [selectedTodo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddLink = () => {
    setLinks([...links, { url: '', icon: '' }]);
  };

  const handleRemoveLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const resetForm = () => {
    setForm({ title: '', note: '', date: null });
    setLinks([]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, links });
  };

  const handleDateChange = (date) => {
    if (date) {
      // Tarihi UTC'ye çevir
      const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
      setForm({ ...form, date: new Date(utcDate) });
    } else {
      setForm({ ...form, date: null });
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className={tableClasses.formContainer}>
      <div className="mb-4">
        <label className={tableClasses.formLabel}>Title</label>
        <input
          type="text"
          className={tableClasses.formInput}
          name="title"
          value={form.title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className={tableClasses.formLabel}>Note</label>
        <textarea
          className={tableClasses.formInput}
          name="note"
          value={form.note}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label className={tableClasses.formLabel}>Date</label>
        <DatePicker
          selected={form.date}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          className={tableClasses.formInput}
        />
      </div>

      {/* Linklerin eklenmesi */}
      <div className="mb-4">
        <button type="button" onClick={handleAddLink} className={tableClasses.addButton}>
          Add Link
        </button>
        {links.map((link, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              placeholder="URL"
              className={tableClasses.formInput}
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            />
            <input
              type="text"
              placeholder="Icon"
              className={tableClasses.formInput}
              value={link.icon}
              onChange={(e) => handleLinkChange(index, 'icon', e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleRemoveLink(index)}
              className={tableClasses.cancelButton}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="submit" className={tableClasses.formButton}>
        {selectedTodo ? 'Update Todo' : 'Add Todo'}
      </button>
      {selectedTodo && (
        <XCircle onClick={resetForm} className="cursor-pointer text-gray-600 hover:text-gray-800 ml-2" />
      )}
    </form>
  );
};

export default TodoForm;
