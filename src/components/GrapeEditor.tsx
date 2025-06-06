"use client";
import GjsEditor from "@grapesjs/react";
import type { Editor, EditorConfig } from "grapesjs";
import { useRef, useCallback } from "react";

const gjsOptions: EditorConfig = {
  height: "100vh",
  storageManager: {
    type: "local",
    autosave: true,
    autoload: true,
    stepsBeforeSave: 1,
  },
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  projectData: {
    assets: [
      "https://via.placeholder.com/350x250/78c5d6/fff",
      "https://via.placeholder.com/350x250/459ba8/fff",
      "https://via.placeholder.com/350x250/79c267/fff",
      "https://via.placeholder.com/350x250/c5d647/fff",
      "https://via.placeholder.com/350x250/f28c33/fff",
    ],
    pages: [
      {
        name: "Home page",
        component: `<h1>GrapesJS React Custom UI</h1>`,
      },
    ],
  },
};

export default function GrapeEditorPage() {
  const editorRef = useRef<Editor | null>(null);

  const onEditor = useCallback((editor: Editor) => {
    console.log("Editor loaded");
    editorRef.current = editor;
  }, []);

  return (
    <GjsEditor
      className="gjs-custom-editor text-white bg-slate-900"
      grapesjs="https://unpkg.com/grapesjs"
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      options={gjsOptions}
      plugins={[
        {
          id: "gjs-blocks-basic",
          src: "https://unpkg.com/grapesjs-blocks-basic",
        },
      ]}
      onEditor={onEditor}
    />
  );
}
