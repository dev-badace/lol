import { EditorState } from "@tiptap/pm/state";
import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { receiveTransaction } from "@tiptap/pm/collab";
import { Editor } from "@tiptap/react";

interface User {
  color: string;
  name: string;
  position: any;
}

export const defaultCursorBuilder = (user: User) => {
  const cursor = document.createElement("span");
  cursor.classList.add("ProseMirror-yjs-cursor");
  cursor.setAttribute("style", `border-color: ${user.color}`);
  const userDiv = document.createElement("div");
  //   cursor.setAttribute("style", `position: absolute`);
  cursor.setAttribute("style", `display: inline-block; position: absolute`);
  userDiv.setAttribute("style", `background-color: ${user.color}`);
  userDiv.insertBefore(document.createTextNode(user.name), null);
  const nonbreakingSpace1 = document.createTextNode("\u2060");
  const nonbreakingSpace2 = document.createTextNode("\u2060");
  cursor.insertBefore(nonbreakingSpace1, null);
  cursor.insertBefore(userDiv, null);
  cursor.insertBefore(nonbreakingSpace2, null);
  return cursor;
};

export const myCursor = (user: User) => {
  var cursorclass = "cursor";
  var displayname = user.name;
  var displaycolor =
    'style="background-color:' +
    user.color +
    "; border-top-color:" +
    user.color +
    '"';

  const dom = document.createElement("div");
  if (true) {
    cursorclass += " inactive";
  }

  if (false) {
    cursorclass += " me";
  }
  if (false) {
    displayname = dec.clientID;
  }

  dom.innerHTML =
    '<span class="' +
    cursorclass +
    '" ' +
    displaycolor +
    ">" +
    displayname +
    "</span>";
  dom.style.display = "inline";
  dom.class = "tooltip";

  return dom;
};

export const createDecorations = (editor: Editor, color?: string) => {
  const state = editor.storage["mycollabor"];
  //   console.log(editor.view);

  editor.view.setProps({
    decorations() {
      return DecorationSet.create(editor.state.doc, [
        Decoration.widget(
          editor.view.state.selection.$anchor.pos,
          () =>
            myCursor({
              name: "bob",
              color: color ?? state.users.color,
              position: editor.view.state.selection.$anchor.pos,
            }),
          {
            // key: "99" || Math.random().toString(),
            side: 10,
          }
        ),
      ]);
    },
  });
};

export const randCol = () =>
  `rgb(${Math.floor(Math.random() * 254)},${Math.floor(
    Math.random() * 254
  )},${Math.floor(Math.random() * 254)})`;

export const Collab = Extension.create({
  name: "mycollabor",
  addOptions() {
    return {
      me: {
        displayname: "Kona",
      },

      updateCursor(editor: Editor) {
        const col = randCol();
        editor.extensionStorage.mycollabor.users.color = col;
        // console.log(`updating edutor ${col}`);
        createDecorations(editor);
      },

      remoteUpdate(updates: any, editor: Editor) {},
    };
  },

  addStorage() {
    return {
      users: {
        position: 0,
        color: "green",
      },
    };
  },

  //@ts-ignore
  onSelectionUpdate(bob) {
    // console.log(bob.editor);
    // console.log(this);
    // console.log(bob.editor);
    // console.log(bob.editor.view.setProps({}));
    // console.log(bob.editor.state);
    // console.log(bob.editor.storage);
  },
});
