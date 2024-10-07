import React, { useEffect, useState } from 'react';
import { XCircle, Link } from 'lucide-react';
import FormComponent from '../common/FormComponent';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TodoForm = ({ selectedTodo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    note: '',
    date: null,
    links: []
  });

  useEffect(() => {
    if (selectedTodo) {
      setFormData({
        id: selectedTodo.id,
        title: selectedTodo.title || '',
        note: selectedTodo.note || '',
        date: selectedTodo.date ? new Date(selectedTodo.date) : null,
        links: Array.isArray(selectedTodo.links) ? selectedTodo.links : []
      });
    } else {
      resetForm();
    }
  }, [selectedTodo]);

  // Form verilerindeki değişiklikleri yönetir
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Yeni bir link ekler
  const handleAddLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { url: '', icon: '' }]
    }));
  };

  // Bir linki kaldırır
  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  // Link alanlarındaki değişiklikleri yönetir
  const handleLinkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  // Form sıfırlama işlevi
  const resetForm = () => {
    setFormData({ title: '', note: '', date: null, links: [] });
    onCancel();
  };

  // Form gönderim işlemi
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Form alanlarının tanımlandığı dizi
  const fields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { 
      name: 'date', 
      label: 'Date', 
      className: 'w-full',
      type: 'custom',
      render: (value, onChange) => (
        <DatePicker
          selected={value}
          onChange={(date) => onChange('date', date)}
          dateFormat="dd/MM/yyyy"
          className="text-sm w-full mr-6 shadow border border-gray-100 rounded p-2 hover:border-gray-600"
          placeholderText="Date"
        />
      )
    },
    { 
      name: 'note', 
      label: 'Note', 
      type: 'textarea',
      rows: 3,
    },
    ...formData.links.map((link, index) => ({
      name: `link-${index}`,
      label: `Link ${index + 1}`,
      type: 'custom',
      render: (_, onChange) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="URL"
            className="w-6/12 border border-gray-300 rounded p-2 text-xs"
            value={link.url}
            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
          />
          <input
            type="text"
            placeholder="Icon"
            className="w-4/12 border border-gray-300 rounded p-2 text-xs"
            value={link.icon}
            onChange={(e) => handleLinkChange(index, 'icon', e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleRemoveLink(index)}
            className="w-2/12 bg-red-500 text-white rounded p-2"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )
    }))
  ];

  return (
    <FormComponent
      formData={formData}
      fields={fields}
      title="Todo"
      onChange={handleChange}
     
      onCancel={resetForm}
      isEdit={!!selectedTodo}
      extraButtons={
        <button
          type="button"
          onClick={handleAddLink}
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          <Link className="w-4 h-4 inline-block mr-2" />
          Add Link
        </button>
      }
      onSubmit={handleSubmit}
    />
  );
};

export default TodoForm;