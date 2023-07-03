// TypeScript users only add this code
import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

// Import React dependencies.
import React, { useState } from "react";
// Import the Slate editor factory.
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

export const Editor = () => {
  const [editor] = useState(() => withReact(createEditor()));
  // Render the Slate context.

  return (
    <Slate
      editor={editor}
      // onChange={(vals) => {
      //   console.log(vals);
      // }}
      initialValue={initialValue}
    >
      <Editable // Define a new handler which prints the key that was pressed.
        onKeyDown={(event) => {
          console.log(event);
        }}
      />
    </Slate>
  );
};
