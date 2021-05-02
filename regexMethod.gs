/**
* 本家であるtrailblazerページの仕様が変わるとスクレイピングできなくなるため、最新化する作業に使うクラス
* 仕様変更の頻度が多いためそとだししてます。
*
*1.最新のページのリソースをコピーして、trailblazerSample.htmlに保存する。
*   (注意)Trailheadに未ログイン状態（シークレットウインドウ推奨）で開発者コンソール(F12)のElementsからコピーすること。
*       「右クリック→ページのソースを表示」だと遅延ローディング部分が反映されないためNG。
*
*       また、実際のGASスクリプト上ではPhantomJSを経由して取得しているので英語版のリソースが使用される
*       このため、コンソールの設定で「More tools→Sensors」をSan Francisco等に設定してからコピーすること。
*
*2.下記のメソッドをデバッグ実行してログを確認し、正規表現を最新化する。
*/

/**
 * デバッグ実行用のメソッド
 */
function パース処理の確認() {
  
  let isTest = true;
  let rawData = HtmlService.createHtmlOutputFromFile("test_trailblazerSample").getContent();
  Logger.log(rawData);

  Logger.log(regexApply(rawData, isTest));

  Logger.log("すべてOK");
}

/**
 * フェッチで取得したxmlを正規表現で解析して必要な値を取得するメソッド
 * @param rawData 解析対象のxml
 * @param isTest テスト実行フラグ（テスト時はログ多）
 * @return 解析結果のリスト
 */
function regexApply(rawData, isTest){
  let tmp_result = [];
  let myRegexp;
  let regexResult;

    // TODO パース用のメソッドもあるがうまくいかなかった。使えればもっと簡単に実装できるかも。
    //let xml = XmlService.parse(rawData);

    // =================================     名前と会社名          ==================================
    // trailblazer上の名前があるセクションはShadowDOMのため取得できない。やむなくページタイトルから取得
    // TODO Chromのヘッドレスブラウザなら取得できる？かも
    myRegexp = /<title>([\s\S]*?) - Trailblazer Profile<\/title>/;
    regexResult = myRegexp.exec(rawData);
    // 名前は海外表記のため姓名を反転する
    let myName = reverseName(regexResult[1]);
    tmp_result.push(myName);
    Logger.log("名前： " + myName);
    // 会社名の表示は廃止
    tmp_result.push("dummy");
  
    // =================================     Trailblazerランク（IMG）          ==================================
    myRegexp = /<img c-trailheadrank_trailheadrank="" alt="([\s\S]*?)" src="([\s\S]*?)" class="rank-image">/i;
    regexResult = myRegexp.exec(rawData);
    // 正規表現を /igにしてたらとれる画像ととれない画像があったためハンドリング。/iにしたら発生しなくなったけど未調査
    if(regexResult){
      let rankSrc = regexResult[2];
      let imgTagText = '<img height="25px" title="' + regexResult[1] + '" src="' + rankSrc + '" style="vertical-align:middle;" \/>';
      tmp_result.push(SET_TD_TAG(imgTagText, 0));
    }else{
      tmp_result.push(SET_TD_TAG("取得失敗。報告してください。", 0));
      Logger.log("画像取得エラー");
    }
    if(isTest) Logger.log("1.SFランクOK");

    // =================================     バッジ数          ==================================
    // 未調査："Badges"を除いてigにすると２人目以降の取得に失敗することがある。
    myRegexp = /<span class="tds-tally__count tds-tally__count_success">([\s\S]*?)<\/span><span class="tds-tally__label slds-text-color_weak slds-m-top_xx-small">Badges/i;
    regexResult = myRegexp.exec(rawData)[1];
    tmp_result.push(regexResult);
    if(isTest) Logger.log("2.バッチ数OK");
  
    // =================================     ポイント数         ==================================
    myRegexp = /Badges<\/span><\/span><\/c-lwc-tally><c-lwc-tally c-trailheadrank_trailheadrank=""><span class="tds-tally slds-grid slds-grid_vertical"><span class="tds-tally__count tds-tally__count_success">([\s\S]*?)<\/span><span class="tds-tally__label slds-text-color_weak slds-m-top_xx-small">Points/i;
    regexResult = myRegexp.exec(rawData)[1];
    tmp_result.push(regexResult);
    if(isTest) Logger.log("3.ポイント数OK");
  
    // =================================     最近取ったバッチ（リンク）         ==================================
    myRegexp = /<a c-lwctrailheadbadge_lwctrailheadbadge="" href="([\s\S]*?)" target="_blank" tabindex="-1" aria-hidden="true" rel="noopener">/;
    let badgeURL = myEncode(myRegexp.exec(rawData)[1]);
    myRegexp = /<img c-lwctrailheadbadge_lwctrailheadbadge="" alt="([\s\S]*?)" src="([\s\S]*?)" width="100">/i;
    let badgeName = myEncode(myRegexp.exec(rawData)[1]);
    let badgeImageSrc = myRegexp.exec(rawData)[2];
    let badgeImageTagText = '<img height="25px" src="' + cleansingTab(badgeImageSrc) + '" style="vertical-align:middle;" \/>';
    let badgeAnchor = "<a href='" + badgeURL + "' target='_brank'>" + badgeName + "</a>";
    
    // １セル内に表示するためテーブル化
    let miniTableText = '<table border="0px" style="margin:0px;">'
        + '<tr><td width="50px" align="center" style="border:0px;padding:0;background-color:transparent;">' + badgeImageTagText + '</td>'
        + '<td style="border:0px;padding:0;background-color:transparent;">' + badgeAnchor + '</td></tr></table>';
    tmp_result.push(SET_TD_TAG(miniTableText));
    if(isTest) Logger.log("4.最近取ったバッチOK");
  
    // =================================     認定資格の数         ==================================
    try{
      // 備忘：Certificationは２個以上だとCertificationsと表記される。
      myRegexp = /<h3 class="slds-text-title_caps">([\d]*?) Certification/i;
      regexResult = myRegexp.exec(rawData)[1];
      tmp_result.push(regexResult);
     }catch(e){
       // 正規表現に合致しなければ０個とみなす
       tmp_result.push(0);
     }
    if(isTest) Logger.log("5.資格の数OK");
  
    // =================================     スーパーバッジの数         ==================================
    try{
      // 備忘：Superbadgeは２個以上だとSuperbadgesと表記される。
      myRegexp = /<h3 class="slds-text-title_caps">([\d]*?) Superbadge/i;
      regexResult = myRegexp.exec(rawData)[1];
      tmp_result.push(regexResult);
     }catch(e){
       // 正規表現に合致しなければ０個とみなす
       tmp_result.push(0);
     }
      if(isTest) Logger.log("6.スーパーバッジの数OK");

      return tmp_result;

}
