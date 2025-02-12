// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');

// const app = express();
// const PORT = 3000; // Change if needed

// app.use(express.json());
// app.use(cors()); // Enable CORS if accessing from a frontend

// // Helper function to clean the response from <think> tags
// const cleanResponse = (content) => {
//   return content.replace(/<think>.*?<\/think>/gs, '').trim(); // Removes the <think> tags
// };

// // Endpoint to send a chat message to the LM Studio server
// app.post('/chat', async (req, res) => {
//   const { message } = req.body;
  
//   if (!message) {
//     return res.status(400).json({ error: 'Message is required' });
//   }

//   try {
//     const response = await axios.post('http://localhost:1234/v1/chat/completions', {
//       model: 'your-model-name', // Replace with your actual model's name
//       messages: [{ role: 'user', content: message }]
//     });

//     let assistantMessage = response.data.choices[0].message.content;
    
//     // Clean the message to remove unwanted <think> tags or extra formatting
//     assistantMessage = cleanResponse(assistantMessage);

//     res.json({ response: assistantMessage });
//   } catch (error) {
//     res.status(500).json({ error: error.response ? error.response.data : error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post('http://localhost:1234/v1/chat/completions', {
      model: 'your-model-name',
      messages: [{ role: 'user', content: message }]
    });

    let assistantMessage = response.data.choices[0].message.content;

    // Remove ** (bold markers) from the message
    assistantMessage = assistantMessage.replace(/\*\*/g, '').trim();

    // Remove any HTML-like content (e.g., <think>...</think>) before extracting structured data
    assistantMessage = assistantMessage.replace(/<think>.*?<\/think>/gs, '').trim();

    // Now, extract the fields from the cleaned message
    const responseJson = {
      "Exercise Name": "",      // Placeholder for Exercise Name
      "Description": "",        // Placeholder for Description
      "Beginner Reps": "",      // Placeholder for Beginner Reps
      "Intermediate Reps": "",  // Placeholder for Intermediate Reps
      "Professional Reps": ""   // Placeholder for Professional Reps
    };

    // Split the cleaned message into lines and extract relevant information
    const lines = assistantMessage.split("\n");

    // Loop through each line to match and extract key-value pairs
    let currentKey = "";
    lines.forEach(line => {
      if (line.startsWith("Exercise Name:")) {
        responseJson["Exercise Name"] = line.replace("Exercise Name:", "").trim();
      } else if (line.startsWith("Description:")) {
        responseJson["Description"] = line.replace("Description:", "").trim();
      } else if (line.startsWith("Beginner Reps:")) {
        responseJson["Beginner Reps"] = line.replace("Beginner Reps:", "").trim();
      } else if (line.startsWith("Intermediate Reps:")) {
        responseJson["Intermediate Reps"] = line.replace("Intermediate Reps:", "").trim();
      } else if (line.startsWith("Professional Reps:")) {
        responseJson["Professional Reps"] = line.replace("Professional Reps:", "").trim();
      }
    });

    res.json(responseJson);

  } catch (error) {
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
