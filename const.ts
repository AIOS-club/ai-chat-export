export const contentUpdatePort = 8801;

export const isDev = process.env.ENV === "development";

export const outputDir = isDev ? "local" : "extension";
