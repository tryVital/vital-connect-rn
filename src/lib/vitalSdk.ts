import { VitalCore } from "@tryvital/vital-core-react-native";
import { clearAll } from "./utils";

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
};
