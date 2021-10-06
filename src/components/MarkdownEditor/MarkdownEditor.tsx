import React, { FC, FormEventHandler, ReactNode, useEffect, useRef, useState } from "react";
import styled from "./MarkdownEditor.module.scss";
import { processor } from "./marks";
interface Props {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * MarkdownEditor
 *
 * @param {Props} { }
 */

export const MarkdownEditor: FC<Props> = ({ defaultValue, onChange }) => {
  const refNode = useRef<HTMLDivElement>(null);
  const value = useRef<{
    active?: boolean;
    position: number;
    dragText: string;
    histories: [number, string][];
    historyIndex: number;
  }>({
    position: 0,
    dragText: "",
    histories: [],
    historyIndex: 0,
  }).current;
  const [caret, setCaret] = useState(true);
  const [text, setText] = useState(defaultValue || "");
  const [reactNode, setReactNode] = useState<ReactNode>(null);
  const pushText = (newText: string) => {
    value.histories.splice(value.historyIndex++);
    value.histories.push([value.position, text]);
    setText(newText);
  };
  const undoText = () => {
    if (value.historyIndex) {
      if (value.historyIndex >= value.histories.length)
        value.histories.push([value.position, text]);
      else value.histories[value.historyIndex] = [value.position, text];
      return value.histories[--value.historyIndex];
    }
    return undefined;
  };
  const redoText = () => {
    if (value.historyIndex < value.histories.length - 1)
      return value.histories[++value.historyIndex];
    return undefined;
  };
  const movePosition = (editor: HTMLElement, position: number) => {
    const selection = document.getSelection();
    if (!selection) return;
    const findNode = (node: Node, count: number): [Node | null, number] => {
      if (node.nodeType === Node.TEXT_NODE) {
        count -= node.textContent!.length;
      } else if (node.nodeName === "BR") {
        count -= 1;
      }
      if (count <= 0) {
        return [node, (node.nodeType === Node.TEXT_NODE ? node.textContent!.length : 0) + count];
      }
      for (let i = 0; i < node.childNodes.length; i++) {
        const [n, o] = findNode(node.childNodes[i], count);
        if (n) return [n, o];
        count = o;
      }
      return [null, count];
    };
    const [targetNode, offset] = findNode(editor, position);
    const range = document.createRange();
    try {
      if (targetNode) {
        range.setStart(targetNode, offset);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        range.setStart(refNode.current!, 0);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const getPosition = () => {
    const selection = document.getSelection();
    if (!selection) return [0, 0];
    const getPos = (end = true) => {
      const [targetNode, targetOffset] = end
        ? [selection.anchorNode, selection.anchorOffset]
        : [selection.focusNode, selection.focusOffset];
      const findNode = (node: Node) => {
        if (node === targetNode && (node !== refNode.current || !targetOffset)) {
          return [true, targetOffset] as const;
        }
        let count = 0;
        for (let i = 0; i < node.childNodes.length; i++) {
          const [flag, length] = findNode(node.childNodes[i]);
          count += length;
          if (flag) return [true, count] as const;
        }
        count +=
          node.nodeType === Node.TEXT_NODE
            ? node.textContent!.length
            : node.nodeName === "BR" || node.nodeName === "DIV" || node.nodeName === "P"
            ? 1
            : 0;
        return [false, count] as const;
      };
      const p = findNode(refNode.current!);
      return p[0] ? p[1] : p[1] - 1;
    };
    const p = getPos(true);
    if (!selection.rangeCount) {
      return [p, p] as const;
    }
    const p2 = getPos(false);
    return [Math.min(p, p2), Math.max(p, p2)] as const;
  };
  const insertText = (text: string) => {
    const pos = getPosition();
    const currentText = refNode.current!.innerText;
    pushText(currentText.slice(0, pos[0]) + text + currentText.slice(pos[1], currentText.length));
    value.position = pos[0] + text.length;
  };
  const deleteInsertText = (text: string, start: number, end: number) => {
    const pos = getPosition();
    const currentText = refNode.current!.innerText;
    if (pos[0] < start) {
      const currentText2 = currentText.slice(0, start) + currentText.slice(end, currentText.length);
      pushText(
        currentText2.slice(0, pos[0]) + text + currentText2.slice(pos[1], currentText2.length)
      );
      value.position = pos[0] + text.length;
    } else {
      const currentText2 =
        currentText.slice(0, pos[0]) + text + currentText.slice(pos[1], currentText.length);
      pushText(currentText2.slice(0, start) + currentText2.slice(end, currentText2.length));
      value.position = pos[0] + text.length + start - end;
    }
  };
  const deleteText = (start: number, end: number) => {
    const currentText = refNode.current!.innerText;
    const text = currentText.slice(0, start) + currentText.slice(end, currentText.length);
    pushText(text);
  };
  useEffect(() => {
    processor
      .process(text || "")
      .then(
        (file) => {
          setReactNode(file.result as ReactNode);
        },
        (error) => {
          throw error;
        }
      )
      .catch((e) => {
        console.error(e);
      });
    setCaret(false);
  }, [text]);
  useEffect(() => {
    movePosition(refNode.current!, value.position);
    setCaret(true);
  }, [reactNode]);

  const handleInput: FormEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    const currentText = e.currentTarget.innerText;
    if (!value.active) {
      pushText(currentText);
      value.position = getPosition()[0];
      onChange?.(currentText);
    }
  };
  //const html = ReactDOMServer.renderToString(reactNode as ReactElement);
  return (
    <>
      <div
        style={{ caretColor: caret ? "auto" : "transparent" }}
        className={styled.root}
        key={reactNode ? 0 : 1}
        ref={refNode}
        contentEditable
        spellCheck={false}
        onInput={handleInput}
        onPaste={(e) => {
          const t = e.clipboardData.getData("text/plain").replaceAll("\r\n", "\n");
          insertText(t);
          e.preventDefault();
        }}
        onDragEnter={(e) => {
          value.dragText = e.dataTransfer.getData("text/plain");
        }}
        onDrop={(e) => {
          if (document.caretRangeFromPoint) {
            const p = getPosition();
            var sel = getSelection()!;
            const x = e.clientX;
            const y = e.clientY;
            const pos = document.caretRangeFromPoint(x, y)!;
            sel.removeAllRanges();
            sel.addRange(pos);
            const t = e.dataTransfer.getData("text/plain").replaceAll("\r\n", "\n");
            deleteInsertText(t, p[0], p[1]);
          } else {
            const p = getPosition();
            const range = document.createRange();
            range.setStart((e.nativeEvent as any).rangeParent, (e.nativeEvent as any).rangeOffset);
            var sel = getSelection()!;
            sel.removeAllRanges();
            sel.addRange(range);
            const t = e.dataTransfer.getData("text/plain").replaceAll("\r\n", "\n");
            deleteInsertText(t, p[0], p[1]);
          }
          e.preventDefault();
        }}
        onKeyPress={(e) => {
          insertText(e.key);
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          switch (e.key) {
            case "Tab": {
              insertText("\t");
              e.preventDefault();
              break;
            }
            case "Enter":
              const p = getPosition();
              if (p[0] === refNode.current!.innerText.length) {
                insertText("\n\n");
                value.position--;
              } else insertText("\n");
              e.preventDefault();
              break;
            case "Backspace":
              {
                const p = getPosition();
                const start = Math.max(p[0] - 1, 0);
                const end = Math.min(p[1], refNode.current!.innerText.length);
                deleteText(start, end);
                value.position = start;
                e.preventDefault();
              }
              break;
            case "Delete":
              {
                const p = getPosition();
                deleteText(p[0], p[1] + 1);
                value.position = p[0];
                e.preventDefault();
              }
              break;
            case "z":
              if (e.ctrlKey && !e.shiftKey) {
                const p = undoText();
                if (p) {
                  value.position = p[0];
                  setText(p[1]);
                }
              }
              break;
            case "y":
              if (e.ctrlKey && !e.shiftKey) {
                const p = redoText();
                if (p) {
                  value.position = p[0];
                  setText(p[1]);
                }
              }
              break;
          }
        }}
        onCompositionStart={() => {
          value.active = true;
        }}
        onCompositionEnd={() => {
          value.active = false;
        }}
        suppressContentEditableWarning={true}
        // dangerouslySetInnerHTML={{
        //   __html: html === "\n" ? "" : html,
        // }}
      >
        {reactNode}
      </div>
    </>
  );
};
