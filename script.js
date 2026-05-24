let apikey = process.env.GROQ_API_KEY || "";  // Load from environment variable
const chatbox = document.getElementById("chatbox");
const userinput = document.getElementById("userinput");
const sendbutton = document.getElementById("send-button");

function addMessage(message, classname) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", classname);
  msgDiv.textContent = message;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function showtyping() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot-message");
  typingDiv.textContent = "AI is typing";
  chatbox.appendChild(typingDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
  return typingDiv;
}

async function getbotreply(usermessage) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apikey}`,   
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",          
        messages: [
          { role: "user", content: usermessage }
        ]
      })
    });

    const data = await response.json();
    console.log(data);

    // Return the bot's reply text
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error:", error);
    return "Sorry, something went wrong.";
  }
}

sendbutton.onclick = async () => {
  const message = userinput.value.trim();
  console.log(message);
  if (message === "") return;
  addMessage(message, "user-message");
  userinput.value = "";
  const typingDiv = showtyping();
  const botreply = await getbotreply(message);
  typingDiv.remove();
  addMessage(botreply, "bot-message");
  localStorage.setItem("chatHistory", chatbox.innerHTML);
}

userinput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendbutton.onclick();
});