/**
* 参加者のIDリストから、各々のトレイルヘッド結果を更新して集計シートに反映する。
*/
function updateBadges(){
 
  // 更新に失敗したら復元するため、前回の取得結果を退避しておく。
  let oldResult     = sheetResult.getDataRange().getValues(); 

  sheetResult.clear();

  // スプレッドシートから参加者リスト（４列目※重複対策済）を取得
  let lastRow      = sheetReply.getLastRow(); // 列の最終行だと誤作動する可能性があるためシートの最終行を使用
  let idList     = sheetReply.getRange(2,4,lastRow-1,1).getValues();

  // 参加者IDを使用してPhantomJSで呼び出せる形式のURLを作成
  let urlList = [];
  let j=1;
  for(let i=0; i<(isTest?1:idList.length); i++){
    if(idList[i] != ""){  
      let phantomPayload = 
        {url:contestURLBase + idList[i],
         renderType:'HTML',
         muteHttpExceptions: true,
         outputAsJson:true};
      phantomPayload = JSON.stringify(phantomPayload);
      phantomPayload = encodeURIComponent(phantomPayload);

      let userURL = phantomURL + phantomKey + '/?request=' + phantomPayload;  
      urlList.push(userURL);
      // ID一覧を結果に反映
      sheetResult.getRange(j++, 1).setValue(idList[i]);
    }
  }
  
  // URLリストをフェッチ
  try{
    let fetchResults = UrlFetchApp.fetchAll(urlList);
    Logger.log("フェッチリクエスト終了");

    // フェッチした結果を成形してシートに書き込む
    let allResult = []; 
    for(let i=0; i<fetchResults.length; i++){
      allResult.push(analyzeContent(JSON.parse(fetchResults[i].getContentText())["content"]["data"]));
    }
    sheetResult.getRange(1, 2, allResult.length, allResult[0].length).setValues(allResult);
    Logger.log("全員分の解析終了");

    // 最終取得日を記録
    lastDate = Utilities.formatDate(new Date(), "JST", dateFormats);
    sheetReply.getRange(2,5).setValue(lastDate);

  }catch(e){
    // フェッチに異常があった場合はここでキャッチして過去データの復元
    Logger.log(e);
    sheetResult.getRange(1, 1, oldResult.length, oldResult[0].length).setValues(oldResult);
    lastDate = Utilities.formatDate(sheetReply.getRange(2,5).getValue(), "JST", dateFormats);
  }
}

/**
* 参加者ごとにfetch結果から必要な値を取得する
*/
function analyzeContent(rawData) {
  let result = [];

  Logger.log("解析開始");
  if(isTest) Logger.log(rawData);
  
  try{
      result = regexApply(rawData, isTest);
  }catch(e){
    Logger.log(e);
    
    if(rawData.indexOf("非公開")>-1){
        //非公開の場合
        result=["非公開のユーザ" , "<td>?</td>", "<td>?</td>", "0", "0", "<td>自己紹介のページでプロファイル可視性を公開に変更してください</td>", "0", "0"];
    } else if(rawData.indexOf("Looks like this page doesn't exist.")>-1){
        //不明ユーザの場合
        result=["不明ユーザ" , "<td>?</td>", "<td>?</td>", "0", "0", "<td>存在しないIDが登録されたようです。発見次第管理者が修正します。</td>", "0", "0"];
    } else {
        // 成形処理失敗の場合
        result=["サイトの仕様が変更されました" , "<td>?</td>", "<td>?</td>", "0", "0", "<td>?</td>", "0", "0"];
    }
  }
  Logger.log("解析終了");
  return result;
}

/*
* <td></td>形式に変換
* @param text-align なし:デフォルト（左寄り） 0:中央寄り 1:右寄り
*/
function SET_TD_TAG(txt, align){
  let style = '';
    if(align == 0){
      style = ' style="text-align:center;"';
    }
    else if(align == 1){
      style = ' style="text-align:right;"';
    }
  return '<td' + style + '>' + txt + '</td>';
}

/**
* 姓名入れ替え
*/
function reverseName(txt){

  let splitName = txt.split(' ');
  let result = '';
  for(let i = splitName.length; i>0; i--){
    result += splitName[i-1] + ' ';
  }
  return result;
}

/**
* 会社名のクレンジング
*/
function cleansingCompName(txt){

  let ret = txt;
   ret = ret.replace('株式会社', '');
   ret = ret.replace('Inc.', '');
  return ret;
}

/**
* 簡易エンコード
*/
function myEncode(txt){

  let ret;
  ret = txt.replace(/\\u0026/g, '&');
  return ret;
}

/**
* img srcに\t\t\tみたいなものがはいっていることがあったので除外する
*/
function cleansingTab(txt){

  return txt.replace(/\\t/g, '');
}

/**
* 集計結果のソート
*/
function sortResult(){
  let lastRow = sheetResult.getLastRow();
  let lastCol = sheetResult.getLastColumn();
  // 第2キー ポイント数の降順でソート
  sheetResult.getRange(1, 1, lastRow, lastCol).sort({column: 6, ascending: false});
  // 第1キー バッチ数の降順でソート
  sheetResult.getRange(1, 1, lastRow, lastCol).sort({column: 5, ascending: false});
}