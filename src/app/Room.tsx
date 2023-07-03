"use client";

import { Editor } from "./editor/Editor";

// import { ClientSideSuspense } from "@liveblocks/react";
// import { ReactNode } from "react";
// import {
//   RoomProvider,
//   useBroadcastEvent,
//   useEventListener,
// } from "./liveblocks.config";

// function App() {
//   const broadcast = useBroadcastEvent();
//   useEventListener(({ connectionId, event }) => {
//     console.log(connectionId, event);
//   });

//   return (
//     <div
//       style={{
//         height: "40px",
//         width: "40px",
//         alignSelf: "center",
//         justifySelf: "center",
//         cursor: "pointer",
//       }}
//       //@ts-ignore
//       onClick={() => broadcast({ type: "bob", data: "bob bob bob" })}
//     >
//       bob
//     </div>
//   );
// }

// export function Room({ children }: { children: ReactNode }) {
//   return (
//     // <RoomProvider id="my-room" initialPresence={{ cursor: null }}>
//       <ClientSideSuspense fallback={<div>Loading...</div>}>
//         {() => <App />}
//       </ClientSideSuspense>
//     // </RoomProvider>
//   );
// }

import { useState } from "react";
import "./App.css";
import Details from "./components/Details";
import { Tiptap } from "./components/TipTap";
import { RoomProvider } from "./liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";

export function App() {
  const [description, setDescription] = useState("");

  return (
    <RoomProvider id="my-room" initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {() => (
          <div className="App">
            <Tiptap setDescription={setDescription} />
            <Details description={description} />
          </div>
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export default App;
