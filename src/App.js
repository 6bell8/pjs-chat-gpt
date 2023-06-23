/* eslint-disable */

import { BsPlusCircleFill } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import "./index.css";

const App = () => {
  // backend에서 send한 data를 다시 보내주는 작업
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        // 일단 하드코딩으로 test
        message: "안녕하세요? 반갑습니다.",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      // 서버에서 했던 것 처럼 서버에서 전송한 데이터를 json 형태로 가공하는 작업
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <section className="side-bar">
        <button>
          <BsPlusCircleFill className="plus-icon" />
          새로운 채팅
        </button>
        <ul className="history">
          <li>asd</li>
        </ul>
        <nav>
          <p>Made By Jinsung</p>
        </nav>
      </section>
      <section className="main">
        <h1>pjs-chatGPT</h1>
        <ul className="feed"></ul>
        <div className="bottom-section">
          <div className="input-container">
            <input />
            <div id="submit" onClick={getMessages}>
              <AiOutlineArrowRight />
            </div>
          </div>
          <p className="info">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
            optio vitae molestias. Totam perspiciatis reiciendis ducimus
            asperiores sed ipsam enim quae, eligendi quasi quos quidem commodi!
            Esse magni iure sint!
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
