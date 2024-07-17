// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import '../css/EditMcqQuestion.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const EditMcqQuestion = () => {
//     const { questionId } = useParams();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [title, setTitle] = useState(location.state ? location.state.quizTitle : "");
//     const [questions, setQuestions] = useState([]);
//     const [currentQuestion, setCurrentQuestion] = useState({
//         question: "",
//         options: ["", ""],
//         correctAnswer: "",
//         answerDescription: "",
//         questionImage: null,
//         optionImages: [],
//     });
//     const [loading, setLoading] = useState(false);
//     const [isDropdownFocused, setIsDropdownFocused] = useState(false);
//     const [imagePreviewModal, setImagePreviewModal] = useState(false);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [imageUploadType, setImageUploadType] = useState("");
//     const [optionIndex, setOptionIndex] = useState(null);

//     useEffect(() => {
//         if (!questionId) {
//             toast.error("Question ID is required");
//             navigate('/'); // Navigate to a default route if questionId is not available
//             return;
//         }
//         // Fetch existing question details here if needed
//     }, [questionId, navigate]);

//     const handleOptionChange = (index, event) => {
//         const { value } = event.target;
//         if (value.length <= 150) {
//             const updatedOptions = [...currentQuestion.options];
//             updatedOptions[index] = value;
//             setCurrentQuestion({
//                 ...currentQuestion,
//                 options: updatedOptions,
//             });
//         }
//     };

//     const handleAddOption = () => {
//         setCurrentQuestion({
//             ...currentQuestion,
//             options: [...currentQuestion.options, ""],
//         });
//     };
    
//     const handleRemoveOption = (index) => {
//         const updatedOptions = currentQuestion.options.filter(
//             (_, optionIndex) => optionIndex !== index
//         );
//         setCurrentQuestion({
//             ...currentQuestion,
//             options: updatedOptions,
//         });
//     };
    
//     const handleImageUpload = (file, type, index) => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             const base64Data = reader.result.split(',')[1];
//             setSelectedImage(base64Data);
//             setImagePreviewModal(true);
//             setImageUploadType(type);
//             setOptionIndex(index);
//         };
//         reader.onerror = (error) => {
//             console.error('Error reading file:', error);
//         };
//         reader.readAsDataURL(file);
//     };
    
//     const handleConfirmImage = () => {
//         if (selectedImage) {
//             try {
//                 let imageType = imageUploadType;
//                 const existingImages = JSON.parse(localStorage.getItem('images')) || [];
//                 if (imageType === "option" && optionIndex !== null) {
//                     imageType = `option${optionIndex + 1}`;
//                 }
//                 const newImage = {
//                     type: imageType,
//                     base64encodedurl: selectedImage
//                 };
//                 const updatedImages = existingImages.filter(img => img.type !== imageType);
//                 updatedImages.push(newImage);
//                 localStorage.setItem('images', JSON.stringify(updatedImages));
//                 if (imageType === "question") {
//                     setCurrentQuestion((prevQuestion) => ({
//                         ...prevQuestion,
//                         questionImage: selectedImage
//                     }));
//                 } else if (imageType.startsWith("option")) {
//                     setCurrentQuestion((prevQuestion) => {
//                         const updatedOptionImages = [...prevQuestion.optionImages];
//                         updatedOptionImages[optionIndex] = selectedImage;
//                         return {
//                             ...prevQuestion,
//                             optionImages: updatedOptionImages
//                         };
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error storing image:', error.message);
//             } finally {
//                 setSelectedImage(null);
//                 setImagePreviewModal(false);
//             }
//         }
//     };
    
//     const handleCancelImage = () => {
//         setSelectedImage(null);
//         setImagePreviewModal(false);
//     };
    
//     const handleUpdatedQuestion = async () => {
//         setLoading(true);
//         const token = localStorage.getItem('token');
//         try {
//             const existingImages = JSON.parse(localStorage.getItem('images')) || [];
//             const updatedImages = [];
//             for (let i = 0; i < existingImages.length; i++) {
//                 const img = existingImages[i];
//                 if (!img.base64encodedurl) continue;
//                 const apiPayload = {
//                     body: JSON.stringify({
//                         imageType: img.type,
//                         image: img.base64encodedurl,
//                     }),
//                     headers: {
//                         Authorization: token,
//                         "Content-Type": "application/json",
//                     },
//                 };
//                 try {
//                     const response = await axios.post(
//                         "https://7efwp1v3ed.execute-api.us-east-1.amazonaws.com/upload/imageS3Bucket",
//                         apiPayload
//                     );
//                     const { imageUrl } = JSON.parse(response.data.body);
//                     updatedImages.push({
//                         ...img,
//                         base64encodedurl: imageUrl,
//                     });
//                 } catch (error) {
//                     console.error('Error uploading image to S3:', error.message);
//                 }
//             }
    
//             localStorage.setItem('images', JSON.stringify(updatedImages));
//             console.log('Updated images in localStorage:', JSON.parse(localStorage.getItem('images')));
    
//             const mapOptions = (options, images) => {
//                 return options.map((option, index) => {
//                     const image = images.find(img => img.type === `option${index + 1}`);
//                     return {
//                         answer: option,
//                         answerImageLink: image ? image.base64encodedurl : "",
//                     };
//                 });
//             };
    
//             const questionImage = updatedImages.find(img => img.type === 'question');
//             const optionImages = updatedImages.filter(img => img.type.startsWith('option'));
    
//             const questionData = {
//                 question: currentQuestion.question,
//                 options: mapOptions(currentQuestion.options, optionImages),
//                 // correctAnswer: currentQuestion.correctAnswer,
//                 correctAnswer: currentQuestion.options.indexOf(currentQuestion.correctAnswer) + 1,
//                 description: currentQuestion.answerDescription || "",
//                 questionImageLink: questionImage ? questionImage.base64encodedurl : "",
//             };
    
//             const payload = {
//                 headers: {
//                     Authorization: token,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     questionId: questionId,
//                     updatedQuestion: questionData,
//                 }),
//             };
        
    
//             const response = await axios.post(
//                 "https://7efwp1v3ed.execute-api.us-east-1.amazonaws.com/userdashbordedit/dashbordquestionEdit",
//                 payload
//             );
//             console.log("MCQ payload", payload);
    
//             console.log("Question API response:", response.data);
//             toast.success("Question updated successfully!");
    
//             setCurrentQuestion({
//                 question: "",
//                 options: ["", ""],
//                 correctAnswer: "",
//                 answerDescription: "",
//                 questionImage: null,
//                 optionImages: [],
//             });
    
//             navigate("/NavigationBar");
//             // navigate(`/quiz-detail/${questionId}`);
    
//         } catch (error) {
//             console.error("Error updating question:", error);
//             toast.error("Failed to update question. Please try again.");
//         } finally {
//             localStorage.removeItem('images');
//             setLoading(false);
//         }
//     };
    
    
//     // Inside the return statement of EditMcqQuestion component
//     // Inside the return statement of EditMcqQuestion component
//     return (
//         <div className="edit-exam">
//             {loading && (
//                 <div className="loader-overlay">
//                     <div className="loader"></div>
//                 </div>
//             )}
//             <h2 className="Examtitle">Edit MCQ Questions</h2>
//             <div className="containerEditMcqQuestion">
//                 <ToastContainer />
//                 <div className="mcq-section">
//                     <div className="MCQcontainer">
//                         <div className="MCQFORM">
//                             <div className="forme-group-questionn">
//                                 <input
//                                     type="text"
//                                     className="forme-control"
//                                     placeholder="Question"
//                                     aria-label="Question"
//                                     id="question"
//                                     name="question"
//                                     value={currentQuestion.question}
//                                     onChange={(e) =>
//                                         setCurrentQuestion({
//                                             ...currentQuestion,
//                                             question: e.target.value,
//                                         })
//                                     }
//                                 />
//                                 {/* <div className="upload-questionimage">
//                                     <label htmlFor="questionImageUpload" className="upload-buttonn">
//                                         Upload Question Image
//                                     </label>
//                                     <input
//                                         type="file"
//                                         id="questionImageUpload"
//                                         accept=".jpg,.jpeg,.png"
//                                         style={{ display: 'none' }}
//                                         onChange={(e) => {
//                                             const file = e.target.files[0];
//                                             if (file) {
//                                                 handleImageUpload(file, "question");
//                                             }
//                                         }}
//                                     />
//                                 </div> */}
//                             </div>

//                             {currentQuestion.options.map((option, index) => (
//                                 <div key={index} className="option-row">
//                                     <input
//                                         type="text"
//                                         className="forme-control"
//                                         placeholder={`Option ${index + 1}`}
//                                         aria-label={`Option ${index + 1}`}
//                                         value={option}
//                                         onChange={(e) => handleOptionChange(index, e)}
//                                     />

//                                     {/* {(
//                                         <div className="upload-optionimage">
//                                             <label htmlFor={`optionImageUpload${index}`} className="upload-buttonn">
//                                                 Upload Option Image
//                                             </label>
//                                             <input
//                                                 type="file"
//                                                 id={`optionImageUpload${index}`}
//                                                 accept=".jpg,.jpeg,.png"
//                                                 style={{ display: 'none' }}
//                                                 onChange={(e) => {
//                                                     const file = e.target.files[0];
//                                                     if (file) {
//                                                         handleImageUpload(file, "option", index);
//                                                     }
//                                                 }}
//                                             />
//                                         </div>
//                                     )} */}
//                                     {index > 1 && (
//                                         <button
//                                             className="remove-option"
//                                             onClick={() => handleRemoveOption(index)}
//                                         >
//                                             Remove
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                             <div className="add-option-container">
//                                 <button
//                                     className="add-optionn"
//                                     onClick={handleAddOption}
//                                     disabled={currentQuestion.options.length >= 4}
//                                 >
//                                     Add Option
//                                 </button>
//                             </div>
//                             <div className="forme-group">
//                                 <select
//                                     id="correctAnswer"
//                                     className="forme-control"
//                                     value={currentQuestion.correctAnswer}
//                                     onChange={(e) =>
//                                         setCurrentQuestion({
//                                             ...currentQuestion,
//                                             correctAnswer: e.target.value,
//                                         })
//                                     }

//                                     onFocus={() => setIsDropdownFocused(true)}
//                                     onBlur={() => setIsDropdownFocused(false)}
//                                 >

//                                     {!isDropdownFocused && <option value="" disabled={!currentQuestion.correctAnswer}>Select correct answer</option>}
//                                     {isDropdownFocused && currentQuestion.options.map((option, index) => {
//                                         const optionText = `Option ${index + 1}`;
//                                         const hasText = !!option.trim(); // Check if there is text for this option
//                                         const hasImage = !!currentQuestion.optionImages[index]; // Check if image exists for this option index
//                                         const optionValue = hasText ? option : `option${index + 1}image`;
//                                         return (
//                                             <option key={index} value={optionValue} disabled={!(hasText || hasImage)}>
//                                                 {hasText ? optionText : (hasImage ? `Option ${index + 1} Image` : '')}
//                                             </option>
//                                         );
//                                     })}
//                                 </select>



//                             </div>
//                             <div className="forme-group">
//                                 <textarea
//                                     className="forme-control"
//                                     placeholder="Answer Description"
//                                     value={currentQuestion.answerDescription}
//                                     onChange={(e) =>
//                                         setCurrentQuestion({
//                                             ...currentQuestion,
//                                             answerDescription: e.target.value,
//                                         })
//                                     }
//                                 ></textarea>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="form-group-buttons">
//                     <button className="btn save" onClick={handleUpdatedQuestion}>
//                         Updated Question
//                     </button>

//                 </div>
//             </div>
//             {imagePreviewModal && (
//                 <div className="image-preview-modal" onClick={() => setImagePreviewModal(false)}>
//                     <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
//                         <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Preview" className="image-preview" />
//                         <div className="image-preview-buttons">
//                             <button className="confirm" onClick={handleConfirmImage}>Confirm</button>
//                             <button className="cancel" onClick={handleCancelImage}>Cancel</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

// };
// export default EditMcqQuestion;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/EditMcqQuestion.css';

const EditMcqQuestion = () => {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentQuestion, setCurrentQuestion] = useState({
        question: "",
        options: ["", ""],
        correctAnswer: "",
        answerDescription: "",
        questionImage: null,
        optionImages: [],
    });
    const [loading, setLoading] = useState(false);
    const [isDropdownFocused, setIsDropdownFocused] = useState(false);
    const [imagePreviewModal, setImagePreviewModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUploadType, setImageUploadType] = useState("");
    const [optionIndex, setOptionIndex] = useState(null);

    useEffect(() => {
        if (!questionId || !location.state || !location.state.question) {
            toast.error("Question details not found.");
            navigate('/'); // Navigate to a default route if question details are not available
            return;
        }
        
        const { question } = location.state;

        // Set current question details from location state
        setCurrentQuestion({
            question: question.question || "",
            options: question.options.map(opt => opt.answer),
            correctAnswer: question.correctAnswer || "",
            answerDescription: question.answerDescription || "",
            questionImage: question.questionImageLink || null,
            optionImages: question.options.map(opt => opt.answerImageLink || null),
        });

    }, [questionId, navigate, location.state]);

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

    const handleImageUpload = (file, type, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            setSelectedImage(base64Data);
            setImagePreviewModal(true);
            setImageUploadType(type);
            setOptionIndex(index);
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };
        reader.readAsDataURL(file);
    };

    const handleConfirmImage = () => {
        if (selectedImage) {
            try {
                let imageType = imageUploadType;
                const existingImages = JSON.parse(localStorage.getItem('images')) || [];
                if (imageType === "option" && optionIndex !== null) {
                    imageType = `option${optionIndex + 1}`;
                }
                const newImage = {
                    type: imageType,
                    base64encodedurl: selectedImage
                };
                const updatedImages = existingImages.filter(img => img.type !== imageType);
                updatedImages.push(newImage);
                localStorage.setItem('images', JSON.stringify(updatedImages));
                if (imageType === "question") {
                    setCurrentQuestion((prevQuestion) => ({
                        ...prevQuestion,
                        questionImage: selectedImage
                    }));
                } else if (imageType.startsWith("option")) {
                    setCurrentQuestion((prevQuestion) => {
                        const updatedOptionImages = [...prevQuestion.optionImages];
                        updatedOptionImages[optionIndex] = selectedImage;
                        return {
                            ...prevQuestion,
                            optionImages: updatedOptionImages
                        };
                    });
                }
            } catch (error) {
                console.error('Error storing image:', error.message);
            } finally {
                setSelectedImage(null);
                setImagePreviewModal(false);
            }
        }
    };

    const handleCancelImage = () => {
        setSelectedImage(null);
        setImagePreviewModal(false);
    };

    const handleUpdatedQuestion = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const existingImages = JSON.parse(localStorage.getItem('images')) || [];
            const updatedImages = [];
            for (let i = 0; i < existingImages.length; i++) {
                const img = existingImages[i];
                if (!img.base64encodedurl) continue;
                const apiPayload = {
                    body: JSON.stringify({
                        imageType: img.type,
                        image: img.base64encodedurl,
                    }),
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                };
                try {
                    const response = await axios.post(
                        "https://7efwp1v3ed.execute-api.us-east-1.amazonaws.com/upload/imageS3Bucket",
                        apiPayload
                    );
                    const { imageUrl } = JSON.parse(response.data.body);
                    updatedImages.push({
                        ...img,
                        base64encodedurl: imageUrl,
                    });
                } catch (error) {
                    console.error('Error uploading image to S3:', error.message);
                }
            }

            localStorage.setItem('images', JSON.stringify(updatedImages));
            console.log('Updated images in localStorage:', JSON.parse(localStorage.getItem('images')));

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

            const questionData = {
                question: currentQuestion.question,
                options: mapOptions(currentQuestion.options, optionImages),
                correctAnswer: currentQuestion.options.indexOf(currentQuestion.correctAnswer) + 1,
                description: currentQuestion.answerDescription || "",
                questionImageLink: questionImage ? questionImage.base64encodedurl : "",
            };

            const payload = {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questionId: questionId,
                    updatedQuestion: questionData,
                }),
            };

            const response = await axios.post(
                "https://7efwp1v3ed.execute-api.us-east-1.amazonaws.com/userdashbordedit/dashbordquestionEdit",
                payload
            );
            console.log("Question API response:", response.data);
            toast.success("Question updated successfully!");

            setCurrentQuestion({
                question: "",
                options: ["", ""],
                correctAnswer: "",
                answerDescription: "",
                questionImage: null,
                optionImages: [],
            });

            navigate("/NavigationBar");

        } catch (error) {
            console.error("Error updating question:", error);
            toast.error("Failed to update question. Please try again.");
        } finally {
            localStorage.removeItem('images');
            setLoading(false);
        }
    };
        return (
        <div className="edit-exam">
            {loading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
            <h2 className="Examtitle">Edit MCQ Questions</h2>
            <div className="containerEditMcqQuestion">
                <ToastContainer />
                <div className="mcq-section">
                    <div className="MCQcontainer">
                        <div className="MCQFORM">
                            <div className="forme-group-questionn">
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

                                {/* <div className="upload-questionimage">
                                    <label htmlFor="questionImageUpload" className="upload-buttonn">
                                        Upload Question Image
                                    </label>
                                    <input
                                        type="file"
                                        id="questionImageUpload"
                                        accept=".jpg,.jpeg,.png"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleImageUpload(file, "question");
                                            }
                                        }}
                                    />
                                </div> */}
                            </div>

                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="option-row">
                                  <input
                                type="text"
                                className="form-control"
                                placeholder={`Option ${index + 1}`}
                                aria-label={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e)}
                            />

                                    {/* {(
                                        <div className="upload-optionimage">
                                            <label htmlFor={`optionImageUpload${index}`} className="upload-buttonn">
                                                Upload Option Image
                                            </label>
                                            <input
                                                type="file"
                                                id={`optionImageUpload${index}`}
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        handleImageUpload(file, "option", index);
                                                    }
                                                }}
                                            />
                                        </div>
                                    )} */}
                                    {index > 1 && (
                                        <button
                                            className="remove-option"
                                            onClick={() => handleRemoveOption(index)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <div className="add-option-container">
                                <button
                                    className="add-optionn"
                                    onClick={handleAddOption}
                                    disabled={currentQuestion.options.length >= 4}
                                >
                                    Add Option
                                </button>
                            </div>
                            <div className="forme-group">
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



                            </div>
                            <div className="forme-group">
                                <textarea
                                    className="forme-control"
                                    placeholder="Answer Description"
                                    value={currentQuestion.answerDescription}
                                    onChange={(e) =>
                                        setCurrentQuestion({
                                            ...currentQuestion,
                                            answerDescription: e.target.value,
                                        })
                                    }
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group-buttons">
                    <button className="btn save" onClick={handleUpdatedQuestion}>
                        Updated Question
                    </button>

                </div>
            </div>
            {imagePreviewModal && (
                <div className="image-preview-modal" onClick={() => setImagePreviewModal(false)}>
                    <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
                        <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Preview" className="image-preview" />
                        <div className="image-preview-buttons">
                            <button className="confirm" onClick={handleConfirmImage}>Confirm</button>
                            <button className="cancel" onClick={handleCancelImage}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default EditMcqQuestion;
