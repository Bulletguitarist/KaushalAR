import { View, Text } from "react-native";

export default function CertificateScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#020617",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "orange",
          fontSize: 40,
          fontWeight: "bold",
        }}
      >
        Certificate Earned
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 20,
          marginTop: 20,
          textAlign: "center",
        }}
      >
        Electrician Level 1 Completed
      </Text>
    </View>
  );
}