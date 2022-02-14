import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "styles/Home.module.scss";
import propagate from "util/math";
import copy from "copy-to-clipboard";
const globalAny: any = global;

declare global {
  interface Window {
    MathJax: any;
  }
}

const Home: NextPage = () => {
  const [equation, setEquation] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<any>("");

  useEffect(() => {
    setEquation(global.localStorage.getItem("equation") || "");
    window &&
      window.MathJax &&
      window.MathJax.typeset &&
      window.MathJax.typeset();
    setCopied(false);
  }, [result]);

  return (
    <div className={styles["container"]}>
      <Head>
        <title>Uncertainty Propagation</title>
        <meta
          name="description"
          content="A handy uncertainty propagation tool that supports LaTeX inputs and outputs"
        />
        <link rel="icon" href="/favicon.ico" />{" "}
        <script
          type="text/javascript"
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        ></script>
        <script
          data-goatcounter="https://stats.uncertainty.afridge.io/count"
          async
          src="//stats.uncertainty.afridge.io/count.js"
        ></script>
      </Head>

      <main className={styles["main"]}>
        <h1>Uncertainty Propagation</h1>
        <p>
          Quite possibly the <i>only</i> uncertainty calculator that outputs the
          relevant LaTeX, with LaTeX input! The author makes no guarantees
          regarding the accuracy of the results, so use at your own risk.
        </p>
        <p>
          When doing multiplication, please use a &quot;*&quot; operator.
          It&apos;s not <i>strictly</i> necessary, but failing to do so can
          cause catastrophically incorrect results.
        </p>
        <p>
          Note that the resulting equation won&apos;t probably be <i>fully</i>{" "}
          simplified, but it typically does a reasonable job.
        </p>
        <input
          type="text"
          placeholder="Type your equation here"
          value={equation}
          onChange={(e) => {
            setEquation(e.target.value);
            localStorage.setItem("equation", e.target.value);
          }}
        />
        <div className={styles["group"]}>
          <button
            onClick={() => {
              try {
                setResult(propagate(equation));
                setError("");
              } catch (err: any) {
                setError(err);
              }
            }}
          >
            Propagate!
          </button>
        </div>
        {error && <div className={styles["error"]}>{error.message}</div>}
        <h2>Result</h2>

        <div className={styles["formula"]}>
          {result && (
            <div className={styles["rendered"]}>{"$$ " + result + " $$"}</div>
          )}
        </div>

        <code>{result}</code>
        <div className={styles["group"]}>
          <button
            className={styles["small-button"]}
            onClick={() => {
              (window as any).MathJax.typeset();
            }}
          >
            Force typeset
          </button>
          <button
            className={styles["small-button"]}
            onClick={() => {
              window &&
                window.MathJax &&
                window.MathJax.typeset &&
                window.MathJax.typeset();
              setCopied(true);
              copy(result);
            }}
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
        <h2>Examples</h2>
        <input type="text" disabled value="e^(x * y)" />
        <input type="text" disabled value="R_1 + R_2" />
        <input type="text" disabled value="R_1 + 1/(1/R_2 + 1/R_3)" />
        <input type="text" disabled value="P * V" />
        <input type="text" disabled value="x^2 + y^2 + z^2" />
        <input type="text" disabled value="\alpha_{\beta_2} * \alpha_2" />
        <input type="text" disabled value="\alpha * \beta/\gamma" />
        <input type="text" disabled value="log(x * y)" />
        <input type="text" disabled value="V_\text{out}/V_\text{in}" />
      </main>
      <footer className={styles["footer"]}>Made with ❤️</footer>
    </div>
  );
};

export default Home;
