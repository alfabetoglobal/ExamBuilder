import React, { useState, useEffect } from 'react';
import './Test.css'; // Ensure you have a CSS file to style the component
import axios from 'axios';

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [questionStates, setQuestionStates] = useState([]);
  const [selectedType, setSelectedType] = useState('mcq');
  const [showWarning, setShowWarning] = useState(false);
  const [IsSaveNextClicked, setIsSaveNextClicked] = useState(false);
  const applicationNumber = localStorage.getItem('applicationnumber');
  const apiUrl = 'https://ybkfar4y6i.execute-api.us-east-1.amazonaws.com/S1/submitAllstudentquestion'; // Replace with your API URL

  // Load questions from localStorage on component mount
  useEffect(() => {
    const storedQuestions = localStorage.getItem('shuffledQuestions');
    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions);
      const mcqQuestions = parsedQuestions.mcqQuizz || [];
      const descriptiveQuestions = parsedQuestions.descriptiveQuizz || [];

      if (selectedType === 'mcq') {
        setQuestions(mcqQuestions);
        setQuestionStates(Array(mcqQuestions.length).fill({ visited: false, answered: false, marked: false }));
      } else {
        setQuestions(descriptiveQuestions);
        setQuestionStates(Array(descriptiveQuestions.length).fill({ visited: false, answered: false, marked: false }));
      }
    }
  }, [selectedType]);

  // Timer effect to count down time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit(); // Handle submission when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Set question states when questions change
  useEffect(() => {
    setQuestionStates(Array(questions.length).fill({ visited: false, answered: false, marked: false }));
  }, [questions]);
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const storedItem = JSON.parse(localStorage.getItem(`question-${currentQuestion + 1}`));
      if (storedItem && storedItem.optionId !== null) {
        if (selectedType === 'mcq') {
          submitQuestion(storedItem.questionId, storedItem.optionId)
            .then(() => {
              setIsSaveNextClicked(true); // Set isSaveNextClicked to true after successful submission
              setCurrentQuestion(currentQuestion + 1);
       
            })
            .catch(error => {
              console.error('Error saving question:', error);
            });
        } else if (selectedType === 'descriptive') {
          submitDescriptiveAnswer(storedItem.questionId, storedItem.optionDescription)
            .then(() => {
              setCurrentQuestion(currentQuestion + 1);
              setIsSaveNextClicked(true); // Set isSaveNextClicked to true after successful submission
            })
            .catch(error => {
              console.error('Error saving descriptive answer:', error);
            });
        }
      } else {
        if (selectedType === 'mcq') {
          submitQuestion(questions[currentQuestion]._id, null, 'delete')
            .then(() => {
              setCurrentQuestion(currentQuestion + 1);
              setIsSaveNextClicked(true); // Set isSaveNextClicked to true after clearing response
            })
            .catch(error => {
              console.error('Error clearing question response:', error);
            });
        } else if (selectedType === 'descriptive') {
          submitDescriptiveAnswer(questions[currentQuestion]._id, null, 'delete')
            .then(() => {
              setCurrentQuestion(currentQuestion + 1);
              setIsSaveNextClicked(true); // Set isSaveNextClicked to true after clearing response
            })
            .catch(error => {
              console.error('Error clearing descriptive answer:', error);
            });
        }
      }
    }
  };
  
  // const handleNext = () => {
  //   if (currentQuestion < questions.length - 1) {
  //     const storedItem = JSON.parse(localStorage.getItem(`question-${currentQuestion + 1}`));
  //     if (storedItem && storedItem.optionId !== null) {
  //       if (selectedType === 'mcq') {
  //         submitQuestion(storedItem.questionId, storedItem.optionId)
  //           .then(() => {
  //             setIsSaveNextClicked(true);
  //             setCurrentQuestion(currentQuestion + 1);
  //           })
  //           .catch(error => {
  //             console.error('Error saving question:', error);
  //           });
  //       } else if (selectedType === 'descriptive') {
  //         submitDescriptiveAnswer(storedItem.questionId, storedItem.optionDescription)
  //           .then(() => {
  //             setCurrentQuestion(currentQuestion + 1);
  //           })
  //           .catch(error => {
  //             console.error('Error saving descriptive answer:', error);
  //           });
  //       }
  //     } else {
  //       if (selectedType === 'mcq') {
  //         submitQuestion(questions[currentQuestion]._id, null, 'delete')
  //           .then(() => {
  //             setCurrentQuestion(currentQuestion + 1);
  //           })
  //           .catch(error => {
  //             console.error('Error clearing question response:', error);
  //           });
  //       } else if (selectedType === 'descriptive') {
  //         submitDescriptiveAnswer(questions[currentQuestion]._id, null, 'delete')
  //           .then(() => {
  //             setCurrentQuestion(currentQuestion + 1);
  //           })
  //           .catch(error => {
  //             console.error('Error clearing descriptive answer:', error);
  //           });
  //       }


  //     }
  //   }
  // };

  // API Call to submit, change, or delete a MCQ question
  const submitQuestion = (questionId, optionId, action = '') => {
    const payload = {
      applicationNumber,
      questionId,
      optionId
    };
    const token = localStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      }
    };

    if (!optionId) {
      payload.action = action || 'delete';
    }

    return axios.post(`${apiUrl}`, payload, headers)
      .then(response => {
        console.log('MCQ API Response:', response.data);
      })
      .catch(error => {
        console.error('MCQ API Error:', error);
        throw error;
      });
  };

  // API Call to submit, change, or delete a descriptive question answer
  const submitDescriptiveAnswer = (questionId, answer, action = '') => {
    const payload = {
      applicationNumber,
      questionId,
      answer
    };
    const token = localStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      }
    };

    if (!answer) {
      payload.action = action || 'delete';
    }

    return axios.post(`${apiUrl}`, payload, headers)
      .then(response => {
        console.log('Descriptive API Response:', response.data);
      })
      .catch(error => {
        console.error('Descriptive API Error:', error);
        throw error;
      });
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Mark/unmark question for review
  const handleMarkForReview = () => {
    setQuestionStates(prevState => {
      const newState = [...prevState];
      newState[currentQuestion].marked = !newState[currentQuestion].marked;
      return newState;
    });
  };

  // Handle answering MCQ
  const handleAnswer = (optionId, optionDescription) => {
    const storedItem = JSON.parse(localStorage.getItem(`question-${currentQuestion + 1}`)) || {};
    const questionId = questions[currentQuestion]._id;

    if (selectedType === 'mcq') {
      const mcqArray = JSON.parse(localStorage.getItem('mcqArray')) || [];
      const existingIndex = mcqArray.findIndex(item => item.questionId === questionId);
      if (existingIndex !== -1) {
        mcqArray[existingIndex].optionId = optionId;
      } else {
        mcqArray.push({ questionId, optionId });
      }
      localStorage.setItem('mcqArray', JSON.stringify(mcqArray));
    } else if (selectedType === 'descriptive') {
      console.log(localStorage.setItem('descriptiveArray'));
      const descriptiveArray = JSON.parse(localStorage.getItem('descriptiveArray')) || [];
      const existingIndex = descriptiveArray.findIndex(item => item.questionId === questionId);
      if (existingIndex !== -1) {
        descriptiveArray[existingIndex].answer = optionDescription;
      } else {
        descriptiveArray.push({ questionId, answer: optionDescription });
      }
      localStorage.setItem('descriptiveArray', JSON.stringify(descriptiveArray));
    }

    setQuestionStates(prevState => {
      const newState = [...prevState];
      newState[currentQuestion].answered = true;
      return newState;
    });

    localStorage.setItem(`question-${currentQuestion + 1}`, JSON.stringify({ questionId, optionId, optionDescription }));
  };

  // Clear answer for the current question
  const handleClearResponse = () => {
    setQuestionStates(prevState => {
      const newState = [...prevState];
      newState[currentQuestion].answered = false;
      newState[currentQuestion].marked = false;
      return newState;
    });

    localStorage.removeItem(`question-${currentQuestion + 1}`);

    if (selectedType === 'mcq') {
      const mcqArray = JSON.parse(localStorage.getItem('mcqArray')) || [];
      const updatedMcqArray = mcqArray.filter(item => item.questionId !== questions[currentQuestion]._id);
      localStorage.setItem('mcqArray', JSON.stringify(updatedMcqArray));
    } else if (selectedType === 'descriptive') {
      const descriptiveArray = JSON.parse(localStorage.getItem('descriptiveArray')) || [];
      const updatedDescriptiveArray = descriptiveArray.filter(item => item.questionId !== questions[currentQuestion]._id);
      localStorage.setItem('descriptiveArray', JSON.stringify(updatedDescriptiveArray));
    }
  };

  // Handle switch between MCQ and descriptive questions
  const handleTypeChange = type => {
    setSelectedType(type);
    setCurrentQuestion(0);
  };

  // Handle submit button click
  const handleSubmit = () => {
    setShowWarning(true);
  };

  // Confirm submission
  const confirmSubmit = () => {
    setShowWarning(false);
    alert('Your answers have been submitted.');
    // Additional submit logic can be added here
  };
  // Render options for MCQ questions
  const renderMCQOptions = question => {
    const storedItem = JSON.parse(localStorage.getItem(`question-${currentQuestion + 1}`)) || {};

    if (!question || !question.options || !Array.isArray(question.options)) {
      return <p>No options available for this question.</p>;
    }

    return (
      <div>
        <p>{question.question}</p>
        <ul className="options">
          {question.options.map(option => (
            <li key={option._id}>
              <input
                type="radio"
                name={`answer-${currentQuestion}`}
                id={option._id}
                value={option._id}
                onChange={() => handleAnswer(option._id, option.answer)}
                checked={localStorage.getItem(`question-${currentQuestion + 1}`) === JSON.stringify({ questionId: question._id, optionId: option._id, optionDescription: option.answer })}
              />
              <label htmlFor={option._id}>{option.answer}</label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render descriptive question text
  const renderDescriptiveQuestion = question => {
    const storedItem = JSON.parse(localStorage.getItem(`question-${currentQuestion + 1}`)) || {};
    return (
      <div>
        <p>{question.question}</p>
        <textarea
          rows="4"
          cols="50"
          value={storedItem.optionDescription || ''}
          onChange={(e) => {
            localStorage.setItem(`question-${currentQuestion + 1}`, JSON.stringify({ ...storedItem, optionDescription: e.target.value }));
          }}
        ></textarea>
      </div>
    );
  };

  if (!questions) {
    return <div>Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available for {selectedType === 'mcq' ? 'MCQ' : 'Descriptive'}.</div>;
  }

  if (currentQuestion < 0 || currentQuestion >= questions.length) {
    return <div>Current question index out of bounds.</div>;
  }

  return (
    <div className="container">
      <main className="main-content">
        <div className="question">
          <h2>Question No {currentQuestion + 1}</h2>
          {selectedType === 'mcq' ? renderMCQOptions(questions[currentQuestion]) : renderDescriptiveQuestion(questions[currentQuestion])}
          <div className="buttons">
            <button onClick={handlePrevious} disabled={currentQuestion === 0}>Previous</button>
            <button
              onClick={handleMarkForReview}
              className={questionStates[currentQuestion]?.marked ? 'marked' : ''}
            >
              {questionStates[currentQuestion]?.marked ? 'Unmark for Review' : 'Mark for Review'}
            </button>
            <button onClick={handleClearResponse}>Clear Response</button>
            <button onClick={handleNext} disabled={currentQuestion === questions.length - 1}>Save & Next</button>
          </div>
        </div>

        <div className="sidebar">
          <div className="sections">
            <button className="section-button" onClick={() => handleTypeChange('mcq')}>MCQ TYPE</button>
            <button className="section-button" onClick={() => handleTypeChange('descriptive')}>DESCRIPTIVE TYPE</button>
          </div>
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
    
          <div className="question-palette">
  <ul>
    {questions.map((question, index) => {
      const state = questionStates[index] || {};
      let className; // Default class for unanswered questions

      if (IsSaveNextClicked && index === currentQuestion) {
        className = 'saved-and-next';
       } 
       // Apply 'saved-and-next' class when Save & Next clicked
      // } else if (state.answered) {
      //   className = 'answered';
      // } else if (state.marked) {
      //   className = 'marked';
      // } else if (!state.visited) {
      //   className = 'not-visited';
      // }

      return (
        <li
          key={question._id}
          className={className}
          onClick={() => setCurrentQuestion(index)}
        >
          {index + 1}
        </li>
      );
    })}
  </ul>
</div>



          </div>
          <div className="button-container">
            <div className="actions">
              <button className="action-button">Question Paper</button>
              <button className="action-button" onClick={handleSubmit}>Submit</button>
            </div>
          </div>

          {showWarning && (
            <div className="modal-card-container">
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-content">
                    <p>Are you sure you want to submit the exam?</p>
                    <div className="modal-buttons">
                      <button className='yesbutton' onClick={confirmSubmit}>Yes</button>
                      <button className='nobutton' onClick={() => setShowWarning(false)}>No</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Test;
