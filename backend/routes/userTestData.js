//   const express = require('express');
//   const router = express.Router();
//   const StudentTestData = require('../models/StudentTestData');
//   const MockTest = require('../models/MockTest');
//   const User = require('../models/User');

//   // ✅ GET RESULT WITH ENRICHED QUESTIONS FOR SOLUTION PAGE
//   router.get('/results/:id', async (req, res) => {
//     try {
//       console.log('▶ [GET /api/results/:id] params:', req.params);

//       const result = await StudentTestData.findById(req.params.id);
//       if (!result) {
//         console.warn('⚠ No result found for id:', req.params.id);
//         return res.status(404).json({ error: 'Result not found' });
//       }
//       console.log('✅ Found result:', result);

//       const test = await MockTest.findById(result.testId);
//       console.log('✅ Loaded test:', test);

//       const allResults = await StudentTestData.find({ testId: result.testId });
//       console.log('✅ Loaded all results count:', allResults.length);

//       const totalQuestions = result.detailedAnswers.length;
//       const correct = result.detailedAnswers.filter(a => a.isCorrect).length;
//       const incorrect = result.detailedAnswers.filter(a => a.selectedAnswer && !a.isCorrect).length;
//       const skipped = result.detailedAnswers.filter(a => a.selectedAnswer === null).length;
//       const score = result.score || 0;

//       const sorted = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
//       const rank = sorted.findIndex(r => r._id.toString() === result._id.toString()) + 1;
//       const topper = sorted[0]?.score || 0;
//       const average = sorted.length > 0
//         ? (sorted.reduce((acc, r) => acc + (r.score || 0), 0) / sorted.length).toFixed(2)
//         : "0.00";

//       const topperCorrectCount = sorted[0]?.detailedAnswers
//         ? sorted[0].detailedAnswers.filter(a => a.isCorrect).length
//         : 0;
//       const topperAccuracy = totalQuestions > 0
//         ? ((topperCorrectCount / totalQuestions) * 100).toFixed(2)
//         : "0.00";

//       const averageCorrectCount = sorted.reduce((acc, r) => {
//         if (!r.detailedAnswers) return acc;
//         return acc + r.detailedAnswers.filter(a => a.isCorrect).length;
//       }, 0);
//       const averageAccuracy = (sorted.length > 0 && totalQuestions > 0)
//         ? ((averageCorrectCount / (sorted.length * totalQuestions)) * 100).toFixed(2)
//         : "0.00";

//       const topicMap = {};
//       for (const ans of result.detailedAnswers) {
//         for (const tag of ans.tags || []) {
//           if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
//           topicMap[tag].total += 1;
//           if (ans.isCorrect) topicMap[tag].correct += 1;
//         }
//       }
//       const topicReport = Object.values(topicMap);

//       const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
//       const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
//       for (const ans of result.detailedAnswers) {
//         const level = ans.difficulty || 'Medium';
//         difficultyStats[level] += 1;
//         if (ans.isCorrect) difficultyScore[level] += (ans.marks || 1);
//       }

//       const enrichedQuestions = (test?.questions || []).map((q) => {
//         const qId = q._id?.toString() || q.questionNumber?.toString();
//         const attempt = result.answers?.[qId];

//         return {
//           ...q.toObject?.() || q,
//           selectedAnswer: attempt?.selectedOption ?? null,
//           correctAnswer: q.correctAnswer || null,
//           isCorrect: attempt?.isCorrect ?? null,
//           explanation: q.explanation || null,
//           options: q.options || [],
//           definitions: q.questionType === 'Drag and Drop' ? q.definitions || [] : undefined,
//           terms: q.questionType === 'Drag and Drop' ? q.terms || [] : undefined,
//           answer: q.questionType === 'Drag and Drop' ? q.answer || [] : undefined,
//         };
//       });


//       const yourAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";


//       await StudentTestData.findByIdAndUpdate(req.params.id, {
//         testTitle: test?.title || 'Mock Test',
//         totalMarks: test?.questions?.length || 0,
//         correct,
//         incorrect,
//         skipped,
//         rank,
//         topper,
//         average,
//         yourAccuracy,
//         topperAccuracy,
//         averageAccuracy,
//         topicReport,
//         difficultyStats,
//         difficultyScore,
//       });

//       res.json({
//         testTitle: test?.title || 'Mock Test',
//         totalMarks: test?.questions?.length || 0,
//         score,
//         correct,
//         incorrect,
//         skipped,
//         rank,
//         topper,
//         average,
//         yourAccuracy,
//         topperAccuracy,
//         averageAccuracy,
//         topicReport,
//         difficultyStats,
//         difficultyScore,
//         questions: enrichedQuestions,
//         answers: result?.answers || {}
//       });

//     } catch (err) {
//       console.error('❌ Error in GET /api/results/:id', err);
//       res.status(500).json({ error: 'Something went wrong.' });
//     }
//   });

//   // ✅ POST SUBMIT TEST WITH DEBUG LOGS
//   const mongoose = require('mongoose');

//   router.post('/userTestData/submit-test', async (req, res) => {
//     try {
//       console.log('▶ [POST /userTestData/submit-test] received body:', JSON.stringify(req.body, null, 2));

//       const {
//         userId,
//         testId,
//         answers,
//         score,
//         markedForReviewMap,
//         questionStatusMap,
//         detailedAnswers
//       } = req.body;

//       console.log('✅ userId:', userId);
//       console.log('✅ testId:', testId);
//       console.log('✅ answers keys:', Object.keys(answers || {}));
//       console.log('✅ markedForReviewMap keys:', Object.keys(markedForReviewMap || {}));
//       console.log('✅ questionStatusMap keys:', Object.keys(questionStatusMap || {}));
//       console.log('✅ detailedAnswers count:', detailedAnswers ? detailedAnswers.length : 'MISSING');

//       if (!detailedAnswers || !Array.isArray(detailedAnswers)) {
//         console.warn('⚠ detailedAnswers is missing or invalid:', detailedAnswers);
//         return res.status(400).json({ error: 'Invalid or missing detailedAnswers' });
//       }

//       const attemptCount = await StudentTestData.countDocuments({ userId, testId });
//       console.log('✅ Attempt count:', attemptCount);

//       const test = await MockTest.findById(testId);
//       if (!test) {
//         console.warn('⚠ Test not found for testId:', testId);
//         return res.status(404).json({ error: 'Test not found' });
//       }
//       console.log('✅ Loaded test title:', test.title);
//       console.log('✅ Loaded test questions count:', test.questions ? test.questions.length : 0);

//       const allResults = await StudentTestData.find({ testId });
//       console.log('✅ All previous results count:', allResults.length);

//       const totalQuestions = detailedAnswers.length;
//       const correct = detailedAnswers.filter(a => a.isCorrect).length;
//       const incorrect = detailedAnswers.filter(a => a.selectedAnswer && !a.isCorrect).length;
//       const skipped = detailedAnswers.filter(a => a.selectedAnswer === null).length;

//       console.log('✅ totalQuestions:', totalQuestions);
//       console.log('✅ correct:', correct);
//       console.log('✅ incorrect:', incorrect);
//       console.log('✅ skipped:', skipped);

//       const sorted = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
//       const rank = sorted.findIndex(r => r.userId && r.userId.toString() === userId.toString()) + 1;
//       const topper = sorted[0]?.score || 0;
//       const average = sorted.length > 0
//         ? (sorted.reduce((acc, r) => acc + (r.score || 0), 0) / sorted.length).toFixed(2)
//         : "0.00";

//       console.log('✅ rank:', rank);
//       console.log('✅ topper score:', topper);
//       console.log('✅ average score:', average);

//       const topperCorrectCount = sorted[0]?.detailedAnswers
//         ? sorted[0].detailedAnswers.filter(a => a.isCorrect).length
//         : 0;
//       const topperAccuracy = totalQuestions > 0
//         ? ((topperCorrectCount / totalQuestions) * 100).toFixed(2)
//         : "0.00";

//       const averageCorrectCount = sorted.reduce((acc, r) => {
//         if (!r.detailedAnswers) return acc;
//         return acc + r.detailedAnswers.filter(a => a.isCorrect).length;
//       }, 0);
//       const averageAccuracy = (sorted.length > 0 && totalQuestions > 0)
//         ? ((averageCorrectCount / (sorted.length * totalQuestions)) * 100).toFixed(2)
//         : "0.00";

//       console.log('✅ topperAccuracy:', topperAccuracy);
//       console.log('✅ averageAccuracy:', averageAccuracy);

//       const topicMap = {};
//       for (const ans of detailedAnswers) {
//         for (const tag of ans.tags || []) {
//           if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
//           topicMap[tag].total += 1;
//           if (ans.isCorrect) topicMap[tag].correct += 1;
//         }
//       }
//       const topicReport = Object.values(topicMap);
//       console.log('✅ topicReport:', topicReport);

//       const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
//       const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
//       for (const ans of detailedAnswers) {
//         const level = ans.difficulty || 'Medium';
//         difficultyStats[level] += 1;
//         if (ans.isCorrect) difficultyScore[level] += (ans.marks || 1);
//       }
//       console.log('✅ difficultyStats:', difficultyStats);
//       console.log('✅ difficultyScore:', difficultyScore);

//       // ✅ Calculate yourAccuracy
//     const yourAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

//       // ✅ Convert string IDs to ObjectId safely
//       const safeUserId = new mongoose.Types.ObjectId(userId);
// const safeDetailedAnswers = detailedAnswers.map(ans => ({
//   ...ans,
//   questionId: new mongoose.Types.ObjectId(ans.questionId)
// }));

//       const newRecord = new StudentTestData({
//         userId: safeUserId,
//         testId,
//         attemptNumber: attemptCount + 1,
//         answers,
//         score,
//         markedForReviewMap,
//         questionStatusMap,
//         detailedAnswers: safeDetailedAnswers,
//         status: 'completed',
//         completedAt: new Date(),

//         testTitle: test?.title || 'Mock Test',
//         totalMarks: test?.questions?.length || 0,
//         correct,
//         incorrect,
//         skipped,
//         rank,
//         topper,
//         average,
//         yourAccuracy,
//         topperAccuracy,
//         averageAccuracy,
//         topicReport,
//         difficultyStats,
//         difficultyScore
//       });

//       console.log('✅ Prepared newRecord:', JSON.stringify(newRecord, null, 2));

//       const saved = await newRecord.save();
//       console.log('✅ Successfully saved result with ID:', saved._id);

//       res.status(200).json({ resultId: saved._id });

//     } catch (error) {
//       console.error('❌ Submit test error:', error);
//       res.status(500).json({ error: 'Something went wrong during submission.' });
//     }
//   });



// // GET /api/user/dashboard/:userId
// router.get('/user/dashboard/:userId', async (req, res) => {
//     const { userId } = req.params;
  
//     try {
//       const attempts = await StudentTestData.find({ userId })
//         .sort({ createdAt: -1 })
//         .select(
//           'testTitle attemptNumber completedAt score totalMarks correct incorrect skipped rank topper average yourAccuracy topperAccuracy averageAccuracy topicReport difficultyStats difficultyScore'
//         );
  
//       if (attempts.length === 0) {
//         return res.json([]);
//       }
  
//       // Initialize totals
//       let totalAccuracy = 0;
//       let totalAverage = 0;
//       let totalRank = 0;
//       let accuracyCount = 0;
//       let averageCount = 0;
//       let rankCount = 0;
//       let totalMarks = 0;
//     let totalScore = 0;
  
//       // Loop through to sum up
//       attempts.forEach((attempt) => {
//         if (!isNaN(attempt.yourAccuracy)) {
//           totalAccuracy += attempt.yourAccuracy;
//           accuracyCount++;
//         }
//         if (!isNaN(attempt.average)) {
//           totalAverage += attempt.average;
//           averageCount++;
//         }
//         if (!isNaN(attempt.rank)) {
//           totalRank += attempt.rank;
//           rankCount++;
//         }
//         if (!isNaN(attempt.totalMarks)) totalMarks += attempt.totalMarks;
//       if (!isNaN(attempt.score)) totalScore += attempt.score;
//       });
  
//       // Compute averages
//       const avgAccuracy = accuracyCount > 0 ? totalAccuracy / accuracyCount : 0;
//       const avgScore = averageCount > 0 ? totalAverage / averageCount : 0;
//       const avgRank = rankCount > 0 ? (totalRank / rankCount).toFixed(0) : '-';
  
//       // Attach to first attempt (used by frontend for display)
//       if (attempts[0]) {
//         attempts[0] = {
//           ...attempts[0]._doc,
//           average: avgScore,
//           yourAccuracy: avgAccuracy,
//           rank: avgRank,
//           totalCombinedMarks: totalMarks,
//         totalCombinedScore: totalScore
//         };
//       }
  
//       res.json(attempts);
//     } catch (err) {
//       console.error('Dashboard fetch error:', err);
//       res.status(500).json({ error: 'Failed to load dashboard data' });
//     }
//   });

//   // Teacher access individual results Express route
//   router.get("/results/search", async (req, res) => {
//     try {
//       const name = req.query.name;
//       if (!name) return res.status(400).json({ error: "Name is required" });
  
//       const users = await User.find({ name: new RegExp(name, "i") }); // case-insensitive match
  
//       const userIds = users.map(user => user._id);
  
//       const results = await StudentTestData.find({ userId: { $in: userIds } });
  
//       res.json(results);
//     } catch (err) {
//       console.error("Search error:", err);
//       res.status(500).json({ error: "Server error" });
//     }
//   });
  
   

// module.exports = router;



const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const StudentTestData = require('../models/StudentTestData');
const MockTest = require('../models/MockTest');
const User = require('../models/User');

// ✅ GET RESULT WITH ENRICHED QUESTIONS FOR SOLUTION PAGE
router.get('/results/:id', async (req, res) => {
  try {
    const result = await StudentTestData.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Result not found' });

    const test = await MockTest.findById(result.testId);
    const allResults = await StudentTestData.find({ testId: result.testId });

    const totalQuestions = result.detailedAnswers.length;
    const correct = result.detailedAnswers.filter(a => a.isCorrect).length;
    const incorrect = result.detailedAnswers.filter(a => a.selectedAnswer && !a.isCorrect).length;
    const skipped = result.detailedAnswers.filter(a => a.selectedAnswer === null).length;
    const score = result.score || 0;

    const sorted = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    const rank = sorted.findIndex(r => r._id.toString() === result._id.toString()) + 1;
    const topper = sorted[0]?.score || 0;
    const average = sorted.length > 0
      ? (sorted.reduce((acc, r) => acc + (r.score || 0), 0) / sorted.length).toFixed(2)
      : "0.00";

    const topperCorrectCount = sorted[0]?.detailedAnswers?.filter(a => a.isCorrect).length || 0;
    const topperAccuracy = totalQuestions > 0
      ? ((topperCorrectCount / totalQuestions) * 100).toFixed(2)
      : "0.00";

    const averageCorrectCount = sorted.reduce((acc, r) => {
      if (!r.detailedAnswers) return acc;
      return acc + r.detailedAnswers.filter(a => a.isCorrect).length;
    }, 0);
    const averageAccuracy = (sorted.length > 0 && totalQuestions > 0)
      ? ((averageCorrectCount / (sorted.length * totalQuestions)) * 100).toFixed(2)
      : "0.00";

    const topicMap = {};
    for (const ans of result.detailedAnswers) {
      for (const tag of ans.tags || []) {
        if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
        topicMap[tag].total += 1;
        if (ans.isCorrect) topicMap[tag].correct += 1;
      }
    }
    const topicReport = Object.values(topicMap);

    const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
    const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
    for (const ans of result.detailedAnswers) {
      const level = ans.difficulty || 'Medium';
      difficultyStats[level] += 1;
      if (ans.isCorrect) difficultyScore[level] += (ans.marks || 1);
    }

    const enrichedQuestions = (test?.questions || []).map((q) => {
      const qId = q._id?.toString() || q.questionNumber?.toString();
      const attempt = result.answers?.[qId];

      return {
        ...q.toObject?.() || q,
        selectedAnswer: attempt?.selectedOption ?? null,
        correctAnswer: q.correctAnswer || null,
        isCorrect: attempt?.isCorrect ?? null,
        explanation: q.explanation || null,
        options: q.options || [],
        definitions: q.questionType === 'Drag and Drop' ? q.definitions || [] : undefined,
        terms: q.questionType === 'Drag and Drop' ? q.terms || [] : undefined,
        answer: q.questionType === 'Drag and Drop' ? q.answer || [] : undefined,
      };
    });

    const yourAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

    await StudentTestData.findByIdAndUpdate(req.params.id, {
      testTitle: test?.title || 'Mock Test',
      totalMarks: test?.questions?.length || 0,
      correct,
      incorrect,
      skipped,
      rank,
      topper,
      average,
      yourAccuracy,
      topperAccuracy,
      averageAccuracy,
      topicReport,
      difficultyStats,
      difficultyScore,
    });

    res.json({
      _id: result._id,
      testTitle: test?.title || 'Mock Test',
      totalMarks: test?.questions?.length || 0,
      score,
      correct,
      incorrect,
      skipped,
      rank,
      topper,
      average,
      yourAccuracy,
      topperAccuracy,
      averageAccuracy,
      topicReport,
      difficultyStats,
      difficultyScore,
      questions: enrichedQuestions,
      answers: result?.answers || {},
      detailedAnswers: result?.detailedAnswers || [], // ✅ ADD THIS
      questionTimeSpent: result?.questionTimeSpent || {}


    });

  } catch (err) {
    console.error('❌ Error in GET /api/results/:id', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


// 🔁 Auto-save every second (called from frontend)
// /routes/yourRoutes.js
// router.post('/userTestData/auto-save', async (req, res) => {
//   try {
//     console.log("📥 Incoming auto-save payload:", req.body);
//     const {
//       attemptId,
//       answers,
//       markedForReviewMap,
//       questionStatusMap,
//       timeLeft,
//       score,
//       yourAccuracy,
//       status,
//       completedAt,
//       currentQuestionIndex,
//       totalMarks
//     } = req.body;

//     if (!attemptId){ 
//       console.error("❌ Missing attemptId");
//       return res.status(400).json({ error: 'Missing attemptId' })
//     };

//     const attempt = await StudentTestData.findById(attemptId);
//     if (!attempt) {
//       console.error("❌ Attempt not found for ID:", attemptId);
//       return res.status(404).json({ error: 'Attempt not found' })};
//    if (attempt.status === 'completed') {
//   console.warn("⚠️ Attempt already submitted:", attemptId);
//   return res.status(400).json({ error: 'Attempt already submitted', status: attempt.status });
// }

//     console.log("✅ Attempt found and valid, proceeding...");

//     const test = await MockTest.findById(attempt.testId);
//     const questionMap = new Map((test?.questions || []).map(q => [q._id.toString(), q]));

//     const totalQuestions = [...questionMap.values()].filter(q => q.questionType && q.question?.trim()).length;

//     let localScore = 0;
//     let correct = 0;
//     let attempted = 0;

//     const detailedAnswers = [];

//     const normalizeStatus = (status) => {
//       switch (status) {
//         case 'answered': return 'ANSWERED';
//         case 'unanswered': return 'NOT ANSWERED';
//         case 'marked': return 'MARKED FOR REVIEW';
//         case 'answeredMarked': return 'ANSWERED & MARKED FOR REVIEW';
//         default: return 'NOT ANSWERED';
//       }
//     };

    


//     for (const [questionId, answer] of Object.entries(answers || {})) {
//       const originalQ = questionMap.get(questionId);
//       if (!originalQ) continue;

//       const selected = answer.selectedOption;
//       const isCorrect = !!answer.isCorrect;
//       const marks = originalQ?.marks || 1;

//       if (selected !== undefined && selected !== null) attempted++;
//       if (isCorrect) {
//         correct++;
//         localScore += marks;
//       }

//       detailedAnswers.push({
//         questionId,
//         selectedAnswer: selected,
//         correctAnswer: answer.correctAnswer || [],
//         isCorrect,
//         explanation: originalQ?.explanation || '',
//         tags: originalQ?.tags || [],
//         difficulty: originalQ?.difficulty || 'Medium',
//         timeAllocated: originalQ?.timeAllocated || 0,
//         markedForReview: markedForReviewMap?.[questionId] || false,
//         questionStatus: normalizeStatus(questionStatusMap?.[questionId]),
//       });
//     }

//     const incorrect = attempted - correct;
//     const skipped = totalQuestions - attempted;
//     const calcAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

//     // Topic report
//     const topicMap = {};
//     for (const ans of detailedAnswers) {
//       for (const tag of ans.tags || []) {
//         if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
//         topicMap[tag].total += 1;
//         if (ans.isCorrect) topicMap[tag].correct += 1;
//       }
//     }

//     const topicReport = Object.values(topicMap);

//     // Difficulty breakdown
//     const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
//     const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
//     for (const ans of detailedAnswers) {
//       const level = ans.difficulty || 'Medium';
//       const qid = ans.questionId?.toString();
//       const marks = questionMap.get(qid)?.marks || 1;
//       difficultyStats[level] += 1;
//       if (ans.isCorrect) difficultyScore[level] += marks;
//     }

//     // ✅ Store all fields (with fallback to local computation if missing)
//     attempt.answers = answers || {};
//     attempt.markedForReviewMap = markedForReviewMap || {};
//     attempt.questionStatusMap = questionStatusMap || {};
//     attempt.detailedAnswers = detailedAnswers;
//     attempt.score = typeof score === 'number' ? score : localScore;
//     attempt.correct = correct;
//     attempt.incorrect = incorrect;
//     attempt.skipped = skipped;
//     attempt.yourAccuracy = yourAccuracy || calcAccuracy;
//     attempt.topicReport = topicReport;
//     attempt.difficultyStats = difficultyStats;
//     attempt.difficultyScore = difficultyScore;
//     attempt.timeLeft = typeof timeLeft === 'number' ? timeLeft : attempt.timeLeft;
//     attempt.currentQuestionIndex = typeof currentQuestionIndex === 'number' ? currentQuestionIndex : 0;
//     attempt.totalMarks = typeof totalMarks === 'number'
//   ? totalMarks
//   : [...questionMap.values()]
//       .filter(q => q.questionType && q.question?.trim())
//       .reduce((sum, q) => sum + (q.marks || 1), 0);


//     // ✅ Only overwrite status/completedAt if not already completed
//     if (attempt.status !== 'completed') {
//       attempt.status = status || 'in-progress';
//       attempt.completedAt = completedAt ?? null;
//     }

//     attempt.updatedAt = new Date();
//     // ✅ Merge per-question time tracking without disturbing other logic
// const { questionTimeSpent } = req.body;
// if (questionTimeSpent && typeof questionTimeSpent === 'object') {
//   if (!attempt.questionTimeSpent) attempt.questionTimeSpent = {};
//   Object.entries(questionTimeSpent).forEach(([qid, time]) => {
//     if (!attempt.questionTimeSpent[qid]) {
//       attempt.questionTimeSpent[qid] = 0;
//     }
//     attempt.questionTimeSpent[qid] += time;
//   });
// }

//      await attempt.save({ optimisticConcurrency: false });
// ;

//     res.status(200).json({ message: 'Auto-save successful' });

//   } catch (err) {
//     console.error("❌ Auto-save error:", err);
//     res.status(500).json({ error: "Auto-save failed." });
//   }
// });

// // 🧠 Final Submit (manual or auto-on-exit)
// router.post('/userTestData/submit-test', async (req, res) => {
//   try {
//     const { userId, testId, answers, markedForReviewMap, questionStatusMap, detailedAnswers } = req.body;
// const { questionTimeSpent } = req.body;

//     if (!Array.isArray(detailedAnswers)) {
//       return res.status(400).json({ error: 'Invalid detailedAnswers' });
//     }

//     const attempt = await StudentTestData.findOne({ userId, testId, status: 'in-progress' }).sort({ createdAt: -1 });
//     if (!attempt) return res.status(404).json({ error: 'No in-progress attempt found' });

//     const test = await MockTest.findById(testId);
//     const user = await User.findById(userId);

//     const questionMap = {};
//     for (const q of test?.questions || []) {
//       const qid = (q._id || q.questionNumber)?.toString();
//       questionMap[qid] = q;
//     }

//     let score = 0;
//     let correct = 0;
//     let incorrect = 0;
//     let attempted = 0;

//     for (const ans of detailedAnswers) {
//       const qid = ans.questionId?.toString();
//       const q = questionMap[qid];

//       const isAttempted = ans.selectedAnswer !== null && ans.selectedAnswer !== undefined;
//       if (isAttempted) {
//         attempted++;
//         if (ans.isCorrect) {
//           correct++;
//           score += q?.marks || 1;  // ✅ pull marks from Excel-loaded question
//         } else {
//           incorrect++;
//         }
//       }
//     }

//     const totalQuestions = Object.keys(questionMap).length;
//     const skipped = totalQuestions - attempted;
//     const yourAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

//     // Rank calculation
//     const allResults = await StudentTestData.find({ testId });
//     const sorted = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
//     const rank = sorted.findIndex(r => r._id.toString() === attempt._id.toString()) + 1;

//     // Topic report
//     const topicMap = {};
//     for (const ans of detailedAnswers) {
//       for (const tag of ans.tags || []) {
//         if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
//         topicMap[tag].total += 1;
//         if (ans.isCorrect) topicMap[tag].correct += 1;
//       }
//     }
//     const topicReport = Object.values(topicMap);

//     // Difficulty breakdown
//     const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
//     const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
//     for (const ans of detailedAnswers) {
//       const level = ans.difficulty || 'Medium';
//       const qid = ans.questionId?.toString();
//       const marks = questionMap[qid]?.marks || 1;
//       difficultyStats[level] += 1;
//       if (ans.isCorrect) difficultyScore[level] += marks;
//     }

//     const updatePayload = {
//       answers,
//       markedForReviewMap,
//       questionStatusMap,
//       detailedAnswers,
//       score,
//       status: 'completed',
//       completedAt: new Date(),
//       testTitle: test?.title || 'Mock Test',
//       studentName: user?.name || "Unknown",
//       totalMarks: test?.questions
//   ?.filter(q => q.questionType && q.question?.trim())
//   .reduce((sum, q) => sum + (q.marks || 1), 0),

//       correct,
//       incorrect,
//       skipped,
//       rank,
//       topper: sorted[0]?.score || 0,
//       average: sorted.length > 0
//         ? (sorted.reduce((acc, r) => acc + (r.score || 0), 0) / sorted.length).toFixed(2)
//         : "0.00",
//       yourAccuracy,
//       topicReport,
//       difficultyStats,
//       difficultyScore
//     };

//     await StudentTestData.findByIdAndUpdate(attempt._id, updatePayload, { new: true });
//     res.status(200).json({ resultId: attempt._id });
//   } catch (err) {
//     console.error("❌ Submission error:", err);
//     res.status(500).json({ error: "Submission failed" });
//   }
// });



router.post('/userTestData/auto-save', async (req, res) => {
  try {
    console.log("📥 Incoming auto-save payload:", req.body);
    const {
      attemptId,
      answers,
      markedForReviewMap,
      questionStatusMap,
      timeLeft,
      score,
      yourAccuracy,
      status,
      completedAt,
      currentQuestionIndex,
      totalMarks,
      questionTimeSpent // ✅ include this from request
    } = req.body;

    if (!attemptId){ 
      console.error("❌ Missing attemptId");
      return res.status(400).json({ error: 'Missing attemptId' })
    };

    const attempt = await StudentTestData.findById(attemptId);
    if (!attempt) {
      console.error("❌ Attempt not found for ID:", attemptId);
      return res.status(404).json({ error: 'Attempt not found' })};
   if (attempt.status === 'completed') {
      console.warn("⚠️ Attempt already submitted:", attemptId);
      return res.status(400).json({ error: 'Attempt already submitted', status: attempt.status });
    }

    console.log("✅ Attempt found and valid, proceeding...");

    const test = await MockTest.findById(attempt.testId);
    const questionMap = new Map((test?.questions || []).map(q => [q._id.toString(), q]));

    const totalQuestions = [...questionMap.values()].filter(q => q.questionType && q.question?.trim()).length;

    let localScore = 0;
    let correct = 0;
    let attempted = 0;

    const detailedAnswers = [];

    const normalizeStatus = (status) => {
      switch (status) {
        case 'answered': return 'ANSWERED';
        case 'unanswered': return 'NOT ANSWERED';
        case 'marked': return 'MARKED FOR REVIEW';
        case 'answeredMarked': return 'ANSWERED & MARKED FOR REVIEW';
        default: return 'NOT ANSWERED';
      }
    };

    for (const [questionId, answer] of Object.entries(answers || {})) {
      const originalQ = questionMap.get(questionId);
      if (!originalQ) continue;

      const selected = answer.selectedOption;
      const isCorrect = !!answer.isCorrect;
      const marks = originalQ?.marks || 1;

      if (selected !== undefined && selected !== null) attempted++;
      if (isCorrect) {
        correct++;
        localScore += marks;
      }

      detailedAnswers.push({
        questionId,
        selectedAnswer: selected,
        correctAnswer: answer.correctAnswer || [],
        isCorrect,
        explanation: originalQ?.explanation || '',
        tags: originalQ?.tags || [],
        difficulty: originalQ?.difficulty || 'Medium',
        timeAllocated: originalQ?.timeAllocated || 0,
        markedForReview: markedForReviewMap?.[questionId] || false,
        questionStatus: normalizeStatus(questionStatusMap?.[questionId]),
      });
    }

    const incorrect = attempted - correct;
    const skipped = totalQuestions - attempted;
    const calcAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

    // Topic report
    const topicMap = {};
    for (const ans of detailedAnswers) {
      for (const tag of ans.tags || []) {
        if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
        topicMap[tag].total += 1;
        if (ans.isCorrect) topicMap[tag].correct += 1;
      }
    }
    const topicReport = Object.values(topicMap);

    // Difficulty breakdown
    const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
    const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
    for (const ans of detailedAnswers) {
      const level = ans.difficulty || 'Medium';
      const qid = ans.questionId?.toString();
      const marks = questionMap.get(qid)?.marks || 1;
      difficultyStats[level] += 1;
      if (ans.isCorrect) difficultyScore[level] += marks;
    }

    // ✅ Store all fields
    attempt.answers = answers || {};
    attempt.markedForReviewMap = markedForReviewMap || {};
    attempt.questionStatusMap = questionStatusMap || {};
    attempt.detailedAnswers = detailedAnswers;
    attempt.score = typeof score === 'number' ? score : localScore;
    attempt.correct = correct;
    attempt.incorrect = incorrect;
    attempt.skipped = skipped;
    attempt.yourAccuracy = yourAccuracy || calcAccuracy;
    attempt.topicReport = topicReport;
    attempt.difficultyStats = difficultyStats;
    attempt.difficultyScore = difficultyScore;
    attempt.timeLeft = typeof timeLeft === 'number' ? timeLeft : attempt.timeLeft;
    attempt.currentQuestionIndex = typeof currentQuestionIndex === 'number' ? currentQuestionIndex : 0;
    attempt.totalMarks = typeof totalMarks === 'number'
      ? totalMarks
      : [...questionMap.values()]
        .filter(q => q.questionType && q.question?.trim())
        .reduce((sum, q) => sum + (q.marks || 1), 0);

    // ✅ Only update status if not already completed
    if (attempt.status !== 'completed') {
      attempt.status = status || 'in-progress';
      attempt.completedAt = completedAt ?? null;
    }

    attempt.updatedAt = new Date();

    // ✅ Merge per-question time tracking
    if (questionTimeSpent && typeof questionTimeSpent === 'object') {
      if (!attempt.questionTimeSpent) attempt.questionTimeSpent = {};
      Object.entries(questionTimeSpent).forEach(([qid, time]) => {
        if (!attempt.questionTimeSpent[qid]) {
          attempt.questionTimeSpent[qid] = 0;
        }
        attempt.questionTimeSpent[qid] += time;
      });
    }

    await attempt.save({ optimisticConcurrency: false });

    res.status(200).json({ message: 'Auto-save successful' });

  } catch (err) {
    console.error("❌ Auto-save error:", err);
    res.status(500).json({ error: "Auto-save failed." });
  }
});


// 🧠 Final Submit (manual or auto-on-exit)
router.post('/userTestData/submit-test', async (req, res) => {
  try {
    const { userId, testId, answers, markedForReviewMap, questionStatusMap, detailedAnswers, questionTimeSpent } = req.body;

    if (!Array.isArray(detailedAnswers)) {
      return res.status(400).json({ error: 'Invalid detailedAnswers' });
    }

    const attempt = await StudentTestData.findOne({ userId, testId, status: 'in-progress' }).sort({ createdAt: -1 });
    if (!attempt) return res.status(404).json({ error: 'No in-progress attempt found' });

    const test = await MockTest.findById(testId);
    const user = await User.findById(userId);

    const questionMap = {};
    for (const q of test?.questions || []) {
      const qid = (q._id || q.questionNumber)?.toString();
      questionMap[qid] = q;
    }

    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let attempted = 0;

    for (const ans of detailedAnswers) {
      const qid = ans.questionId?.toString();
      const q = questionMap[qid];

      const isAttempted = ans.selectedAnswer !== null && ans.selectedAnswer !== undefined;
      if (isAttempted) {
        attempted++;
        if (ans.isCorrect) {
          correct++;
          score += q?.marks || 1;
        } else {
          incorrect++;
        }
      }
    }

    const totalQuestions = Object.keys(questionMap).length;
    const skipped = totalQuestions - attempted;
    const yourAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

    const allResults = await StudentTestData.find({ testId });
    const sorted = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    const rank = sorted.findIndex(r => r._id.toString() === attempt._id.toString()) + 1;

    const topicMap = {};
    for (const ans of detailedAnswers) {
      for (const tag of ans.tags || []) {
        if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
        topicMap[tag].total += 1;
        if (ans.isCorrect) topicMap[tag].correct += 1;
      }
    }
    const topicReport = Object.values(topicMap);

    const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
    const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
    for (const ans of detailedAnswers) {
      const level = ans.difficulty || 'Medium';
      const qid = ans.questionId?.toString();
      const marks = questionMap[qid]?.marks || 1;
      difficultyStats[level] += 1;
      if (ans.isCorrect) difficultyScore[level] += marks;
    }

    if (questionTimeSpent && typeof questionTimeSpent === 'object') {
      if (!attempt.questionTimeSpent) attempt.questionTimeSpent = {};
      Object.entries(questionTimeSpent).forEach(([qid, time]) => {
        if (!attempt.questionTimeSpent[qid]) {
          attempt.questionTimeSpent[qid] = 0;
        }
        attempt.questionTimeSpent[qid] += time;
      });
    }

    const updatePayload = {
      answers,
      markedForReviewMap,
      questionStatusMap,
      detailedAnswers,
      score,
      status: 'completed',
      completedAt: new Date(),
      testTitle: test?.title || 'Mock Test',
      studentName: user?.name || "Unknown",
      totalMarks: test?.questions
        ?.filter(q => q.questionType && q.question?.trim())
        .reduce((sum, q) => sum + (q.marks || 1), 0),
      correct,
      incorrect,
      skipped,
      rank,
      topper: sorted[0]?.score || 0,
      average: sorted.length > 0
        ? (sorted.reduce((acc, r) => acc + (r.score || 0), 0) / sorted.length).toFixed(2)
        : "0.00",
      yourAccuracy,
      topicReport,
      difficultyStats,
      difficultyScore,
      questionTimeSpent: attempt.questionTimeSpent || {} // ✅ include in final record
    };

    await StudentTestData.findByIdAndUpdate(attempt._id, updatePayload, { new: true });
    res.status(200).json({ resultId: attempt._id });
  } catch (err) {
    console.error("❌ Submission error:", err);
    res.status(500).json({ error: "Submission failed" });
  }
});



// 🔁 Start attempt (called only if no in-progress exists)
router.post('/userTestData/start-attempt', async (req, res) => {
  const { userId, testId } = req.body;
  try {
    const count = await StudentTestData.countDocuments({ userId, testId });
    if (count >= 5) return res.status(403).json({ error: "Max 5 attempts allowed" });

    const test = await MockTest.findById(testId);
    const user = await User.findById(userId);

    const newAttempt = new StudentTestData({
      userId,
      testId,
      attemptNumber: count + 1,
      answers: {},
      score: 0,
      detailedAnswers: [],
      status: 'in-progress',
      testTitle: test?.title || 'Mock Test',
      studentName: user?.name || "Unknown",
      markedForReviewMap: {},
      questionStatusMap: {},
      timeLeft: test?.duration * 60 || 0,
    });

    const saved = await newAttempt.save();
    res.status(200).json({ attempt: saved });
  } catch (err) {
    console.error("❌ Error starting attempt:", err);
    res.status(500).json({ error: "Start failed" });
  }
});

// 🔁 Resume if in-progress
router.get('/userTestData/latest-attempt', async (req, res) => {
  const { userId, testId } = req.query;
  try {
    const latest = await StudentTestData.findOne({ userId, testId, status: 'in-progress' }).sort({ createdAt: -1 });
    if (!latest) return res.json({ attempt: null });

    res.json({
      attempt: {
        _id: latest._id,
        status: latest.status,
        answers: latest.answers || {},
        markedForReviewMap: latest.markedForReviewMap || {},
        questionStatusMap: latest.questionStatusMap || {},
        timeLeft: latest.timeLeft,
        attemptNumber: latest.attemptNumber,
        currentQuestionIndex: latest.currentQuestionIndex || 0
      }
    });
  } catch (err) {
    console.error("❌ Resume error:", err);
    res.status(500).json({ error: "Resume failed" });
  }
});



// ✅ GET STUDENT DASHBOARD DATA
router.get('/user/dashboard/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const attempts = await StudentTestData.find({ userId })
      .sort({ createdAt: -1 })
      .select(
        'testTitle attemptNumber completedAt status score totalMarks correct incorrect skipped rank topper average yourAccuracy topperAccuracy averageAccuracy topicReport difficultyStats difficultyScore'
      );

    // ✅ Always return consistent JSON shape
    if (!Array.isArray(attempts) || attempts.length === 0) {
      return res.json({ attempts: [], summary: {} });
    }

    let totalAccuracy = 0;
    let totalAverage = 0;
    let totalRank = 0;
    let accuracyCount = 0;
    let averageCount = 0;
    let rankCount = 0;
    let totalMarks = 0;
    let totalScore = 0;

    attempts.forEach((attempt) => {
      if (!isNaN(attempt.yourAccuracy)) {
        totalAccuracy += attempt.yourAccuracy;
        accuracyCount++;
      }
      if (!isNaN(attempt.average)) {
        totalAverage += attempt.average;
        averageCount++;
      }
      if (!isNaN(attempt.rank)) {
        totalRank += attempt.rank;
        rankCount++;
      }
      if (!isNaN(attempt.totalMarks)) totalMarks += attempt.totalMarks;
      if (!isNaN(attempt.score)) totalScore += attempt.score;
    });

    const avgAccuracy = accuracyCount > 0 ? totalAccuracy / accuracyCount : 0;
    const avgScore = averageCount > 0 ? totalAverage / averageCount : 0;
    const avgRank = rankCount > 0 ? (totalRank / rankCount).toFixed(0) : '-';

    res.json({
      attempts,
      summary: {
        avgAccuracy: Number(avgAccuracy.toFixed(2)),
        avgScore: Number(avgScore.toFixed(2)),
        avgRank,
        totalCombinedMarks: totalMarks,
        totalCombinedScore: totalScore
      }
    });

  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});



// ✅ IN-PROGRESS RESUME ENDPOINT
router.get('/userTestData/in-progress/:userId/:testId', async (req, res) => {
  try {
    const { userId, testId } = req.params;

    const inProgress = await StudentTestData.findOne({
      userId,
      testId,
      status: 'in-progress',
    }).sort({ createdAt: -1 });

    if (!inProgress) {
      console.warn("🕳 No in-progress attempt found for", userId, testId);
      return res.status(404).json({ message: 'No in-progress attempt found.' });
    }

    console.log("📥 Resume in-progress attempt:", inProgress._id);

    res.json({
      attempt: {
        _id: inProgress._id,
        status: inProgress.status,
        answers: inProgress.answers || {},
        markedForReviewMap: inProgress.markedForReviewMap || {},
        questionStatusMap: inProgress.questionStatusMap || {},
        timeLeft: inProgress.timeLeft || null,
        attemptNumber: inProgress.attemptNumber || 1
      }
    });

  } catch (error) {
    console.error('❌ Error fetching in-progress attempt:', error);
    res.status(500).json({ error: 'Failed to fetch in-progress attempt' });
  }
});


// 🗑️ Clear all attempts for a user and testId
router.delete('/userTestData/clear-attempts', async (req, res) => {
  try {
    const { userId, testId } = req.body;
    if (!userId || !testId) {
      return res.status(400).json({ error: "userId and testId are required" });
    }

    const deleted = await StudentTestData.deleteMany({ userId, testId });
    console.log(`🧹 Cleared ${deleted.deletedCount} attempts for user ${userId} on test ${testId}`);
    res.status(200).json({ message: 'Attempts cleared successfully' });
  } catch (err) {
    console.error("❌ Error clearing attempts:", err);
    res.status(500).json({ error: "Failed to clear attempts" });
  }
});




// ✅ SEARCH RESULTS BY NAME
router.get("/name/search", async (req, res) => {
    try {
      const name = req.query.name;
      if (!name) return res.status(400).json({ error: "Name is required" });
  
  
      // ✅ New: Directly search in StudentTestData by studentName
      const results = await StudentTestData.find({
        studentName: { $regex: new RegExp(name, "i") }, 
      });
  
      res.json(results);
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  

module.exports = router;
