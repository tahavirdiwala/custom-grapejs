"use client";
import GjsEditor from "@grapesjs/react";
import type { Editor, EditorConfig } from "grapesjs";
import { useRef, useCallback, useMemo, useState } from "react";
import CustomButtonPlugin from "@/components/blocks/button.block";

const STORAGE_KEY = "grapesjs-project";

const PLACEHOLDER_ASSETS = [
  "https://via.placeholder.com/350x250/78c5d6/fff",
  "https://via.placeholder.com/350x250/459ba8/fff",
  "https://via.placeholder.com/350x250/79c267/fff",
  "https://via.placeholder.com/350x250/c5d647/fff",
  "https://via.placeholder.com/350x250/f28c33/fff",
] as const;

export default function GrapeEditorPage() {
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  // Memoized configuration object
  const gjsOptions: EditorConfig = useMemo(
    () => ({
      height: "100vh",
      storageManager: {
        type: "local",
        autoload: true,
        autosave: false,
        stepsBeforeSave: 1,
        options: {
          local: {
            key: STORAGE_KEY,
          },
        },
      },
      undoManager: { trackSelection: false },
      selectorManager: { componentFirst: true },
      projectData: {
        assets: PLACEHOLDER_ASSETS,
        pages: [
          {
            name: "Home page",
            component: `<h1>GrapesJS Next Custom UI</h1>`,
          },
        ],
      },
    }),
    []
  );

  // Memoized plugins array
  const plugins = useMemo(
    () => [
      {
        id: "gjs-blocks-basic",
        src: "https://unpkg.com/grapesjs-blocks-basic",
      },
    ],
    []
  );

  // Optimized save function with loading state and error handling
  const handleSave = useCallback(async () => {
    if (!editorRef.current || isSaving) return;

    try {
      setIsSaving(true);
      editorRef.current.store();
      console.log("Data saved to localStorage");
    } catch (error) {
      console.error("Failed to save data:", error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving]);

  // Optimized editor initialization
  const onEditor = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;

      // Add custom components plugins
      [CustomButtonPlugin].forEach((plugin) => plugin(editor));

      // Load existing data with proper timing
      const loadData = () => {
        try {
          const hasStoredData = localStorage.getItem(STORAGE_KEY);
          if (hasStoredData) {
            editor.load();
            console.log("Data loaded from localStorage on refresh");
          } else {
            console.log("No stored data found");
          }
        } catch (error) {
          console.error("Failed to load data:", error);
        }
      };

      // Wait for editor to be fully ready before loading
      editor.on("load", () => {
        console.log("Editor load event triggered");
        setTimeout(() => {
          loadData();
        }, 100);
      });

      // Also load after a slight delay to ensure editor is fully initialized
      setTimeout(() => {
        loadData();
      }, 100);

      // Keyboard shortcut for save (Ctrl+S)
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          e.stopPropagation();
          handleSave();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      // Cleanup function
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    [handleSave]
  );

  return (
    <>
      <div className="flex justify-end items-center bg-primary p-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 text-black rounded transition-colors ${
            isSaving
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-white hover:bg-gray-100 cursor-pointer"
          }`}
          aria-label={isSaving ? "Saving..." : "Save Page"}
        >
          {isSaving ? "Saving..." : "Save Page"}
        </button>
      </div>

      <GjsEditor
        className="gjs-custom-editor text-white bg-slate-900"
        grapesjs="https://unpkg.com/grapesjs"
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        options={gjsOptions}
        plugins={plugins}
        onEditor={onEditor}
      />
    </>
  );
}
