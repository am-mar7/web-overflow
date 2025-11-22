"use client";
import "@mdxeditor/editor/style.css";
import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  BoldItalicUnderlineToggles,
  Separator,
  ListsToggle,
  InsertCodeBlock,
  InsertImage,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import "./dark-editor.css";
import { useTheme } from "next-themes";

export default function Editor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  const { resolvedTheme } = useTheme();
  const themeExtension = resolvedTheme === "dark" ? [basicDark] : [];
  return (
    <MDXEditor
      key={resolvedTheme}
      className="border-light-300 dark-editor border bg-light800_dark200 rounded-lg w-full h-full"
      {...props}
      plugins={[
        // Example Plugin Usage
        linkPlugin(),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "css",
            txt: "txt",
            sql: "sql",
            html: "html",
            sass: "sass",
            scss: "scss",
            bash: "bash",
            json: "json",
            js: "javascript",
            ts: "typescript",
            "": "unspecified",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: themeExtension,
        }),
        toolbarPlugin({
          toolbarContents: () => {
            return (
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <div className="flex flex-wrap">
                        <UndoRedo />
                        <Separator />
                        <BoldItalicUnderlineToggles />
                        <Separator />
                        <ListsToggle />
                        <Separator />
                        <CreateLink />
                        <Separator />
                        <InsertImage />
                        <Separator />
                        <InsertTable />
                        <InsertThematicBreak />
                        <Separator />
                        <InsertCodeBlock />
                      </div>
                    ),
                  },
                ]}
              />
            );
          },
        }),
      ]}
      ref={editorRef}
    />
  );
}
