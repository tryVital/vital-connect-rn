import { VitalCore } from "@tryvital/vital-core-react-native";
import { clearAll } from "./utils";
import { HealthProvider, VitalHealth } from "@tryvital/vital-health-react-native";
import { Platform } from "react-native";

export const reconcileSdkStatus = async () => {
    // This function reconciles the app session state with the Vital SDK user state.
    // 
    // Here we treat the Vital SDK user state as the canonical state. This makes sense
    // for Vital Connect.
    //
    // If you have your own app session state linked to your own user management system,
    // your state should be the canonical one. You then sign-in / sign-out the Vital SDK
    // in reaction to any state changes from your end, or any discrepencies.

    const status = await VitalCore.status();

    if (!status.includes("signedIn")) {
        await clearAll();
    }


    // Ensure that the Health SDK configuration is in sync with our expected values.
    if (Platform.OS === "ios") {
        configureSDK("apple_health_kit");
    }

    // Ensure that the Health SDK configuration is in sync with our expected values.
    if (Platform.OS === "android") {
        const [hasHealthConnect, hasSamsungHealth] = await Promise.all([
            VitalHealth.isAvailable("health_connect"),
            VitalHealth.isAvailable("samsung_health"),
        ]);
        if (hasHealthConnect) {
            configureSDK("health_connect");
        }
        if (hasSamsungHealth) {
            configureSDK("samsung_health");
        }
    }
};

export const configureSDK = async (provider: HealthProvider) => {
    await VitalHealth.configure({
        logsEnabled: true,
        numberOfDaysToBackFill: 30,
        connectionPolicy: 'explicit',
        androidConfig: { syncOnAppStart: true },
        iOSConfig: {
            dataPushMode: 'automatic',
            backgroundDeliveryEnabled: true,
        },
    }, provider);
}
