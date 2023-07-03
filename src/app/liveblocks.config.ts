import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey:
    "pk_dev_g9RToUhHAMZhIwR5G9nANAv_f-gI5BoyTeXLQY4Gbgq72c4zJpAq1n7CRONBV7Gs",
});

type Presence = {
  cursor: { x: number; y: number } | null;
};

// ...

export const {
  RoomProvider,
  useOthers,
  useUpdateMyPresence, // 👈
  useBroadcastEvent,
  useEventListener,
} = createRoomContext<Presence>(client);
