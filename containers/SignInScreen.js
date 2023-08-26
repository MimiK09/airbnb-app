import { useNavigation } from "@react-navigation/core";
import {
	Text,
	TextInput,
	View,
	TouchableOpacity,
	Image,
	useWindowDimensions,
	StyleSheet,
	ScrollView,
	Alert,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignInScreen({ setToken }) {
	const styles = useStyle();

	const navigation = useNavigation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async () => {
		if (email && password) {
			try {
				const response = await axios.post(
					"https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
					{ email, password }
				);
				Alert.alert("You're connected !");
				setEmail("");
				setPassword("");
				setErrorMessage("");
				console.log("response.data.token", response.data.token);
				await AsyncStorage.setItem("token", response.data.token);
				setToken(response.data.token);
			} catch (error) {
				setErrorMessage("Email or password are false");
				console.log("sign in error", error.response);
			}
		} else {
			setErrorMessage("Please fill all fields");
		}
	};

	return (
		<View>
			<ScrollView contentContainerStyle={styles.mainBloc}>
				<View style={styles.blocGap}>
					<View style={styles.centerBloc}>
						<Image
							source={require("../assets/ABNB.png")}
							style={styles.imgLogo}
						/>
						<Text style={styles.titleSign}>Sign In</Text>
					</View>
					<KeyboardAwareScrollView>
						<View style={styles.centerBloc}>
							<TextInput
								placeholder="Email"
								onChangeText={(text) => setEmail(text)}
								value={email}
								style={styles.input}
							/>

							<TextInput
								placeholder="Password"
								secureTextEntry={true}
								onChangeText={(text) => setPassword(text)}
								value={password}
								style={styles.input}
							/>
						</View>
					</KeyboardAwareScrollView>
					<KeyboardAwareScrollView>
						<View style={styles.centerBloc}>
							<TouchableOpacity
								title="Sign in"
								onPress={handleSubmit}
								style={styles.validationButton}
							>
								<Text style={styles.textValidationButton}>Sign In</Text>
							</TouchableOpacity>
							{errorMessage ? (
								<Text style={styles.errorMsg}>{errorMessage}</Text>
							) : (
								<></>
							)}
							<TouchableOpacity
								onPress={() => {
									navigation.navigate("SignUp");
								}}
								style={styles.secondButton}
							>
								<Text>No account ? Register</Text>
							</TouchableOpacity>
						</View>
					</KeyboardAwareScrollView>
				</View>
			</ScrollView>
		</View>
	);
}

const useStyle = () => {
	const { width, height } = useWindowDimensions();

	const styles = StyleSheet.create({
		imgLogo: {
			width: 50,
			height: 50,
			resizeMode: "contain",
			marginVertical: 10,
		},
		mainBloc: {
			backgroundColor: "#fff",
			height: "100%",
			justifyContent: "space-around",
		},
		centerBloc: {
			alignItems: "center",
		},
		blocGap: { gap: 50 },
		titleSign: {
			fontSize: 24,
			color: "#717171",
			fontWeight: "bold",
			marginVertical: 5,
		},
		input: {
			width: "80%",
			height: 40,
			borderBottomWidth: 1,
			borderBottomColor: "#f9585d",
			marginVertical: 10,
		},
		validationButton: {
			width: "40%",
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			height: 50,
			borderColor: "#f9585d",
			borderRadius: 30,
			borderWidth: 2,
		},
		textValidationButton: {
			color: "#717171",
			fontWeight: "600",
			fontSize: 16,
		},
		secondButton: {
			width: "80%",
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			height: 50,
		},
		errorMsg: {
			color: "#f9585d",
			marginVertical: 10,
		},
	});

	return styles;
};
