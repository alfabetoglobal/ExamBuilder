import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/ExamForm.css";
import instructionFile from '../Assets/instruction.pdf';
import sampleFileMCQ from '../Assets/ExcelMCQ.xlsx';
import sampleFile from '../Assets/ExcelDESCRIPTIVE.xlsx';


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
    // optionImages: [],
    optionImages: ["", ""],
  });
  const [showDropdown, setShowDropdown] = useState(false); // Define showDropdown state
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDropdownFocused, setIsDropdownFocused] = useState(false);
  const [imagePreviewModal, setImagePreviewModal] = useState(false); // State for image preview modal
  const [selectedImage, setSelectedImage] = useState(null); // State to store selected image
  const [imageUploadType, setImageUploadType] = useState(""); // State to store type of image being uploaded
  const [optionIndex, setOptionIndex] = useState(null);
  const [imageUploadIndex, setImageUploadIndex] = useState(null); // State to store index of option image being uploaded



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


  // const handleImageUpload = (file, type, index) => {

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const base64Data = reader.result.split(',')[1];


  //     // Check file size
  //     // const fileSizeInKB = (file.size / 1024);
  //     // if (fileSizeInKB < 200) {
  //     //   alert("Image size is smaller than the required minimum (200 KB). Please select a larger image.");
  //     //   return;
  //     // }
  //     setSelectedImage(base64Data); // Set selected image for preview in modal
  //     setImagePreviewModal(true); // Open image preview modal
  //     setImageUploadType(type);
  //     setOptionIndex(index); // Set the index for the option being uploaded
  //   };
  //   reader.onerror = (error) => {
  //     console.error('Error reading file:', error);
  //     // Handle error if needed
  //   };

  //   // Check file size before reading

  //   reader.readAsDataURL(file);
  // };

  // const handleConfirmImage = () => {
  //   if (selectedImage) {
  //     try {
  //       let imageType = imageUploadType; // "question" or "option"

  //       // Get existing images from local storage
  //       const existingImages = JSON.parse(localStorage.getItem('images')) || [];

  //       // Determine image type for options
  //       if (imageType === "option" && optionIndex !== null) {
  //         imageType = `option${optionIndex + 1}`;
  //       }

  //       // Create new image object
  //       const newImage = {
  //         type: imageType,
  //         base64encodedurl: selectedImage
  //       };

  //       // Check if an image for the same option already exists
  //       const updatedImages = existingImages.filter(img => img.type !== imageType);
  //       updatedImages.push(newImage);

  //       // Save the updated array back to local storage
  //       localStorage.setItem('images', JSON.stringify(updatedImages));

  //       // Update state or perform other actions with imageUrl
  //       if (imageType === "question") {
  //         setCurrentQuestion((prevQuestion) => ({
  //           ...prevQuestion,
  //           questionImage: selectedImage
  //         }));
  //       } else if (imageType.startsWith("option")) {
  //         setCurrentQuestion((prevQuestion) => {
  //           const updatedOptionImages = [...prevQuestion.optionImages];
  //           updatedOptionImages[optionIndex] = selectedImage;
  //           return {
  //             ...prevQuestion,
  //             optionImages: updatedOptionImages
  //           };
  //         });
  //       }

  //       // Log image type to console
  //       console.log('Image stored successfully:', imageType);

  //     } catch (error) {
  //       console.error('Error storing image:', error.message);
  //       // Handle error state or display error message
  //     } finally {
  //       setSelectedImage(null);
  //       setImagePreviewModal(false);
  //     }
  //   }
  // };


  // const handleCancelImage = () => {
  //   // Clear selected image state and close modal
  //   setSelectedImage(null);
  //   setImagePreviewModal(false);
  //   // Further processing logic if needed
  //   // ...
  // };
  // const getDropdownOptions = () => {
  //   const existingImages = JSON.parse(localStorage.getItem('images')) || [];
  //   return currentQuestion.options.map((option, index) => {
  //     const imageType = `option${index + 1}image`;
  //     const image = existingImages.find(img => img.type === imageType);
  //     return image ? imageType : option;
  //   });
  // };

  const handleAddQuestion = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      // Iterate through all images in local storage
      const existingImages = JSON.parse(localStorage.getItem('images')) || [];
      const updatedImages = [];

      // Upload images to S3 and replace base64encodedurl with imageUrl
      for (let i = 0; i < existingImages.length; i++) {
        const img = existingImages[i];
        if (!img.base64encodedurl) continue; // Skip if no base64encodedurl

        // Construct the API payload
        const apiPayload = {
          body: JSON.stringify({
            imageType: img.type, // Use existing type from local storage
            image: img.base64encodedurl, // Use base64encodedurl from local storage
          }),
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        };

        // Make the API call to upload image to S3
        try {
          const response = await axios.post(
            "https://7efwp1v3ed.execute-api.us-east-1.amazonaws.com/upload/imageS3Bucket",
            apiPayload
          );

          // Handle the API response
          const { imageUrl } = JSON.parse(response.data.body); // Parse the JSON body to extract imageUrl
          console.log(`Image uploaded successfully: ${imageUrl}`);

          // Update local storage with imageUrl replacing base64encodedurl
          updatedImages.push({
            ...img,
            base64encodedurl: imageUrl, // Update base64encodedurl with imageUrl
          });
        } catch (error) {
          console.error('Error uploading image to S3:', error.message);
          // Handle error if needed
        }
      }

      // Save updated images array back to local storage
      localStorage.setItem('images', JSON.stringify(updatedImages));

      // Function to map updated images to their respective fields
      const mapImagesToFields = (field, updatedImages) => {
        const image = updatedImages.find(img => img.type === field);
        return image ? image.base64encodedurl : "";
      };
 
      // Function to map updated images to their respective options
      // const mapImagesToOptions = (options, updatedImages) => {
      //   return options.map((option, index) => {
      //     const imageUrl = mapImagesToFields(`option${index + 1}`, updatedImages);
      //     return {
      //       answer: option,
      //       answerImageLink: imageUrl, // Use imageUrl for answerImageLink
      //     };
      //   });
      // };

      const mapOptions = (options, images) => {
        return options.map((option, index) => {
            const image = images.find(img => img.type === `option${index + 1}`);
            return {
                answer: option,
                answerImageLink: image ? image.base64encodedurl : "",
            };
        });
    };

    const questionImage = updatedImages.find(img => img.type === 'question');
    const optionImages = updatedImages.filter(img => img.type.startsWith('option'));

      let payload;
      if (questionType === "MCQ") {
        // Validate if a valid correct answer is selected
        console.log("Current Question:", currentQuestion);
        console.log("Selected Answer:", currentQuestion.correctAnswer);
        console.log("Options:", currentQuestion.options);

 

        // if (!currentQuestion.correctAnswer || !currentQuestion.options.some(option => option === currentQuestion.correctAnswer)) {
        //   console.log("Invalid Correct Answer:", currentQuestion.correctAnswer);
        //   console.log("Options:", currentQuestion.options);
        //   toast.warn("Please choose a valid option as correct answer.");
        //   setLoading(false);
        //   return;
        // }
        


        const questionData = {
          question: currentQuestion.question,
          options: mapOptions(currentQuestion.options, optionImages),
          correctAnswer: currentQuestion.options.indexOf(currentQuestion.correctAnswer) + 1,
          description: currentQuestion.answerDescription || "",
          questionImageLink: questionImage ? questionImage.base64encodedurl : "",
        };

        payload = {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizTitle: title,
            mcqQuizz: [questionData],
          }),
        };
        // Post the payload to add question API after all images are processed
        const addQuestionResponse = await axios.post(
          "https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/add/Question",
          payload
        );

        console.log("Question API response:", addQuestionResponse.data);
        toast.success("Question saved successfully!");
      } else if (questionType === "Subjective") {
        const questionData = {
          question: currentQuestion.question || "",
          questionImageLink: mapImagesToFields("question", updatedImages),
          answer: currentQuestion.answerDescription || "",
          answerImageLink: updatedImages.find(img => img.type === "answer")?.base64encodedurl || ""
          
        };

        payload = {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizTitle: title,
            descriptiveQuizz: [questionData],
          }),
        };

        // Post the payload to add question API after all images are processed
        const addQuestionResponse = await axios.post(
          "https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/questionstyle/descriptiveQuestion",
          payload
          
        );

        console.log("Descriptive question API response:", addQuestionResponse.data);
        toast.success("Descriptive question saved successfully!");
      }

      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        question: "",
        options: ["", ""],
        correctAnswer: "", // Reset correctAnswer
        answerDescription: "",
        questionImage: null,
        optionImages: [],
      });

      fetchTotalQuestions();
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to save question. Please try again.");
    } finally {
      // Clear images from local storage
      localStorage.removeItem('images');
      setLoading(false);
    }
  };



  const handleSubmitAllQuestions = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const payload = {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizTitle: title,
      }),
    };
    console.log("Payload being sent to PaperSubmit API:", payload);
    try {
      const response = await axios.post(
        "https://ee4pmf8ys1.execute-api.us-east-1.amazonaws.com/check/PaperSubmit",
       payload,
      
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

      <ToastContainer />
      <div className="exam-form">
        <h2 className="Examtitle">Exam Form</h2>
        <p>Title: {title}</p>
        <form>
          <div className="forme-group">
            <select
              className="forme-select"
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
                <div className="forme-group-question">
                  <input
                    type="text"
                    className="forme-control"
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
                  {/* <button
                    type="button"
                    className="upload-button"
                    onClick={() => document.getElementById("questionImageUpload").click()}
                  >
                    Upload Question Image
                  </button> */}
                  <input
                    type="file"
                    id="questionImageUpload"
                    className="add-question-button"
                    style={{ display: "none" }}
                    accept="image/*"
                  // onChange={(e) => handleImageUpload(e.target.files[0], "question")}
                  />
                </div>

                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="forme-group">
                    <input
                      type="text"
                      className="forme-control"
                      placeholder={`Option ${index + 1}`}
                      aria-label={`Option ${index + 1}`}
                      id={`option${index + 1}`}
                      name={`option${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e)}
                    />
                    {/* <button
                      type="button"
                      className="upload-button"
                      onClick={() => document.getElementById(`optionImageUpload${index}`).click()}
                    >
                      Upload Option Image
                    </button> */}
                    <input
                      type="file"
                      id={`optionImageUpload${index}`}
                      className="add-option-button"
                      style={{ display: "none" }}
                      accept="image/*"
                    // onChange={(e) => handleImageUpload(e.target.files[0], "option", index)}
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

                {questionType === "MCQ" && (
                  <div className="form-group">
                     <select
                                    id="correctAnswer"
                                    className="forme-control"
                                    value={currentQuestion.correctAnswer}
                                    onChange={(e) =>
                                        setCurrentQuestion({
                                            ...currentQuestion,
                                            correctAnswer: e.target.value,
                                        })
                                    }

                                    onFocus={() => setIsDropdownFocused(true)}
                                    onBlur={() => setIsDropdownFocused(false)}
                                >
                                      {!isDropdownFocused && <option value="" disabled={!currentQuestion.correctAnswer}>Select correct answer</option>}
                                    {isDropdownFocused && currentQuestion.options.map((option, index) => {
                                        const optionText = `Option ${index + 1}`;
                                        const hasText = !!option.trim(); // Check if there is text for this option
                                        const hasImage = !!currentQuestion.optionImages[index]; // Check if image exists for this option index
                                        const optionValue = hasText ? option : `option${index + 1}image`;
                                        return (
                                            <option key={index} value={optionValue} disabled={!(hasText || hasImage)}>
                                                {hasText ? optionText : (hasImage ? `Option ${index + 1} Image` : '')}
                                            </option>
                                        );
                                    })}
                                </select>

          
                    {/* <select
                      className="form-control custom-dropdown"
                      id="correctAnswer"
                      value={currentQuestion.correctAnswer}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: e.target.value,
                        })
                      }
                      
                      onFocus={() => setIsDropdownFocused(true)}
                      onBlur={() => setIsDropdownFocused(false)}
                    > */}
                      {/* {!isDropdownFocused && (
                        <option value="" disabled={!currentQuestion.correctAnswer}>
                          Select correct answer
                        </option>
                      )}
                      {isDropdownFocused &&
                        currentQuestion.options.map((option, index) => {
                          const optionText = `Option ${index + 1}`;
                          const hasText = !!option.trim(); // Check if there is text for this option
                          return (
                            <option
                              key={index}
                              value={hasText ? option : `option${index + 1}`}
                              disabled={!hasText}
                            >
                              {optionText}
                            </option>
                          );
                        })}
                    </select> */}



                  </div>
                )}


                <div className="forme-group">
                  <textarea
                    className="forme-control"
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

                <div className="forme-group-question">
                  <input
                    type="text"
                    className="forme-control"
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
                  {/* <button
                    type="button"
                    className="upload-button"
                    onClick={() => document.getElementById("questionImageUpload").click()}
                  >
                    Upload Question Image
                  </button>
                  <input
                    type="file"
                    id="questionImageUpload"
                    className="add-question-button"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], "question")}
                  /> */}
                </div>

                <div className="forme-group">
                  <textarea
                    className="forme-control"
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
                  {/* <button
                    type="button"
                    className="upload-button"
                    onClick={() => document.getElementById("answerImageUpload").click()}
                  >
                    Upload Answer Image(s)
                  </button> */}
                  <input
                    type="file"
                    id="answerImageUpload"
                    style={{ display: "none" }}
                    multiple
                    accept="image/*"
                  // onChange={(e) => handleImageUpload(e.target.files[0], "answer")}
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
      {/* <div class="modal" style={{ display: imagePreviewModal ? 'block' : 'none' }}>
        <div class="modal-content">
          <div class="modal-header">
            <h2>Image Preview</h2>
            <span class="close" onClick={handleCancelImage}>&times;</span>
          </div>
          <div class="modal-body">
            {selectedImage && <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Preview" />}
          </div>
          <div class="modal-footer">
            <button onClick={handleConfirmImage}>Confirm</button>
            <button onClick={handleCancelImage}>Cancel</button>
          </div>
        </div>
      </div> */}

    </div>

  );
};

export default ExamForm;
