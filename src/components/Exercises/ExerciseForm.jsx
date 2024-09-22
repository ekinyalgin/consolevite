// components/Exercises/ExerciseForm.jsx
import React, { useEffect, useState } from 'react';
import tableClasses from '../../utils/tableClasses';

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

    onSave(form);
  };

  return (
    <form onSubmit={handleFormSubmit} className={tableClasses.formContainer}>
      <div className="mb-4">
        <label className={tableClasses.formLabel}>Title</label>
        <input
          type="text"
          className={tableClasses.formInput}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={tableClasses.formLabel}>Duration (MM:SS)</label>
        <input
          type="text"
          placeholder="MM:SS"
          className={tableClasses.formInput}
          value={form.duration}
          onChange={handleDurationChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className={tableClasses.formLabel}>Description</label>
        <textarea
          className={tableClasses.formInput}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className={tableClasses.formLabel}>Video URL</label>
        <input
          type="url"
          className={tableClasses.formInput}
          value={form.video_url}
          onChange={(e) => setForm({ ...form, video_url: e.target.value })}
        />
      </div>
      <button type="submit" className={tableClasses.formButton}>
        {selectedExercise ? 'Update Exercise' : 'Add Exercise'}
      </button>
      {selectedExercise && (
        <button type="button" className={tableClasses.cancelButton} onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default ExerciseForm;
