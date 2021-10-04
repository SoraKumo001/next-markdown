import { unified, Processor, Compiler } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type unist from "unist";
import { Root, Content } from "mdast";
import React, { ReactElement, ReactNode } from "react";
export type VNode = { type: string; value?: unknown; start: number; end: number };

function stringify(this: Processor) {
  const expandNode = (node: Content & Partial<unist.Parent<Content>>, nodes: VNode[]) => {
    nodes.push({
      type: node.type,
      start: node.position!.start.offset!,
      end: node.position!.end!.offset!,
      value: node.type === "heading" ? node.depth : undefined,
    });
    node.children?.forEach((n) => expandNode(n, nodes));
  };
  const reactNode = (vnodes: VNode[], value: string): ReactNode => {
    let position = 0;
    let index = 0;
    const getNode = (limit: number): ReactNode => {
      const nodes = [];
      while (position < limit && index < vnodes.length) {
        const vnode = vnodes[index];
        const [start, end] = [vnode.start, vnode.end];
        if (start > limit) {
          nodes.push(value.substring(position, limit));
          position = limit;
          break;
        }
        if (position < start) {
          if (index < vnodes.length) {
            nodes.push(value.substring(position, start));
            position = start;
          } else {
            nodes.push(value.substring(position, end));
            position = end;
          }
        } else {
          const TagName = {
            heading: "h" + vnode.value,
            strong: "strong",
            emphasis: "em",
            inlineCode: "code",
            code: "code",
            list: "code",
            table: "code",
          }[vnode.type] as keyof JSX.IntrinsicElements;
          index++;
          if (TagName) {
            if (index < vnodes.length) {
              nodes.push(React.createElement(TagName, { key: index }, getNode(end)));
            } else {
              nodes.push(React.createElement(TagName, { key: index }, value.substring(start, end)));
              position = end;
            }
          }
        }
      }
      if (position < limit) {
        nodes.push(value.substring(position, limit));
        position = limit;
      }
      return nodes;
    };
    return getNode(value.length);
  };

  const Compiler: Compiler = (tree: unist.Node & Partial<unist.Parent<unist.Node>>, value) => {
    const nodes: VNode[] = [];
    expandNode(tree as Content, nodes);
    return reactNode(
      nodes.filter((node) => !["text", "paragraph"].includes(node.type)),
      String(value)
    );
  };
  this.Compiler = Compiler;
}

export const processor = unified().use(remarkParse).use(remarkGfm).use(stringify) as Processor<
  Root,
  Root,
  Root,
  ReactElement
>;
