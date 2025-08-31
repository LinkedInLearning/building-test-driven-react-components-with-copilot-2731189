// User type interface with preferences for the Counter app
export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: "light" | "dark";
    initialCounterValue: number;
    enableAnalytics: boolean;
    maxCounter?: number;
    minCounter?: number;
  };
  createdAt: undefined | Date;
  lastActive: undefined | Date;
}
