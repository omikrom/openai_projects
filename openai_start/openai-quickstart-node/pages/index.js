import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";


export default function Home() {
  const [keywordInput, setKeywordInput] = useState("");
  const [unameInput, setUsernameInput] = useState("");
  const [result, setResult] = useState();
  const [image, setImage] = useState();
  const [cssDisplay, setCssDisplay] = useState("none");
  const [showTitle, setShowTitle] = useState("none");

  function addLineBreaks(text) {
    let newtext = text;
    newtext = newtext.replace(/\\n/g, "<br></br>");
    console.log("newtext: ", newtext);
    return newtext;
  }

  function changeCSSToDisplay(element) {
    if (element === "title") {
      setShowTitle("block");
    }
    else if (element === "parent") {
      setCssDisplay("flex");
    }

  }

  function showLoadingMessage() {
    setResult("Loading...");
    setImage("https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif");
  }



  async function onSubmit(event) {
    event.preventDefault();
    console.log("unameInput: ", unameInput);
    console.log("keywordInput: ", keywordInput);
    changeCSSToDisplay("parent");
    showLoadingMessage();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: unameInput,
          keyword: keywordInput,
        }),
      });

      const data = await response.json();
      console.log("data: ", data);
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      //let poem = addLineBreaks(data.result);
      changeCSSToDisplay("title");
      setResult(data.result);
      setImage(data.imageUrl);
      setKeywordInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.view}>
      <Head>
        <title>AI Poem Generator</title>
        <link rel="icon" href="" />
      </Head>
      <main className={styles.main}>
        <h3>Poem generator</h3>
        <form onSubmit={onSubmit}>
          <input type="text" name="username" placeholder="Enter the name of the person"
            value={unameInput}
            onChange={(e) => setUsernameInput(e.target.value)} />
          <input
            type="text"
            name="keyword"
            placeholder="Enter a keyword"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
          <input type="submit" value="Generate a poem" />
        </form>
        <div className={styles.result_container} style={{
          backgroundImage: `url(${image})`,
          display: cssDisplay
        }
        }>
          <div className={styles.poem_title} style={{
            display: showTitle
          }}></div>
          <div className={styles.result}>
            <p className={styles.poem_title} style={{
              display: showTitle
            }}>{unameInput}'s poem</p>
            <p className={styles.poem_content}>{result}</p></div>
          <div className={styles.poem_bg}></div>
        </div>
      </main>
    </div>
  );
}
