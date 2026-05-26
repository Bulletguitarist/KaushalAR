import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function ARScreen() {
  return (
    <View
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
        Electrician AR Training
      </Text>

      <View
        style={{
          backgroundColor: "#1e293b",
          padding: 20,
          borderRadius: 20,
          marginTop: 40,
        }}
      >
        <Text
          style={{
            color: "orange",
            fontSize: 24,
          }}
        >
          Module 1
        </Text>

        <Text
          style={{
            color: "white",
            marginTop: 15,
            fontSize: 20,
          }}
        >
          Basic House Wiring
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "orange",
            padding: 15,
            borderRadius: 12,
            marginTop: 25,
          }}
          onPress={() => router.push("/mentor")}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            OPEN AI MENTOR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}