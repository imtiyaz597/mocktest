import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";

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


    // ✅ Time formatting helper
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

const totalTimeSpent = Object.values(report?.questionTimeSpent || {}).reduce((sum, sec) => sum + sec, 0);


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

        <div className="container mb-4">
  <div className="d-flex justify-content-between align-items-center">
    <h4 className="fw-bold mb-3">Question Report</h4>
    <button
  className="btn btn-link"
  onClick={() => navigate(`/report/${lastSubmittedResultId || resultId}`)}
>
  View Report →
</button>

  </div>
  <div className="row g-3 text-center p-3 rounded border shadow-sm">
    <div className="col-6 col-md-2">
      <h5>{report?.totalMarks || realQuestions.length}</h5>
      <p className="text-muted small mb-0">Questions</p>
    </div>
    <div className="col-6 col-md-2">
      <h5 className="text-success">{report?.correct}</h5>
      <p className="text-muted small mb-0">Correct</p>
    </div>
    <div className="col-6 col-md-2">
      <h5 className="text-danger">{report?.incorrect}</h5>
      <p className="text-muted small mb-0">Incorrect</p>
    </div>
    <div className="col-6 col-md-2">
      <h5>{report?.skipped || (report?.totalMarks - report?.correct - report?.incorrect)}</h5>
      <p className="text-muted small mb-0">Skipped</p>
    </div>
    <div className="col-6 col-md-2">
      <h5>{report?.score}</h5>
      <p className="text-muted small mb-0">Score</p>
    </div>
    <div className="col-6 col-md-2">
      <h5>{formatTime(totalTimeSpent)}</h5>
      <p className="text-muted small mb-0">Time Taken</p>
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
