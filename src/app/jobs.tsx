import { View, Text } from "react-native";

export default function JobsScreen() {
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
        Job Marketplace
      </Text>

      <View
        style={{
          backgroundColor: "#1e293b",
          padding: 20,
          borderRadius: 20,
          marginTop: 30,
        }}
      >
        <Text style={{ color: "orange", fontSize: 26 }}>
          Tata Motors
        </Text>

        <Text style={{ color: "white", marginTop: 10 }}>
          Electrician Apprentice
        </Text>

        <Text style={{ color: "gray", marginTop: 10 }}>
          Pune • ₹18,000/month
        </Text>
      </View>
    </View>
  );
}