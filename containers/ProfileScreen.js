import { useRoute } from "@react-navigation/core";
import {
	Text,
	TextInput,
	View,
	TouchableOpacity,
	SafeAreaView,
	Image,
	useWindowDimensions,
	StyleSheet,
	ScrollView,
	Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import accountPict from "../assets/accountPict.jpeg";

export default function ProfileScreen({ userId, userToken }) {
	const { params } = useRoute();
	const styles = useStyle();
	const navigation = useNavigation();
	console.log("userId>>", userId);
	console.log("userToken>>", userToken);

	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [pict, setPict] = useState("");

	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const response = await axios.get(
					`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
					{
						headers: {
							Authorization: `Bearer ${userToken}`,
						},
					}
				);
				setDescription(response.data.description);
				setName(response.data.username);
				setEmail(response.data.email);
				setPict(response.data.photo);
			} catch (error) {
				console.log("error", error.response);
			}
		};

		getUserInfo();
	}, []);

	const getPermissionAndGetPicture = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status === "granted") {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [1, 1],
			});
			console.log("result image", result);

			if (result.canceled === true) {
				alert("No pict have been selected");
			} else {
				setPict(result.assets[0].uri);
			}
		} else {
			alert(
				"permission refused, if you want to upload a pict from your galery, you must go to your settings to gie authorization"
			);
		}
	};

	return (
		<SafeAreaView style={styles.mainBloc}>
			<Text>ProfileScreen</Text>
			<TextInput
				onChangeText={(event) => {
					setName(event);
				}}
				value={name}
			></TextInput>

			<TextInput
				onChangeText={(event) => {
					setEmail(event);
				}}
				value={email}
			></TextInput>

			<TextInput
				onChangeText={(event) => {
					setDescription(event);
				}}
				value={description}
			></TextInput>

			<Image
				source={pict ? { uri: pict } : accountPict} // Remplace "chemin/vers/icon.png" par le chemin de ton icône
				style={styles.profileImage}
			/>

			<TouchableOpacity onPress={getPermissionAndGetPicture}>
				<Text>Galerie</Text>
			</TouchableOpacity>

			<TouchableOpacity>
				<Text>Appareil photo</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const useStyle = () => {
	const { width, height } = useWindowDimensions();

	const styles = StyleSheet.create({
		mainBloc: {
			alignItems: "center",
		},
		profileImage: {
			width: 300,
			height: 300,
		},
	});

	return styles;
};
