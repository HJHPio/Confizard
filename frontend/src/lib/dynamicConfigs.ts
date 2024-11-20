import { isDefined } from "@vueuse/core";
import { useRoute } from "vue-router";

/**
 * Converts a defined object to a string or returns null.
 * @param tmpObj - The object to check and convert.
 * @returns The string representation of the object if defined, otherwise null.
 */
export function returnDefinedStrOrNull(tmpObj: any): string | null {
    return isDefined(tmpObj) ? tmpObj.toString() : null;
}

/**
 * Retrieves an environment variable by name dynamically.
 * @param envName - The name of the environment variable.
 * @returns The value of the environment variable as a string or null.
 */
export function getEnvStrByDynamicName(envName: string): string | null {
    return returnDefinedStrOrNull(import.meta.env[envName])
}

/**
 * Optimized retrieval of the VITE_EXTERNAL_CONFIG_URL_BASE environment variable.
 * Optimization: Using dot notation (.) instead of dynamic brackets ([]) for better performance.
 * @returns The value of VITE_EXTERNAL_CONFIG_URL_BASE as a string or null.
 */
export function getConfUrlFromEnvs(): string | null {
    return returnDefinedStrOrNull(import.meta.env.VITE_EXTERNAL_CONFIG_URL_BASE);
}

/**
 * Retrieves a query parameter by name dynamically from the route object.
 * @param route - The current Vue Router route object.
 * @param name - The name of the query parameter to retrieve.
 * @returns The value of the query parameter as a string or null.
 */
export function getQueryStrByDynamicName(
    route: ReturnType<typeof useRoute>, name: string): string | null {
    return returnDefinedStrOrNull(route.query[name]);
}

/**
 * Optimized retrieval of the `extConfUrl` query parameter from the route object.
 * Optimization: Using dot notation (.) instead of dynamic brackets ([]) for better performance.
 * @param route - The current Vue Router route object.
 * @returns The value of `extConfUrl` as a string or null.
 */
export function getExtConfUrlFromQuery(
    route: ReturnType<typeof useRoute>): string | null {
    return returnDefinedStrOrNull(route.query.extConfUrl);
}

/**
 * Determines the dynamic config base URL in the following order of precedence:
 * 1. URL query parameter (`extConfUrl`).
 * 2. Project environment variable (`VITE_EXTERNAL_CONFIG_URL_BASE`).
 * 3. Default (empty string).
 * @param route - The current Vue Router route object.
 * @returns The determined dynamic config base URL as a string.
 */
export function getDynamicConfigBaseUrl(route: ReturnType<typeof useRoute>): string {
    const extConfFromUrl = getExtConfUrlFromQuery(route);
    if(extConfFromUrl != null) return extConfFromUrl;

    const confFromEnvs = getConfUrlFromEnvs();
    if(confFromEnvs != null) return confFromEnvs;
    
    return "";
}