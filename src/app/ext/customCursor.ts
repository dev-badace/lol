// // this example loads the EditorState class from the ProseMirror state package
// import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
// import { Decoration, DecorationSet, EditorView } from "@tiptap/pm/view";

// interface User {
//   color: string;
//   name: string;
//   position: any;
// }

// interface State {
//   users: User[];
// }

// const cursorPluginKey = new PluginKey("cursor");

// export const defaultCursorBuilder = (user: User) => {
//   const cursor = document.createElement("span");
//   cursor.classList.add("ProseMirror-yjs-cursor");
//   cursor.setAttribute("style", `border-color: ${user.color}`);
//   const userDiv = document.createElement("div");
//   userDiv.setAttribute("style", `background-color: ${user.color}`);
//   userDiv.insertBefore(document.createTextNode(user.name), null);
//   const nonbreakingSpace1 = document.createTextNode("\u2060");
//   const nonbreakingSpace2 = document.createTextNode("\u2060");
//   cursor.insertBefore(nonbreakingSpace1, null);
//   cursor.insertBefore(userDiv, null);
//   cursor.insertBefore(nonbreakingSpace2, null);
//   return cursor;
// };

// export const defaultSelectionBuilder = (user: User) => {
//   return {
//     style: `background-color: ${user.color}70`,
//     class: "ProseMirror-yjs-selection",
//   };
// };

// export const createDecorations = (ediotrState: EditorState) => {
//   const state = cursorPluginKey.getState(ediotrState);
//   console.log(state);

//   return DecorationSet.create(ediotrState.doc, [
//     Decoration.widget(
//       0,
//       () =>
//         defaultCursorBuilder({ color: "green", name: "gonda", position: 0 }),
//       {
//         key: "99",
//         side: 10,
//       }
//     ),
//   ]);
// };

// export const CursorPlugin = () => {
//   return new Plugin<{ users: User[] }>({
//     key: cursorPluginKey,
//     state: {
//       //@ts-ignore
//       init(_config, state) {
//         return createDecorations(state);
//       },
//       //   apply(tr, prevState, _oldState, newState) {

//       //     return
//       //   },
//     },
//   });
// };
