package order_services;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class OrderServicesApplication {

	public static void main(String[] args) {
		loadDotEnv();
		SpringApplication.run(OrderServicesApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.web.reactive.function.client.WebClient.Builder webClientBuilder() {
		return org.springframework.web.reactive.function.client.WebClient.builder();
	}

	private static void loadDotEnv() {
		// Look in current working directory
		Path envPath = Paths.get(".env");
		
		// Fallback: Check if run from workspace root
		if (!Files.exists(envPath)) {
			envPath = Paths.get("backend/backend2/order-services/.env");
		}

		if (Files.exists(envPath)) {
			try {
				List<String> lines = Files.readAllLines(envPath);
				for (String line : lines) {
					line = line.trim();
					// Skip empty lines or comments
					if (line.isEmpty() || line.startsWith("#")) {
						continue;
					}
					
					int eqIdx = line.indexOf('=');
					if (eqIdx > 0) {
						String key = line.substring(0, eqIdx).trim();
						String value = line.substring(eqIdx + 1).trim();
						
						// Remove any surrounding quotes
						if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
							value = value.substring(1, value.length() - 1);
						} else if (value.startsWith("'") && value.endsWith("'") && value.length() >= 2) {
							value = value.substring(1, value.length() - 1);
						}
						
						System.setProperty(key, value);
					}
				}
				System.out.println("Successfully loaded local environment properties from: " + envPath.toAbsolutePath());
			} catch (IOException e) {
				System.err.println("Warning: Failed to read .env file: " + e.getMessage());
			}
		} else {
			System.out.println("Notice: No .env file found. Relying on system environment variables.");
		}
	}
}
