import React, { useState } from 'react';
import './InstructionsPage.css';
import { Link } from 'react-router-dom';

const InstructionsPage = () => {
    const [termsAccepted, setTermsAccepted] = useState(false);

    const startExam = () => {
        if (termsAccepted) {
            window.location.href = '/Test';
        } else {
            alert('Please accept the terms and conditions to start the exam.');
        }
    };

    const handleTermsChange = () => {
        setTermsAccepted(!termsAccepted);
    };

    return (
        <div className="instructions-container">
            <h1 className="instructions-title">Important Instructions for Candidates</h1>
            <ol className="instructions-list">
            <li>As a precaution for COVID-19, the candidate must reach the Centre at the time as indicated against Reporting/Entry time at Centre, in the Admit Card.</li>
                <li>No candidate shall be permitted to enter after the Gate Closing Time.</li>
                <li>No candidate shall be permitted to leave the Examination Room/Hall before the end of the examination.</li>
                <li>On completion of the examination, please wait for instructions from Invigilator and do not get up from your seat until advised. The candidates will be permitted to move out, one at a time only.</li>
                <li>All candidates are required to download and read carefully, the Instructions and Advisory for COVID-19 given with the Admit Card and strictly adhere to them.</li>
                <li>This Admit Card consists of three pages- Page 1 contains the Centre details and Self Declaration (Undertaking) form regarding COVID-19, Page 2 has "Important instruction for candidates" and Page 3 has "Advisory for candidates regarding COVID-19". The candidate has to download all three pages.</li>
                <li>The Admit Card is provisional, subject to satisfying the eligibility conditions as given in the Prospectus/Information Bulletin.</li>
                <li>Candidates are advised to verify the location of the test venue, a day in advance so that they do not face any problem on the day of the test.</li>
            <li>If religion/customs require you to wear specific attire, please visit Centre early for thorough checking and mandatory frisking.</li>
                <li>No Candidate would be allowed to enter the Examination Centre, without Admit Card and undertaking, Valid ID Proof and proper frisking. Frisking through Handheld Metal Detector (HHMD), will be carried out without physical touch.</li>
                <li>Candidates will be permitted to carry only the following items with them into the examination venue: a) Personal transparent water bottle, b) Personal hand sanitiser (50 ml) c) A simple transparent Ball Point Pen d) Admit Card along with Self Declaration (Undertaking) downloaded from the NTA website (a clear printout on A4 size paper) duly filled in. e) Additional passport size photograph for pasting on the Attendance Sheet f) Original valid ID proof g) Mask and Gloves</li>
                <li>Before reaching the Centre, candidates must enter required details in the Self Declaration (Undertaking) in legible handwriting, paste the Photograph and put thumb impression at the appropriate place on the Admit Card. They should ensure that their Left-Hand Thumb Impression is clear and not smudged.</li>
                <li>Candidate must carry "Any one of the original and valid Photo Identification Proof issued by the Government" - PAN card/Driving Licence/Voter ID/ Passport/ Aadhaar Card (With photograph)/ E-Aadhaar/ Ration Card/ Aadhaar Enrolment No. with Photo. All other ID/Photocopies of IDs even if attested/scanned photo of IDS in the mobile phone will NOT be considered as valid ID Proof.</li>
                <li>The candidate must bring PWD certificate issued by the Competent Authority if claiming relaxation under PWD category. The scribe must also carry his/ her own Self Declaration(Undertaking) regarding educational qualification, etc., passport size photograph, valid government ID.</li>
            </ol>
            <div className="terms-checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={handleTermsChange}
                    />
                    I accept the terms and conditions.
                </label>
            </div>
            <div className="start-button-container">
                <button className="start-button" onClick={startExam}>
                    Start Exam
                </button>
            </div>
        </div>
    );
};

export default InstructionsPage;
