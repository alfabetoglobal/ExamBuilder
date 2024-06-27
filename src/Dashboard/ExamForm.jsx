import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/ExamForm.css";
import instructionFile from '../Assets/instruction.pdf';
import sampleFileMCQ from '../Assets/newtest.xlsx';
import sampleFile from '../Assets/descriptiveExcel.xlsx';


const ExamForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState(location.state ? location.state.quizTitle : "");
  const [questionType, setQuestionType] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", ""],
    correctAnswer: "",
    answerDescription: "",
    questionImage: null,
    optionImages: [],
  });
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        handleUploadExcel(base64Data);
      };
      reader.readAsDataURL(acceptedFiles[0]);
    },
  });

  const fetchTotalQuestions = async () => {
    const token = localStorage.getItem('token');
    const payload = {
      body: JSON.stringify({ quizTitle: title }),
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    };

    try {
      const response = await axios.post(
        "https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/all/questionCount",
        payload
      );
      console.log("Question count API response:", response.data);
      const totalQuizzCount = JSON.parse(response.data.body).totalQuizzCount; 
      setTotalQuestions(totalQuizzCount); 
    } catch (error) {
      console.error("Error fetching question count:", error);
    } finally {
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    fetchTotalQuestions();
  }, [title]); 

  const handleQuestionTypeChange = (event) => {
    setQuestionType(event.target.value);
  };

  const handleOptionChange = (index, event) => {
    const { value } = event.target;
    if (value.length <= 150) {
      const updatedOptions = [...currentQuestion.options];
      updatedOptions[index] = value;
      setCurrentQuestion({
        ...currentQuestion,
        options: updatedOptions,
      });
    }
  };

  const handleAddOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, ""],
    });
  };
   
  const handleRemoveOption = (index) => {
    const updatedOptions = currentQuestion.options.filter(
      (_, optionIndex) => optionIndex !== index
    );
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions,
    });
  };

  const handleUploadExcel = async (base64Data) => {
    setLoading(true);
    const payload = {
      excelFile: base64Data,
      quizTitle: title,
    };

    const token = localStorage.getItem('token');
    console.log('JWT', token);
    console.log("Payload being sent to Excel API:", payload);
    try {
      let response;
      if (questionType === "MCQ") {
        response = await axios.post(
          "https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/Many/addExcelQuestion",
          JSON.stringify({
            body: payload,
            headers: {
              "Authorization": token,
              "Content-Type": "application/json",
            },
          })
        );
      } else if (questionType === "Subjective") {
        response = await axios.post(
          "https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/questiontype/descriptiveexcelquestion",
          JSON.stringify({
            body: payload,
            headers: {
              "Authorization": token,
              "Content-Type": "application/json",
            },
          })
        );
      }
      console.log("Excel API response:", response.data);
      toast.success("Excel file uploaded successfully!");
      fetchTotalQuestions(); 
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      toast.error("Failed to upload Excel file. Please try again.");
    } finally {
      setLoading(false); 
    }
  };
  const handleImageUpload = (file, type, index = null) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1]; 
      if (type === "question") {
        setCurrentQuestion((prev) => ({ ...prev, questionImage: base64Data }));
      } else if (type === "option") {
        const updatedOptionImages = [...currentQuestion.optionImages];
        updatedOptionImages[index] = base64Data;
        setCurrentQuestion((prev) => ({ ...prev, optionImages: updatedOptionImages }));
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleAddQuestion = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      let payload;
      if (questionType === "MCQ") {
        // Ensure correct answer is in options or answerImages
        const validAnswer = currentQuestion.options.includes(currentQuestion.correctAnswer) || currentQuestion.optionImages.includes(currentQuestion.correctAnswer);
        if (!validAnswer) {
          toast.warn("Please ensure that the correct answer is one of the options or images.");
          setLoading(false);
          return;
        }
  
        const questionData = {
          answers: currentQuestion.options.filter(opt => opt) || [],
          correctAnswer: currentQuestion.correctAnswer,
          description: currentQuestion.answerDescription || "",
          answerImage: currentQuestion.optionImages.filter(img => img) || [],
        };
        
        if (currentQuestion.question) {
          questionData.question = currentQuestion.question;
        } else if (currentQuestion.questionImage) {
          questionData.questionImage = currentQuestion.questionImage;
        } else {
          toast.warn("Please provide either a question text or an image.");
          setLoading(false);
          return;
        }
  
        payload = {
          quizTitle: title,
          mcqQuizz: [questionData],
        };
  
        const response = await axios.post(
          "https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/add/Question",
          JSON.stringify({
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        );
  
        console.log("MCQ question API response:", response.data);
        toast.success("MCQ question saved successfully!");
      } else if (questionType === "Subjective") {
        const questionData = {
          answer: currentQuestion.answerDescription || "",
          answerImage: currentQuestion.optionImages.filter(img => img) || [],
        };
  
        if (currentQuestion.question) {
          questionData.question = currentQuestion.question;
        } else if (currentQuestion.questionImage) {
          questionData.questionImage = currentQuestion.questionImage;
        } else {
          toast.warn("Please provide either a question text or an image.");
          setLoading(false);
          return;
        }
  
        payload = {
          quizTitle: title,
          descriptiveQuizz: [questionData],
        };
  
        const response = await axios.post(
          "https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/questionstyle/descriptiveQuestion",
          JSON.stringify({
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        );
  
        console.log("Descriptive question API response:", response.data);
        toast.success("Descriptive question saved successfully!");
      }
  
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        question: "",
        options: ["", ""],
        correctAnswer: "",
        answerDescription: "",
        questionImage: null,
        optionImages: [],
      });
      fetchTotalQuestions();
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to save question. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmitAllQuestions = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const payload = {
      quizTitle: title,
    };
    console.log("Payload being sent to PaperSubmit API:", payload);
    try {
      const response = await axios.post(
        "https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/check/PaperSubmit",
        JSON.stringify(payload),
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("PaperSubmit API response:", response.data);
      toast.success("Question paper submitted successfully!");
      navigate("/NavigationBar");
    } catch (error) {
      console.error("Error submitting question paper:", error);
      toast.error("Failed to submit question paper. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-examform">
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <ToastContainer />
      <div className="exam-form">
        <h2 className="Examtitle">Exam Form</h2>
        <p>Title: {title}</p>
        <form>
          <div className="form-group">
            <select
              className="form-select"
              id="questionType"
              name="questionType"
              value={questionType}
              onChange={handleQuestionTypeChange}
            >
              <option value="">Select Question Type</option>
              <option value="MCQ">Multiple Choice Questions</option>
              <option value="Subjective">Subjective</option>
            </select>
          </div>
        </form>
        {questionType === "MCQ" && (
          <div className="mcq-section">
            <div className="MCQcontainer">
              <div className="MCQFORM">
                <h3 className="ADDMCQ">Add MCQ Question</h3>
                <div className="total-questions">
                  <p>Total Questions: <span id="total-questions">{totalQuestions}</span></p>
                </div>
                <div className="form-group">
                <button
                    type="button"
                    className="upload-button"
                    onClick={() => document.getElementById("questionImageUpload").click()}
                  >
                    Upload Question Image
                  </button>
                  <input
                    type="file"
                    id="questionImageUpload"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], "question")}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Question"
                    aria-label="Question"
                    id="question"
                    name="question"
                    value={currentQuestion.question}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        question: e.target.value,
                      })
                    }
                  />
                  
                </div>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Option ${index + 1}`}
                      aria-label={`Option ${index + 1}`}
                      id={`option${index + 1}`}
                      name={`option${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e)}
                    />
                    {index >= 2 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleRemoveOption(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter correct answer"
                    aria-label="Enter correct answer"
                    id="correctAnswer"
                    name="correctAnswer"
                    value={currentQuestion.correctAnswer}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        correctAnswer: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    id="answerDescription"
                    placeholder="Enter answer description (optional)"
                    aria-label="Enter answer description"
                    name="answerDescription"
                    value={currentQuestion.answerDescription}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        answerDescription: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="button-group">
                  <button
                    type="button"
                    className="add-option-button"
                    onClick={handleAddOption}
                  >
                    Add Option
                  </button>
                  <button
    type="button"
    className="upload-button"
    onClick={() => document.getElementById("optionImageUpload").click()}
  >
    Upload Option Image
  </button>
  <input
    type="file"
    id="optionImageUpload"
    style={{ display: "none" }}
    accept="image/*"
    onChange={(e) => handleImageUpload(e.target.files[0], "option")}
  />
                  <button
                    type="button"
                    className="add-question-button"
                    onClick={handleAddQuestion}
                  >
                    Add Question
                  </button>
                </div>
              </div>
              <div className="import-section">
                <h3 className="IMPORTMCQ">Import MCQ Question Paper</h3>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <p>Drag an Excel file (.xlsx) here to upload.</p>
                </div>
                <div className="file-links">
      Please refer to the instruction document 
      <a href={instructionFile} download>
        (instructions.pdf) 
      </a>
      and the example Excel file 
      <a href={sampleFileMCQ} download>
        (example.xlsx)
      </a>
      for guidance on uploading data to our website. These documents provide step-by-step instructions and sample data to ensure proper format and successful upload.
    </div>
              </div>
            </div>
          </div>
        )}
        {questionType === "Subjective" && (
          <div className="subjective-section">
            <div className="SUBcontainer"> 
              <div className="SUBFORM">
               <h3 className="ADDSUB">Add Subjective Question</h3>
               <div className="total-questions">
                <p>Total Questions: <span id="total-questions">{totalQuestions}</span></p>
               </div>
               <div className="form-group">
               <button
                  type="button"
                  className="upload-button"
                  onClick={() => document.getElementById("questionImageUpload").click()}
                >
                  Upload Question Image
                </button>
                <input
                  type="file"
                  id="questionImageUpload"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], "question")}
                />
                <input
                  type="text"
                  className="form-control"
                  id="subjectiveQuestion"
                  placeholder="Question"
                  aria-label="Question"
                  name="subjectiveQuestion"
                  value={currentQuestion.question}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      question: e.target.value,
                    })
                  }
                />
               </div>
               <div className="form-group">
                <textarea
                  className="form-control"
                  id="answerDescription"
                  placeholder="Enter answer description"
                  aria-label="Enter answer description"
                  name="answerDescription"
                  value={currentQuestion.answerDescription}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      answerDescription: e.target.value,
                    })
                  }
                />
               </div>
               <div className="button-group">
               <button
                      type="button"
                      className="upload-button"
                      onClick={() => document.getElementById("answerImageUpload").click()}
                    >
                      Upload Answer Image(s)
                    </button>
                    <input
                      type="file"
                      id="answerImageUpload"
                      style={{ display: "none" }}
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files, "option")}
                    />
                <button
                  type="button"
                  className="add-question-button"
                  onClick={handleAddQuestion}
                >
                  Add Question
                </button>
               </div>
              </div>
              <div className="import-section">
                <h3 className="IMPORTSUB">Import Subjective Question Paper</h3>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <p>Drag an Excel file (.xlsx) here to upload.</p>
                </div>
                <div className="file-links">
      Please refer to the instruction document 
      <a href={instructionFile} download>
        (instructions.pdf) 
      </a>
      and the example Excel file 
      <a href={sampleFile} download>
        (example.xlsx)
      </a>
      for guidance on uploading data to our website. These documents provide step-by-step instructions and sample data to ensure proper format and successful upload.
    </div>

              </div>
            </div>
          </div>
        )}
        <div className="submit-button-container">
          <button
            type="button"
            className="submit-questions-button"
            onClick={handleSubmitAllQuestions}
          >
            Submit Questions Paper
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamForm;
