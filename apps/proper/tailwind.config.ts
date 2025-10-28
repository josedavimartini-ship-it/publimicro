import sharedConfig from "@publimicro/ui/tailwind.config";

export default {
  ...sharedConfig,
  content: [
    "../../packages/ui/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
};
