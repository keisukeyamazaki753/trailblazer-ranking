/**
 *  GASスクリプトの挙動を確認するためのクラスです。
 *  正式なリファレンスは以下
 *  https://developers.google.com/apps-script/reference
 */

/**
* ロガーの書き方　備忘
*/
function LOGSAMPLE(){
  Logger.log('test');
}

/**
* 正規表現　確認メソッド
*/
function validateREGEX1(){
  
  let body = "</ul><a class='slds-show slds-text-align_center' data-test-current-rank href='/ja/trailblazer-ranks'><img width='100px' src='/assets/ranks/expeditioner-f2c1a62ba3ce2395efbffdb4df00942a7e55d7da12e73b02805a03c05395bd73.png' alt='Expeditioner' /></a></div>";
  let myRegexp = /<a class='slds-show slds-text-align_center' data-test-current-rank href='\/ja\/trailblazer-ranks'><img width='100px' src='([\s\S]*?)' alt='([\s\S]*?)' \/><\/a>/ig;
  let execed = myRegexp.exec(body);
  Logger.log(execed[1]);
  Logger.log(execed[2]);
}

/**
* 正規表現　確認メソッド
*/
function validateREGEX2(){
  
  let result = [];
  let body = "abc let='agve'abcde";
  let regexp = /abc let='[^']*'([\s\S]*?)de/i;
  result.push(regexp.exec(body)[1]);
  Logger.log(result);
}

/**
* ３桁区切り
*/
function sprit3(){
  let body = "1234567654";
  let numFormats = '%#,###';
  let text = Utilities.formatString(numFormats, body);
  Logger.log(text);
  Logger.log(Utilities.formatString('%11.6f', 123.456));
  
}


/**
* リプレース
*/
function repl(){
  
  let baseSt = 'https://developer.salesforce.com/resource/images/trailhead/badges/modules/trailhead_module_sales_cloud_lightning_essentials_features.png\t\t\t';
  let body = baseSt.replace(/\t/g, '');
  Logger.log(body);
}

/**
* 正規表現　出現回数のカウント
*/
function validateREGEXcount(){
  
  let result = [];
  let body = "[&quot;superbadge&quot;][&quot;superbadge&quot;]w[&quot;superbadge&quot;&quot;superbadge&quot;]&quot;superbadge&quot;";
  let regexp = /\[&quot;superbadge&quot;\]/g;
  result.push(body.match(regexp).length);
  Logger.log(result);
}

/**
* 姓名入れ替え
*/
function reverseNameTest(){
  
  let baseName = '啓介 山崎';
  let result = baseName.split(' ');
  let re = '';
  for(let i = result.length; i>0; i--){
    re += result[i-1] + ' ';
  Logger.log(i);
  Logger.log(result[i-1]);
  }
  Logger.log(re);
}

/**
* containsってどう書くの？
*/
function containsTest(){
  
  let baseSt = 'abadbbesgegasfwfesfesav';
  Logger.log(baseSt.indexOf("sgega")>-1);
}
