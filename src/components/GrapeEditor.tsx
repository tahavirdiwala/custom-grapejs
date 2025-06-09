"use client";
import GjsEditor from "@grapesjs/react";
import type { Editor, EditorConfig } from "grapesjs";
import { useRef, useCallback } from "react";

const gjsOptions: EditorConfig = {
  height: "100vh",
  storageManager: {
    type: "local",
    autoload: true, // This will automatically load on editor init
    stepsBeforeSave: 1,
    // Optional: Custom storage key
    options: {
      local: {
        key: "grapesjs-project", // Custom key for localStorage
      },
    },
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
  const saveProjectRef = useRef<() => void>(() => {});

  const onEditor = useCallback((editor: Editor) => {
    // Manual save function
    const saveData = () => {
      editor.store();
      console.log("Data saved to localStorage");
    };

    saveProjectRef.current = saveData;

    // Alternative: Force load after a short delay to ensure editor is fully ready
    setTimeout(() => {
      editor.load();
      console.log("Data loaded from localStorage after mount");
    }, 100);
  }, []);

  return (
    <>
      <div className="flex justify-end bg-primary p-2">
        <button
          onClick={() => saveProjectRef.current()}
          className="px-4 py-2 bg-white cursor-pointer"
        >
          Save Page
        </button>
      </div>
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
    </>
  );
}
