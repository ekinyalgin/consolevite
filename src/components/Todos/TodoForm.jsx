import React, { useEffect, useState } from 'react';
import { XCircle, FileText, Plus, Link } from 'lucide-react';
import tableClasses from '../../utils/tableClasses';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TodoForm = ({ selectedTodo, onSave, onCancel }) => {
  const [form, setForm] = useState({ title: '', note: '', date: null, links: [] });
  const [links, setLinks] = useState([]);
  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    if (selectedTodo) {
      setForm({
        id: selectedTodo.id,
        title: selectedTodo.title || '',
        note: selectedTodo.note || '',
        date: selectedTodo.date ? new Date(selectedTodo.date) : null,
      });
      setLinks(Array.isArray(selectedTodo.links) ? selectedTodo.links : []); // Eğer `selectedTodo.links` array değilse, boş dizi olarak ayarla
      setShowNote(!!selectedTodo.note);
    } else {
      resetForm();
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
    setShowNote(false);
    onCancel(); // Bu satırı ekledik
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, links });
  };

  const handleDateChange = (date) => {
    if (date) {
      const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
      setForm({ ...form, date: new Date(utcDate) });
    } else {
      setForm({ ...form, date: null });
    }
  };

  const toggleNote = () => setShowNote(!showNote);

  return (
    <form onSubmit={handleFormSubmit} className={tableClasses.formContainer + " space-y-4"}>
      <input
        type="text"
        className={`${tableClasses.formInput} w-full`}
        name="title"
        value={form.title}
        onChange={handleInputChange}
        placeholder="Title"
        required
      />
      <DatePicker
        selected={form.date}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        className={`${tableClasses.formInput} w-full mr-10`}
        placeholderText="Date"
      />
      <div className='flex items-center justify-center space-x-2'>
        <button
          type="button"
          onClick={handleAddLink}
          className="hover:bg-gray-300 font-semibold text-sm px-4 py-2 rounded transition bg-gray-200 shadow-sm text-black w-1/2 flex items-center justify-center"
        >
          <Link className="w-4 h-5" />
        </button>
        <button
          type="button"
          onClick={toggleNote}
          className="hover:bg-gray-300 font-semibold text-sm px-4 py-2 rounded transition bg-gray-200 shadow-sm text-black w-1/2 flex items-center justify-center"
        >
          <FileText className="w-4 h-5" />
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className={`${tableClasses.formButton} ${selectedTodo ? 'w-4/6' : 'w-full'}`}
        >
          {selectedTodo ? 'Update' : 'Add'}
        </button>
        {selectedTodo && (
          <button
            type="button"
            onClick={resetForm}
            className={`${tableClasses.formButton} w-2/6 flex items-center justify-center`}
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {showNote && (
        <div className="mb-4">
          <textarea
            className={tableClasses.formInput + " w-full"}
            name="note"
            value={form.note}
            onChange={handleInputChange}
            placeholder="Note"
            rows="3"
          />
        </div>
      )}

      {links.map((link, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="URL"
            className={tableClasses.formInput + " w-6/12 text-xs py-2"}
            value={link.url}
            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
          />
          <input
            type="text"
            placeholder="Icon"
            className={tableClasses.formInput + " w-4/12 text-xs py-2"}
            value={link.icon}
            onChange={(e) => handleLinkChange(index, 'icon', e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleRemoveLink(index)}
            className={tableClasses.cancelButton + " w-2/12"}
          >
           <XCircle className="w-4 h-4" />
          </button>
        </div>
      ))}
    </form>
  );
};

export default TodoForm;
