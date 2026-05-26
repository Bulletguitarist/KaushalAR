import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";

export default function TradesScreen() {
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
        Select Trade
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#1e293b",
          padding: 20,
          borderRadius: 20,
          marginTop: 30,
        }}
        onPress={() => router.push("/ar")}
      >
        <Text style={{ color: "orange", fontSize: 28 }}>
          ⚡ Electrician
        </Text>

        <Text style={{ color: "gray", marginTop: 10 }}>
          Learn electrical wiring using AR
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#1e293b",
          padding: 20,
          borderRadius: 20,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "orange", fontSize: 28 }}>
          🔧 Plumbing
        </Text>

        <Text style={{ color: "gray", marginTop: 10 }}>
          Pipe fitting training
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}