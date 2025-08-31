// Simple analytics service to track counter events and clicks

export const analytics = {
  trackEvent: (
    eventName: string,
    data?: Record<string, any>
  ) => {
    console.log(`Event Tracked: ${eventName}`, data || {});
  },
};
