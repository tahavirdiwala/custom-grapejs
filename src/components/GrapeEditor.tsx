"use client";
import GjsEditor from "@grapesjs/react";
import type { Editor, EditorConfig } from "grapesjs";
import { useRef, useCallback, useMemo, useState } from "react";
import CustomButtonPlugin from "@/components/blocks/button.block";
import { PLACEHOLDER_ASSETS, STORAGE_KEY } from "@/lib/constant";

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
          },
        ],
      },
    }),
    []
  );

  const plugins = [
    {
      id: "gjs-blocks-basic",
      src: "https://unpkg.com/grapesjs-blocks-basic",
    },
  ];

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

  const onEditor = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;

      // Add custom components plugins
      [CustomButtonPlugin].forEach((plugin) => plugin(editor));

      // Memoized load data function
      const loadData = () => {
        try {
          const hasStoredData = localStorage.getItem(STORAGE_KEY);
          if (hasStoredData) {
            editor.load();
            console.log("Data loaded from localStorage");
          }
        } catch (error) {
          console.error("Failed to load data:", error);
          // You might want to show a user-friendly error message here
        }
      };

      // Memoized keyboard handler
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          e.stopPropagation();
          handleSave();
        }
      };

      // Single load initialization with proper timing
      const initializeEditor = () => {
        const loadTimeout = setTimeout(loadData, 100);

        // Setup editor load event
        editor.on("load", loadData);

        // Return cleanup for this specific initialization
        return () => {
          clearTimeout(loadTimeout);
          editor.off("load", loadData);
        };
      };

      // Initialize event listeners
      document.addEventListener("keydown", handleKeyDown);
      const cleanupInit = initializeEditor();

      // Enhanced cleanup function
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        cleanupInit();
        editorRef.current = null;
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
