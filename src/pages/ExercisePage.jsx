import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ExerciseForm from '../components/Exercises/ExerciseForm';
import ExerciseList from '../components/Exercises/ExerciseList';
import { PlayCircle, Shuffle, X, Plus } from 'lucide-react';
import Notification from '../utils/Notification';
import tableClasses from '../utils/tableClasses';
import axios from 'axios';

const ExercisePage = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to control form visibility

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/exercises`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      showNotification('Failed to load exercises', 'error');
    }
  }, [API_URL]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleSave = async (exerciseData) => {
    let tempId = `temp-${Math.random()}`; // Geçici bir ID oluştur
    if (exerciseData.id) {
        // Mevcut bir egzersizi optimistik olarak güncelle
        setExercises(prevExercises => 
            prevExercises.map(exercise => 
                exercise.id === exerciseData.id ? { ...exercise, ...exerciseData } : exercise
            )
        );
    } else {
        // Yeni egzersizi optimistik olarak ekle
        setExercises(prevExercises => [...prevExercises, { ...exerciseData, id: tempId }]);
    }

    try {
        const token = localStorage.getItem('token');
        let response;

        if (exerciseData.id) {
            response = await axios.put(`${API_URL}/exercises/${exerciseData.id}`, exerciseData, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } else {
            response = await axios.post(`${API_URL}/exercises`, exerciseData, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }

        const savedExercise = response.data;

        // Sunucu yanıtı geldiğinde optimistik güncellemeyi kesinleştir
        setExercises(prevExercises => prevExercises.map(exercise => 
            exercise.id === (exerciseData.id || tempId) ? savedExercise : exercise
        ));

        showNotification(exerciseData.id ? 'Exercise updated successfully' : 'Exercise added successfully', 'success');
        setSelectedExercise(null);
    } catch (error) {
        console.error('Error saving exercise:', error);
        showNotification('Failed to save exercise', 'error');

        // Hata durumunda optimistik değişiklikleri geri al
        setExercises(prevExercises => {
            if (exerciseData.id) {
                return prevExercises.map(exercise => 
                    exercise.id === exerciseData.id ? exerciseData : exercise
                );
            } else {
                return prevExercises.filter(exercise => exercise.id !== tempId);
            }
        });
    }
};


const handleDelete = async (id) => {
  // Silme işlemi için onay mesajı
  const isConfirmed = window.confirm("Bu egzersizi silmek istediğinize emin misiniz?");
  if (!isConfirmed) {
      return; // Kullanıcı iptal ettiyse işlemi sonlandır
  }

  // Egzersizi optimistik olarak hemen UI'dan kaldır
  const originalExercises = exercises;
  setExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== id));

  try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/exercises/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      showNotification('Exercise deleted successfully', 'success');
  } catch (error) {
      console.error('Error deleting exercise:', error);
      showNotification('Failed to delete exercise', 'error');

      // Hata durumunda egzersizi geri ekle
      setExercises(originalExercises);
  }
};



const handleEdit = (exercise) => {
  setSelectedExercise(exercise); 
};

  const startRandomExercise = () => {
    if (exercises.length > 0) {
      const totalDuration = exercises.reduce((acc, exercise) => {
        const [minutes, seconds] = exercise.duration.split(':').map(Number);
        return acc + minutes * 60 + seconds;
      }, 0);

      const targetDuration = totalDuration / 7;
      let selectedDuration = 0;
      const selected = [];
      const shuffledExercises = [...exercises].sort(() => 0.5 - Math.random());

      for (let i = 0; i < shuffledExercises.length; i++) {
        const exercise = shuffledExercises[i];
        const [minutes, seconds] = exercise.duration.split(':').map(Number);
        const durationInSeconds = minutes * 60 + seconds;

        if (selectedDuration + durationInSeconds <= targetDuration) {
          selected.push(exercise.id);
          selectedDuration += durationInSeconds;
        }

        if (selectedDuration >= targetDuration) break;
      }

      setSelectedIds(selected);
      setShowOnlySelected(true);
    } else {
      showNotification('No exercises available', 'error');
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setShowOnlySelected(false);
  };

  const startExercise = () => {
    const selectedExercises = exercises.filter((exercise) => selectedIds.includes(exercise.id));
    navigate('/start-exercise', { state: { exercises: selectedExercises } });
  };

  return (
    <div className="container mx-auto p-2">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className={tableClasses.h1}>Exercises</h1>
      <div className="sm:space-x-8 flex flex-col md:flex-row">
        <div className={`sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0 ${isFormOpen ? '' : 'hidden md:block'}`}>
          <ExerciseForm
            selectedExercise={selectedExercise}
            onSave={handleSave}
            onCancel={() => {
              setSelectedExercise(null);
              setIsFormOpen(false); // Close form when cancelled
            }}
          />
        </div>
        <div className="lg:w-9/12">
          <div className={tableClasses.buttonContainer}>
            <button onClick={startRandomExercise} className={tableClasses.transButton + " flex items-center"}>
              <Shuffle className="w-4 mr-2" /> Random
            </button>
            <button onClick={clearSelection} className={tableClasses.transButton + " flex items-center"}>
              <X className="w-4 mr-2" /> Clear Selection
            </button>
            <button onClick={startExercise} className={tableClasses.transButton + " flex items-center"}>
              <PlayCircle className="w-4 mr-2" /> Start Exercise
            </button>
          </div>

          <ExerciseList 
            exercises={exercises} 
            selectedIds={selectedIds} 
            setSelectedIds={setSelectedIds} 
            onEdit={(exercise) => {
              setSelectedExercise(exercise);
              setIsFormOpen(true); // Open form for editing
            }}
            onDelete={handleDelete} 
            showOnlySelected={showOnlySelected} 
          />
        </div>
      </div>

      {/* Button to open/close the form */}
      {!isFormOpen && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-md hover:bg-blue-700 transition duration-300 md:hidden"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
        </button>
      )}

      {isFormOpen && (
        <button
          onClick={() => setIsFormOpen(false)}
          className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-md hover:bg-red-700 transition duration-300 md:hidden"
        >
          <X className="w-4 h-4" strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

export default ExercisePage;
