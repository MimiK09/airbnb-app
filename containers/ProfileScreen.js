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
	ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import accountPict from "../assets/accountPict.jpeg";

export default function ProfileScreen({ userId, userToken, setUserToken }) {
	const { params } = useRoute();
	const styles = useStyle();
	const navigation = useNavigation();
	// console.log("userId>>", userId);
	// console.log("userToken>>", userToken);

	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [pict, setPict] = useState("");
	const [newemail, setNewEmail] = useState("");
	const [newname, setNewName] = useState("");
	const [newdescription, setNewDescription] = useState("");
	const [newpict, setNewPict] = useState("");
	const [isLoading, setIsLoading] = useState(true);

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
				setNewDescription(response.data.description);
				setNewName(response.data.username);
				setNewEmail(response.data.email);
				setNewPict(response.data.photo);
				setIsLoading(false);
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

			if (result.canceled === true) {
				alert("No pict have been selected");
			} else {
				setNewPict(result.assets[0].uri);
			}
		} else {
			alert(
				"permission refused, if you want to upload a pict from your galery, you must go to your settings to gie authorization"
			);
		}
	};

	const handleUpload = async () => {
		// si name OU description OU email change
		if (
			name !== newname ||
			description !== newdescription ||
			email !== newemail
		) {
			try {
				const response = await axios.put(
					"https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update",
					{ email: newemail, description: newdescription, username: newname },
					{
						headers: {
							Authorization: `Bearer ${userToken}`,
						},
					}
				);
			} catch (error) {
				console.log(error.data);
			}
		}

		// si image change
		if (pict !== newpict) {
			try {
				const formData = new FormData();
				formData.append("photo", {
					uri: newpict, // Le chemin de la photo à envoyer
					name: "user_photo.jpg", // Nom de fichier pour le serveur
					type: "image/jpeg", // Type de fichier (image/jpeg, image/png, etc.)
				});

				const response = await axios.put(
					"https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture",
					formData,
					{
						headers: {
							Authorization: `Bearer ${userToken}`,
						},
					}
				);
			} catch (error) {
				console.log("error.data", error);
			}
		}
	};

	return (
		<SafeAreaView style={styles.mainBloc}>
			{isLoading ? (
				<View>
					<ActivityIndicator />
				</View>
			) : (
				<View>
					<TextInput
						onChangeText={(event) => {
							setNewName(event);
						}}
						value={newname}
					></TextInput>
					<TextInput
						onChangeText={(event) => {
							setNewEmail(event);
						}}
						value={newemail}
					></TextInput>

					<TextInput
						onChangeText={(event) => {
							setNewDescription(event);
						}}
						value={newdescription}
					></TextInput>

					<Image
						source={newpict ? { uri: newpict } : accountPict} // Remplace "chemin/vers/icon.png" par le chemin de ton icône
						style={styles.profileImage}
					/>

					<TouchableOpacity onPress={getPermissionAndGetPicture}>
						<Text>Galerie</Text>
					</TouchableOpacity>

					<TouchableOpacity>
						<Text>Appareil photo</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={async () => {
							setUserToken(null);
							await AsyncStorage.removeItem("token");
						}}
					>
						<Text>Log Out</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleUpload}>
						<Text>Upload new info</Text>
					</TouchableOpacity>
				</View>
			)}
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
