// src/pages/QuestionReportPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";

const formatMinutes = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}.${secs.toString().padStart(2, "0")} min`;
};

const QuestionReportPage = () => {
  const { resultId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${REACT_APP_API_URL}/api/results/${resultId}`);
        setReport(res.data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReport();
  }, [resultId]);

  if (!report) return <div className="text-center mt-5">Loading full report...</div>;

  const { testTitle, detailedAnswers = [], questionTimeSpent = {} } = report;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">{testTitle}</h2>

      <div className="row mb-4">
        <div className="col">
          <strong>{detailedAnswers.length}</strong> Questions |
          <strong> {report.correct}</strong> Correct |
          <strong> {report.incorrect}</strong> Incorrect |
          <strong> {report.skipped}</strong> Skipped |
          <strong> {report.score}</strong> Score |
          <strong> {formatMinutes(Object.values(questionTimeSpent).reduce((a, b) => a + b, 0))}</strong> Time Taken
        </div>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
            <th>Marks</th>
            <th>Time Taken</th>
          </tr>
        </thead>
        <tbody>
          {detailedAnswers.map((ans, idx) => (
            <tr key={ans.questionId}>
              <td>{idx + 1}</td>
              <td dangerouslySetInnerHTML={{ __html: ans.question }} />
              <td>{Array.isArray(ans.selectedAnswer) ? ans.selectedAnswer.join(", ") : ans.selectedAnswer || "--"}</td>
              <td>{Array.isArray(ans.correctAnswer) ? ans.correctAnswer.join(", ") : ans.correctAnswer}</td>
              <td style={{ color: ans.isCorrect ? "green" : "red" }}>
                {ans.isCorrect ? ans.marks || 1 : 0}
              </td>
              <td>{formatMinutes(questionTimeSpent[ans.questionId] || 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionReportPage;
