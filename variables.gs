// スプレッドシート (非公開)
// let sheetApp = SpreadsheetApp.openById("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
let sheetApp = SpreadsheetApp.openById(sheetAppID);
// フォームの回答シート
let sheetReply    = sheetApp.getSheetByName("フォームの回答 1");
// 集計結果シート
let sheetResult    = sheetApp.getSheetByName("DataBaseSheet");

// SFDC Trailhead の URL
let contestURLBase = "https://trailblazer.me/id/";

// PhantomJsのAPI Key
let phantomURL = 'https://phantomjscloud.com/api/browser/v2/';
// let phantomKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

// Github URL
let githubURL = 'https://github.com/keisukeyamazaki753/trailblazer-ranking';

// ======= HTML表示用 ==========
 
// ロゴ画像
let logoIMGTag = '<img src="' + logoIMG_URL + '" alt="Trailheadランキング" style="margin-right:50px;margin-bottom:10px;height:100px;float:left;"/>';
let allBadgeDisplay;
let lastDateDisplay;

// エラーメッセージ
let errMessage = '';
let errMessage2 = '';

// 最終取得日
let lastDate;
let dateFormats = 'yyyy年M月d日 HH:mm'; // 2016年9月10日 13:08

// ======= デバッグ用 ==========
// テストモード テスト時は全員分実行しない
let isTest = false;