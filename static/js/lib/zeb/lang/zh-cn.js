/**
 * Zeb中文语言包
 */
if ( 'undefined' === typeof Zeb ) {
  throw 'language require the framework [Zeb]';
}
( function () {
  var lang = {
    ok: '操作成功',
    fail: '操作失败',
    error: '操作出错'
  };
  Zeb.extend( Zeb.lang, lang );
} )();