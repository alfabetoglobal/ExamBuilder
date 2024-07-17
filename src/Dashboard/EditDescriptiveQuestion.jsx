import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/EditMcqQuestion.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EditDescriptiveQuestion = () => {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState(location.state ? location.state.quizTitle : "");
    const [questions, setQuestions] = useState([]);
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
        if (!questionId) {
            toast.error("Question ID is required");
            navigate('/'); // Navigate to a default route if questionId is not available
            return;
        }
        // Fetch existing question details here if needed
    }, [questionId, navigate]); 


    

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
                answer: currentQuestion.answerDescription || "",
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
            console.log("MCQ payload", payload);
    
            console.log("Question API response:", response.data);
            toast.success("Question updated successfully!");
    
            setCurrentQuestion({
                question: "",
                options: ["", ""],
                answerDescription: "",
                questionImage: null,
                optionImages: [],
            });
    
            navigate("/NavigationBar");
            // navigate(`/quiz-detail/${questionId}`);
    
        } catch (error) {
            console.error("Error updating question:", error);
            toast.error("Failed to update question. Please try again.");
        } finally {
            localStorage.removeItem('images');
            setLoading(false);
        }
    };

    // Inside the return statement of EditMcqQuestion component
    // Inside the return statement of EditMcqQuestion component
    return (
        <div className="exam-form">
            {loading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
            <h2 className="Examtitle">Edit Descriptive Question</h2>
            <div className="containerEditMcqQuestion">
                <ToastContainer />
                <div className="mcq-section">
                    <div className="MCQcontainer">
                        <div className="MCQFORM">
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
                                {/* <div className="upload-questionimage">
                                    <label htmlFor="questionImageUpload" className="upload-button">
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
export default EditDescriptiveQuestion;
