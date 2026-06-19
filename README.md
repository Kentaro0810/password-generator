# password-generator
# パスワード自動生成ツール

GitHub Pagesで公開している、自分用のパスワード生成ツールです。

## 機能

- パスワードの文字数を変更
- 大文字、小文字、数字、記号を選択
- 紛らわしい文字を除外
- パスワード強度の目安を表示
- ワンクリックコピー

## 使用技術

- HTML
- CSS
- JavaScript
- GitHub Pages

## セキュリティ方針

このツールは、生成したパスワードを保存しません。
乱数生成には `crypto.getRandomValues()` を使用しています。
