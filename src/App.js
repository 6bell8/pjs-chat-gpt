/* eslint-disable */

import { BsPlusCircleFill } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useState, useEffect } from "react";
import "./index.css";

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const creatNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  // backend에서 send한 data를 다시 보내주는 작업
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        // getmessage 파라미터에 실어보낼 값을 usestate value로 잡고 실어보냄
        message: value,
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
      //setdata안에다가, choice 매서드에서 가장 처음오는 값을 return
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(currentTitle, value, message);
    // 하기 세가지 내용과 같지 않으면 setcurrentTitle에 값을 넣어라
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }

    // 만약 이전 chat 내용과 같을 경우, previousChats 스프레드 연산자로, 객체 최신화
    if (currentTitle && value && message) {
      setPreviousChats((previousChats) => [
        ...previousChats,
        {
          title: currentTitle,
          role: "사용자",
          content: value,
        },
        { title: currentTitle, role: message.role, content: message.content },
      ]);
    }
  }, [message, currentTitle]);

  console.log(previousChats);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={creatNewChat}>
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
        {!currentTitle && <h1>pjs-chatGPT</h1>}
        <ul className="feed">
          {/* currentChat에서 매핑 떄려서 순서대로 나열  */}
          {currentChat.map((chatMessage, index) => {
            <li key={index}></li>;
          })}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value || ""}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
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
