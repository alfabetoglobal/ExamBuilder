import React, { useState, useEffect } from 'react';
import './App.css';

function Test() {
   const mcqQuestions = [
    {
      id: 1,
      text: 'Vishal has total 35 notes which consist of 2 rupee notes and 5 rupee notes. If he has an amount of Rs 115 with him, how many five rupee notes does he have?',
      options: [
        { id: 'option1', text: 'a) 20', value: 20 },
        { id: 'option2', text: 'b) 25', value: 25 },
        { id: 'option3', text: 'c) 10', value: 10 },
        { id: 'option4', text: 'd) 15', value: 15 },
        { id: 'option5', text: 'e) 30', value: 30 },
      ],
    },
    {
      id: 2,
      text: 'What is the capital of France?',
      options: [
        { id: 'option1', text: 'a) Berlin', value: 'Berlin' },
        { id: 'option2', text: 'b) Madrid', value: 'Madrid' },
        { id: 'option3', text: 'c) Paris', value: 'Paris' },
        { id: 'option4', text: 'd) Rome', value: 'Rome' },
      ],
    },
    {
      id: 3,
      text: 'Which planet is known as the Red Planet?',
      options: [
        { id: 'option1', text: 'a) Earth', value: 'Earth' },
        { id: 'option2', text: 'b) Mars', value: 'Mars' },
        { id: 'option3', text: 'c) Jupiter', value: 'Jupiter' },
        { id: 'option4', text: 'd) Saturn', value: 'Saturn' },
      ],
    },
    {
      id: 4,
      text: 'What is the largest ocean on Earth?',
      options: [
        { id: 'option1', text: 'a) Atlantic Ocean', value: 'Atlantic Ocean' },
        { id: 'option2', text: 'b) Indian Ocean', value: 'Indian Ocean' },
        { id: 'option3', text: 'c) Arctic Ocean', value: 'Arctic Ocean' },
        { id: 'option4', text: 'd) Pacific Ocean', value: 'Pacific Ocean' },
      ],
    },
    {
      id: 5,
      text: 'Who wrote "To Kill a Mockingbird"?',
      options: [
        { id: 'option1', text: 'a) Harper Lee', value: 'Harper Lee' },
        { id: 'option2', text: 'b) Jane Austen', value: 'Jane Austen' },
        { id: 'option3', text: 'c) J.K. Rowling', value: 'J.K. Rowling' },
        { id: 'option4', text: 'd) Ernest Hemingway', value: 'Ernest Hemingway' },
      ],
    },
    {
      id: 6,
      text: 'What is the powerhouse of the cell?',
      options: [
        { id: 'option1', text: 'a) Nucleus', value: 'Nucleus' },
        { id: 'option2', text: 'b) Mitochondria', value: 'Mitochondria' },
        { id: 'option3', text: 'c) Ribosome', value: 'Ribosome' },
        { id: 'option4', text: 'd) Endoplasmic Reticulum', value: 'Endoplasmic Reticulum' },
      ],
    },
    {
      id: 7,
      text: 'What is the capital of Japan?',
      options: [
        { id: 'option1', text: 'a) Beijing', value: 'Beijing' },
        { id: 'option2', text: 'b) Seoul', value: 'Seoul' },
        { id: 'option3', text: 'c) Tokyo', value: 'Tokyo' },
        { id: 'option4', text: 'd) Bangkok', value: 'Bangkok' },
      ],
    },
    {
      id: 8,
      text: 'What is the chemical symbol for water?',
      options: [
        { id: 'option1', text: 'a) H2O', value: 'H2O' },
        { id: 'option2', text: 'b) CO2', value: 'CO2' },
        { id: 'option3', text: 'c) O2', value: 'O2' },
        { id: 'option4', text: 'd) NaCl', value: 'NaCl' },
      ],
    },
    {
      id: 9,
      text: 'Which element has the atomic number 1?',
      options: [
        { id: 'option1', text: 'a) Helium', value: 'Helium' },
        { id: 'option2', text: 'b) Hydrogen', value: 'Hydrogen' },
        { id: 'option3', text: 'c) Oxygen', value: 'Oxygen' },
        { id: 'option4', text: 'd) Nitrogen', value: 'Nitrogen' },
      ],
    },
    {
      id: 10,
      text: 'What is the speed of light?',
      options: [
        { id: 'option1', text: 'a) 3.00 x 10^8 m/s', value: '3.00 x 10^8 m/s' },
        { id: 'option2', text: 'b) 3.00 x 10^6 m/s', value: '3.00 x 10^6 m/s' },
        { id: 'option3', text: 'c) 3.00 x 10^5 m/s', value: '3.00 x 10^5 m/s' },
        { id: 'option4', text: 'd) 3.00 x 10^7 m/s', value: '3.00 x 10^7 m/s' },
      ],
    },
  ];
  const subjectiveQuestions = [
    {
      id: 1,
      text: 'Explain the theory of relativity.',
    },
    {
      id: 2,
      text: 'Describe the process of photosynthesis and its importance to plants.',
    },
    {
      id: 3,
      text: 'What are the main causes and effects of global warming?',
    },
    {
      id: 4,
      text: 'Discuss the impact of technology on modern education.',
    },
    {
      id: 5,
      text: 'Analyze the significance of the Industrial Revolution in shaping the modern world.',
    },
    {
      id: 6,
      text: 'Describe the structure and functions of the human heart.',
    },
    {
      id: 7,
      text: 'Explain the principles of Newton’s three laws of motion.',
    },
    {
      id: 8,
      text: 'Discuss the cultural and economic impact of the Renaissance period in Europe.',
    },
    {
      id: 9,
      text: 'What are the ethical implications of artificial intelligence in society?',
    },
    {
      id: 10,
      text: 'Explain the concept of democracy and its various forms.',
    },
    {
      id: 11,
      text: 'Discuss the causes and consequences of World War II.',
    },
    {
      id: 12,
      text: 'What are the main theories of evolution, and how do they explain the diversity of life on Earth?',
    },
    {
      id: 13,
      text: 'Describe the chemical properties and uses of water.',
    },
    {
      id: 14,
      text: 'What are the major challenges faced by the global economy today?',
    },
    {
      id: 15,
      text: 'Explain the importance of biodiversity and the threats it faces.',
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [questionStates, setQuestionStates] = useState([]);
  const [selectedType, setSelectedType] = useState('mcq');

  const questions = selectedType === 'mcq' ? mcqQuestions : subjectiveQuestions;

  useEffect(() => {
    setQuestionStates(questions.map(() => ({ visited: false, answered: false, marked: false })));
  }, [selectedType, questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setQuestionStates((prevState) => {
      const newState = [...prevState];
      newState[currentQuestion].visited = true;
      return newState;
    });
  }, [currentQuestion, selectedType]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleMarkForReview = () => {
    setQuestionStates((prevState) => {
      const newState = [...prevState];
      newState[currentQuestion].marked = !newState[currentQuestion].marked;
      return newState;
    });
  };

  const handleAnswer = (e) => {
    setQuestionStates((prevState) => {
      const newState = [...prevState];
      newState[currentQuestion].answered = true;
      return newState;
    });
  };

  const handleClearResponse = () => {
    setQuestionStates((prevState) => {
      const newState = [...prevState];
      newState[currentQuestion].answered = false;
      newState[currentQuestion].marked = false;
      return newState;
    });
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentQuestion(0);
    setQuestionStates((type === 'mcq' ? mcqQuestions : subjectiveQuestions).map(() => ({ visited: false, answered: false, marked: false })));
  };

  const handleSubmit = () => {
    // Add your submit logic here
    alert('Time is up! Your answers have been submitted.');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Exam Builder Online</h1>
        <div className="language-selector">
          <label htmlFor="language">Choose Language: </label>
          <select id="language" name="language">
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>
      </header>

      <main className="main-content">
        <div className="sections">
          <button className="section-button" onClick={() => handleTypeChange('mcq')}>MCQ TYPE</button>
          <button className="section-button" onClick={() => handleTypeChange('subjective')}>SUBJECTIVE TYPE</button>
        </div>

        {selectedType === 'mcq' ? (
          <div className="question">
            <h2>Question No {questions[currentQuestion].id}</h2>
            <p>{questions[currentQuestion].text}</p>
            <ul className="options">
              {questions[currentQuestion].options.map((option) => (
                <li key={option.id}>
                  <input
                    type="radio"
                    name="answer"
                    id={option.id}
                    value={option.value}
                    onChange={handleAnswer}
                  />
                  <label htmlFor={option.id}>{option.text}</label>
                </li>
              ))}
            </ul>
            <div className="buttons">
              <button onClick={handlePrevious} disabled={currentQuestion === 0}>Previous</button>
              <button onClick={handleMarkForReview} className={questionStates[currentQuestion]?.marked ? 'marked' : ''}>
                {questionStates[currentQuestion]?.marked ? 'Unmark for Review' : 'Mark for Review'}
              </button>
              <button onClick={handleClearResponse}>Clear Response</button>
              <button onClick={handleNext} disabled={currentQuestion === questions.length - 1}>Save & Next</button>
            </div>
          </div>
        ) : (
          <div className="question">
            <h2>Question No {questions[currentQuestion].id}</h2>
            <p>{questions[currentQuestion].text}</p>
            <textarea placeholder="Write your answer here..."></textarea>
            <div className="buttons">
              <button onClick={handlePrevious} disabled={currentQuestion === 0}>Previous</button>
              <button onClick={handleMarkForReview} className={questionStates[currentQuestion]?.marked ? 'marked' : ''}>
                {questionStates[currentQuestion]?.marked ? 'Unmark for Review' : 'Mark for Review'}
              </button>
              <button onClick={handleClearResponse}>Clear Response</button>
              <button onClick={handleNext} disabled={currentQuestion === questions.length - 1}>Save & Next</button>
            </div>
          </div>
        )}

        <div className="sidebar">
          <div className="time-left">
            <p>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</p>
          </div>
          <div className="legend">
            <ul>
              <li><span className="answered"></span>Answered</li>
              <li><span className="not-answered"></span>Not Answered</li>
              <li><span className="marked"></span>Marked</li>
              <li><span className="not-visited"></span>Not Visited</li>
            </ul>
          </div>
          <div className="question-palette">
            <ul>
              {questions.map((question, index) => {
                const state = questionStates[index] || {};
                let className = '';
                if (index === currentQuestion) {
                  className = 'selected';
                } else if (state.answered) {
                  className = 'answered';
                } else if (state.marked) {
                  className = 'marked';
                } else if (!state.visited) {
                  className = 'not-visited';
                } else {
                  className = 'not-answered';
                }
                return (
                  <li
                    key={question.id}
                    className={className}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {question.id}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="actions">
            <button>Question Paper</button>
            <button>Instructions</button>
            <button>Profile</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Test;