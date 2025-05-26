// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// const FullReportPage = ({
//   realQuestions = [],
//   score = 0,
//   answers = {},
//   markedForReview = {},
//   lastSubmittedResultId,
//   handleFinishTest,
//   setShowSummaryBeforeSubmit,
//   testId,
//   test,
//   timeKey,
//   pauseKey,
// }) => {
//   const navigate = useNavigate();
//   const { resultId } = useParams();
//   const [report, setReport] = useState(null);

//   const answered = Object.values(answers).filter(a => a != null).length;
//   const marked = Object.values(markedForReview).filter(Boolean).length;
//   const skippedBeforeSubmit = realQuestions?.length ? realQuestions.length - answered : 0;

//   useEffect(() => {
//     const fetchReport = async () => {
//       const idToUse = lastSubmittedResultId || resultId;
//       if (!idToUse) return;

//       try {
//         const res = await axios.get(`${REACT_APP_API_URL}/api/results/${idToUse}`);
//         setReport(res.data);
//       } catch (err) {
//         console.error("❌ Failed to load full report:", err);
//       }
//     };

//     fetchReport();
//   }, [lastSubmittedResultId, resultId]);

//   if ((lastSubmittedResultId || resultId) && !report) {
//     return <div className="text-center mt-5">Loading Report...</div>;
//   }

//   if ((lastSubmittedResultId || resultId) && report) {
//     const {
//       score,
//       totalMarks,
//       correct,
//       incorrect,
//       yourAccuracy,
//       percentage,
//       testTitle,
//       detailedAnswers = []
//     } = report;

//     const skipped = totalMarks - correct - incorrect;

//     return (
//       <div className="container mt-5">
//         <h3 className="fw-bold mb-4">{testTitle}</h3>

//         <div className="row">
//           <div className="col-md-4 mb-4">
//             <div className="card shadow-sm p-3">
//               <h4 className="text-center mb-2">
//                 {score} <small className="text-muted">out of {totalMarks}</small>
//               </h4>
//               <hr />
//               <ul className="list-unstyled text-center">
//                 <li><strong>Percentile:</strong> N/A</li>
//                 <li><strong>Accuracy:</strong> {yourAccuracy || 0}%</li>
//                 <li><strong>Percentage:</strong> {percentage || 0}%</li>
//               </ul>
//               <button
//                 className="btn btn-primary w-100 mt-3"
//                 onClick={() => navigate(`/solution/${lastSubmittedResultId || resultId}`)}
//               >
//                 View Solution
//               </button>
//             </div>
//           </div>

//           <div className="col-md-8 d-flex flex-wrap justify-content-around align-items-center">
//             <div className="text-center mb-3">
//               <div className="rounded-circle border border-success border-4 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
//                 <h5 className="text-success">{correct}</h5>
//               </div>
//               <p className="mt-2">Correct</p>
//             </div>

//             <div className="text-center mb-3">
//               <div className="rounded-circle border border-danger border-4 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
//                 <h5 className="text-danger">-{incorrect}</h5>
//               </div>
//               <p className="mt-2">Incorrect</p>
//             </div>

//             <div className="text-center mb-3">
//               <div className="rounded-circle border border-primary border-4 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
//                 <h5 className="text-primary">0</h5>
//               </div>
//               <p className="mt-2">Negative Marking</p>
//             </div>

//             <div className="text-center mb-3">
//               <div className="rounded-circle border border-secondary border-4 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
//                 <h5 className="text-muted">-{skipped}</h5>
//               </div>
//               <p className="mt-2">Skipped</p>
//             </div>
//           </div>
//         </div>

//         <div className="alert alert-light mt-4">
//           You have scored <strong>{correct} marks</strong> for correct answers, missed <strong>{incorrect} marks</strong> on incorrect answers,
//           lost <strong>0 marks</strong> due to negative marking and <strong>{skipped} marks</strong> by skipping questions.
//         </div>

        
//       </div>
//     );
//   }

//   // ✅ Pre-submission summary view
//   return (
//     <div className="text-center p-4">
//       <h2>Submit Quiz</h2>
//       <p><strong>Total Questions:</strong> {realQuestions?.length || 0}</p>
//       <p><strong>Score:</strong> {score}</p>
//       <p><strong>Answered:</strong> {answered}</p>
//       <p><strong>Skipped:</strong> {skippedBeforeSubmit}</p>
//       <p><strong>Marked for Review:</strong> {marked}</p>

//       <button onClick={handleFinishTest} className="btn btn-success">Confirm Submit</button>
//       <br />
//       <button
//         onClick={() => {
//           setShowSummaryBeforeSubmit(false);
//           navigate(`/test-overview/${test?._id || testId}`);
//         }}
//         className="btn btn-secondary mt-2"
//       >
//         Cancel
//       </button>
//     </div>
//   );
// };

// export default FullReportPage;




import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const FullReportPage = ({
  realQuestions = [],
  score = 0,
  answers = {},
  markedForReview = {},
  lastSubmittedResultId,
  handleFinishTest,
  setShowSummaryBeforeSubmit,
  testId,
  test,
  timeKey,
  pauseKey,
}) => {
  const navigate = useNavigate();
  const { resultId } = useParams();
  const [report, setReport] = useState(null);

  const answered = Object.values(answers).filter(a => a != null).length;
  const marked = Object.values(markedForReview).filter(Boolean).length;
  const skippedBeforeSubmit = realQuestions?.length ? realQuestions.length - answered : 0;

  useEffect(() => {
    const fetchReport = async () => {
      const idToUse = lastSubmittedResultId || resultId;
      if (!idToUse) return;

      try {
        const res = await axios.get(`${REACT_APP_API_URL}/api/results/${idToUse}`);
        setReport(res.data);
      } catch (err) {
        console.error("❌ Failed to load full report:", err);
      }
    };

    fetchReport();
  }, [lastSubmittedResultId, resultId]);

  if ((lastSubmittedResultId || resultId) && !report) {
    return <div className="text-center mt-5">Loading Report...</div>;
  }

  if ((lastSubmittedResultId || resultId) && report) {
    const {
      score,
      totalMarks,
      correct,
      incorrect,
      yourAccuracy,
      percentage,
      testTitle,
      detailedAnswers = []
    } = report;

    const skipped = totalMarks - correct - incorrect;

    return (
      <div className="container mt-5">
        <h3 className="fw-bold mb-4 text-center">{testTitle}</h3>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-primary shadow">
              <div className="card-header bg-primary text-white text-center fw-semibold">
                Score Summary
              </div>
              <div className="card-body text-center">
                <h4 className="fw-bold mb-3">
                  {score} <small className="text-muted">/ {totalMarks}</small>
                </h4>
                <ul className="list-unstyled mb-3">
                  <li><strong>Percentile:</strong> <span className="text-muted">N/A</span></li>
                  <li><strong>Accuracy:</strong> {yourAccuracy || 0}%</li>
                  <li><strong>Percentage:</strong> {percentage || 0}%</li>
                </ul>
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate(`/solution/${lastSubmittedResultId || resultId}`)}
                >
                  View Solution
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="row g-4 text-center">
              <div className="col-6 col-md-3">
                <div className="p-3 border border-success rounded-circle mx-auto" style={{ width: 100, height: 100 }}>
                  <h5 className="text-success">{correct}</h5>
                </div>
                <p className="mt-2 mb-0">Correct</p>
              </div>

              <div className="col-6 col-md-3">
                <div className="p-3 border border-danger rounded-circle mx-auto" style={{ width: 100, height: 100 }}>
                  <h5 className="text-danger">-{incorrect}</h5>
                </div>
                <p className="mt-2 mb-0">Incorrect</p>
              </div>

              <div className="col-6 col-md-3">
                <div className="p-3 border border-primary rounded-circle mx-auto" style={{ width: 100, height: 100 }}>
                  <h5 className="text-primary">0</h5>
                </div>
                <p className="mt-2 mb-0">Negative</p>
              </div>

              <div className="col-6 col-md-3">
                <div className="p-3 border border-secondary rounded-circle mx-auto" style={{ width: 100, height: 100 }}>
                  <h5 className="text-muted">-{skipped}</h5>
                </div>
                <p className="mt-2 mb-0">Skipped</p>
              </div>
            </div>
            <div className="alert alert-light mt-4 text-center">
          You scored <strong>{correct}</strong> marks from correct answers,
          missed <strong>{incorrect}</strong> marks on incorrect answers,
          <strong> 0</strong> marks lost due to negative marking, and
          <strong> {skipped}</strong> marks by skipping questions.
        </div>
          </div>           
        </div>       
      </div>
    );
  }

  return (
    <div className="text-center p-4">
      <h2 className="mb-3">Submit Quiz</h2>
      <div className="mb-2"><strong>Total Questions:</strong> {realQuestions?.length || 0}</div>
      <div className="mb-2"><strong>Score:</strong> {score}</div>
      <div className="mb-2"><strong>Answered:</strong> {answered}</div>
      <div className="mb-2"><strong>Skipped:</strong> {skippedBeforeSubmit}</div>
      <div className="mb-3"><strong>Marked for Review:</strong> {marked}</div>

      <button onClick={handleFinishTest} className="btn btn-success me-2">✅ Confirm Submit</button>
      <button
        onClick={() => {
          setShowSummaryBeforeSubmit(false);
          navigate(`/test-overview/${test?._id || testId}`);
        }}
        className="btn btn-outline-secondary"
      >
        Cancel
      </button>
    </div>
  );
};

export default FullReportPage;
