import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { BrainAtlas, defaultRegions, useBrainStore, type BrainRegionData } from 'react-brain-atlas';
import 'react-brain-atlas/styles.css';

/* ── Helpers ──────────────────────────────────────────────────── */
const quizRegions = defaultRegions.filter((r) => !r.fill);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestion(exclude?: string) {
  const pool = exclude ? quizRegions.filter((r) => r.id !== exclude) : quizRegions;
  const correct = pool[Math.floor(Math.random() * pool.length)];
  const distractors = shuffle(quizRegions.filter((r) => r.id !== correct.id)).slice(0, 3);
  const options = shuffle([correct, ...distractors]);
  return { correct, options };
}

/* ── App ──────────────────────────────────────────────────────── */
export default function App() {
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [question, setQuestion] = useState(() => pickQuestion());

  const selectRegion = useBrainStore((s) => s.selectRegion);

  // Highlight current region on the atlas
  useEffect(() => {
    selectRegion(question.correct.id);
  }, [question, selectRegion]);

  const handleAnswer = useCallback(
    (region: BrainRegionData) => {
      if (answered) return;
      setAnswered(region.id);
      setTotal((t) => t + 1);
      if (region.id === question.correct.id) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
      } else {
        setStreak(0);
      }
    },
    [answered, question],
  );

  const handleNext = useCallback(() => {
    setAnswered(null);
    setQuestion(pickQuestion(question.correct.id));
  }, [question]);

  const isCorrect = answered === question.correct.id;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; } body { margin: 0; }`}</style>

      {/* Header */}
      <header style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>🧠 Anatomy Flashcards</h1>
        <div style={{ display: 'flex', gap: 20, fontSize: 14, fontWeight: 600 }}>
          <span>✅ {score}/{total}</span>
          <span>🔥 {streak}</span>
          <span>🏆 {bestStreak}</span>
        </div>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: '0 24px 24px', alignItems: 'flex-start' }}>
        {/* Brain viewer */}
        <div style={{ flex: '1 1 400px', minWidth: 300, borderRadius: 16, overflow: 'hidden', background: '#1e1b4b' }}>
          <BrainAtlas glbPath="/brain.glb" minHeight="400px" />
        </div>

        {/* Quiz card */}
        <div style={{ flex: '0 0 360px', background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <p style={{ fontSize: 13, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Question {total + (answered ? 0 : 1)}
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e1b4b', marginBottom: 20 }}>
            What is this brain region?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.options.map((opt) => {
              let bg = '#f3f4f6';
              let border = '2px solid transparent';
              let color = '#1e1b4b';
              if (answered) {
                if (opt.id === question.correct.id) {
                  bg = '#d1fae5';
                  border = '2px solid #10b981';
                  color = '#065f46';
                } else if (opt.id === answered) {
                  bg = '#fee2e2';
                  border = '2px solid #ef4444';
                  color = '#991b1b';
                }
              }
              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: bg,
                    border,
                    color,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: answered ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: opt.color, marginRight: 10, verticalAlign: 'middle' }} />
                  {opt.fullName}
                </button>
              );
            })}
          </div>

          {answered && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: isCorrect ? '#10b981' : '#ef4444', marginBottom: 8 }}>
                {isCorrect ? '🎉 Correct!' : `❌ It was ${question.correct.fullName}`}
              </p>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                {question.correct.description}
              </p>
              <button
                onClick={handleNext}
                style={{
                  padding: '10px 28px',
                  borderRadius: 9999,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
