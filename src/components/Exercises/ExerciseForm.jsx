// components/Exercises/ExerciseForm.jsx
import React, { useEffect, useState } from 'react';
import tableClasses from '../../utils/tableClasses';
import { XCircle } from 'lucide-react';

const ExerciseForm = ({ selectedExercise, onSave, onCancel }) => {
  const [form, setForm] = useState({ title: '', duration: '', description: '', video_url: '' });

  useEffect(() => {
    if (selectedExercise) {
      setForm({
        title: selectedExercise.title || '',
        duration: selectedExercise.duration || '',
        description: selectedExercise.description || '',
        video_url: selectedExercise.video_url || '',
      });
    } else {
      setForm({ title: '', duration: '', description: '', video_url: '' });
    }
  }, [selectedExercise]);

  const handleDurationChange = (e) => {
    let value = e.target.value;
    let numericValue = value.replace(/\D/g, '');

    if (numericValue.length > 4) {
      numericValue = numericValue.substring(0, 4);
    }

    if (numericValue.length >= 3) {
      const formattedValue = numericValue.substring(0, 2) + ':' + numericValue.substring(2);
      setForm({ ...form, duration: formattedValue });
    } else {
      setForm({ ...form, duration: numericValue });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const urlPattern = /^(https?:\/\/)([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/;
    if (form.video_url && !urlPattern.test(form.video_url)) {
        alert("Please enter a valid URL.");
        return;
    }

    // selectedExercise'nin ID'sini form objesine ekle
    if (selectedExercise && selectedExercise.id) {
        form.id = selectedExercise.id;
    }

    onSave(form);
};


  const resetForm = () => {
    setForm({ title: '', duration: '', description: '', video_url: '' });
    onCancel();
  };

  return (
    <form onSubmit={handleFormSubmit} className={tableClasses.formContainer + " space-y-4"}>
      <input
        type="text"
        className={`${tableClasses.formInput} w-full`}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
        required
      />
      <input
        type="text"
        placeholder="Duration MM:SS"
        className={`${tableClasses.formInput} w-full`}
        value={form.duration}
        onChange={handleDurationChange}
        required
      />
      <input
        type="url"
        placeholder="Video URL"
        className={`${tableClasses.formInput} w-full`}
        value={form.video_url}
        onChange={(e) => setForm({ ...form, video_url: e.target.value })}
      />
      <textarea
        className={`${tableClasses.formInput} w-full`}
        value={form.description}
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows="3"
      />
      <div className="flex space-x-2">
        <button
          type="submit"
          className={`${tableClasses.formButton} ${selectedExercise ? 'w-4/6' : 'w-full'}`}
        >
          {selectedExercise ? 'Update' : 'Add'} Exercise
        </button>
        {selectedExercise && (
          <button
            type="button"
            onClick={resetForm}
            className={`${tableClasses.formButton} w-2/6 flex items-center justify-center`}
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default ExerciseForm;
