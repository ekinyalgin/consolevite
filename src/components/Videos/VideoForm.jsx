import React, { useEffect, useState } from 'react';
import FormComponent from '../common/FormComponent'; // Ortak form bileşeni

const VideoForm = ({ selectedVideo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    note: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  // Formun ilk yüklenmesi ya da seçilen video değiştiğinde form verilerini ayarla
  useEffect(() => {
    if (selectedVideo) {
      setFormData({
        title: selectedVideo.title || '',
        url: selectedVideo.url || '',
        note: selectedVideo.note || ''
      });
      setIsEditing(true); // Eğer bir video seçilmişse, düzenleme moduna geç
    } else {
      resetForm(); // Eğer seçilen video yoksa, formu sıfırla
    }
  }, [selectedVideo]);

  // Form alanlarındaki değişiklikleri yönetir
  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Formun gönderilmesi (Kaydetme işlemi)
  const handleSubmit = (e) => {
    e.preventDefault();

    // URL doğrulaması
    const urlPattern = /^(https?:\/\/)([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/;
    if (!urlPattern.test(formData.url)) {
      alert('Please enter a valid URL.');
      return;
    }

    const formToSubmit = { ...formData };
    if (selectedVideo && selectedVideo.id) {
      formToSubmit.id = selectedVideo.id; // Eğer seçilen video varsa, ID eklenir
    }
    onSave(formToSubmit); // Kaydetme işlevini tetikleme
    setIsEditing(false); // Kaydetme işleminden sonra düzenleme modundan çık
  };

  // Formu sıfırlama ve düzenleme modundan çıkma işlevi
  const resetForm = () => {
    setFormData({ title: '', url: '', note: '' });
    setIsEditing(false);
    if (onCancel) {
      onCancel(); // Eğer onCancel işlevi varsa, çağrılır
    }
  };

  // Form alanlarının tanımlandığı dizi
  const fields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'url', label: 'URL', type: 'url', required: true },
    { name: 'note', label: 'Note', type: 'textarea', rows: 3 }
  ];

  return (
    <FormComponent
      formData={formData}
      fields={fields}
      title="Video"
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={resetForm} // Cancel işlemi formu sıfırlamak için
      isEdit={isEditing} // isEditing state'ini kullanarak düzenleme modunu belirt
    />
  );
};

export default VideoForm;
