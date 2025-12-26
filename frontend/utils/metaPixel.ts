export const trackMetaEvent = (
  event: string,
  data: Record<string, any> = {}
) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", event, data);
  }
};
