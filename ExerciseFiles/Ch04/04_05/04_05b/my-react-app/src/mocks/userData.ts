import type { User } from "../types/user";

export const users: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    preferences: {
      theme: "light",
      initialCounterValue: 0,
      enableAnalytics: false,
      maxCounter: 10,
      minCounter: 0,
    },
    createdAt: new Date("2023-01-01T10:00:00Z"),
    lastActive: new Date("2023-06-01T12:00:00Z"),
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    preferences: {
      theme: "dark",
      initialCounterValue: 5,
      enableAnalytics: true,
      maxCounter: 100,
      minCounter: 1,
    },
    createdAt: new Date("2023-02-15T09:30:00Z"),
    lastActive: new Date("2023-06-02T08:45:00Z"),
  },
  {
    id: "3",
    name: "Carlos Rivera",
    email: "carlos.rivera@example.com",
    preferences: {
      theme: "light",
      initialCounterValue: 10,
      enableAnalytics: false,
      maxCounter: 50,
      minCounter: 5,
    },
    createdAt: new Date("2023-03-10T14:20:00Z"),
    lastActive: new Date("2023-06-03T16:10:00Z"),
  },
  {
    id: "4",
    name: "Diana Lee",
    email: "diana.lee@example.com",
    preferences: {
      theme: "dark",
      initialCounterValue: 2,
      enableAnalytics: true,
      maxCounter: undefined,
      minCounter: undefined,
    },
    createdAt: new Date("2023-04-05T11:15:00Z"),
    lastActive: undefined,
  },
  {
    id: "5",
    name: "Ethan Patel",
    email: "ethan.patel@example.com",
    preferences: {
      theme: "light",
      initialCounterValue: 7,
      enableAnalytics: false,
      maxCounter: 20,
      minCounter: 0,
    },
    createdAt: undefined,
    lastActive: new Date("2023-06-05T19:30:00Z"),
  },
];
