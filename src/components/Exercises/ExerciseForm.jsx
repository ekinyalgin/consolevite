import React, { useEffect, useState } from 'react';
import FormComponent from '../common/FormComponent'; // Daha önce oluşturulmuş bir ortak form bileşeni

const ExerciseForm = ({ selectedExercise, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    description: '',
    video_url: ''
  });

  useEffect(() => {
    if (selectedExercise) {
      setFormData({
        title: selectedExercise.title || '',
        duration: selectedExercise.duration || '',
        description: selectedExercise.description || '',
        video_url: selectedExercise.video_url || ''
      });
    } else {
      resetForm();
    }
  }, [selectedExercise]);

  const handleChange = (name, value) => {
    if (name === 'duration') {
      // Sadece sayısal değerler ve MM:SS formatı
      let numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 4) {
        numericValue = numericValue.substring(0, 4);
      }
      if (numericValue.length >= 3) {
        const formattedValue = numericValue.substring(0, 2) + ':' + numericValue.substring(2);
        setFormData(prev => ({ ...prev, duration: formattedValue }));
      } else {
        setFormData(prev => ({ ...prev, duration: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // URL doğrulama
    const urlPattern = /^(https?:\/\/)([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/;
    if (formData.video_url && !urlPattern.test(formData.video_url)) {
      alert("Please enter a valid URL.");
      return;
    }

    const formToSubmit = { ...formData };
    if (selectedExercise && selectedExercise.id) {
      formToSubmit.id = selectedExercise.id;
    }
    onSave(formToSubmit); // Verileri üst bileşene gönder
  };

  const resetForm = () => {
    setFormData({ title: '', duration: '', description: '', video_url: '' });
    onCancel();
  };

  const fields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'duration', label: 'Duration MM:SS', type: 'text', required: true },
    { name: 'video_url', label: 'Video URL', type: 'url' },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3 }
  ];

  return (
    <FormComponent
      formData={formData}
      fields={fields}
      title="Exercise"
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={resetForm}
      isEdit={!!selectedExercise}
    />
  );
};

export default ExerciseForm;
