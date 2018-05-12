/**
 * Zeb扩展方法
 */
if ( 'undefined' === typeof Zeb ) {
  throw 'plugin require the framework [Zeb]';
}
( function () {
  var plugin = {
    loading: function ( msg ) {
      return window.dialog( { id: 'loading-dialog', content: msg || '正在加载…' } ).showModal();
    },
    finish: function () {
      window.dialog.get( 'loading-dialog' ).close();
    },
    tip: function ( msg, time ) {
      var d = window.dialog.get( 'tip-dialog' );
      if ( d ) {
        d.content( msg ).show();
      } else {
        d = window.dialog( { id: 'tip-dialog', content: msg } ).show();
      }
      window.setTimeout( function () {
        d.close();
      }, ( time || 2 ) * 1000 );
      return d;
    },
    confirm: function ( title, content, ok, cancel, show, close ) {
      var conf = { id: 'confirm-dialog', title: title || '提示', content: content || '' };
      ok && Zeb.extend( conf, { ok: ok, okValue: '确定' } );
      cancel && Zeb.extend( conf, { cancel: cancel, cancelValue: '取消' } );
      show && Zeb.extend( conf, { onshow: show } );
      close && Zeb.extend( conf, { close: close } );
      var d = window.dialog( conf ).showModal();
      return d;
    }
  };
  Zeb.extend( Zeb, plugin );
} )();