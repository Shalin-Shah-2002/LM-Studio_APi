const axios = require('axios');

// Function to send a chat message to the LM Studio server
async function sendMessage(message) {
  try {
    const response = await axios.post('http://localhost:1234/v1/chat/completions', {
      model: 'your-model-name', // Replace with your model's name
      messages: [
        { role: 'user', content: message }
      ]
    });

    const assistantMessage = response.data.choices[0].message.content;
    console.log('Assistant:', assistantMessage);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

// Example usage
const userMessage = 'Analyze the users weight 85kg, height 180cm, 23 age, male gender, and fitness goal to calculate their Body Mass Index (BMI) and Basal Metabolic Rate (BMR). Based on these metrics, provide personalized exercise recommendations aligned with their fitness objectives.';
sendMessage(userMessage);
