// pages/StartExercise.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function StartExercises() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { exercises } = state || [];
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [exerciseTime, setExerciseTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    // Toplam süreyi ve her bir egzersizin süresini belirler
    useEffect(() => {
        if (exercises.length > 0) {
            let totalDuration = exercises.reduce((acc, exercise) => {
                const [minutes, seconds] = exercise.duration.split(':').map(Number);
                return acc + minutes * 60 + seconds;
            }, 0);
            setTotalTime(totalDuration);
            setExerciseTime(getDurationInSeconds(exercises[0].duration));
            setIsStarted(true);
        }
    }, [exercises]);

    // Egzersiz zamanlayıcısı
    useEffect(() => {
        let timer;
        if (!isPaused && isStarted) {
            if (exerciseTime > 0) {
                timer = setInterval(() => {
                    setExerciseTime(prev => prev - 1);
                    setTotalTime(prev => prev - 1);
                }, 1000);
            } else if (currentExerciseIndex < exercises.length - 1) {
                setCurrentExerciseIndex(prev => prev + 1);
                setExerciseTime(getDurationInSeconds(exercises[currentExerciseIndex + 1].duration));
                playBeep();
            } else {
                playBeep();
                setTimeout(() => {
                    navigate('/');
                }, 500);
            }
        }
        return () => clearInterval(timer);
    }, [isPaused, isStarted, exerciseTime, currentExerciseIndex, exercises, navigate]);

    // Egzersizin süresini saniyeye çevirir
    const getDurationInSeconds = (duration) => {
        const [minutes, seconds] = duration.split(':').map(Number);
        return minutes * 60 + seconds;
    };

    // Beep sesi oynatma
    const playBeep = () => {
        const beep = new Audio('/assets/ding.wav');
        beep.play();
    };

    // Egzersizi duraklat ve devam ettir
    const handlePauseResume = () => {
        setIsPaused(!isPaused);
    };

    // Video URL'sini iframe embed yapısına çevir
    const getEmbedUrl = (url) => {
        const embedUrl = url.replace("watch?v=", "embed/");
        return `${embedUrl}&autoplay=1`;
    };

    // Bir sonraki egzersize geçiş ve toplam süreden düşme
    const handleNext = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            const currentExerciseDurationInSeconds = getDurationInSeconds(exercises[currentExerciseIndex].duration);
            setTotalTime(prevTotalTime => prevTotalTime - currentExerciseDurationInSeconds);
            
            setCurrentExerciseIndex(prev => prev + 1);
            setExerciseTime(getDurationInSeconds(exercises[currentExerciseIndex + 1].duration));
            playBeep();
        } else {
            navigate('/');
        }
    };

    // Bir önceki egzersize dönüş ve toplam süreye ekleme
    const handlePrevious = () => {
        if (currentExerciseIndex > 0) {
            const previousExerciseDurationInSeconds = getDurationInSeconds(exercises[currentExerciseIndex - 1].duration);
            setTotalTime(prevTotalTime => prevTotalTime + previousExerciseDurationInSeconds);

            setCurrentExerciseIndex(prev => prev - 1);
            setExerciseTime(getDurationInSeconds(exercises[currentExerciseIndex - 1].duration));
        }
    };

    const getExerciseTitle = () => {
        return exercises[currentExerciseIndex].title;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {exercises.length > 0 ? (
                <>
                    <p className="text-gray-600 mb-4 text-sm">
                        {exercises[currentExerciseIndex].description}
                    </p>
                    <div className="flex items-center justify-between space-x-10">
                        {exercises[currentExerciseIndex].video_url && (
                            <div className="w-6/12 my-10">
                                <iframe 
                                    className="rounded-2xl mx-auto w-full h-96"
                                    src={getEmbedUrl(exercises[currentExerciseIndex].video_url)}
                                    frameBorder="0" 
                                    allow="autoplay; encrypted-media" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                        <div className="w-6/12 space-y-10">
                            <h1 className="text-5xl text-left font-bold text-gray-700 mt-4 mb-4">
                                {getExerciseTitle()}
                            </h1>
                            <div className="flex justify-between items-center mt-6 text-sm">
                                <div className='space-x-2'>
                                    <button onClick={handlePrevious} className="bg-transparent border border-gray-300 hover:border-gray-600 text-gray-600 font-bold px-4 rounded py-2">Previous</button>
                                    <button onClick={handleNext} className="bg-transparent border border-gray-300 hover:border-gray-600 text-gray-600 font-bold px-4 rounded py-2">Next</button>
                                    <button onClick={handlePauseResume} className="border border-gray-300 hover:border-gray-600 font-bold px-4 rounded py-2 bg-green-600 text-white">
                                        {isPaused ? 'Resume' : 'Pause'}
                                    </button>
                                </div>
                                <div className="text-right flex space-x-6 text-base">
                                    <p>Time Remaining: <strong>{new Date(exerciseTime * 1000).toISOString().substr(14, 5)}</strong></p>
                                    <p>Total Time Left: <strong>{new Date(totalTime * 1000).toISOString().substr(14, 5)}</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Alt tarafta egzersizlerin isimlerini listeleme */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold">Selected Exercises:</h2>
                        <ul className="list-disc pl-6">
                            {exercises.map((exercise, index) => (
                                <li key={index} className={currentExerciseIndex === index ? "font-bold" : ""}>
                                    {exercise.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <div>
                    <h2>No exercises selected</h2>
                    <button onClick={() => navigate('/')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Go Back</button>
                </div>
            )}
        </div>
    );
}

export default StartExercises;
