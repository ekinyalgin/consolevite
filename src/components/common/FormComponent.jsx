import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

const FormComponent = ({ 
  fields, 
  formData, 
  title, 
  onChange, 
  onSubmit, 
  onCancel, 
  isEdit, 
  extraButtons 
}) => {
  const [editMode, setEditMode] = useState(isEdit);

  useEffect(() => {
    setEditMode(isEdit);
  }, [isEdit]);

  const resetEditMode = () => {
    setEditMode(false);
    onCancel();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-sm uppercase font-semibold tracking-wider">{editMode ? `Edit ${title}` : `Add ${title}`}</h2>

      {fields.map((field) => {
        if (field.type === 'custom') {
          return (
            <div key={field.name}>
              {field.render(formData[field.name], onChange)}
            </div>
          );
        }

        if (field.type === 'textarea') {
          return (
            <textarea
              key={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.label}
              rows={field.rows || 3}
              className="w-full py-2 px-3 border border-gray-200 hover:border-black transition rounded shadow-sm text-sm"
              required={field.required}
            />
          );
        }

        if (field.type === 'select') {
          return (
            <select
              key={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 hover:border-black transition rounded shadow-sm text-sm"
              required={field.required}
            >
              <option value="">{field.label}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }

        return (
          <input
            key={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.label}
            className="w-full py-2 px-3 border border-gray-200 hover:border-black transition rounded shadow-sm text-sm"
            required={field.required}
          />
        );
      })}

      <div className="flex space-x-2">
        {editMode ? (
          <>
            <button
              type="submit"
              className="text-sm font-semibold w-4/6 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded transition"
            >
              Update
            </button>
            <button
              type="button"
              onClick={resetEditMode}
              className="text-sm font-semibold w-2/6 bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center justify-center transition"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="text-sm font-semibold w-full bg-blue-500 hover:bg-blue-700 text-white p-2 rounded transition"
          >
            Submit
          </button>
        )}
      </div>

      {extraButtons}
    </form>
  );
};

export default FormComponent;
