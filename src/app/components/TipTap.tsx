import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  FaBold,
  FaHeading,
  FaItalic,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo,
} from "react-icons/fa";
import { Collab, createDecorations, randCol } from "../ext/collab";
import { Step } from "@tiptap/pm/transform";
import { LiveText } from "../lib/LiveText";
// import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";
import { Node } from "@tiptap/core";
import {
  useBroadcastEvent,
  useEventListener,
  useOthers,
  useUpdateMyPresence,
} from "../liveblocks.config";
import { RemoteNode } from "../lib/types";
import { useEffect, useState } from "react";

export const Document = Node.create({
  name: "doc",
  topNode: true,
  content: "inline+",
});

// const MenuBar = ({ editor }) => {
//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className="menuBar">
//       <div>
//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={editor.isActive("bold") ? "is_active" : ""}
//         >
//           <FaBold />
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={editor.isActive("italic") ? "is_active" : ""}
//         >
//           <FaItalic />
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           className={editor.isActive("underline") ? "is_active" : ""}
//         >
//           <FaUnderline />
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className={editor.isActive("strike") ? "is_active" : ""}
//         >
//           <FaStrikethrough />
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 2 }).run()
//           }
//           className={
//             editor.isActive("heading", { level: 2 }) ? "is_active" : ""
//           }
//         >
//           <FaHeading />
//         </button>
//         <button
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 3 }).run()
//           }
//           className={
//             editor.isActive("heading", { level: 3 }) ? "is_active" : ""
//           }
//         >
//           <FaHeading className="heading3" />
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={editor.isActive("bulletList") ? "is_active" : ""}
//         >
//           <FaListUl />
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={editor.isActive("orderedList") ? "is_active" : ""}
//         >
//           <FaListOl />
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           className={editor.isActive("blockquote") ? "is_active" : ""}
//         >
//           <FaQuoteLeft />
//         </button>
//       </div>
//       <div>
//         <button onClick={() => editor.chain().focus().undo().run()}>
//           <FaUndo />
//         </button>
//         <button onClick={() => editor.chain().focus().redo().run()}>
//           <FaRedo />
//         </button>
//       </div>
//     </div>
//   );
// };

function getExtensionOptions(editor: Editor, name: string) {
  const extension = editor.extensionManager.extensions.find(
    (extension) => extension.name === name
  );

  if (!extension) throw new Error("extension not found");

  return extension.options;
}

// localStorage.clear();
// localStorage.removeItem("myDoc");

export const myLivetext = new LiveText();

window.myLivetext = myLivetext;
const localDoc = localStorage.getItem("myDoc");
if (localDoc) {
  console.log(JSON.parse(localDoc).deletes);
  myLivetext.applyDoc(JSON.parse(localDoc));
  console.log(myLivetext.deletedItems);
  console.log(myLivetext.getDeleteStateVector());
}

export const Tiptap = ({ setDescription }) => {
  const broadcast = useBroadcastEvent();
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();
  // const [] = useState()

  useEffect(() => {
    //@ts-ignore

    console.log(`broadasting`);
    // console.log(myLivetext.getStateVector());
    broadcast(
      {
        type: "vectorState",
        vectors: [
          myLivetext.getStateVector(),
          myLivetext.getDeleteStateVector(),
        ],
      },
      { shouldQueueEventIfNotReady: true }
    );
  }, [broadcast]);

  useEffect(() => {
    console.log(`hey man presence man!`);

    let presences = [];
    others.map((other) => {
      if (other.presence) {
        presences.push(other.presence);
      }
    });

    if (editor) {
      console.log(`updating prens`);
      const ext = getExtensionOptions(editor, "mycollabor");
      ext.updateCursor(editor, presences);
    }

    // editor?.
  }, [others]);

  const editor = useEditor({
    extensions: [
      Document,
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.setHardBreak(),
          };
        },
      }),
      Text,
      Collab,
    ],
    content: myLivetext.toProsemirrorJson(),
    editable: false,

    onTransaction: ({ editor, transaction }) => {
      // console.log(editor.getJSON());

      // console.log(editor)

      if (!transaction.docChanged) {
        try {
          const node = myLivetext.findNodeAtPos(
            transaction.selection.ranges[0].$to.pos
          );
          updateMyPresence({ blockId: node.id });
          // console.log(transaction.curSelection);
          // console.log(transaction.selection);
        } catch (error) {}

        // editor?.commands.setTextSelection(parsedStep.to - 1);
      } else {
        console.log(`doc has changed man!`);
      }
    },
    // onTransaction: ({ editor }) => {
    //   console.log(`transaction`);
    //   const cursorLine = editor.view.state.selection.$anchor.path[1];
    //   const cursorIndex = editor.view.state.selection.$anchor.pos;

    //   console.log(editor)
    //   // console.log("cursorLine:", cursorLine, " index", cursorIndex);
    // },

    onUpdate: ({ editor, transaction }) => {
      // console.log(transaction);
      // console.log(`update`);

      if (!transaction.docChanged) return;
      // console.log(transaction.step.po)
      // editor.lin

      // const step = transaction.steps[0];
      // console.log(transaction.steps[0]);

      // console.log(step);

      //* beginning step is to transform the event so that it makes some sense for the local liveText instance

      const broadcastInsert = (index: number, value: string) => {
        const block = myLivetext.insert(index, value);

        const sendBlock: RemoteNode = {
          id: block.id,
          originLeft: block.originLeft,
          originRight: block.originRight,
          value: block.value,
        };
        broadcast({ type: "insert", val: sendBlock } as never);
        updateMyPresence({ blockId: block.id });

        localStorage.setItem(
          "myDoc",
          JSON.stringify(myLivetext.getEncodedDoc())
        );
        // console.log(myLivetext.getStateVector());
      };

      const broadcastDelete = (index: number) => {
        const block = myLivetext.delete(index);
        if (block) {
          broadcast({
            type: "delete",
            val: { [block.id[0]]: [block] },
          } as never);
          localStorage.setItem(
            "myDoc",
            JSON.stringify(myLivetext.getEncodedDoc())
          );
        }
        // console.log(myLivetext.getDeleteStateVector());
      };

      transaction.steps.map((step) => {
        let action: string;
        let index: number;

        const parsedStep = step.toJSON();

        // console.log(parsedStep);

        if (parsedStep.stepType !== "replace")
          console.error(`unsupported step type ${parsedStep.stepType}`);

        if (parsedStep.to === parsedStep.from) {
          index = parsedStep.from;

          parsedStep.slice.content.map((content: any) => {
            if (content.type === "text") {
              for (let i = 0; i < content.text.length; i++) {
                broadcastInsert(index, content.text[i]);
                index++;
              }
            } else if (content.type === "hardBreak") {
              broadcastInsert(index, "\n");
              index++;
            } else {
              console.warn(`unsupported content type `, parsedStep);
            }
          });
        } else {
          //edge case or maybe special case, dunno
          // if (parsedStep.from === 0 && parsedStep.to > myLivetext.__length) {
          //   console.log(`isssuing full delete?`);
          //   for (let i = myLivetext.__length - 1; i >= 0; i--) {
          //     myLivetext.delete(i);
          //   }
          //   return;
          // }

          // console.log(`before deletion`);
          // console.log(myLivetext.toString().length);

          const deleteIndex = parsedStep.to - 1;

          for (let i = deleteIndex; i >= parsedStep.from; i--) {
            if (i < 0) break;
            broadcastDelete(i);
          }

          // console.log(`after deletion`);
          // console.log(myLivetext.toString().length);

          index = parsedStep.from;
          parsedStep.slice?.content?.map((content: any) => {
            if (content.type === "text") {
              for (let i = 0; i < content.text.length; i++) {
                broadcastInsert(index, content.text[i]);
                index++;
              }
            } else if (content.type === "hardBreak") {
              broadcastInsert(index, "\n");
              index++;
            } else {
              console.warn(`unsupported content type `, parsedStep);
            }
          });
        }
        editor?.commands.setContent(myLivetext.toProsemirrorJson());
        if (parsedStep.slice?.content) {
          editor?.commands.setTextSelection(index);
        } else {
          if (parsedStep.from === parsedStep.to) {
            editor?.commands.setTextSelection(parsedStep.to);
          } else {
            if (parsedStep.to - parsedStep.from === 1) {
              editor?.commands.setTextSelection(parsedStep.to - 1);
            } else {
              editor?.commands.setTextSelection(parsedStep.from);
              //this is the case of multiple deletes with no insert
            }
          }
        }

        // if(parsedStep.from === parsedStep.to) {
        //        editor?.commands.setTextSelection(parsedStep.to + 1);
        // }else {
        //   editor?.commands.setTextSelection(parsedStep.to);
        // }

        // console.log(editor.getJSON());
        // console.log(myLivetext.toProsemirrorJson());

        // if (parsedStep.to === parsedStep.from) {
        //   console.log(parsedStep);
        //   index = parsedStep.from - 1;

        //   parsedStep.slice.content.map((content: any, i: number) => {
        //     if (content.type === "text") {
        //       for (let i = 0; i < content.text.length; i++) {
        //         myLivetext.insert(index, content.text[i]);
        //         index++;
        //       }

        //       // console.log(`inserted -> ${content.text}`);
        //     } else if (content.type === "paragraph") {
        //       if (!content.content) {
        //         if (index !== 0 || i !== 0) {
        //           console.log(`adding`);
        //           myLivetext.insert(index, "\n");
        //           index++;
        //         }
        //         // console.log(`line break`);
        //       } else {
        //         if (index !== 0 || i !== 0) {
        //           console.log(`adding`);
        //           myLivetext.insert(index, "\n");
        //           index++;
        //         }
        //         for (let i = 0; i < content.content[0].text.length; i++) {
        //           myLivetext.insert(index, content.content[0].text[i]);
        //           index++;
        //         }

        //         // console.log(
        //         //   `line break with content ${content.content[0].text}`
        //         // );
        //       }
        //     } else {
        //       console.warn(`unsupprted text type`);
        //       console.log(content);
        //     }
        //   });
        // } else {
        //   //delete index from to
        //   //Edge case, i dunno, when a user does ctrl+a or select all
        //   //and removes all of it, the replace step that is produced is kinda wrong, as the 'to' property exceeds the size of the doc itself
        //   //note that this does not happens, when a user replaces the content with a copied string
        //   if (parsedStep.from === 1 && parsedStep.to > myLivetext.__length) {
        //     console.log(`delete/remove all`);

        //     console.log(myLivetext.__length);
        //     for (let i = myLivetext.__length - 1; i >= 0; i--) {
        //       console.log(`deleting ${i} `);
        //       myLivetext.delete(i);
        //     }

        //     return;
        //   }

        //   //insert-to starting from index

        //   console.log(parsedStep);
        //   let deleted: number = parsedStep.to - parsedStep.from;
        //   let addCount: number = 0;

        //   const deleteIndex = parsedStep.to - 2;

        //   console.log(`deleting form ${deleteIndex} -> ${parsedStep.to - 2}`);
        //   for (let i = deleteIndex; i > parsedStep.from - 2; i--) {
        //     console.log(`deleting ${i}`);
        //     if (i < 0) break;
        //     myLivetext.delete(i);
        //   }

        //   console.log(`adding content to ${parsedStep.from - 1} ?`);

        //   parsedStep.slice?.content?.map((content: any, i: number) => {
        //     let index = parsedStep.from - 1 < 0 ? 0 : parsedStep.from - 1;
        //     if (content.type === "text") {
        //       for (let i = 0; i < content.text.length; i++) {
        //         myLivetext.insert(index, content.text[i]);
        //         index++;
        //       }

        //       // console.log(`inserted -> ${content.text}`);
        //     } else if (content.type === "paragraph") {
        //       console.log(parsedStep);
        //       if (!content.content) {
        //         if (index !== 0 && i !== 0) {
        //           myLivetext.insert(index, "\n");
        //           index++;
        //         }
        //         // console.log(`line break`);
        //       } else {
        //         if (index !== 0 && i !== 0) {
        //           myLivetext.insert(index, "\n");
        //           index++;
        //         }
        //         for (let i = 0; i < content.content[0].text.length; i++) {
        //           myLivetext.insert(index, content.content[0].text[i]);
        //           index++;
        //         }

        //         // console.log(
        //         //   `line break with content ${content.content[0].text}`
        //         // );
        //       }
        //     } else {
        //       console.warn(`unsupprted text type`);
        //       console.log(content);
        //     }
        //   });

        //   // console.log(`delete -> ${deleted}`);
        //   // console.log(`inserted -> ${addCount}`);
        // }
        // console.log(myLivetext.toString());

        // console.log(editor.getText());
        // console.log(myLivetext.toString().length);
        // console.log(editor.getText().length);
      });

      //* first step is to add the change locally to the liveText instance
      //* then have the liveText to create a json for our tiptap editor

      // console.log(step.slice.content.content[0].content.size);

      // console.log(step.slice.content.content[0].type.name);

      // console.log(step.slice.content.content[0].text);

      // console.log(transaction.steps.map((step) => console.log(step)));

      // myLivetext.insert(0, "a");
      // myLivetext.insert(1, "c");
      // myLivetext.insert(1, "b");
      // myLivetext.insert(1, "b");
      // myLivetext.delete(1);
      // myLivetext.insert(3, "d");
      //bulk
      // console.log(myLivetext.toString());

      // console.log(editor.getJSON());
      // console.log(editor.getText());
      // console.log(editor.state)
      // console.log(editor.view.state);
      // console.log(editor.doc);
      // editor.commands.setContent({
      //   type: "doc",
      //   content: [
      //     {
      //       type: "paragraph",
      //       content: [
      //         {
      //           type: "text",
      //           text: "It’s 19871. You can’t turn on a radio, or go to a mall without hearing Olivia Newton-John’s hit song, Physical.",
      //         },
      //       ],
      //     },
      //   ],
      // });

      // editor.doc.content = { content: [{ type: "paragraph", content: "bob" }] };
      const html = editor.getHTML();
      setDescription(html);
    },

    onCreate: ({ editor }) => {
      editor.setEditable(true);
      const ext = getExtensionOptions(editor, "mycollabor");
      // console.log(ext);
      setInterval(() => {
        // console.log(ext);
        // ext.updateCursor(editor);
      }, 1000);
      // setInterval(() => createDecorations(editor, randCol()), 1000);
    },
  });

  useEventListener(({ connectionId, event }) => {
    console.log(`event recieved`);
    console.log(connectionId, event);

    // const ext = getExtensionOptions(editor, "mycollabor");
    // console.log(ext);
    // console.log(editor);

    // ext.remoteUpdate(event, editor);

    if (event.type === "vectorState") {
      // console.log(`someone sent vectorState -> `, event.vectors);
      const { sendableUpdates, shouldBroadcastVector } =
        myLivetext.sendableUpdates(event.vectors[0] || {});

      // console.log(`state vectors`);
      // console.log(event.vectors[0]);
      // console.log(myLivetext.getStateVector());

      const { sendableDeletes, shouldBroadcastDeleteVector } =
        myLivetext.sendableDeletes(event.vectors[1] || {});
      if (sendableUpdates.length >= 1)
        broadcast({ type: "updates", updates: sendableUpdates });

      // console.log(`these are their deletes`, sendableDeletes);
      if (Object.keys(sendableDeletes).length >= 1)
        broadcast({ type: "deletes", deletes: sendableDeletes });

      if (shouldBroadcastVector || shouldBroadcastDeleteVector)
        broadcast({
          type: "vectorState",
          vectors: [
            myLivetext.getStateVector(),
            myLivetext.getDeleteStateVector(),
          ],
        });

      return;
    }

    if (event.type === "updates") {
      // console.log(`someone sent updates`);
      myLivetext.merge(event.updates);
      editor?.commands.setContent(myLivetext.toProsemirrorJson());
      // console.log(myLivetext.getStateVector());
      // console.log(event.updates);
      localStorage.setItem("myDoc", JSON.stringify(myLivetext.getEncodedDoc()));
      return;
    }

    if (event.type === "deletes") {
      // console.log(`someone sent deletes`);
      myLivetext.syncDeletes(event.deletes);
      editor?.commands.setContent(myLivetext.toProsemirrorJson());
      // console.log(myLivetext.getStateVector());
      // console.log(event.deletes);
      localStorage.setItem("myDoc", JSON.stringify(myLivetext.getEncodedDoc()));
      return;
    }

    if (event.type === "delete") {
      myLivetext.syncDeletes(event.val);
      editor?.commands.setContent(myLivetext.toProsemirrorJson());
      localStorage.setItem("myDoc", JSON.stringify(myLivetext.getEncodedDoc()));
      return;
    }

    const pendingUpdates = myLivetext.merge([event.val] as any);

    if (pendingUpdates) {
      broadcast({
        type: "vectorState",
        vectors: [
          myLivetext.getStateVector(),
          myLivetext.getDeleteStateVector(),
        ],
      });

      // console.log(`braodcastin`);
    }

    // console.log(myLivetext.toString());
    editor?.commands.setContent(myLivetext.toProsemirrorJson());
    localStorage.setItem("myDoc", JSON.stringify(myLivetext.getEncodedDoc()));
  });
  return (
    <div className="textEditor">
      {/* <MenuBar editor={editor} /> */}
      <EditorContent editor={editor} />
    </div>
  );
};
