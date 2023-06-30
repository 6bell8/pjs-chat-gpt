/* eslint-disable */

import { BsPlusCircleFill } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import "./index.css";
import moment from "moment";

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [timeNow, setTimeNow] = useState([]);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  //채팅 시간 기록
  const nowTime = moment().format("HH:mm");

  // 채팅 용 스크롤 제어
  // dom을 직접 지정하고
  const scrollRef = useRef();
  // useEffect변화를 통해서, 현재 스크롤을 스크롤 길이값과 같게하여 자동으로 내리기
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  });

  // 새로운 채팅 생성
  const creatNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
    setTimeNow(timeNow);
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
        // "http://localhost:8000/completions",
        "https://pjs-chat-server.fly.dev/completions",
        options
      );
      const data = await response.json();
      //setdata안에다가, choice 매서드에서 가장 처음오는 값을 return
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      getMessages(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  // 이전 채팅 기록 state 최신화
  useEffect(() => {
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
          time: nowTime,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
          time: nowTime,
        },
      ]);
    }
  }, [message, currentTitle]);

  // 이전 채팅 타이틀과 현재 채팅 타이틀이 같을 경우 filter해서 새로운 배열 리턴
  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );

  // 중복 방지 Array.from 이터러블 배열 생성(앝은 복사)
  const uniqueTitles = {
    array: Array.from(
      new Set(previousChats.map((previousChats) => previousChats.title))
    ),
  };

  // 클릭 시 이전 채팅으로 이동 // click 시  setCurrentTitle에 uniqueTitle 인자값을 넣어줌 ㄷㄷ
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
    setTimeNow(uniqueTitle);
  };

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={creatNewChat} className="newChat-btn">
          <BsPlusCircleFill className="plus-icon" />
          새로운 채팅
        </button>
        <ul className="history">
          {/* handleClick안에 uniqueTitle을 넣어줘야 인자값이 들어감, 그리고 인자 값을 넣어줬으니 화살표 함수를 떄려줘야됨 */}
          {uniqueTitles.array?.map((uniqueTitle, i) => (
            <li key={i} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p className="madeby">Made By Jinsung</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>pjs-chatGPT</h1>}
        <ul className="feed" ref={scrollRef}>
          {/* currentChat에서 매핑 떄려서 순서대로 나열  */}
          {/* undefined가 뜰 수 있으니, 옵셔널체이닝 */}
          {currentChat?.map((chatMessage, i) => (
            <li key={i}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value || ""}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onKeyDown={handleOnKeyPress}
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
