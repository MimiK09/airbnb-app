import { View, Text, StyleSheet, Image, Platform } from "react-native";

const HeaderLogo = () => {
  console.log(Platform.OS);

  return <Image source={require("../assets/ABNB.png")} style={styles.logo} />;
};

export default HeaderLogo;

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    marginLeft: Platform.OS === "android" ? -10 : -15,
    height: 30,
    resizeMode: "contain",
    // borderWidth: 1,
    // borderColor: "red",
  },
});
