
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExamContentLayoutForSolution from "../Layout/ExamContentLayoutForSolution";

const REACT_APP_API_URL = "https://full-stack-mocktest.onrender.com"

const SolutionPage = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`${REACT_APP_API_URL}/api/results/${resultId}`);
        const data = await res.json();

        const enrichedQuestions = (data.questions || []).map((q) => {
          const answerEntry = data.answers?.[q._id];

          let selectedAnswer = null;
          let isCorrect = false;

          const normalize = (val) =>
            Array.isArray(val) ? val.sort().join(",") : String(val).trim();

          const correct = normalize(q.correctAnswer || q.answer);

          if (answerEntry !== undefined && answerEntry !== null) {
            selectedAnswer =
              typeof answerEntry === "object" && answerEntry.selectedOption
                ? answerEntry.selectedOption
                : answerEntry;

            const selected = normalize(selectedAnswer);
            isCorrect = selected === correct;
          }

          return {
            ...q,
            options: q.options || [],
            selectedAnswer,
            correctAnswer: q.correctAnswer || q.answer,
            isCorrect,
          };
        });

        setTest({
          title: data.testTitle,
          questions: enrichedQuestions,
          time: data.testTime || "--",
        });

        setResult({
          answers: data.answers,
          score: data.score,
          totalMarks: data.totalMarks,
        });
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    };

    fetchResult();
  }, [resultId]);

  if (!test || !result) return <p>Loading...</p>;

  return (
    <ExamContentLayoutForSolution
      test={test}
      answers={result.answers}
      currentQuestionIndex={currentQuestionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      score={result.score}
      totalMarks={result.totalMarks}
    />
  );
};

export default SolutionPage;
