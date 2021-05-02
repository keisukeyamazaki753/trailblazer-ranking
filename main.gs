/**
* サイトが呼ばれたときに実行されるメソッド
*/
function doGet() {

  // スプレッドシートの値を変数へ保存
  allBadgeDisplay = sheetReply.getRange(2,6).getValue();
  lastDateDisplay = Utilities.formatDate(sheetReply.getRange(2,5).getValue(), "JST", dateFormats);

  return HtmlService.createTemplateFromFile("resultPage").evaluate().setTitle('Trailheadランキング');
}

/**
 * タイマーが実行するメソッド
 * 参加者全員のバッジ情報を更新する
 */
function doGetTimer() {

  updateBadges();

  sortResult();
}

/**
* 参加解除ボタン用のメソッド
* 引数に一致した参加者IDを削除する
*/
function unRegistUserID(ID){

  // IDリストの取得
  let sheetForm    = sheetApp.getSheetByName("フォームの回答 1"); // グローバル変数を使わないことで最新のシートを取得？できると思いたい。
  let lastRow      = sheetForm.getLastRow();
  let idList       = sheetForm.getRange(1,2,lastRow,2).getValues();
  
  // もし二重登録があってもすべて消せるように下から走査
  let idListSize   = idList.length-1;
  for(let i=idListSize;i>0;i--){
    if(idList[i][0] == ID){
      sheetForm.deleteRow(i+1);
    }
  }
  // リロードしても意味がないためコメントアウト（抹消はdoGetTimer起動時に反映される）
  // doGet();
}