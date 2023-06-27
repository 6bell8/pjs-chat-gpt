const PORT = 8080;
const express = require("express");
const cors = require("cors");
const app = express();
const fetch = require("node-fetch");

// node js는 fetch require로 불러오는

// 이걸 잊지말라는데 뭘 잊지말라는건지 모르겠음
app.use(express.json());
app.use(cors());
require("dotenv").config();

// post 양식을 제출할 때, completions page로 보내서 받기
// 비동기 함수 때릴 떄, 파라미터 앞에 어싱크
app.post("/completions", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      // prettier-ignore
      // "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
      "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
      "Content-Type": "application/json",
    },
    // json string으로 바꿔주는 것, 그리고 req.body는 node js 프레임워크에서 사용하는 본문 데이터를 요청하는 방법이다.
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 100,
    }),
  };
  try {
    // 불러들일 때 까지 await
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    // 불러들인 데이터를 json 형태로 변환
    const data = await response.json();
    // 서버에서 다시 데이터를 전송
    res.send(data);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => console.log(PORT + "서버가 작동 중입니다."));
