import React, { useContext, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { signIn, loadingAuth } = useContext(AuthContext);

	async function handleLogin() {
		if (!email || !password) {
			return;
		}

		await signIn({ email, password });
	}

	return (
		<View style={styles.container}>
			<Image style={styles.logo} source={require("../../assets/logo.png")} />

			<View style={styles.inputContainer}>
				<TextInput
					placeholder="Digite seu e-mail"
					style={styles.input}
					placeholderTextColor="#f0f0f0"
					onChangeText={setEmail}
					value={email}
				/>
				<TextInput
					placeholder="Sua senha"
					style={styles.input}
					placeholderTextColor="#f0f0f0"
					secureTextEntry={true}
					onChangeText={setPassword}
					value={password}
				/>
				<TouchableOpacity style={styles.button} onPress={handleLogin}>
					{loadingAuth ? (
						<ActivityIndicator size={25} color="#fff" />
					) : (
						<Text style={styles.buttonText}>Acessar</Text>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#1d1d2e",
	},
	logo: {
		marginBottom: 18,
	},
	inputContainer: {
		width: "95%",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 34,
		paddingHorizontal: 14,
	},
	input: {
		width: "95%",
		height: 40,
		backgroundColor: "#101026",
		marginBottom: 12,
		borderRadius: 4,
		paddingHorizontal: 8,
		color: "#fff",
	},
	button: {
		width: "95%",
		height: 40,
		backgroundColor: "#3fffa3",
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "#101026",
		fontSize: 14,
		fontWeight: "bold",
	},
});
