import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const CONFIG = {
  MONGODB_URI: publicRuntimeConfig.MONGODB_URI ,
  FETCH_URL:publicRuntimeConfig.FETCH_URL ,
  NEXTAUTH_SECRET: publicRuntimeConfig.NEXTAUTH_SECRET ,
  NODE_ENV:publicRuntimeConfig.NODE_ENV ,
  GOOGLE_ID: publicRuntimeConfig.GOOGLE_ID ,
  GOOGLE_SECRET:publicRuntimeConfig.GOOGLE_SECRET,
  GITHUB_ID:publicRuntimeConfig.GITHUB_ID ,
  GITHUB_SECRET:publicRuntimeConfig.GITHUB_SECRET ,
};
export {
  CONFIG
}