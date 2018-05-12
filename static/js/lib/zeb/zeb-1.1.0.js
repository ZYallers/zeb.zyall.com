/**
 * Zeb framework
 * @author ZYaller
 */
if ( 'undefined' === typeof $ ) {
  throw 'Zeb framework require the base library [jquery]';
}
( function ( window, $ ) {
  /**
   * Zeb
   * @param {type} options {setting:{}, util:{}, server:{}, event:{} }
   * @returns {zeb-1.1.0_L5.window.Zeb.zeb-1.1.0Anonym$0}
   */
  window.Zeb = function ( options ) {
    var opts = options || { };
    if ( opts.setting ) {
      Zeb.extend( Zeb.setting, opts.setting );
    }
    if ( opts.server ) {
      Zeb.extend( Zeb.server, opts.server );
    }
    if ( opts.util ) {
      Zeb.extend( Zeb.util, opts.util );
    }
    if ( opts.event ) {
      Zeb.extend( Zeb.event, opts.event );
    }
    return {
      start: function () {
        if ( !Zeb.setting.basePath ) {
          return false;
        }
        var setting = Zeb.setting;
        if ( setting.css && setting.css.length > 0 ) {
          for ( var i = 0, len = setting.css.length; i < len; i++ ) {
            Zeb.loadCss( setting.css[i], function ( data ) {
              Zeb.debug && Zeb.log( 'loaded css: "' + data + '".' );
            }, false, setting.css[i] );
          }
        }
        if ( setting.lang ) {
          var langPath = setting.basePath + 'lang/' + setting.lang + '.js';
          Zeb.loadJs( langPath, function () {
            Zeb.debug && Zeb.log( 'loaded lang: "' + langPath + '".' );
          }, false );
        }
        if ( setting.plugin ) {
          var pluginPath = setting.basePath + setting.plugin + '.js';
          Zeb.loadJs( pluginPath, function () {
            Zeb.debug && Zeb.log( 'loaded plugin: "' + pluginPath + '".' );
          }, false );
        }
        if ( setting.js && setting.js.length > 0 ) {
          for ( var i = 0, len = setting.js.length; i < len; i++ ) {
            Zeb.loadJs( setting.js[i], function ( data ) {
              Zeb.debug && Zeb.log( 'loaded js: "' + data + '".' );
            }, false, setting.js[i] );
          }
        }
        Zeb.on( Zeb.event );
        if ( 'function' === typeof opts.init ) {
          opts.init();
        }
        return this;
      }

    };

  };

  /**
   * 版本
   */
  Zeb.version = '1.1.0';

  /**
   * 模式
   */
  Zeb.debug = true;

  /**
   * 配置
   */
  Zeb.setting = {
    basePath: '/jScripts/global/zeb/',
    //lang: 'zh-cn',
    plugin: 'zeb.plugin-1.0.0',
    css: [],
    js: []
  };

  /**
   * 等于$.extend方法
   */
  Zeb.extend = $.extend;

  /**
   * Zeb
   */
  Zeb.extend( Zeb, {
    log: function ( msg ) {
      window.console && window.console.log( new Date().toLocaleString(), msg );
    },
    /**
     * 获取文件名
     * @param {type} path
     * @example path='http://www.jb51.net/html/images/logo.gif' => logo
     * @returns {unresolved}
     */
    getPathName: function ( path ) {
      var arr = path.split( '/' );
      return arr.slice( arr.length - 1, arr.length ).toString().split( '.' ).slice( 0, 1 ).toString();
    },
    /**
     * jQuery.ajax方法封装
     * @param {object} options
     * @returns {void}
     */
    ajax: function ( options ) {
      $.ajax( Zeb.extend( {
        type: 'POST',
        url: '',
        dataType: 'json',
        async: true,
        cache: Zeb.debug ? false : true,
        processData: true,
        complete: function ( XMLHttpRequest, textStatus ) {
          //Zeb.debug && Zeb.log( 'Request url:"' + this.url + '" completed, status: "' + textStatus + '".' );
        },
        error: function ( XMLHttpRequest, textStatus, errorThrown ) {
          Zeb.log( 'Request url:"' + this.url + '" has ' + textStatus + ' Error: "' + errorThrown + '".' );
        },
        success: function ( data, textStatus ) {
          //Zeb.debug && Zeb.log( 'Request url:"' + this.url + '" success, data: "' + data + '", status: "' + textStatus + '".' );
        }
      }, options ) );
    },
    /**
     * 绑定事件
     * @param {object} ev 绑定方法集
     * @param {object} jq 绑定检索对象集
     * @param {string} attr 检索属性
     * @returns {void}
     */
    on: function ( ev, jq, attr ) {
      var node = jq || $( '[events]' );
      attr = attr || 'rel';
      node.each( function () {
        var that = $( this ), events = that.attr( 'events' );
        if ( !events ) {
          return false;
        }
        var _events = events.split( /\s*,\s*/ );
        for ( var i = 0, len = _events.length; i < len; i++ ) {
          var event = _events[i];
          if ( !event ) {
            continue;
          }
          var func = that.attr( attr ) + event.substring( 0, 1 ).toUpperCase() + event.substring( 1 );
          if ( typeof ev[func] === 'function' ) {
            if ( typeof that.on === 'function' ) {
              that.on( event, ev[func] );
              Zeb.debug && Zeb.log( 'on event: "' + func + '".' );
            } else {
              that.bind( event, ev[func] );
              Zeb.debug && Zeb.log( 'bind event: "' + func + '".' );
            }
          }
        }
      } );
    },
    /**
     * 加载Css文件
     * @param {type} path
     * @param {type} callback
     * @param {type} async
     * @param {type} opts
     * @returns {undefined}
     */
    loadCss: function ( path, callback, async, opts ) {
      Zeb.ajax( { url: path, async: 'undefined' === typeof async ? true : async, dataType: 'text', success: function ( text, status ) {
          if ( 'success' === status ) {
            $( 'head' ).append( '<style id="' + Zeb.getPathName( path ) + '">' + text + '</style>' );
            'function' === typeof callback && callback( opts || { } );
          }
        } } );
    },
    /**
     * 加载Js文件
     * @param {type} path
     * @param {type} callback
     * @param {type} async
     * @param {type} opts
     * @returns {undefined}
     */
    loadJs: function ( path, callback, async, opts ) {
      Zeb.ajax( { url: path, async: 'undefined' === typeof async ? true : async, dataType: 'script', success: function ( text, status ) {
          if ( 'success' === status && 'function' === typeof callback ) {
            callback( opts || { } );
          }
        } } );
    }

  } );
  /**
   * lang=语言包
   */
  Zeb.lang = { };

  /**
   * util=工具类
   */
  Zeb.util = {
    reload: function ( time ) {
      window.setTimeout( function () {
        window.location.reload();
      }, ( time || 0 ) * 1000 );
    },
    back: function () {
      window.history.back();
    },
    forward: function () {
      window.history.forward();
    },
    redirect: function ( url, time ) {
      window.setTimeout( function () {
        window.location.href = url;
      }, ( time || 0 ) * 1000 );
    }
  };

  /**
   * server=数据类
   */
  Zeb.server = { };

  /**
   * event=事件类
   */
  Zeb.event = { };

} )( window, jQuery );