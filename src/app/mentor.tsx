import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import axios from "axios";

export default function MentorScreen() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = async () => {
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA8Z0fPi05IQ-3L5-u59zwBBTOArI1RHes",
        {
          contents: [
            {
              parts: [
                {
                  text: question,
                },
              ],
            },
          ],
        }
      );

      const aiText =
        response.data.candidates[0].content.parts[0].text;

      setAnswer(aiText);
    } catch (error) {
      console.log(error);
      setAnswer("Error getting AI response");
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#020617",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 35,
          fontWeight: "bold",
          marginTop: 40,
        }}
      >
        AI Mentor
      </Text>

      <TextInput
        placeholder="Ask in Hindi..."
        placeholderTextColor="gray"
        value={question}
        onChangeText={setQuestion}
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          padding: 15,
          borderRadius: 12,
          marginTop: 40,
          fontSize: 18,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "orange",
          padding: 15,
          borderRadius: 12,
          marginTop: 20,
        }}
        onPress={askAI}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          ASK AI
        </Text>
      </TouchableOpacity>

      <View
        style={{
          backgroundColor: "#1e293b",
          padding: 20,
          borderRadius: 20,
          marginTop: 30,
        }}
      >
        <Text
          style={{
            color: "orange",
            fontSize: 22,
            marginBottom: 10,
          }}
        >
          AI Response
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 18,
          }}
        >
          {answer}
        </Text>
      </View>
    </ScrollView>
  );
}