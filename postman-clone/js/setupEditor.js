import { EditorState, basicSetup } from "@codemirror/basic-setup"
import { EditorView, keymap } from "@codemirror/view"
import { defaultTabBinding } from "@codemirror/commands"
import { json } from "@codemirror/lang-json"

export default function setupEditors() {
  const jsonRequestBody = document.querySelector("[data-request-tab-content='json']")
  const jsonResponseBody = document.querySelector("[data-response-tab-content='body']")

  const baseExtensios = [
    basicSetup,
    keymap.of([defaultTabBinding]),
    json(),
    EditorState.tabSize.of(2)
  ]

  const requestEditor = new EditorView({
    state: EditorState.create({
      doc: "{\n\t\n}",
      extensions: baseExtensios
    }),
    parent: jsonRequestBody
  })

  const responseEditor = new EditorView({
    state: EditorState.create({
      doc: "{}",
      extensions: [...baseExtensios, EditorView.editable.of(false)]
    }),
    parent: jsonResponseBody
  })

  function updateResponseEditor(value) {
    responseEditor.dispatch({
      changes: {
        from: 0,
        to: responseEditor.state.doc.length,
        insert: JSON.stringify(value, null, 2)
      }
    })
  }

  return { requestEditor, updateResponseEditor }
}