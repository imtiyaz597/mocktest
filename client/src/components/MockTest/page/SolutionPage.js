
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import ExamContentLayoutForSolution from "../Layout/ExamContentLayoutForSolution";

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// const SolutionPage = () => {
//   const { resultId } = useParams();
//   const [result, setResult] = useState(null);
//   const [test, setTest] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   useEffect(() => {
//     const fetchResult = async () => {
//       try {
//         const res = await fetch(`${REACT_APP_API_URL}/api/results/${resultId}`);
//         const data = await res.json();

//         const enrichedQuestions = (data.questions || []).map((q) => {
//           const answerEntry = data.answers?.[q._id];

//           let selectedAnswer = null;
//           let isCorrect = false;

//           const normalize = (val) =>
//             Array.isArray(val) ? val.sort().join(",") : String(val).trim();

//           const correct = normalize(q.correctAnswer || q.answer);

//           if (answerEntry !== undefined && answerEntry !== null) {
//             selectedAnswer =
//               typeof answerEntry === "object" && answerEntry.selectedOption
//                 ? answerEntry.selectedOption
//                 : answerEntry;

//             const selected = normalize(selectedAnswer);
//             isCorrect = selected === correct;
//           }

//           return {
//             ...q,
//             options: q.options || [],
//             selectedAnswer,
//             correctAnswer: q.correctAnswer || q.answer,
//             isCorrect,
//           };
//         });

//         setTest({
//           _id: data._id,
//           title: data.testTitle,
//           questions: enrichedQuestions,
//           time: data.testTime || "--",
//         });

//         setResult({
//           answers: data.answers,
//           score: data.score,
//           totalMarks: data.totalMarks,
//         });
//       } catch (error) {
//         console.error("Error fetching result:", error);
//       }
//     };

//     fetchResult();
//   }, [resultId]);

//   if (!test || !result) return <p>Loading...</p>;

//   return (
//     <ExamContentLayoutForSolution
//       test={test}
//       testId={test._id}
//       answers={result.answers}
//       currentQuestionIndex={currentQuestionIndex}
//       setCurrentQuestionIndex={setCurrentQuestionIndex}
//       score={result.score}
//       totalMarks={result.totalMarks}
//     />
//   );
// };

// export default SolutionPage;




// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import ExamContentLayoutForSolution from "../Layout/ExamContentLayoutForSolution";

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";

// const SolutionPage = () => {
//   const { resultId } = useParams();
//   const [result, setResult] = useState(null);
//   const [test, setTest] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   useEffect(() => {
//     const fetchResult = async () => {
//       try {
//         const res = await fetch(`${REACT_APP_API_URL}/api/results/${resultId}`);
//         const data = await res.json();

//         const enrichedQuestions = (data.questions || []).map((q) => {
//           const answerEntry = data.answers?.[q._id];
//           let selectedAnswer = null;
//           let isCorrect = false;

//           const normalize = (val) =>
//             Array.isArray(val) ? val.sort().join(",") : String(val).trim();

//           const correct = normalize(q.correctAnswer || q.answer);

//           if (answerEntry !== undefined && answerEntry !== null) {
//             selectedAnswer =
//               typeof answerEntry === "object" && answerEntry.selectedOption
//                 ? answerEntry.selectedOption
//                 : answerEntry;

//             const selected = normalize(selectedAnswer);
//             isCorrect = selected === correct;
//           }

//           return {
//             ...q,
//             options: q.options || [],
//             selectedAnswer,
//             correctAnswer: q.correctAnswer || q.answer,
//             isCorrect,
//             timeSpent: data.questionTimeSpent?.[q._id?.toString()] || 0 // ✅ Inject time spent here
//           };
//         });

//         setTest({
//           _id: data._id,
//           title: data.testTitle,
//           questions: enrichedQuestions,
//           time: data.testTime || "--",
//         });

//         setResult({
//           answers: data.answers,
//           score: data.score,
//           totalMarks: data.totalMarks,
//           questionTimeSpent: data.questionTimeSpent || {}
//         });
//       } catch (error) {
//         console.error("Error fetching result:", error);
//       }
//     };

//     fetchResult();
//   }, [resultId]);

//   if (!test || !result) return <p>Loading...</p>;

//   return (
//     <ExamContentLayoutForSolution
//       test={test}
//       testId={test._id}
//       answers={result.answers}
//       currentQuestionIndex={currentQuestionIndex}
//       setCurrentQuestionIndex={setCurrentQuestionIndex}
//       score={result.score}
//       totalMarks={result.totalMarks}
//       questionTimeSpent={result.questionTimeSpent} // ✅ Pass this to layout if needed
//     />
//   );
// };

// export default SolutionPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";

const formatTime = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}.${secs.toString().padStart(2, '0')} min`;
};

const SolutionPage = () => {
  const { resultId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`${REACT_APP_API_URL}/api/results/${resultId}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error loading result:", err);
      }
    };
    fetchResult();
  }, [resultId]);

  if (!data) return <div className="p-4 text-center">Loading...</div>;

  const {
    testTitle,
    correct,
    incorrect,
    skipped,
    score,
    totalMarks,
    detailedAnswers = [],
    questionTimeSpent = {}
  } = data;

  const totalTimeSpent = Object.values(questionTimeSpent).reduce((sum, sec) => sum + sec, 0);
  const formatTimeSingle = (sec) => `${(sec / 60).toFixed(2)} min`;

  return (
    <div className="container mt-4 mb-5">
      <h3 className="fw-bold mb-4">{testTitle}</h3>

      <div className="d-flex mb-3 justify-content-between">
        <div><strong>{totalMarks}</strong> QUESTIONS</div>
        <div className="text-success"><strong>{correct}</strong> CORRECT</div>
        <div className="text-danger"><strong>{incorrect}</strong> INCORRECT</div>
        <div><strong>{skipped}</strong> SKIPPED</div>
        <div><strong>{score}</strong> MARKS</div>
        <div><strong>{formatTime(totalTimeSpent)}</strong> TIME TAKEN</div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Questions</th>
              <th>Your answer</th>
              <th>Correct answer</th>
              <th>Marks</th>
              <th>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {detailedAnswers.map((qa, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{qa.question}</td>
                <td>
                  <span className="badge bg-danger text-uppercase">
                    {Array.isArray(qa.selectedAnswer) ? qa.selectedAnswer.join(", ") : qa.selectedAnswer || "--"}
                  </span>
                </td>
                <td>
                  <span className="badge bg-light text-dark border border-dark text-uppercase">
                    {Array.isArray(qa.correctAnswer) ? qa.correctAnswer.join(", ") : qa.correctAnswer || "--"}
                  </span>
                </td>
                <td className={qa.isCorrect ? "text-success" : "text-danger"}>
                  {qa.isCorrect ? (qa.marks || 1) : "0.0"}
                </td>
                <td>{formatTimeSingle(questionTimeSpent[qa.questionId] || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SolutionPage;
