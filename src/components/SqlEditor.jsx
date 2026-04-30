import { useEffect, useRef } from 'react'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sql, SQLite } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { autocompletion } from '@codemirror/autocomplete'
import { searchKeymap } from '@codemirror/search'

export default function SqlEditor({ value, onChange, onRun }) {
  const editorRef = useRef(null)
  const viewRef = useRef(null)
  const onRunRef = useRef(onRun)

  useEffect(() => {
    onRunRef.current = onRun
  }, [onRun])

  useEffect(() => {
    if (!editorRef.current) return

    const runKeymap = keymap.of([{
      key: 'Ctrl-Enter',
      run: () => { onRunRef.current(); return true },
    }, {
      key: 'Cmd-Enter',
      run: () => { onRunRef.current(); return true },
    }])

    const state = EditorState.create({
      doc: value || '',
      extensions: [
        sql({ dialect: SQLite }),
        oneDark,
        runKeymap,
        keymap.of([...defaultKeymap, indentWithTab, ...searchKeymap]),
        autocompletion(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': { height: '100%', fontSize: '14px' },
          '.cm-scroller': { fontFamily: "'JetBrains Mono', monospace" },
          '.cm-content': { padding: '12px 0' },
          '.cm-gutters': { borderRight: '1px solid rgba(99,120,255,0.1)' },
        }),
      ],
    })

    const view = new EditorView({ state, parent: editorRef.current })
    viewRef.current = view

    return () => view.destroy()
  }, []) // Only on mount

  // Update content when value changes externally (e.g., question change)
  useEffect(() => {
    if (viewRef.current) {
      const current = viewRef.current.state.doc.toString()
      if (current !== value) {
        viewRef.current.dispatch({
          changes: { from: 0, to: current.length, insert: value || '' }
        })
      }
    }
  }, [value])

  return <div ref={editorRef} style={{ height: '100%' }} />
}
