import React from "react";
import { MarkdownEditor } from "../components/MarkdownEditor";

const value = `# タイトル

文章中に**強調**を入れる

- リスト
- リスト

## テーブル実験

| Parts         | Description                                |
| ------------- | ------------------------------------------ |
| Icon          | タイトルで使用するアイコン                 |
| TitleBar      | Windowのタイトルバーの部分                 |
| ResizeFrame   | サイズ変更用の不可視フレーム               |
| Client        | クライアント領域(オーバーラップ制御に必要) |
| VirtualWindow | 全てを統合した仮想Windowコンポーネント     |

# A*B*CD

ふぉっふぉっふぉ
`;

const Page = () => {
  return <MarkdownEditor defaultValue={value} />;
};
export default Page;
