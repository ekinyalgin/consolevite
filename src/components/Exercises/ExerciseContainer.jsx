import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';
import ExerciseControls from './ExerciseControls';
import Notification from '../../utils/Notification';
import exerciseService from './exerciseService';
import ToggleFormButton from '../common/ToggleFormButton';

const ExerciseContainer = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedFormOpen = localStorage.getItem('exerciseFormOpen');
    if (storedFormOpen !== null) {
      setIsFormOpen(JSON.parse(storedFormOpen));
    }
    fetchExercises();
  }, []);

  useEffect(() => {
    localStorage.setItem('exerciseFormOpen', JSON.stringify(isFormOpen));
  }, [isFormOpen]);

  const fetchExercises = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await exerciseService.getAll();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      showNotification('Failed to load exercises', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleSave = async (exerciseData) => {
    let tempId = `temp-${Math.random()}`;
    if (exerciseData.id) {
      setExercises(prevExercises => 
        prevExercises.map(exercise => 
          exercise.id === exerciseData.id ? { ...exercise, ...exerciseData } : exercise
        )
      );
    } else {
      setExercises(prevExercises => [...prevExercises, { ...exerciseData, id: tempId }]);
    }

    try {
      let savedExercise;
      if (exerciseData.id) {
        savedExercise = await exerciseService.update(exerciseData);
      } else {
        savedExercise = await exerciseService.create(exerciseData);
      }

      setExercises(prevExercises => prevExercises.map(exercise => 
        exercise.id === (exerciseData.id || tempId) ? savedExercise : exercise
      ));

      showNotification(exerciseData.id ? 'Exercise updated successfully' : 'Exercise added successfully', 'success');
      setSelectedExercise(savedExercise);  // Form açık kalması için bu satırı değiştirdik
      // setIsFormOpen(false);  // Bu satırı kaldırdık
    } catch (error) {
      console.error('Error saving exercise:', error);
      showNotification('Failed to save exercise', 'error');

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
    const isConfirmed = window.confirm("Are you sure you want to delete this exercise?");
    if (!isConfirmed) {
      return;
    }

    const originalExercises = exercises;
    setExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== id));

    try {
      await exerciseService.remove(id);
      showNotification('Exercise deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting exercise:', error);
      showNotification('Failed to delete exercise', 'error');
      setExercises(originalExercises);
    }
  };

  const handleEdit = (exercise) => {
    setSelectedExercise(exercise);
    setIsFormOpen(true);
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

  const toggleForm = useCallback(() => {
    setIsFormOpen(prev => {
      const newState = !prev;
      localStorage.setItem('exerciseFormOpen', JSON.stringify(newState));
      return newState;
    });
    if (isFormOpen) {
      setSelectedExercise(null);
    }
  }, [isFormOpen]);

  const handleFormReset = useCallback(() => {
    setSelectedExercise(null);
    // setIsFormOpen(false); // Bu satırı kaldırıyoruz
  }, []);

  return (
    <div className="container mx-auto p-2">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">Exercises</h1>
      <div className="sm:space-x-8 flex flex-col md:flex-row">
        <div className={`sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0 ${isFormOpen ? 'block' : 'hidden'}`}>
          <ExerciseForm
            selectedExercise={selectedExercise}
            onSave={handleSave}
            onCancel={handleFormReset}
          />
        </div>
        <div className={`${isFormOpen ? 'lg:w-9/12' : 'w-full'}`}>
          <ExerciseControls
            onStartRandom={startRandomExercise}
            onClearSelection={clearSelection}
            onStartExercise={startExercise}
          />

          {isLoading ? (
            <p>Loading exercises...</p>
          ) : (
            <ExerciseList 
              exercises={exercises} 
              selectedIds={selectedIds} 
              setSelectedIds={setSelectedIds} 
              onEdit={handleEdit}
              onDelete={handleDelete} 
              showOnlySelected={showOnlySelected} 
            />
          )}
        </div>
      </div>

      <ToggleFormButton isOpen={isFormOpen} onClick={toggleForm} />
    </div>
  );
};

export default ExerciseContainer;