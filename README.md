# trailblazer-ranking
Salesforceの公式学習サイトである Trailheadの進捗をランキング形式で公開するアプリです。  
GASを使用したWebスクレイピングという技術になります。  
集計元のTrailheadページがjavascriptで遅延ローディングで実装されているため  
PhantomJSを使用してフェッチを行っています。

フェッチのリクエストが有限のため更新方法はサイトのリクエスト毎ではなく定時更新です。  
参加人数20名程度であれば４時間毎に更新できます。

規模や頻度を拡大したい場合はPhantomJSを有料アカウントにしてください。

データベース：Google スプレッドシート  
参加者の募集：Google フォーム  
フェッチ：PhantomJSのフリーアカウント  
最終更新：2021/5/2  

実際に使用しているスプレッドシートのIDやPhantomJSのAPI Key等はignoreしています。

# 課題
３回に一度程度、更新が失敗する。
PhantomJのSリクエスト量が多すぎる模様。
{"name":"HttpStatusCodeException","message":"OUT OF CREDITS: Your account is out of both Daily Subscription Credits and Prepaid Credits. Either wai..

# 対応検討中
PhantomJSからChromeのヘッドレスブラウザへの変更
