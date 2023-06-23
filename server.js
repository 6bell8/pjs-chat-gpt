const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const fetch = require("node-fetch");
// node js는 fetch require로 불러오는

app.use(express.json());
app.use(cors());



// post 양식을 제출할 때, completions page로 보내서 받기
// 비동기 함수 때릴 떄, 파라미터 앞에 어싱크
app.post("/completions", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      // prettier-ignore
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    // json string으로 바꿔주는 것
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "how are you?" }],
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
