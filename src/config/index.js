export const config = {
  iceServers: [
    {
      url: "stun:global.stun.twilio.com:3478?transport=udp",
      urls: "stun:global.stun.twilio.com:3478?transport=udp",
    },
    {
      url: "turn:global.turn.twilio.com:3478?transport=udp",
      username:
        "bf5911f121110cf5e6d0096769206b118f8249af0ffad2e1f753232f9d40b73b",
      urls: "turn:global.turn.twilio.com:3478?transport=udp",
      credential: "6CWrnOKYbwIJKgefUN9BuBvY6EyZrjKnNn9T32kplZE=",
    },
    {
      url: "turn:global.turn.twilio.com:3478?transport=tcp",
      username:
        "bf5911f121110cf5e6d0096769206b118f8249af0ffad2e1f753232f9d40b73b",
      urls: "turn:global.turn.twilio.com:3478?transport=tcp",
      credential: "6CWrnOKYbwIJKgefUN9BuBvY6EyZrjKnNn9T32kplZE=",
    },
    {
      url: "turn:global.turn.twilio.com:443?transport=tcp",
      username:
        "bf5911f121110cf5e6d0096769206b118f8249af0ffad2e1f753232f9d40b73b",
      urls: "turn:global.turn.twilio.com:443?transport=tcp",
      credential: "6CWrnOKYbwIJKgefUN9BuBvY6EyZrjKnNn9T32kplZE=",
    },
  ],
};

export const baseUrl = "http://34.200.246.160:3001/";
