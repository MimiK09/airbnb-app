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

export default function SignUpScreen({ setToken }) {
	const styles = useStyle();
	const navigation = useNavigation();

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [text, setText] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [activityIndicator, setActivityIndicator] = useState(false);

	const handleChange = (func, string) => {
		func(string);
	};

	const handleSubmit = async () => {
		if (password && confirmPassword && text && email && username) {
			if (password === confirmPassword) {
				try {
					console.log("je passe")

					const response = await axios.post(
						"https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
						{ email, username, description: text, password }
					);
					console.log("je passe2")
					Alert.alert("Sign up completed !");
					setEmail("");
					setUsername("");
					setConfirmPassword("");
					setPassword("");
					setText("");
					setErrorMsg("");
					console.log("response.data.token", response.data.token);
					setToken(response.data.token)
				} catch (error) {
					console.log("error", error);
				}
			} else {
				setErrorMsg("Passwords are not the same");
			}
		} else {
			setErrorMsg("Please fill all the fields");
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
						<Text style={styles.titleSign}>Sign Up</Text>
					</View>
					<KeyboardAwareScrollView>
						<View style={styles.centerBloc}>
							<TextInput
								placeholder="Email"
								textContentType="emailAddress"
								value={email}
								onChangeText={(text) => {
									handleChange(setEmail, text);
								}}
								style={styles.input}
							/>

							<TextInput
								placeholder="Username"
								value={username}
								onChangeText={(text) => {
									handleChange(setUsername, text);
								}}
								style={styles.input}
							/>

							<TextInput
								placeholder="Text"
								multiline
								value={text}
								onChangeText={(text) => {
									handleChange(setText, text);
								}}
								style={styles.input}
							/>

							<TextInput
								placeholder="Password"
								secureTextEntry={true}
								value={password}
								onChangeText={(text) => {
									handleChange(setPassword, text);
								}}
								style={styles.input}
							/>

							<TextInput
								placeholder="Confirm password"
								secureTextEntry={true}
								value={confirmPassword}
								onChangeText={(text) => {
									handleChange(setConfirmPassword, text);
								}}
								style={styles.input}
							/>
						</View>
					</KeyboardAwareScrollView>
					<KeyboardAwareScrollView>
						<View style={styles.centerBloc}>
							<TouchableOpacity
								title="Sign up"
								onPress={handleSubmit}
								style={styles.validationButton}
							>
								<Text style={styles.textValidationButton}>Sign Up</Text>
							</TouchableOpacity>
							{errorMsg ? (
								<Text style={styles.errorMsg}>{errorMsg}</Text>
							) : (
								<></>
							)}
							<TouchableOpacity
								onPress={() => {
									navigation.navigate("SignIn");
								}}
								style={styles.secondButton}
							>
								<Text>Already Have an account : Sign In</Text>
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
