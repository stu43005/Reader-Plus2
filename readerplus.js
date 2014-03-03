var head = $("head"),
	viewer = $("#viewer-entries-container"),
	title = $("#title-and-status-holder"),
	is_new_google2 = $("#gbzw").length > 0,
	is_new_google = $("#gbq").length > 0,
	fixspace_init, fixspace_change, hidegbzw_change, minsearch_change, setting = {
		"fitheight": {
			text: "固定文章高度",
			input: {
				"scrollerfix": {
					text: "捲動優化"
				}
			}
		},
		"jump": {
			text: "添加跳到頂部/底部鏈接"
		},
		"fixspace": {
			text: "縮小網頁空白區域",
			input: {
				"hidegbzw": {
					text: "隱藏又黑又硬的導覽列",
					callback: hidegbzw_change
				},
				"minsearch": {
					text: "搜尋列縮到最小",
					callback: minsearch_change
				},
				"fixspace_1": {
					text: "搜尋列高度",
					type: "slider",
					after: "&nbsp;px",
					min: 30,
					max: 200,
					step: 1,
					def: 72,
					callback: fixspace_init
				},
				"fixspace_2": {
					text: "工具列高度",
					type: "slider",
					after: "&nbsp;px",
					min: 30,
					max: 200,
					step: 1,
					def: 57,
					callback: fixspace_init
				},
				"fixspace_3": {
					text: "側邊欄寬度",
					type: "slider",
					after: "&nbsp;px",
					min: 130,
					max: 300,
					step: 1,
					def: 248,
					callback: fixspace_init
				}
			},
			callback: fixspace_change
		},
		"tags": {
			text: "修正標記功能"
		},
		"wumii": {
			text: "隱藏无觅相关文章插件"
		},
		"feedburner": {
			text: "隱藏feedburner工具按鈕"
		},
		"search_plus": {
			text: "搜尋功能強化 *",
		}
	};

if ( is_new_google2 )
	console.debug("Reader Plus2 - new google nav v2");
else if ( is_new_google )
	console.debug("Reader Plus2 - new google nav");

(function(){
	var d, z;
	for(d in setting) {
		if ( !localStorage[d] )
			localStorage[d] = (setting[d].def ? setting[d].def : 0);
		if ( setting[d].input ) {
			for(z in setting[d].input) {
				if ( !localStorage[z] )
					localStorage[z] = (setting[d].input[z].def ? setting[d].input[z].def : 0);
				setting[d].input[z].match = /^(\d+)$/;
			}
		}
	}
})();

/* 設定 */
var setting_show = 0,
	setting_title = "Reader Plus2 - 設定";
function setting_call() {
	if ( setting_show ) return;
	var win = $(window), w, h, a, b, c, f = false, g;
	function onresize() {
		a.css({
			width: (w = win.width()) + "px",
			height: (h = win.height()) + "px"
		});
	}
	function onmousemove(e) {
		if ( !f || b.length < 1 || !g ) return;
		var l = g.o.left + e.pageX - g.e.pageX;
		var t = g.o.top + e.pageY - g.e.pageY;
		if ( l < 0 ) l = 0;
		else if ( (l + b.outerWidth()) > w ) l = w - b.outerWidth();
		if ( t < 0 ) t = 0;
		else if ( (t + b.outerHeight()) > h ) t = h - b.outerHeight();
		b.css({
			left: l + "px",
			top: t + "px"
		});
	}
	function onmouseup() {
		f = false;
		$("body").unbind("mousemove", onmousemove).unbind("mouseup", onmouseup);
	}
	$("body").append(
		a = $('<div class="stream-details-dialog modal-dialog-bg" style="opacity:0.75"/>')
	).append(
		b = $('<div class="stream-details-dialog modal-dialog" role="dialog" style="z-index:1000"/>').append(
			$('<div class="stream-details-dialog modal-dialog-title modal-dialog-title-draggable"/>').append(
				$('<span class="stream-details-dialog modal-dialog-title-text" style="-webkit-user-select:none"/>').html(setting_title)
			).append(
				$('<span class="stream-details-dialog modal-dialog-title-close"/>').click(function(){
					a.remove();
					b.remove();
					win.unbind("resize", onresize);
					setting_show = 0;
				})
			).mousedown(function(e){
				f = true;
				g = {
					"e": e,
					"o": b.offset()
				};
				$("body").bind("mousemove", onmousemove).bind("mouseup", onmouseup);
			})
		).append(
			c = $('<div class="stream-details-dialog modal-dialog-content"/>')
		)
	);
	win.bind("resize", onresize);
	onresize();
	setting_show = 1;
	c.append('<p>禁用以下功能：</p>');
	var d, i = 0;
	for(d in setting) {
		var input = $('<input type="checkbox"/>').attr("id","rp-o-cb-" + i).attr("name",d).click(function(){
				var id = $(this).attr("name"),
					val = $(this).attr("checked");
				if ( setting[id].input ) {
					if ( val )
						$(this).nextUntil(document.getElementsByTagName("input"),"div").hide();
					else
						$(this).nextUntil(document.getElementsByTagName("input"),"div").show();
				}
				localStorage[id] = (val ? 1 : 0);
				if ( setting[id].callback )
					setting[id].callback.call();
			}),
			label = $('<label/>').attr("for","rp-o-cb-" + i).html(setting[d].text),
			div = $('<div/>');
		if ( localStorage[d] == "1" ) {
			input.attr("checked","checked");
			div.hide();
		}
		if ( setting[d].desc )
			input.add(label).attr("title",setting[d].desc ? setting[d].desc : "");
		if ( setting[d].input ) {
			var z;
			div.css("margin-left","24px");
			for(z in setting[d].input) {
				if ( setting[d].input[z].type == "slider" ) {
					var temp;
					div.append(
						$('<div style="margin-top:10px"/>').attr("id","readerplus_"+z).append(
							$('<span style="-webkit-user-select:none"/>')
							.attr("title","點兩下回復預設值: "+(setting[d].input[z].def ? setting[d].input[z].def : 0)).dblclick(function(e){
								e.stopPropagation();
								if ( confirm("回復預設值嗎?") ) {
									var input = $(this).parent().find("input[type=slider]"),
										d = input.attr("data-d"),
										z = input.attr("name");
									input.slider("value",(setting[d].input[z].def ? setting[d].input[z].def : 0));
								}
							}).append(setting[d].input[z].text).append(":&nbsp;")
						).append(
							$('<span style="display:inline-block;padding:0 5px"/>').css("width",(setting[d].input[z].width?setting[d].input[z].width:300)+"px").append(
								temp = $('<input type="slider"/>').val(localStorage[z]).attr({
									"name": z,
									"data-d": d
								})
							)
						)
					);
					temp.slider({
						from: setting[d].input[z].min,
						to: setting[d].input[z].max,
						step: setting[d].input[z].step,
						round: 0,
						dimension: setting[d].input[z].after,
						onstatechange: function(value) {
							var d = this.inputNode.attr("data-d"),
								z = this.inputNode.attr("name"),
								ma = value.match(setting[d].input[z].match);
							if (
								!ma ||
								(setting[d].input[z].min && ma[1] < setting[d].input[z].min) ||
								(setting[d].input[z].max && ma[1] > setting[d].input[z].max)
							) {
								localStorage[z] = (setting[d].input[z].def ? setting[d].input[z].def : 0);
							} else {
								localStorage[z] = ma[1];
							}
							if ( setting[d].input[z].callback )
								setting[d].input[z].callback.call();
						},
						skin: "round"
					});
				} else {
					var temp;
					div.append(
						$('<div/>').attr("id","readerplus_"+z).append(
							temp = $('<input type="checkbox"/>').attr({
								"id": "rp-o-cb-" + z,
								"name": z,
								"data-d": d
							}).click(function(){
								var input = $(this),
									d = input.attr("data-d"),
									z = input.attr("name"),
									val = input.attr("checked");
								localStorage[z] = (val ? 1 : 0);
								if ( setting[d].input[z].callback )
									setting[d].input[z].callback.call();
							})
						).append(
							$('<label/>').attr("for","rp-o-cb-" + z).html(setting[d].input[z].text)
						)
					);
					if ( localStorage[z] == "1" )
						temp.attr("checked","checked");
				}
			}
		}
		c.append(input).append("&nbsp;").append(label).append('<br/>').append(div);
		i++;
	}
	c.append('<p>名稱後方有「*」表示需要重整網頁才會生效。</p>');
	b.css({
		left: ((w - b.outerWidth()) / 2) + "px",
		top: ((h - b.outerHeight()) / 2) + "px"
	});
	setTimeout(function(){$(window).resize()},10);
}
$("#gbom").append(
	$('<li class="gbkc gbmtc"/>').append(
		$('<a class="gbmt link"/>').html(setting_title)
	).click(setting_call)
);
$("#settings-button-menu").append(
	$('<div class="goog-menuitem" role="menuitem" style="-webkit-user-select:none"/>').append(
		$('<div class="goog-menuitem-content"/>').html(setting_title)
	).hover(function(){
		$(this).addClass("goog-menuitem-highlight");
	},function(){
		$(this).removeClass("goog-menuitem-highlight");
	}).click(setting_call).click(function(){
		$("#settings-button-menu").hide();
	})
);
head.append("<style type=\"text/css\">.jfk-textinput.jfk-textinput-error{border-color:#DD4B39 !important}</style>");



/* fitheight 固定高度 */
function fitheight(b) {
	if ( localStorage['fitheight'] == 1 ) return;
	if ( typeof b == 'undefined' ) b = false;
	var entry = $("#current-entry"),
		body = $(".entry-body",entry),
		bodyd = $(".entry-body > div",entry);
	if ( bodyd.length > 0 && ( !bodyd.data("is-set-max-height") || b ) ) {
		//scrollable
		if (bodyd.find(".scrollable-sections-top-shadow").length < 1) {
			body.css({
				"position": "relative",
				"padding-top": "0"
			});
			$(".item-body", bodyd).css("padding", "8px 0");
			bodyd.append($("<div/>").addClass("scrollable-sections-top-shadow").css({
				"width": "100%",
				"cursor": "pointer",
				"top": "0",
				"opacity": "0",
				"border-top": "1px solid rgba(0, 0, 0, 0.4)",
				"background": "-webkit-gradient(linear,left top,left bottom,from(rgba(0, 0, 0, .3)),to(transparent))",
				"-webkit-mask-box-image": "-webkit-gradient(linear,left top,right top,color-stop(0.0,rgba(0,0,0,0)),color-stop(0.5,rgba(0,0,0,.8)),color-stop(1.0,rgba(0,0,0,0)))",
				"margin-right": "0",
				"height": "8px",
				"left": "0",
				"position": "absolute"
			}).click(function() {
				$("#current-entry .entry-body > div").animate({
					scrollTop: 0
				}, 500);
			}), $("<div/>").addClass("scrollable-sections-bottom-shadow").css({
				"width": "100%",
				"cursor": "pointer",
				"bottom": "0",
				"opacity": "1",
				"border-bottom": "1px solid rgba(0, 0, 0, 0.4)",
				"background": "-webkit-gradient(linear,left bottom,left top,from(rgba(0, 0, 0, .3)),to(transparent))",
				"-webkit-mask-box-image": "-webkit-gradient(linear,left bottom,right bottom,color-stop(0.0,rgba(0,0,0,0)),color-stop(0.5,rgba(0,0,0,.8)),color-stop(1.0,rgba(0,0,0,0)))",
				"margin-right": "0",
				"height": "8px",
				"left": "0",
				"position": "absolute"
			}).click(function() {
				var scrollable = $("#current-entry .entry-body > div");
				scrollable.animate({
					scrollTop: $(".item-body", scrollable).outerHeight() - $(scrollable).outerHeight()
				}, 500);
			})).scroll(function() {
				$(".scrollable-sections-top-shadow", this).css("opacity", $(this).scrollTop() / 30);
				$(".scrollable-sections-bottom-shadow", this).css("opacity", ($(".item-body", this).outerHeight() - $(this).outerHeight() - $(this).scrollTop()) / 30);
			});
		}
		var height;
		if ( bodyd.data("is-set-max-height") )
			height = viewer.height() - entry.outerHeight() + bodyd.height();
		else {
			bodyd.css({
				"max-height": viewer.height() + "px",
				"overflow-y": "auto"
			}).bind("mousewheel", function(e){
				if ( localStorage['scrollerfix'] == 1 && $(">div", this).outerHeight() > $(this).height() ) {
					e.preventDefault();
					if ( entry.position().top < 0 || (entry.position().top > 0 && (entry.position().top + entry.outerHeight()) > viewer.height()) )
						gototop();
					e.originalEvent.wheelDeltaY && $(this).stop().animate({
						scrollTop: "-=" + e.originalEvent.wheelDeltaY
					}, 20);
				}
			});
			height = viewer.height() - entry.outerHeight() + bodyd.height() - 2;
		}
		bodyd.css("max-height",height + "px").data("is-set-max-height",1).scroll();
		if ( !b ) {
			if ( entry.position().top < 0 || (entry.position().top > 0 && (entry.position().top + entry.outerHeight()) > viewer.height()) )
				gototop();
		}
	}
}
/*var scroller_keycode = null;
$(document).bind("keydown", function(e){
	scroller_keycode = e.keyCode;
}).bind("keyup", function(e){
	scroller_keycode = null;
});
$("div#viewer-entries-container").bind("scroll", function(e){
	if ( localStorage['scrollerfix'] == 1 && scroller_keycode != null ) {
		var entry = $("#current-entry"),
			bodyd = $(".entry-body > div", entry),
			bodydd = $(">div", bodyd);
		if ( bodyd.length > 0 && bodydd.length > 0 && $(">div", bodyd).outerHeight() > bodyd.height() ) {
			var scrollpx = 0;
			switch(scroller_keycode) {
			case 40: // down
				scrollpx = 30;
				break;
			case 38: // up
				scrollpx = -30;
				break;
			case 34: // pagedown
			case 33: // pageup
				return;	// TODO: 捲動大小
			}
			e.preventDefault();
			e.stopPropagation();
			if ( entry.position().top < 0 || (entry.position().top > 0 && (entry.position().top + entry.outerHeight()) > viewer.height()) )
				gototop();
			bodyd.animate({
				scrollTop: "+=" + scrollpx
			}, 20);
		}
	}
});*/

/* fixlayout 固定佈局 */
head.append("<style type=\"text/css\">.entry-body img{max-width:100%}.entry .entry-body,.entry .entry-title,.entry .entry-likers{max-width:100% !important}.entry .entry-body .item-body{width:99%}</style>");

/* unreadcount 顯示所有未讀計數 */
head.append("<style type=\"text/css\">.lhn-section-no-unread-counts .unread-count{display:inline !important}</style>");

/* jump 添加頂部/底部鏈接 */
head.append("<style type=\"text/css\">.entry-title-go-to-bottom{margin-left:4px;padding-left:18px;height:14px;background-repeat:no-repeat;background-image:url("+chrome.extension.getURL("gotobottomicon.png")+")}.item-go-to-top{padding:1px 0 1px 16px;margin-right:16px;background-repeat:no-repeat;background-image:url("+chrome.extension.getURL("gototopicon.png")+")}</style>");
function gotobottom(e,fix) {
	if ( e ) e.stopPropagation();
	if ( typeof fix == 'undefined' ) fix = (($("#stream-view-options-container > div:nth-child(2)").attr("aria-pressed") == "true") ? 10 : 0);
	var entry = $("#current-entry"),
		//top = entry.position().top + entry.outerHeight() - viewer.height() + title.innerHeight() + fix;
		top = viewer.scrollTop() + entry.position().top + entry.outerHeight() - viewer.height() + fix;	/* 11/21 17:44 修正 */
	viewer.scrollTop(top>0?top:0);
}
function gototop(e,fix) {
	if ( e ) e.stopPropagation();
	if ( typeof fix == 'undefined' ) fix = (($("#stream-view-options-container > div:nth-child(2)").attr("aria-pressed") == "true") ? 10 : 0);
	var entry = $("#current-entry"),
		//top = entry.position().top + title.innerHeight() + fix;
		top = viewer.scrollTop() + entry.position().top + fix;	/* 11/21 17:44 修正 */
	viewer.scrollTop(top);
}
function jump() {
	if ( localStorage['jump'] == 1 ) return;
	var entry = $("#current-entry");
	if ( $(".entry-title-go-to-bottom",entry).length < 1 && $(".entry-icons-placeholder",entry).length > 0 ) {
		var div = $('<div class="link entry-title-go-to-bottom" title="跳到底部"/>').click(gotobottom);
		$(".entry-icons-placeholder",entry).append(div);
	}
	if ( $(".item-go-to-top",entry).length < 1 && $(".entry-actions",entry).length > 0 ) {
		var span = $('<span class="grp-btn btn-jump item-go-to-top link unselectable" title="跳到頂部">jump</span>').click(gototop);
		$(".entry-actions",entry).append('<wbr/>').append(span);
	}
}

/* 縮小網頁空白區域 */
function fixspace(b,c) {
	if ( typeof c == 'undefined' ) c = true;
	if ( c && localStorage['fixspace'] == 1 ) return;
	if ( typeof fixspace.count == 'undefined' ) fixspace.count = 0;	//static variables
	if ( typeof b == 'undefined' ) b = true;
	if ( $("#settings-frame").length > 0 && !$("#settings-frame").hasClass("hidden") ) return;
	if ( b ) {
		if ( $("#loading-area-container.hidden").length < 1 ) {
			fixspace.count++;
			if ( fixspace.count < 100 ) {
				setTimeout(function(){fixspace(true)},100);
				return;
			}
		}
		fixspace.count = 0;
	}
	var is_fullscreen = $("body").hasClass("fullscreen");
	var is_lhn_hidden = $("body").hasClass("lhn-hidden");
	var is_page_view = $("#chrome").hasClass("page-view");
	if ( is_new_google ) {
		if ( is_fullscreen )
			var height = $(window).height() - $("#chrome-fullscreen-top-toggle").outerHeight() - $("#viewer-header-container").outerHeight();
		else
			var height = $(window).height() - $("#gb").outerHeight() - $("#viewer-header-container").outerHeight();
		$("#viewer-entries-container").css("height",height + "px");
		if ( !is_lhn_hidden ) {
			var height2 = height - $("#lhn-add-subscription-section").outerHeight();
			$("#scrollable-sections").css("height",height2 + "px");
		}
	} else {
		if ( is_fullscreen )
			var height = $(window).height() - $("#chrome-fullscreen-top-toggle").outerHeight() - $("#viewer-header-container").outerHeight();
		else
			var height = $(window).height() - $("#gb").outerHeight() - $("#top-bar").outerHeight() - $("#viewer-header-container").outerHeight();
		$("#viewer-entries-container").css("height",height + "px");
		if ( !is_lhn_hidden )
			$("#scrollable-sections").css("height",height + "px");
	}
	if ( is_new_google2 && localStorage['minsearch'] == 1 ) {
		var left = (is_lhn_hidden ? $("#chrome-lhn-menu").outerWidth(true) : $("#nav").width()) + (is_page_view ? $("#sections-header .overview-section-header").outerWidth(true) : $("#viewer-refresh").outerWidth(true) + $("#viewer-view-options").outerWidth(true) + $("#mark-all-as-read-split-button").outerWidth(true) + $("#stream-prefs-menu").outerWidth(true)) + 3;
		$("#gbq2").style("margin-left",left + "px","important");
	}
	if ( is_page_view ) $("#sections-header").css("height",localStorage['fixspace_2'] + "px");
	fitheight(true);
}
function delay_fixspace() {
	if ( localStorage['fixspace'] == 1 ) return;
	fixspace(false);
	setTimeout(function(){fixspace()},500);
}
function fixspace_init() {
	if ( localStorage['fixspace'] == 1 ) return;
	if ( is_new_google2 && localStorage['hidegbzw'] == 1 ) {
		$("#gbzw, #gbx3").hide();
		$("#gbx1, #gb #gbx1, #gbq, #gbu, #gb #gbq, #gb #gbu").css("top","0px");
	}
	if ( is_new_google2 && localStorage['minsearch'] == 1 ) {
		$("#gbq1, #gbu, #gbx1").hide();
		$("#gbq").css("z-index","auto");
		$("#gbq2").css({
			"padding-top": ((localStorage['fixspace_2']-30)/2+2) + "px",
			"z-index": "8"
		});
		$("#gbq2, #gbqf, #gbqff").css("max-width","200px");
		$("#gbqfbw").show();
		$("#gbqfq").focus(function(){$("#gbqfbw").show();});
	}
	if ( is_new_google ) {
		if ( is_new_google2 )
			$("#gb").css("height",((localStorage['minsearch']==1?0:parseInt(localStorage['fixspace_1'])) + (localStorage['hidegbzw']==1?0:$("#gbz").height())) + "px");
		else
			$("#gb").css("height",localStorage['fixspace_1'] + "px");
		$("#gbx1, #gbx2").css("height",(localStorage['fixspace_1']-1) + "px");
		if ( !is_new_google2 || localStorage['minsearch'] != 1 )
			$("#gbq2, #gbv, #gbu").css("padding-top",(localStorage['fixspace_1']-30)/2 + "px");
		if ( $("#fixspace_css1").length > 0 )
			$("#fixspace_css1").remove();
		head.append("<style type=\"text/css\" id=\"fixspace_css1\">#gbq1{margin-top:"+(72-localStorage['fixspace_1'])/(-2)+"px}#gbq1.gbem,#gbq1.gbes{margin-top:"+(58-localStorage['fixspace_1'])/(-2)+"px}</style>");
		$("#viewer-header").css("height",localStorage['fixspace_2'] + "px");
		$("#logo-section").css("height",(localStorage['fixspace_2']-12) + "px").css("line-height",(localStorage['fixspace_2']-12) + "px");
	} else {
		$("#top-bar").css("height",localStorage['fixspace_1'] + "px");
		$("#search").css("padding",(localStorage['fixspace_1']-30)/2 + "px 0");
		$("#lhn-add-subscription-section, #viewer-header").css("height",localStorage['fixspace_2'] + "px");
	}
	$("#nav, #logo-container, #lhn-add-subscription-section, #scrollable-sections-top-shadow, #scrollable-sections-bottom-shadow").css("width",localStorage['fixspace_3'] + "px");
	if ( $("#fixspace_css3").length > 0 )
		$("#fixspace_css3").remove();
	head.append("<style type=\"text/css\" id=\"fixspace_css3\">#reading-list-selector .label{max-width:"+(localStorage['fixspace_3']-62)+"px}.folder .name-text,.folder .folder .name-text.folder-name-text{max-width:"+(localStorage['fixspace_3']-105)+"px}.folder .folder .name-text{max-width:"+(localStorage['fixspace_3']-112)+"px}#chrome{margin-left:"+localStorage['fixspace_3']+"px}</style>");
	fixspace();
}
function hidegbzw_change(v) {
	if ( !is_new_google2 ) return;
	if ( typeof v == 'undefined' ) v = (localStorage['fixspace'] == 0 ? localStorage['hidegbzw'] : 0);
	if ( v != 1 ) {
		$("#gbzw, #gbx3").show();
		$("#gbx1, #gb #gbx1, #gbq, #gbu, #gb #gbq, #gb #gbu").css("top","");
	}
	fixspace_init();
}
function minsearch_change(v) {
	if ( !is_new_google2 ) return;
	if ( typeof v == 'undefined' ) v = (localStorage['fixspace'] == 0 ? localStorage['minsearch'] : 0);
	if ( v != 1 ) {
		$("#gbq1, #gbu, #gbx1").show();
		$("#gbq2").css({
			"margin-left": "",
			"width": "",
			"z-index": ""
		});
		$("#gbq2, #gbqf, #gbqff").css("max-width","");
		$("#gbqfbw").show();
	}
	fixspace_init();
}
function fixspace_change(v) {
	if ( typeof v == 'undefined' ) v = localStorage['fixspace'];
	if ( v == 1 ) {
		if ( is_new_google ) {
			$("#gb, #gbx1, #gbx2, #viewer-header, #logo-section").css("height","");
			$("#gbq2, #gbv, #gbu").css("padding-top","");
			$("#logo-section").css("line-height","");
			if ( $("#fixspace_css1").length > 0 )
				$("#fixspace_css1").remove();
		} else {
			$("#top-bar, #lhn-add-subscription-section, #viewer-header").css("height","");
			$("#search").css("padding","");
		}
		fixspace(false,false);
		$("#viewer-entries-container, #scrollable-sections").height(function(index, height){
			if ( index == 1 && $("body").hasClass("lhn-hidden") )
				return height;
			return height-13;
		});
		if ( $("#fixspace_css3").length > 0 )
			$("#fixspace_css3").remove();
		hidegbzw_change();
		minsearch_change();
	} else {
		fixspace_init();
	}
}
if ( is_new_google && !is_new_google2 && $("#gbpr").length > 0 ) {
	$("#gbpr, #gbx3, #gbx4").remove();
	$(".gbpro #gbq, .gbpro #gbu, .gbpro #gbn, .gbpro #gbx1, .gbpro #gbx2").css("top","0");
}
fixspace_init();
$(window).bind("resize",function(){fixspace(false)}).bind("hashchange",delay_fixspace);
$("#scrollable-sections-holder, #viewer-header, .goog-menu, .goog-button, .jfk-button, *[role*='button'], button, .entry-source-title, .user-tags-list a").live("click",delay_fixspace);
$("#chrome-fullscreen-top-toggle").live("mouseover",function(){fixspace(false)});


/* 解決標記會使文章彈至上方的問題，並修正標記功能的位置 */
function tagsinput() {
	if ( typeof tagsinput.count == 'undefined' ) tagsinput.count = 0;	//static variables
	var tagslist = $(".ac-renderer").filter(function(){
			var f = $(this);
			return f.css("display") != 'none' && (f.position().top + f.outerHeight()) >= $(window).height();
		});
	if ( tagslist.length < 1 ) {
		tagsinput.count++;
		if ( tagsinput.count < 10 ) setTimeout(function(){tagsinput()},100);
		else tagsinput.count = 0;
		return;
	}
	tagsinput.count = 0;
	tagslist.each(function(){
		var f = $(this);
		f.css("top",(f.position().top - f.outerHeight() - $(".tags-edit-tags").outerHeight()) + "px");
	});
}
function tags(e) {
	if ( localStorage['tags'] == 1 ) return;
	if ( typeof tags.count == 'undefined' ) tags.count = 0;	//static variables
	var entry = $("#current-entry"),
		tagsedit = $(".tags-edit");
	if ( tagsedit.length < 1 || tagsedit.position().top < 1 ) {
		tags.count++;
		if ( tags.count < 10 ) setTimeout(function(){tags(e)},100);
		else tags.count = 0;
		return;
	}
	tags.count = 0;
	$("input",tagsedit).bind("keypress",tagsinput);
	if ( entry.outerHeight() > viewer.height() )
		gotobottom(e);
	//else if ( entry.position().top < viewer.scrollTop() )
	else if ( entry.position().top < 0 )	/* 11/21 17:44 修正 */
		gototop(e);
	//if ( (tagsedit.position().top + tagsedit.outerHeight() + title.innerHeight() - 1 /* 允許超過1px */) < (viewer.scrollTop() + viewer.height()) )
	if ( (tagsedit.position().top + tagsedit.outerHeight() - 1 /* 允許超過1px */) < viewer.height() )	/* 11/21 17:44 修正 */
		return;
	//var top = tagsedit.position().top - tagsedit.outerHeight() - $(".entry-actions",entry).outerHeight() + 1 /* entry下方border */ + 1;
	var top = viewer.scrollTop() + entry.position().top + entry.outerHeight() - tagsedit.outerHeight() - 3;	/* 11/21 17:44 修正 */
	tagsedit.css("top",top + "px");
}
$("#entries .entry .tag.link .entry-tagging-action-title").live("click",tags);

/* 隱藏无觅相关文章插件 */
function wumii() {
	if ( localStorage['wumii'] == 1 ) return;
	var body = $("#current-entry .entry-body");
	if ( body.length > 0 ) {
		$("table a[href*='http://www.wumii.com/'][target='_blank']",body).each(function(){
			$(this).parents("table").hide();
		});
	}
}

/* 隱藏feedburner工具按鈕 */
function feedburner() {
	if ( localStorage['feedburner'] == 1 ) return;
	var body = $("#current-entry .entry-body");
	if ( body.length > 0 ) {
		$("div a[href*='http://feeds.feedburner.com/'][target='_blank'] img[src*='http://feeds.feedburner.com/']",body).each(function(){
			$(this).parent("a").parent("div").hide();
		});
	}
}

/* 所有連結以新視窗開啟 */
function a_target_blank() {
	var body = $("#current-entry .entry-body");
	if ( body.length > 0 ) {
		$("a[target!='_blank']",body).attr("target","_blank");
	}
}

/* 側邊欄快速滾動 */
$("#scrollable-sections-top-shadow, #scrollable-sections-bottom-shadow").css("cursor","pointer").live("click",function(){
	var scrollable = $("#scrollable-sections");
	if ( $(this).attr("id") == "scrollable-sections-top-shadow" ) {
		scrollable.animate({
			scrollTop: 0
		}, 500);
	} else {
		var i = 0;
		$("#scrollable-sections > div").each(function(){
			i += $(this).outerHeight();
		});
		if ( !$("#lhn-selectors").hasClass("section-minimized") )
			i += 13;
		if ( !$("#lhn-recommendations").hasClass("section-minimized") )
			i += 13;
		i -= scrollable.height();
		scrollable.animate({
			scrollTop: i
		}, 500);
	}
});
$("#lhn-subscriptions").css("padding-bottom","8px");

/* 搜尋強化 */
if ( localStorage['search_plus'] == 0 ) {

if ( is_new_google ) {

var search_button,
	search_input,
	search_text = "",
	search_keyword = "",
	search_show = 0;

$(".search-restrict").live("mousedown",function(){
	search_button = $(".search-restrict + .goog-menu");
	if ( !search_show ) {
		var t = !search_input;
		if ( t ) {
			search_button.prepend(
				$('<div class="goog-menuitem main-item" style="-webkit-user-select:auto"/>').append(
					$('<div class="goog-menuitem-content" style="-webkit-user-select:auto"/>').append(
						$('<div class="goog-menuitem-checkbox" style="-webkit-user-select:none"/>')
					).append(
						search_input = $('<input class="jfk-textinput" style="height:20px" type="text" autocomplete="off" placeholder="filter"/>').val(search_keyword)
						.keyup(function(){
							search_keyword = $(this).val();
							var text = search_keyword.toLowerCase();
							$(".goog-menuitem:not(.main-item)",search_button).each(function(){
								var content;
								if ( $(this).data("content") )
									content = $(this).data("content");
								else {
									content = $(".goog-menuitem-content",this).clone();
									$(".goog-menuitem-checkbox",content).remove();
									content = content.html().toLowerCase();
									$(this).data("content",content);
								}
								if ( content.indexOf(text) == -1 ) {
									$(this).hide();
								} else {
									$(this).show();
								}
							});
						}).focusout(function(){
							setTimeout(function(){
								if ( search_input.length > 0 ) {
									search_keyword = search_input.val();
								}
								search_button.hide();
								search_show = 0;
							},100);
						})
					)
				)
			);
		}
		search_button.css("display","");
		search_input.focus().keyup();
		search_show = 1;
	} else {
		if ( search_input.length > 0 ) {
			search_keyword = search_input.val();
		}
		search_button.hide();
		search_show = 0;
	}
}).live("mousedown",function(){
	if ( search_show )
		search_button.css("display","");
});

} else {

var search_button = $("#search .search-restrict .goog-flat-menu-button-caption"),
	search_text = "",
	search_keyword = "",
	search_show = 0;

function search_hide() {
	if ( $("input",search_button).length > 0 ) {
		search_keyword = $("input",search_button).val();
		search_button.html(search_text);
	}
	$("#search .goog-menu").hide();
	search_show = 0;
}
$("#search .search-restrict").css("-webkit-user-select","auto").live("click",function(){
	if ( !search_show ) {
		var t = $("input",search_button).length < 1;
		if ( t ) {
			search_text = search_button.html();
			search_button.html('<input class="jfk-textinput" style="height: 20px;" type="text" size="10"/>');
			$("input",search_button).val(search_keyword);
		}
		$("input",search_button).focus().keyup();
		if ( t ) {
			$("input",search_button).focusout(function(){
				setTimeout(search_hide,100);
			});
		}
		$("#search .goog-menu").css("display","");
		search_show = 1;
	} else {
		search_hide();
	}
});
$("input",search_button).live("keyup",function(){
	search_keyword = $(this).val();
	var text = search_keyword.toLowerCase();
	$("#search .goog-menu .goog-menuitem:not(.main-item)").each(function(){
		var content;
		if ( $(this).data("content") )
			content = $(this).data("content");
		else {
			content = $(".goog-menuitem-content",this).html().toLowerCase();
			$(this).data("content",content);
		}
		if ( content.indexOf(text) == -1 ) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
});

}

}

/* 修正浮動框背景 */
head.append("<style type=\"text/css\">div.goog-modalpopup-bg,div.modal-dialog-bg{z-index:9}</style>");

/* 修正pre和code會超過範圍的問題 */
head.append("<style type=\"text/css\">pre,code{white-space:pre-wrap}</style>");

/* 未讀醒目提示 */
function unread_count() {
	var unread = $("#reading-list-unread-count");
	if ( unread.length > 0 && !unread.hasClass("hidden") )
		$("#viewer-refresh").css("border","1px solid #4D90FE");
	else
		$("#viewer-refresh").css("border","");
}
$(window).load(unread_count).focus(unread_count);
$("#viewer-refresh").click(unread_count);



function entry_click() {
	if ( typeof entry_click.count == 'undefined' ) entry_click.count = 0;	//static variables
	if ( $("#current-entry .entry-body").length < 1 ) {
		entry_click.count++;
		if ( entry_click.count < 10 ) setTimeout(function(){entry_click()},100);
		else entry_click.count = 0;
		return;
	}
	entry_click.count = 0;

	unread_count();

	if ( $("#stream-view-options-container > div:nth-child(2)").attr("aria-pressed") == "true" ) return;	// 功能只作用在列表顯示模式
	wumii();
	feedburner();
	a_target_blank();
	jump();
	fitheight();
}
$("#entries .entry, #entries-up, #entries-down").live("click",entry_click);

var g_click = false,
	g_click_timer;
$("*:not(input)").live("keyup", function(e){
	if (g_click == true) {
		g_click = false;
		clearTimeout(g_click_timer);
		switch(e.keyCode) {
		case 72:	// h
		case 65:	// a
		case 83:	// s
		case 85:	// u
		case 84:	// t
		case 68:	// d
		case 69:	// e
		case 80:	// p
			delay_fixspace();
			return;
		}
	}
	if (e.keyCode == 71) {
		g_click = true;
		g_click_timer = setTimeout(function(){
			g_click = false;
		},1500);
		return;
	}
	switch(e.keyCode) {
	case 13:	// Enter
	case 32:	// Space
	case 79:	// O
	case 74:	// J
	case 75:	// K
	case 78:	// N
	case 80:	// P
	case 189:	// -
	case 109:	// num-
	case 187:	// =
		entry_click();
		break;
	case 84:	// T
		tags(e);
		break;
	case 82:	// R
	case 49:	// 1
	case 97:	// num1
	case 50:	// 2
	case 98:	// num2
	case 51:	// 3
	case 99:	// num3
		break;
	case 36:	// Home
		if ( $("#current-entry .entry-body").length > 0 ) gototop(e);
		break;
	case 35:	// End
		if ( $("#current-entry .entry-body").length > 0 ) gotobottom(e);
		break;
	case 70:	// F
	case 85:	// U
		fixspace(false);
	default:
		return;
	}
	delay_fixspace();
});