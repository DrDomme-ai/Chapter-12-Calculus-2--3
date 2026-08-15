import { useState } from "react";
import "./AdditionAnimation.css";

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }

  return x || 1;
}

function simplifyFraction(numerator, denominator) {
  if (denominator === 0) return null;

  const sign = denominator < 0 ? -1 : 1;
  const n = numerator * sign;
  const d = Math.abs(denominator);

  const divisor = gcd(n, d);

  return {
    numerator: n / divisor,
    denominator: d / divisor,
  };
}

function Fraction({ numerator, denominator }) {
  if (denominator === 1) {
    return <span>{numerator}</span>;
  }

  return (
    <span className="fraction">
      <span>{numerator}</span>
      <span>{denominator}</span>
    </span>
  );
}

function NumberLine({
  min = -6,
  max = 6,
  highlighted = [],
  continuous = false,
  irrationalPoints = false,
}) {
  const values = [];

  for (let value = min; value <= max; value += 1) {
    values.push(value);
  }

  const getPercent = (value) =>
    ((value - min) / (max - min)) * 100;

  const irrationalValues = [
    { label: "√2", value: Math.sqrt(2) },
    { label: "√3", value: Math.sqrt(3) },
    { label: "e", value: Math.E },
    { label: "π", value: Math.PI },
  ];

  return (
    <div className="number-line-wrapper">
      <div
        className={`number-line ${continuous ? "continuous" : ""}`}
      />

      {values.map((value) => (
        <div
          key={value}
          className="tick"
          style={{ left: `${getPercent(value)}%` }}
        >
          <span className="tick-mark" />
          <span className="tick-label">{value}</span>
        </div>
      ))}

      {highlighted.map((item, index) => (
        <div
          key={`${item.value}-${index}`}
          className={`number-point ${item.kind || ""}`}
          style={{ left: `${getPercent(item.value)}%` }}
        >
          <span className="point-dot" />
          <span className="point-label">{item.label}</span>
        </div>
      ))}

      {irrationalPoints &&
        irrationalValues
          .filter((item) => item.value >= min && item.value <= max)
          .map((item) => (
            <div
              key={item.label}
              className="number-point irrational"
              style={{ left: `${getPercent(item.value)}%` }}
            >
              <span className="point-dot" />
              <span className="point-label">{item.label}</span>
            </div>
          ))}
    </div>
  );
}

export default function AdditionAnimation() {
  const [stage, setStage] = useState(0);

  // Natural-number activity
  const [naturalA, setNaturalA] = useState(2);
  const [naturalB, setNaturalB] = useState(3);

  // Integer activity
  const [integerA, setIntegerA] = useState(2);
  const [integerB, setIntegerB] = useState(5);

  // Rational activity
  const [p, setP] = useState(2);
  const [q, setQ] = useState(3);
  const [r, setR] = useState(4);
  const [s, setS] = useState(5);

  const stages = [
    "Natural Numbers",
    "Integers",
    "Rational Numbers",
    "Why Q Is Not Complete",
    "Real Numbers",
  ];

  const naturalSum = naturalA + naturalB;

  const integerDifference = integerA - integerB;

  // (p/q) ÷ (r/s) = (p/q)(s/r)
  const rationalResult =
    r !== 0
      ? simplifyFraction(p * s, q * r)
      : null;

  const nextStage = () => {
    setStage((current) =>
      Math.min(current + 1, stages.length - 1)
    );
  };

  const previousStage = () => {
    setStage((current) => Math.max(current - 1, 0));
  };

  const reset = () => {
    setStage(0);
    setNaturalA(2);
    setNaturalB(3);
    setIntegerA(2);
    setIntegerB(5);
    setP(2);
    setQ(3);
    setR(4);
    setS(5);
  };

  return (
    <section className="number-system-demo">
      <header className="number-system-header">
        <p className="eyebrow">Building the Real Number System</p>

        <h2>{stages[stage]}</h2>

        <p>
          We begin with counting numbers and enlarge the number
          system only when a familiar arithmetic operation
          requires numbers we do not yet have.
        </p>
      </header>

      <div className="stage-progress">
        {stages.map((name, index) => (
          <button
            key={name}
            type="button"
            className={index === stage ? "active" : ""}
            onClick={() => setStage(index)}
          >
            <span>{index + 1}</span>
            {name}
          </button>
        ))}
      </div>

      {/* =====================================================
          STAGE 1 — NATURAL NUMBERS
      ====================================================== */}

      {stage === 0 && (
        <div className="lesson-stage">
          <div className="concept-heading">
            <p className="eyebrow">Start with counting</p>

            <h3>
              1, 2, 3, 4, ... are the natural numbers.
            </h3>

            <div className="math-statement">
              ℕ = {"{"}1, 2, 3, 4, ...{"}"}
            </div>

            <p>
              Choose any two natural numbers below and add them.
              The result is still a natural number.
            </p>
          </div>

          <NumberLine
            min={0}
            max={12}
            highlighted={[
              {
                value: naturalA,
                label: `a = ${naturalA}`,
              },
              {
                value: naturalB,
                label: `b = ${naturalB}`,
              },
              {
                value: naturalSum,
                label: `a + b = ${naturalSum}`,
                kind: "result",
              },
            ]}
          />

          <div className="interaction-card">
            <div className="control-grid">
              <label>
                Choose a
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={naturalA}
                  onChange={(event) =>
                    setNaturalA(Number(event.target.value))
                  }
                />
                <strong>{naturalA}</strong>
              </label>

              <label>
                Choose b
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={naturalB}
                  onChange={(event) =>
                    setNaturalB(Number(event.target.value))
                  }
                />
                <strong>{naturalB}</strong>
              </label>
            </div>

            <div className="operation-display">
              {naturalA} + {naturalB} ={" "}
              <strong>{naturalSum}</strong>
            </div>

            <div className="success-message">
              ✓ The result {naturalSum} is still in ℕ.
            </div>
          </div>

          <div className="teaching-box">
            <strong>Property discovered: Closure under addition</strong>

            <p>
              If <em>a</em> and <em>b</em> are natural numbers,
              then <em>a + b</em> is also a natural number.
            </p>

            <div className="math-statement">
              a, b ∈ ℕ ⟹ a + b ∈ ℕ
            </div>
          </div>

          <div className="transition-question">
            <h4>But what happens if we subtract?</h4>

            <p>
              For example, 2 − 5 = −3. The number −3 is not in
              our current set.
            </p>

            <button type="button" onClick={nextStage}>
              Add zero and negative numbers →
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          STAGE 2 — INTEGERS
      ====================================================== */}

      {stage === 1 && (
        <div className="lesson-stage">
          <div className="concept-heading">
            <p className="eyebrow">Extend the number line</p>

            <h3>
              Add zero and the negative counting numbers.
            </h3>

            <div className="math-statement">
              ℤ = {"{"}..., −3, −2, −1, 0, 1, 2, 3, ...{"}"}
            </div>

            <p>
              Now subtraction between integers never forces us
              outside the set.
            </p>
          </div>

          <NumberLine
            min={-8}
            max={8}
            highlighted={[
              {
                value: integerA,
                label: `a = ${integerA}`,
              },
              {
                value: integerB,
                label: `b = ${integerB}`,
              },
              {
                value: integerDifference,
                label: `a − b = ${integerDifference}`,
                kind: "result",
              },
            ]}
          />

          <div className="interaction-card">
            <div className="control-grid">
              <label>
                Choose a
                <input
                  type="range"
                  min="-5"
                  max="5"
                  value={integerA}
                  onChange={(event) =>
                    setIntegerA(Number(event.target.value))
                  }
                />
                <strong>{integerA}</strong>
              </label>

              <label>
                Choose b
                <input
                  type="range"
                  min="-5"
                  max="5"
                  value={integerB}
                  onChange={(event) =>
                    setIntegerB(Number(event.target.value))
                  }
                />
                <strong>{integerB}</strong>
              </label>
            </div>

            <div className="operation-display">
              {integerA} − ({integerB}) ={" "}
              <strong>{integerDifference}</strong>
            </div>

            <div className="equivalent-operation">
              Subtraction can be viewed as addition of the
              additive inverse:
              <div className="math-statement">
                {integerA} + ({-integerB}) ={" "}
                {integerDifference}
              </div>
            </div>

            <div className="success-message">
              ✓ The result {integerDifference} is still in ℤ.
            </div>
          </div>

          <div className="teaching-box">
            <strong>Additive inverses</strong>

            <p>
              Every integer <em>a</em> has an opposite, −
              <em>a</em>, and
            </p>

            <div className="math-statement">
              a + (−a) = 0.
            </div>
          </div>

          <div className="transition-question">
            <h4>Are integers enough for division?</h4>

            <p>
              No. For example, 1 ÷ 2 = 1/2, and 1/2 is not an
              integer.
            </p>

            <button type="button" onClick={nextStage}>
              Insert the fractions →
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          STAGE 3 — RATIONAL NUMBERS
      ====================================================== */}

      {stage === 2 && (
        <div className="lesson-stage">
          <div className="concept-heading">
            <p className="eyebrow">Make division possible</p>

            <h3>Introduce the rational numbers.</h3>

            <div className="math-statement">
              ℚ = {"{"}p/q : p, q ∈ ℤ and q ≠ 0{"}"}
            </div>

            <p>
              Every nonzero rational number has a rational
              reciprocal. Dividing by a nonzero rational number
              is the same as multiplying by its reciprocal.
            </p>
          </div>

          <div className="rational-line">
            <NumberLine
              min={-4}
              max={4}
              highlighted={[
                { value: -2.5, label: "−5/2" },
                { value: -1.5, label: "−3/2" },
                { value: -0.5, label: "−1/2" },
                { value: 0.5, label: "1/2" },
                { value: 1.5, label: "3/2" },
                { value: 2.5, label: "5/2" },
              ]}
            />
          </div>

          <div className="interaction-card">
            <h4>Divide two rational numbers</h4>

            <div className="fraction-controls">
              <div>
                <label>
                  p
                  <input
                    type="number"
                    value={p}
                    onChange={(event) =>
                      setP(Number(event.target.value))
                    }
                  />
                </label>

                <span>/</span>

                <label>
                  q
                  <input
                    type="number"
                    min="1"
                    value={q}
                    onChange={(event) =>
                      setQ(
                        Math.max(1, Number(event.target.value))
                      )
                    }
                  />
                </label>
              </div>

              <span className="operation-symbol">÷</span>

              <div>
                <label>
                  r
                  <input
                    type="number"
                    value={r}
                    onChange={(event) =>
                      setR(Number(event.target.value))
                    }
                  />
                </label>

                <span>/</span>

                <label>
                  s
                  <input
                    type="number"
                    min="1"
                    value={s}
                    onChange={(event) =>
                      setS(
                        Math.max(1, Number(event.target.value))
                      )
                    }
                  />
                </label>
              </div>
            </div>

            {r === 0 ? (
              <div className="warning-message">
                Division by zero is undefined. Choose r ≠ 0.
              </div>
            ) : (
              <>
                <div className="operation-display fraction-equation">
                  <Fraction numerator={p} denominator={q} />
                  <span> ÷ </span>
                  <Fraction numerator={r} denominator={s} />
                  <span> = </span>
                  <Fraction numerator={p} denominator={q} />
                  <span> × </span>
                  <Fraction numerator={s} denominator={r} />
                  <span> = </span>

                  {rationalResult && (
                    <strong>
                      <Fraction
                        numerator={rationalResult.numerator}
                        denominator={rationalResult.denominator}
                      />
                    </strong>
                  )}
                </div>

                <div className="success-message">
                  ✓ The result is still rational.
                </div>
              </>
            )}
          </div>

          <div className="teaching-box">
            <strong>Important: ℚ is already a field.</strong>

            <p>
              Rational numbers are closed under addition,
              subtraction, and multiplication, and under
              division by any nonzero rational number.
            </p>

            <p>
              But something important is still missing:
              <strong> completeness.</strong>
            </p>
          </div>

          <div className="transition-question">
            <h4>
              If fractions are everywhere, have we filled the
              entire number line?
            </h4>

            <button type="button" onClick={nextStage}>
              Look more closely →
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          STAGE 4 — Q IS DENSE BUT NOT COMPLETE
      ====================================================== */}

      {stage === 3 && (
        <div className="lesson-stage">
          <div className="concept-heading">
            <p className="eyebrow">A subtle problem</p>

            <h3>ℚ is dense, but ℚ is not complete.</h3>

            <p>
              Rational numbers occur arbitrarily close to every
              point on the line. But certain limiting values do
              not belong to ℚ.
            </p>
          </div>

          <NumberLine
            min={0}
            max={4}
            highlighted={[
              { value: 1.4, label: "1.4" },
              { value: 1.41, label: "1.41" },
              { value: 1.414, label: "1.414" },
              { value: 1.4142, label: "1.4142" },
              {
                value: Math.sqrt(2),
                label: "√2",
                kind: "missing",
              },
            ]}
          />

          <div className="approximation-panel">
            <h4>Watch rational numbers approach √2</h4>

            <div className="approximation-row">
              <span>1</span>
              <span>1.4</span>
              <span>1.41</span>
              <span>1.414</span>
              <span>1.4142</span>
              <span>...</span>
              <strong>√2</strong>
            </div>

            <p>
              Every decimal shown before √2 is rational, but
              the exact number
            </p>

            <div className="math-statement">√2</div>

            <p>is irrational.</p>
          </div>

          <div className="teaching-box">
            <strong>Dense does not mean complete.</strong>

            <p>
              Between any two distinct real numbers there is a
              rational number. Nevertheless, ℚ can contain
              sequences that approach a limit that is not in ℚ.
            </p>
          </div>

          <div className="irrational-examples">
            <h4>Some values missing from ℚ</h4>

            <div className="irrational-card-grid">
              <article>
                <strong>√2</strong>
                <span>≈ 1.41421356...</span>
              </article>

              <article>
                <strong>√3</strong>
                <span>≈ 1.73205081...</span>
              </article>

              <article>
                <strong>e</strong>
                <span>≈ 2.71828183...</span>
              </article>

              <article>
                <strong>π</strong>
                <span>≈ 3.14159265...</span>
              </article>
            </div>
          </div>

          <div className="transition-question">
            <h4>
              What happens when rational and irrational numbers
              are included together?
            </h4>

            <button type="button" onClick={nextStage}>
              Complete the real line →
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          STAGE 5 — REAL NUMBERS / COMPLETENESS
      ====================================================== */}

      {stage === 4 && (
        <div className="lesson-stage">
          <div className="concept-heading">
            <p className="eyebrow">The real number system</p>

            <h3>The real number line is complete.</h3>

            <div className="math-statement">
              ℝ = rational numbers ∪ irrational numbers
            </div>
          </div>

          <NumberLine
            min={-4}
            max={4}
            continuous
            irrationalPoints
            highlighted={[
              { value: -2.5, label: "−5/2" },
              { value: -1, label: "−1" },
              { value: 0, label: "0" },
              { value: 0.5, label: "1/2" },
              { value: 2, label: "2" },
            ]}
          />

          <div className="complete-line-message">
            <strong>No missing limiting points.</strong>

            <p>
              Rational and irrational numbers together form the
              real number system.
            </p>
          </div>

          <div className="completeness-card">
            <p className="eyebrow">Completeness</p>

            <h4>Least Upper Bound Property</h4>

            <p>
              Every nonempty subset of ℝ that is bounded above
              has a least upper bound in ℝ.
            </p>

            <div className="math-statement">
              S ⊆ ℝ, S ≠ ∅, S bounded above
              <br />
              ⟹ sup S ∈ ℝ
            </div>
          </div>

          <div className="structure-grid">
            <article>
              <span>01</span>
              <h4>Field</h4>
              <p>
                Addition, subtraction, multiplication, and
                division by nonzero numbers behave according to
                the field laws.
              </p>
            </article>

            <article>
              <span>02</span>
              <h4>Ordered</h4>
              <p>
                Real numbers can be compared using &lt;, ≤,
                &gt;, and ≥ in a way compatible with arithmetic.
              </p>
            </article>

            <article>
              <span>03</span>
              <h4>Complete</h4>
              <p>
                Bounded sets have the boundary values required
                by the least-upper-bound property.
              </p>
            </article>
          </div>

          <div className="final-statement">
            <span>The destination</span>

            <h3>ℝ is a complete ordered field.</h3>

            <p>
              This is the number system on which ordinary
              calculus is built.
            </p>
          </div>

          <div className="containment-chain">
            ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ
          </div>
        </div>
      )}

      {/* =====================================================
          BOTTOM NAVIGATION
      ====================================================== */}

      <footer className="animation-navigation">
        <button
          type="button"
          onClick={previousStage}
          disabled={stage === 0}
        >
          ← Previous
        </button>

        <span>
          Step {stage + 1} of {stages.length}
        </span>

        {stage < stages.length - 1 ? (
          <button type="button" onClick={nextStage}>
            Next →
          </button>
        ) : (
          <button type="button" onClick={reset}>
            Restart
          </button>
        )}
      </footer>
    </section>
  );
}