const aiResponses = {
    "Java": "Let's learn about classes, objects, and inheritance in Java!",
    "C Programming": "Arrays and pointers are the backbone of C.",
    "Machine Learning": "ML helps computers learn from data.",
    "default": "AI lesson generated successfully!"
};

const aiService = {
    generateLesson: (topic) => {
        try {
            console.log("Connecting to AI model with topic: " + topic);
            return aiResponses[topic] || aiResponses["default"];
        } catch (e) {
            console.error("Error connecting to AI service: " + e.message);
            return "Error: Unable to generate AI lesson.";
        }
    }
};

module.exports = aiService;
