var showingtab = 0;
var educanup = 1;
var cardnum = 0;
var jobwt = [];
var jobjs = [];
var skselectjs = [];
var moneyjs = [];
var skilljs = [];
var chart = [];
var weaponsjs = [];
var save = {};
var jobname = "";
var table_id = ["jl-t", "ts-t", "yd-t", "jn-t", "zd-t", "yl-t", "zs-t"];
var skselectid = ["jiyi", "muyu", "waiyu", "jiashi", "gedou", "sheji", "kexue", "shengcun"];
var uid = 0;
var token = "";

$(function () {
	ra(0, 0, 0, 0, 0, 0, 0, 0);
	uid = GetQueryValue("userid");
	token = GetQueryValue("token");
	console.log(uid);
	console.log(token);
	$.ajax({
		type: "get",
		url: "../coc7/json/all.json",
		async: true,
		success: function (data) {
			skilljs = data.skills[0];
			chart.skills = skilljs;
			chart.zdy = [];
			for (var i = 0; i < table_id.length; i++) {
				setskills(table_id[i], table_id[i]);
			}
			skselectjs = data.skselect[0];
			jobjs = data.job[0];
			setjob();
			weaponsjs = data.weapons[0];
			loadweapons();
			setskillszdy();
			setskillszdy();
		}
	});
	$.ajax({
		type: "get",
		url: "../coc7/json/money.json",
		async: true,
		success: function (data) {
			moneyjs = data;
		}
	});

	rb(0, 0, 0, 0, 0, 0, 0);
	Crop.init({
		id: 'TCrop',
		url: './coc7/php/pic.php',
		allowsuf: ['jpg', 'jpeg', 'png', 'gif'],
		cropParam: {
			minSize: [50, 50],
			maxSize: [400, 400],
			allowSelect: true,
			allowMove: true,
			allowResize: true,
			dragEdges: true,
			onChange: function (c) { },
			onSelect: function (c) { }
		},
		isCrop: true,
		onComplete: function (data) {
			console.log(data);
			var img = new Image();
			img.src = data;
			img.onload = function () {
				console.log(img.width);
				console.log(img.height);
				if (img.width >= img.height) {
					console.log("宽");
					$('#imgtouxiang').css("width", "100%");
					$('#imgtouxiang').css("height", "auto");
				} else {
					console.log("长");
					$('#imgtouxiang').css("height", "100%");
					$('#imgtouxiang').css("width", "auto");
				}
				document.getElementById('imgtouxiang').src = data;
				$("#touxiang").css("display", "none");
			};

		}
	});
	//使用方法

	window.onbeforeunload = function (e) {
		var e = window.event || e;
		e.returnValue = ("离开页面后未保存的信息将会丢失");
	}
});

function GetQueryValue(queryName) {
	var query = decodeURI(window.location.search.substring(1));
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == queryName) {
			return pair[1];
		}
	}
	return null;
}

;
(function (global, $, Crop) {
	var defaultOpt = {
		id: 'TCrop',
		url: './coc7/php/pic.php',
		allowsuf: ['jpg', 'jpeg', 'png', 'gif'],
		cropParam: {
			minSize: [50, 50],
			maxSize: [400, 400],
			allowSelect: true,
			allowMove: true,
			allowResize: true,
			dragEdges: true,
			onChange: function (c) { },
			onSelect: function (c) { }
		},
		isCrop: true,
		onComplete: function (data) {
			console.log(data);
		}
	};
	var jcropApi;

	function _createDom($wrap, opt) {
		$('#TCrop').css("z-index", "1");
		$('#TCrop').css("display", "inline-block");
		$('#TCrop').css("border", "0");
		var accept = 'image/' + opt.allowsuf.join(', image/');
		var $ifr = $('<iframe id="uploadIfr" name="uploadIfr" class="crop-hidden"></iframe>');
		var $form = $('<form action="' + opt.url + '" enctype="multipart/form-data" method="post" target="uploadIfr"/>');
		var $cropDataInp = $('<input type="hidden" name="cropData" id="cropData">');
		var $picker = $('<div class="crop-picker-wrap"><button class="crop-picker" type="button">选择图片</button></div>');
		var $fileInp = $('<input type="file" id="file" name="file" accept="' + accept + '" class="crop-picker-file">');
		$picker.append($fileInp);
		$form.append($cropDataInp).append($picker);
		var $cropWrap = $('<div class="crop-wrapper crop-hidden"/>');
		var $cropArea = $('<div class="crop-area-wrapper"></div>');
		var $cropPreviewWrap = $('<div class="crop-preview-wrapper"></div>');
		var $cropPreview = $('<div class="crop-preview-container"/>');
		$cropPreviewWrap.append($cropPreview);
		var $cropContainer = $('<div class="crop-container"/>').append($cropArea).append($cropPreviewWrap);
		$cropWrap.append($cropContainer);
		var $save = $('<div class="crop-save">保存</div>');
		var $cropCancel = $('<div class="crop-cancel">取消</div>');
		var $cropOpe = $('<div class="crop-operate"/>').append($save).append($cropCancel);
		if (!opt.isCrop) {
			$cropPreviewWrap.addClass('crop-hidden');
		}
		$cropWrap.append($cropOpe);
		$form.append($cropWrap);
		$wrap.append($ifr).append($form);
		return {
			$ifr: $ifr,
			$form: $form,
			$cropDataInp: $cropDataInp,
			$cropPicker: $picker,
			$fileInp: $fileInp,
			$cropWrap: $cropWrap,
			$cropArea: $cropArea,
			$cropPreview: $cropPreview,
			$save: $save,
			$cancel: $cropCancel
		};
	};

	function _bind($cropObj, opt) {
		var $cropPicker = $cropObj.$cropPicker;
		var $fileInp = $cropObj.$fileInp;
		var $save = $cropObj.$save;
		var $cancel = $cropObj.$cancel;
		var $ifr = $cropObj.$ifr;
		$fileInp.change(function (eve) {
			if (!this.value) {
				return;
			}
			var fileSuf = this.value.substring(this.value.lastIndexOf('.') + 1);
			if (!_checkSuf(fileSuf, opt.allowsuf)) {
				alert('只允许上传后缀名为' + opt.allowsuf.join(',') + '的图片');
				return;
			}
			_crop($cropObj, this);
			$cropPicker.addClass('crop-hidden').next().removeClass('crop-hidden');
		});
		$save.click(function (eve) {
			eve.preventDefault();
			Crop.upload();
		});
		$cancel.click(function (eve) {
			eve.preventDefault();
			Crop.cancel();
		});
		window.setTimeout(function () {
			$ifr.load(function () {
				var body = this.contentWindow.document.body;
				var text = body.innerText;
				opt.onComplete(text);
			});
		}, 100);
	};

	function _checkSuf(fileSuf, suffixs) {
		for (var i = 0, j = suffixs.length; i < j; i++) {
			if (fileSuf.toLowerCase() == suffixs[i].toLowerCase()) {
				return true;
			}
		}
		return false;
	};

	function _crop($cropObj, fileInp) {
		var cropArea = $cropObj.$cropArea.get(0);
		var cropPreview = $cropObj.$cropPreview.get(0);
		var opt = _getOpt();
		var jcropOpt = opt.cropParam;
		cropArea.innerHTML = '';
		if (fileInp.files && fileInp.files[0]) {
			var img = document.createElement('img');
			img.style.visibility = 'hidden';
			cropArea.appendChild(img);
			img.onload = function () {
				var scaleOpt = _getScale(cropArea.clientWidth, cropArea.clientHeight, img.offsetWidth, img.offsetHeight);
				img.setAttribute('style', 'position: absolute;visibility: visible;width: ' + scaleOpt.w + 'px;height: ' + scaleOpt.h + 'px');
				if (!opt.isCrop) {
					return;
				}
				var cropPreviewImg = img.cloneNode(true);
				cropPreview.appendChild(cropPreviewImg);
				_startCrop(img, jcropOpt);
				Crop.ratio = scaleOpt.scale;
				Crop.cropPreview = {
					cropAreaImg: img,
					cropPreviewImg: cropPreviewImg
				};
			};
			var fr = new FileReader();
			fr.onload = function (eve) {
				img.src = eve.target.result;
			}
			fr.readAsDataURL(fileInp.files[0]);
		} else {
			var img = document.createElement('div');
			img.style.visibility = 'hidden';
			img.style.width = '100%';
			img.style.height = '100%';
			cropArea.appendChild(img);
			fileInp.select();
			var src = document.selection.createRange().text;
			var img_filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src='" + src + "')";
			img.style.filter = img_filter;
			window.setTimeout(function () {
				_loadFiter(cropArea, img);
			}, 100);
		}
	};

	function _loadFiter(cropArea, img) {
		var time = 0;
		if (img.offsetWidth != cropArea.clientWidth) {
			_filterCrop(cropArea, img);
		} else {
			time++;
			if (time < 20) {
				window.setTimeout(function () {
					_loadFiter(cropArea, img);
				}, 100);
			} else {
				alert('图片加载失败，请重试！');
			}
		}
	};

	function _filterCrop(cropArea, img) {
		var scaleOpt = _getScale(cropArea.clientWidth, cropArea.clientHeight, img.offsetWidth, img.offsetHeight);
		var s_filter = img.style.filter.replace(/sizingMethod='image'/g, "sizingMethod='scale'");
		var jcropOpt = _getOpt().cropParam;
		img.setAttribute('style', 'position: absolute;visibility: visible;width: ' + scaleOpt.w + 'px;height: ' + scaleOpt.h + 'px;filter: ' + s_filter);
		if (!_getOpt().isCrop) {
			return;
		}
		var cropPreview = cropArea.nextSibling.firstChild;
		var cropPreviewImg = img.cloneNode(true);
		cropPreview.appendChild(cropPreviewImg);
		_startCrop(img, jcropOpt);
		Crop.ratio = scaleOpt.scale;
		Crop.cropPreview = {
			cropAreaImg: img,
			cropPreviewImg: cropPreviewImg
		};
	};

	function _startCrop(img, jcropOpt) {
		var imgW = img.offsetWidth;
		var imgH = img.offsetHeight;
		var minW = jcropOpt.minSize[0],
			minH = jcropOpt.minSize[1];
		var offsetWidth = (imgW / 2) - (minW / 2);
		var offsetHeight = (imgH / 2) - (minH / 2);
		var obj = {
			x: offsetWidth,
			y: offsetHeight,
			x2: offsetWidth + minW,
			y2: offsetHeight + minH,
			w: minW,
			h: minH
		};
		$(img).Jcrop(jcropOpt, function () {
			jcropApi = this;
			this.animateTo([obj.x, obj.y, obj.x2, obj.y2]);
		});
	};

	function _getOpt() {
		var id = Crop.crop.id;
		var cropDom = document.getElementById(id);
		var opt = $.data(cropDom, 'crop').opt;
		return opt;
	};

	function _getScale(vw, vh, sw, sh) {
		vw = Number(vw);
		vh = Number(vh);
		sw = Number(sw);
		sh = Number(sh);
		if (vw <= 0 || vh <= 0) {
			console.log('参数不能为0');
			return false;
		}
		var wScale = sw / vw;
		var hScale = sh / vh;
		var scale = 1,
			w, h;
		if (wScale > hScale) {
			scale = wScale;
			w = vw;
			h = sh / scale;
		} else {
			scale = hScale;
			h = vh;
			w = sw / scale;
		}
		return {
			scale: scale,
			w: w,
			h: h
		};
	};

	function _updatePreview(c) {
		var cropAreaImg = Crop.cropPreview.cropAreaImg;
		var cropPreviewImg = Crop.cropPreview.cropPreviewImg;
		var $cropObj = $.data(document.getElementById(Crop.crop.id), 'crop').$cropObj;
		var $cropDataInp = $cropObj.$cropDataInp;
		var $cropPreview = $cropObj.$cropPreview;
		var $previewParent = $cropPreview.parent();
		var vw = $previewParent.width(),
			vh = $previewParent.height();
		var scaleOpt = _getScale(vw, vh, c.w, c.h);
		$cropPreview.width(scaleOpt.w);
		$cropPreview.height(scaleOpt.h);
		var width = $(cropAreaImg).width() / scaleOpt.scale;
		var height = $(cropAreaImg).height() / scaleOpt.scale;
		var top = -(c.y / scaleOpt.scale);
		var left = -(c.x / scaleOpt.scale);
		cropPreviewImg.style.width = width + 'px';
		cropPreviewImg.style.height = height + 'px';
		cropPreviewImg.style.top = top + 'px';
		cropPreviewImg.style.left = left + 'px';
		_setCropData($cropDataInp, c);
	};

	function _setCropData($cropDataInp, c) {
		var ratio = Crop.ratio;
		var data = {
			x: c.x * ratio,
			y: c.y * ratio,
			w: c.w * ratio,
			h: c.h * ratio
		};
		var dataJson = JSON.stringify(data);
		$cropDataInp.val(dataJson);
	};

	function _extendOpt(opt) {
		opt = $.extend(true, {}, defaultOpt, opt);
		var select = opt.cropParam.onSelect;
		var change = opt.cropParam.onChange;
		if (Object.prototype.toString.call(select) == '[object Function]') {
			opt.cropParam.onSelect = function (c) {
				_updatePreview.call(jcropApi, c);
				select.call(jcropApi, c);
			};
		} else {
			opt.cropParam.onSelect = _updatePreview;
		}
		if (Object.prototype.toString.call(change) == '[object Function]') {
			opt.cropParam.onChange = function (c) {
				_updatePreview.call(jcropApi, c);
				change.call(jcropApi, c);
			}
		} else {
			opt.cropParam.onChange = _updatePreview;
		}
		return opt;
	};

	function init(opt) {
		var opt = _extendOpt(opt);
		var $uploadCropWrap = $('#' + opt.id);
		var hasDom = true;
		if ($uploadCropWrap.length == 0) {
			$uploadCropWrap = $('<div id="' + opt.id + '" />');
			hasDom = false;
		}
		$uploadCropWrap.html('');
		var $cropObj = _createDom($uploadCropWrap, opt);
		$.data($uploadCropWrap.get(0), 'crop', {
			opt: opt,
			$cropObj: $cropObj
		});
		hasDom || $('body').append($uploadCropWrap);
		_bind($cropObj, opt);
		Crop.crop = {
			id: opt.id,
			hasDom: hasDom
		};
	};

	function upload() {
		var id = (Crop.crop && Crop.crop.id) || '';
		console.log(id);
		var dom = document.getElementById(id);
		if (!dom) {
			return;
		}
		var form = $.data(dom, 'crop').$cropObj.$form.get(0);
		var size = document.getElementById('cropData').value;
		console.log(size);
		console.log(form);
		form.submit();
		setTimeout(cancel(), 200);
	};

	function cancel() {
		var id = (Crop.crop && Crop.crop.id) || "";
		var dom = document.getElementById(id);
		if (!dom) {
			return;
		}
		var $cropObj = $.data(dom, 'crop').$cropObj;
		$cropObj.$cropWrap.addClass('crop-hidden');
		$cropObj.$cropPicker.removeClass('crop-hidden');
	};

	function destroy() {
		var crop = Crop.crop || {};
		var $cropWrap = $('#' + crop.id);
		if (crop.hasDom === true) {
			$cropWrap.html('');
		} else {
			$cropWrap.remove();
		}
	};

	if ($.isEmptyObject(Crop)) {
		global.Crop = Crop = {
			init: init,
			upload: upload,
			cancel: cancel,
			destroy: destroy,
			crop: {}
		};
	} else {
		Crop = $.extend(Crop, {
			init: init,
			upload: upload,
			cancel: cancel,
			destroy: destroy,
			crop: {}
		});
	}
})(window, jQuery, window.Crop || {});


function setjob() {
	var sj = document.getElementById('career1');
	for (var i = 0; i < jobjs.length; i++) {
		var result = "<option value='" + i + "'>" + jobjs[i].job + "</option>";
		$('#career1').append(result);
	}
	chart.job = jobjs[0];
	jobname = chart.job.job;
	setskills_bz(chart);
	firstbz();
	selectall();
	document.getElementById('proskill').innerHTML = chart.job.intro[0].proskill;
	document.getElementById('honesty').innerHTML = chart.job.intro[0].honesty;
	document.getElementById('propoint').innerHTML = chart.job.intro[0].propoint;
};

function changejob(num) {
	chart.job = jobjs[num];
	jobname = chart.job.job;
	setskills_bz(chart);
	for (var i = 0; i < table_id.length; i++) {
		setskills(table_id[i], table_id[i]);
	}
	document.getElementById('proskill').innerHTML = chart.job.intro[0].proskill;
	document.getElementById('honesty').innerHTML = chart.job.intro[0].honesty;
	if (chart.job.intro[0].honesty != "自定义") {
		document.getElementById('propoint').innerHTML = chart.job.intro[0].propoint;
	} else {
		document.getElementById('propoint').innerHTML = "<select id='propointzd' onchange='setskpoint()'><option>请选择</option></select>";
		var pro = ["教育*4", "教育*2+敏捷*2", "教育*2+力量*2", "教育*2+外貌*2", "教育*2+意志*2"]
		for (var i = 0; i < pro.length; i++) {
			var result = "<option value='" + i + "'>" + pro[i] + "</option>";
			$('#propointzd').append(result);
		}
		var zdy = prompt("请输入职业名");
		var zdy_op = "<option selected value='113'>" + zdy + "</option>";
		$('#career1').append(zdy_op);
	}
	firstbz();
	setskpoint();
	selectclear();
	selectall();
	loadinchart();
	var d = document.getElementById("dex").value;
	var h = document.getElementById("edu").value;
	setedu(h);
	setdex(d);
};

function rec() {
	var num1 = ran1();
	var num2 = ran1();
	var num3 = ran2();
	var num4 = ran1();
	var num5 = ran1();
	var num6 = ran2();
	var num7 = ran1();
	var num8 = ran2();
	var num9 = ran1();
	document.getElementById("str").value = num1;
	document.getElementById("con").value = num2;
	document.getElementById("siz").value = num3;
	document.getElementById("dex").value = num4;
	document.getElementById("app").value = num5;
	document.getElementById("int").value = num6;
	document.getElementById("pow").value = num7;
	document.getElementById("edu").value = num8;
	document.getElementById("luck").value = num9;

	for (var i = 0; i < 4; i++) {
		ra(0, 0, 0, 0, 0, 0, 0, 0);
	}
	ra(num1, num2, num3, num4, num5, num6, num7, num8);
	setskpoint();
	setedu(num8);
	setdex(num4);
	setelse();
	document.getElementById("attrtotal").innerHTML = num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8;
};

function re() {
	var a = document.getElementById("str").value;
	var b = document.getElementById("con").value;
	var c = document.getElementById("siz").value;
	var d = document.getElementById("dex").value;
	var e = document.getElementById("app").value;
	var f = document.getElementById("int").value;
	var g = document.getElementById("pow").value;
	var h = document.getElementById("edu").value;
	var arr = [Number(a), Number(b), Number(c), Number(d), Number(e), Number(f), Number(g), Number(h)];
	if (Number(a) > 100 || Number(b) > 100 || Number(c) > 100 || Number(d) > 100 || Number(e) > 100 || Number(f) > 100 || Number(g) > 100 || Number(h) > 100) {
		if (confirm("数值超出范围,是否确认?")) {
			setedu(h);
			setdex(d);
			for (var i = 0; i < 4; i++) {
				ra(0, 0, 0, 0, 0, 0, 0, 0);
			}
			ra(a, b, c, d, e, f, g, h);
			setskpoint();
			setelse();
			document.getElementById("attrtotal").innerHTML = Number(a) + Number(b) + Number(c) + Number(d) + Number(e) + Number(f) + Number(g) + Number(h);
		} else {
			var max = 0;
			var ch = 0;
			for (var i = 0; i < 8; i++) {
				if (arr[i] > max) {
					max = arr[i];
					ch = i;
				}
			}
			arr[ch] = "";
			document.getElementById("str").value = arr[0];
			document.getElementById("con").value = arr[1];
			document.getElementById("siz").value = arr[2];
			document.getElementById("dex").value = arr[3];
			document.getElementById("app").value = arr[4];
			document.getElementById("int").value = arr[5];
			document.getElementById("pow").value = arr[6];
			document.getElementById("edu").value = arr[7];
			re();
		}
	} else {
		setedu(h);
		setdex(d);
		for (var i = 0; i < 4; i++) {
			ra(0, 0, 0, 0, 0, 0, 0, 0);
		}
		ra(a, b, c, d, e, f, g, h);
		setskpoint();
		setelse();
		document.getElementById("attrtotal").innerHTML = Number(a) + Number(b) + Number(c) + Number(d) + Number(e) + Number(f) + Number(g) + Number(h);
	}
};

$(attribute);

function attribute() {
	var $mainhide = $(".mainhide2");
	$mainhide.hide();
	var $ranBtn = $("#ran");
	var $togBtn = $("#tog");
	var $wasteBtn = $("#wastecan");
	$togBtn.click(function () {
		if ($mainhide.is(":visible")) {
			$mainhide.hide();
			$("#tog>img").attr("src", "./coc7/img/stretching.jpg")
		} else {
			$mainhide.show();
			$("#tog>img").attr("src", "./coc7/img/shrink.jpg")
		}
	})
	$ranBtn.click(function () {
		var tab = document.getElementById('ranature');
		var len = tab.rows.length;
		var row = tab.insertRow(len);
		var cell1 = row.insertCell(0);
		cell1.innerHTML = $("#str").val();
		var cell2 = row.insertCell(1);
		cell2.innerHTML = $("#con").val();
		var cell3 = row.insertCell(2);
		cell3.innerHTML = $("#siz").val();
		var cell4 = row.insertCell(3);
		cell4.innerHTML = $("#dex").val();;
		var cell5 = row.insertCell(4);
		cell5.innerHTML = $("#app").val();
		var cell6 = row.insertCell(5);
		cell6.innerHTML = $("#int").val();
		var cell7 = row.insertCell(6);
		cell7.innerHTML = $("#pow").val();
		var cell8 = row.insertCell(7);
		cell8.innerHTML = $("#edu").val();
		var cell9 = row.insertCell(8);
		cell9.innerHTML = Number($("#str").val()) + Number($("#con").val()) + Number($("#siz").val()) + Number($("#dex").val()) + Number($("#app").val()) + Number($("#int").val()) + Number($("#pow").val()) + Number($("#edu").val());
		var cell10 = row.insertCell(9);
		cell10.innerHTML = "<input type='radio' name='ranselect' value='" + len + "' onclick='changeransele(this.value)' />";
	})

};

function changeransele(num) {
	var tab = document.getElementById('ranature');
	var row = tab.rows[num];
	var cell = row.cells;
	$("#str").val(cell[0].innerHTML);
	$("#con").val(cell[1].innerHTML);
	$("#siz").val(cell[2].innerHTML);
	$("#dex").val(cell[3].innerHTML);
	$("#app").val(cell[4].innerHTML);
	$("#int").val(cell[5].innerHTML);
	$("#pow").val(cell[6].innerHTML);
	$("#edu").val(cell[7].innerHTML);
	re();
};

$(tab);

function tab() {
	$("#bz").show().siblings().hide();
	$(".menu div").click(function () {
		var i = $(this).index();
		showingtab = i;
		$(this).addClass('select').siblings().removeClass('select');
		$('.menudiv div').eq(i).show().siblings().hide();
	});
}

$(instruction);

function instruction() {
	var $mainhide = $(".mainhide3");
	$mainhide.hide();
	var $togBtn = $("#togg");
	$togBtn.click(function () {
		if ($mainhide.is(":visible")) {
			$mainhide.hide();
			$("#togg>img").attr("src", "./coc7/img/stretching.jpg")
		} else {
			$mainhide.show();
			$("#togg>img").attr("src", "./coc7/img/shrink.jpg")
		}
	});
};

function checknum(tableid, cellname) {
	var bzc_c = -1;
	switch (tableid) {
		case "jl-t":
			bzc_c += Number(cellname);
			break;
		case "ts-t":
			bzc_c += Number(skilljs[table_id[0]].length);
			bzc_c += Number(cellname);
			break;
		case "yd-t":
			bzc_c += Number(skilljs[table_id[0]].length);
			bzc_c += Number(skilljs[table_id[1]].length);
			bzc_c += Number(cellname);
			break;
		case "jn-t":
			bzc_c += Number(skilljs[table_id[0]].length);
			bzc_c += Number(skilljs[table_id[1]].length);
			bzc_c += Number(skilljs[table_id[2]].length);
			bzc_c += Number(cellname);
			break;
		case "zd-t":
			bzc_c += Number(skilljs[table_id[0]].length);
			bzc_c += Number(skilljs[table_id[1]].length);
			bzc_c += Number(skilljs[table_id[2]].length);
			bzc_c += Number(skilljs[table_id[3]].length);
			bzc_c += Number(cellname);
			break;
		case "yl-t":
			bzc_c += Number(skilljs[table_id[0]].length);
			bzc_c += Number(skilljs[table_id[1]].length);
			bzc_c += Number(skilljs[table_id[2]].length);
			bzc_c += Number(skilljs[table_id[3]].length);
			bzc_c += Number(skilljs[table_id[4]].length);
			bzc_c += Number(cellname);
			break;
		case "zs-t":
			bzc_c += Number(skilljs[table_id[0]].length);
			bzc_c += Number(skilljs[table_id[1]].length);
			bzc_c += Number(skilljs[table_id[2]].length);
			bzc_c += Number(skilljs[table_id[3]].length);
			bzc_c += Number(skilljs[table_id[4]].length);
			bzc_c += Number(skilljs[table_id[5]].length);
			bzc_c += Number(cellname);
			break;
		case "qt-t":
			bzc_c += Number(skilljs[table_id[0]].length);
			bzc_c += Number(skilljs[table_id[1]].length);
			bzc_c += Number(skilljs[table_id[2]].length);
			bzc_c += Number(skilljs[table_id[3]].length);
			bzc_c += Number(skilljs[table_id[4]].length);
			bzc_c += Number(skilljs[table_id[5]].length);
			bzc_c += Number(skilljs[table_id[6]].length);
			bzc_c += Number(cellname);
			break;
	}
	return (bzc_c);
};

function changesum(cell, tableid, cellname) {
	var sum = 0;
	sum += Number(cell[1].innerHTML);
	for (var i = 1; i < 4; i++) {
		var nam = tableid + '-' + cellname + '-' + i;
		var ce = document.getElementById(nam).value;
		sum += Number(ce);
	}

	cell[5].innerHTML = sum;
	cell[6].innerHTML = hardsucc(sum);
	cell[7].innerHTML = sohardsucc(sum);
};

function changesum2(cell, tableid, cellname) {
	var sum = 0;
	sum += Number(cell[2].innerHTML);
	for (var i = 1; i < 4; i++) {
		var nam = tableid + '-' + cellname + '-' + i;
		var ce = document.getElementById(nam).value;
		sum += Number(ce);
	}
	cell[6].innerHTML = sum;
	cell[7].innerHTML = hardsucc(sum);
	cell[8].innerHTML = sohardsucc(sum);
};

function hardsucc(data) {
	var hs_d = 0;
	if (Number(data) > 1) {
		hs_d = parseInt(Number(data) / 2);
	} else {
		hs_d = Number(data);
	}
	return (hs_d);
};

function sohardsucc(data) {
	var shs_d = 0;
	if (Number(data) > 3) {
		shs_d = parseInt(Number(data) / 5);
	} else if (Number(data) > 0) {
		shs_d = 1;
	} else {
		shs_d = 0;
	}
	return (shs_d);
};

function sleep(numberMillis) {
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true) {
		now = new Date();
		if (now.getTime() > exitTime)
			return;
	}
};

function ran1() {
	var numran = 0;
	for (var i = 0; i < 3; i++) {
		numran += Math.floor(Math.random() * 6 + 1);
		sleep(5);
	}
	numran = numran * 5;
	return (numran);
};

function ran2() {
	var numran = 0;
	for (var i = 0; i < 2; i++) {
		numran += Math.floor(Math.random() * 6 + 1);
		sleep(5);
	}
	numran += 6;
	numran = numran * 5;
	return (numran);
};

function setskpoint() {
	var a = document.getElementById("str").value;
	var b = document.getElementById("con").value;
	var c = document.getElementById("siz").value;
	var d = document.getElementById("dex").value;
	var e = document.getElementById("app").value;
	var f = document.getElementById("int").value;
	var g = document.getElementById("pow").value;
	var h = document.getElementById("edu").value;
	var arr = [a, b, c, d, e, f, g, h];
	var sum = 0;
	var promax = 0;
	var ins = 0;
	if (document.getElementById("career1").value != 113) {
		for (var i = 0; i < chart.job.pro.length; i++) {
			sum = 0;
			for (var j = 0; j < chart.job.pro[i].length; j++) {
				sum += arr[j] * chart.job.pro[i][j]
			}
			if (sum > promax) {
				promax = sum
			}
		}
	} else {
		var k = document.getElementById("propointzd").value;
		if (k != "请选择") {
			var brr = [
				[0, 0, 0, 0, 0, 0, 0, 4],
				[0, 0, 0, 2, 0, 0, 0, 2],
				[2, 0, 0, 0, 0, 0, 0, 2],
				[0, 0, 0, 0, 2, 0, 0, 2],
				[0, 0, 0, 0, 0, 0, 2, 2]
			];
			var crr = ["教育*4", "教育*2+敏捷*2", "教育*2+力量*2", "教育*2+外貌*2", "教育*2+意志*2"];
			for (var i = 0; i < brr[k].length; i++) {
				sum += brr[k][i] * arr[i];
			}
			chart.job.pro[0] = brr[k];
			chart.job.intro[0].propoint = crr[k];
			promax = sum;
		}
	}
	ins = arr[5] * 2;
	$('#pro_have').text(promax);
	$('#ins_have').text(ins);
	loadinchart();
};

function setdex(dex) {
	var bztab = ['bz-t', 'bz-t-t', 'bz-t-f-o', 'bz-t-f-t', 'bz-t-a'];
	for (var i = 0; i < bztab.length; i++) {
		var table = document.getElementById(bztab[i]);
		var row = table.rows;
		for (var j = 1; j < row.length; j++) {
			var cell = row[j].cells[0];
			if (cell.innerHTML == "闪避") {
				if (i != 0 && i != 4) {
					row[j].cells[6].innerHTML = row[j].cells[6].innerHTML - row[j].cells[1].innerHTML + parseInt(Number(dex) / 2);
					row[j].cells[7].innerHTML = hardsucc(Number(row[j].cells[6].innerHTML));
					row[j].cells[8].innerHTML = sohardsucc(Number(row[j].cells[6].innerHTML));
					row[j].cells[1].innerHTML = parseInt(Number(dex) / 2);
				} else {
					row[j].cells[5].innerHTML = row[j].cells[5].innerHTML - row[j].cells[1].innerHTML + parseInt(Number(dex) / 2);
					row[j].cells[6].innerHTML = hardsucc(Number(row[j].cells[5].innerHTML));
					row[j].cells[7].innerHTML = sohardsucc(Number(row[j].cells[5].innerHTML));
					row[j].cells[1].innerHTML = parseInt(Number(dex) / 2);
				}
			}
		}
	}
	var zdtab = document.getElementById('zd-t');
	var row = zdtab.rows[7];
	var cell = row.cells;
	cell[5].innerHTML = cell[5].innerHTML - cell[1].innerHTML + parseInt(Number(dex) / 2);
	cell[6].innerHTML = hardsucc(Number(cell[5].innerHTML));
	cell[7].innerHTML = sohardsucc(Number(cell[5].innerHTML));
	cell[1].innerHTML = parseInt(Number(dex) / 2);
};

function setedu(edu) {
	var bztab = ['bz-t', 'bz-t-t', 'bz-t-f-o', 'bz-t-f-t', 'bz-t-a'];
	for (var i = 0; i < bztab.length; i++) {
		var table = document.getElementById(bztab[i]);
		var row = table.rows;
		for (var j = 1; j < row.length; j++) {
			var cell = row[j].cells[0];
			if (cell.innerHTML.indexOf("母语") != -1) {
				if (i != 0 && i != 4) {
					row[j].cells[6].innerHTML = row[j].cells[6].innerHTML - row[j].cells[2].innerHTML + parseInt(Number(edu));
					row[j].cells[7].innerHTML = hardsucc(Number(row[j].cells[6].innerHTML));
					row[j].cells[8].innerHTML = sohardsucc(Number(row[j].cells[6].innerHTML));
					row[j].cells[2].innerHTML = parseInt(Number(edu));
				} else {
					row[j].cells[5].innerHTML = row[j].cells[5].innerHTML - row[j].cells[1].innerHTML + parseInt(Number(edu));
					row[j].cells[6].innerHTML = hardsucc(Number(row[j].cells[5].innerHTML));
					row[j].cells[7].innerHTML = sohardsucc(Number(row[j].cells[5].innerHTML));
					row[j].cells[1].innerHTML = parseInt(Number(edu));
				}
			}
		}
	}
	var zdtab = document.getElementById('jl-t');
	var row = zdtab.rows[7];
	var cell = row.cells;
	cell[5].innerHTML = cell[5].innerHTML - cell[1].innerHTML + parseInt(Number(edu));
	cell[6].innerHTML = hardsucc(Number(cell[5].innerHTML));
	cell[7].innerHTML = sohardsucc(Number(cell[5].innerHTML));
	cell[1].innerHTML = parseInt(Number(edu));
};

function changesk(tableid, cellid, cellname) {
	var changes = document.getElementById(tableid);
	var rowc = changes.rows[cellname];
	var cell = rowc.cells;
	var celled = document.getElementById(cellid);
	if (tableid.indexOf("bz") == -1) {
		var bzc_checkbox = checknum(tableid, cellname);
		var bzc = document.getElementsByName('bzc');
		var bzc_len = bzc.length;
		if (cellid.charAt(cellid.length - 1) == 2) {
			console.log(cellid.charAt(cellid.length - 1));
			var newbzsk = 1;
			if (chart.job.skills != undefined) {
				for (var i = 0; i < chart.job.skills.length; i++) {
					if (chart.job.skills[i].kind == skilljs[tableid][Number(cellname) - 1].kind && chart.job.skills[i].num == skilljs[tableid][Number(cellname) - 1].num) {
						var a = 'bz-t';
						var b = i + 1;
						var bztab = document.getElementById(a);
						var bzcell = bztab.rows[b].cells;
						var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
						var bzchange = document.getElementById(bzid);
						bzchange.value = celled.value;
						changesum(bzcell, a, b);
						newbzsk = 0;
					}
				}
			}
			if (chart.job.two != undefined) {
				for (var i = 0; i < chart.job.two.length; i++) {
					if (chart.job.two[i].okind == skilljs[tableid][Number(cellname) - 1].kind && chart.job.two[i].onum == skilljs[tableid][Number(cellname) - 1].num) {
						var a = 'bz-t-t';
						var b = 2 * i + 1;
						var bztab = document.getElementById(a);
						var bzcell = bztab.rows[b].cells;
						var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
						var bzchange = document.getElementById(bzid);
						bzchange.value = celled.value;
						changesum2(bzcell, a, b);
						changesk(a, bzid, b);
						newbzsk = 0;
					} else if (chart.job.two[i].tkind == skilljs[tableid][Number(cellname) - 1].kind && chart.job.two[i].tnum == skilljs[tableid][Number(cellname) - 1].num) {
						var a = 'bz-t-t';
						var b = 2 * i + 2;
						var bztab = document.getElementById(a);
						var bzcell = bztab.rows[b].cells;
						var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
						var bzchange = document.getElementById(bzid);
						bzchange.value = celled.value;
						changesum2(bzcell, a, b);
						changesk(a, bzid, b);
						newbzsk = 0;
					}
				}
			}
			var tablefo = document.getElementById('bz-t-f-o');
			var forow = tablefo.rows;
			for (var i = 1; i < forow.length; i++) {
				var c1 = forow[i].cells[0];
				if (c1.innerHTML == cell[0].innerHTML) {
					var a = 'bz-t-f-o';
					var b = i;
					var bztab = document.getElementById(a);
					var bzcell = bztab.rows[b].cells;
					var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
					var bzchange = document.getElementById(bzid);
					bzchange.value = celled.value;
					changesum2(bzcell, a, b);
					changesk(a, bzid, b)
					newbzsk = 0;
				}
			}
			var tableft = document.getElementById('bz-t-f-t');
			var ftrow = tableft.rows;
			for (var i = 1; i < ftrow.length; i++) {
				var c1 = ftrow[i].cells[0];
				if (c1.innerHTML == cell[0].innerHTML) {
					var a = 'bz-t-f-t';
					var b = i;
					var bztab = document.getElementById(a);
					var bzcell = bztab.rows[b].cells;
					var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
					var bzchange = document.getElementById(bzid);
					bzchange.value = celled.value;
					changesum2(bzcell, a, b);
					changesk(a, bzid, b)
					newbzsk = 0;
				}
			}
			var tablea = document.getElementById('bz-t-a');
			var arow = tablea.rows;
			for (var i = 1; i < arow.length; i++) {
				var c1 = arow[i].cells[0];
				if (c1.innerHTML == cell[0].innerHTML) {
					var a = 'bz-t-a';
					var b = i;
					var bztab = document.getElementById(a);
					var bzcell = bztab.rows[b].cells;
					var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
					var bzchange = document.getElementById(bzid);
					bzchange.value = celled.value;
					changesum(bzcell, a, b);
					changesk(a, bzid, b);
					newbzsk = 0;
				}
			}
			var nu = 0;
			var taball = document.getElementById('bz-t-a');
			var rowall = taball.rows;
			for (var i = 0; i < rowall.length; i++) {
				if (rowall[i].cells[0].innerHTML == "") {
					nu = 1;
					break;
				}
			}
			if (nu == 1 && newbzsk == 1 && celled.value != 0) {
				changesum(cell, tableid, cellname);
				bzc[bzc_checkbox].checked = true;
				changecheck(tableid, cellname);
			} else if (newbzsk == 0 && celled.value == 0) {
				changesum(cell, tableid, cellname);
				bzc[bzc_checkbox].checked = false;
				changecheck(tableid, cellname);
			} else if (newbzsk == 0) {
				changesum(cell, tableid, cellname);
			} else {
				celled.value = 0;
				changesum(cell, tableid, cellname);
				alert("已选满本职技能");
			}
		} else {
			changesum(cell, tableid, cellname);
			if (chart.job.skills != undefined) {
				for (var i = 0; i < chart.job.skills.length; i++) {
					if (chart.job.skills[i].kind == skilljs[tableid][Number(cellname) - 1].kind && chart.job.skills[i].num == skilljs[tableid][Number(cellname) - 1].num) {
						var a = 'bz-t';
						var b = i + 1;
						var bztab = document.getElementById(a);
						var bzcell = bztab.rows[b].cells;
						var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
						var bzchange = document.getElementById(bzid);
						bzchange.value = celled.value;
						changesum(bzcell, a, b);
					}
				}
			}
			if (chart.job.two != undefined) {
				for (var i = 0; i < chart.job.two.length; i++) {
					if (chart.job.two[i].okind == skilljs[tableid][Number(cellname) - 1].kind && chart.job.two[i].onum == skilljs[tableid][Number(cellname) - 1].num) {
						var a = 'bz-t-t';
						var b = 2 * i + 1;
						var bztab = document.getElementById(a);
						var bzcell = bztab.rows[b].cells;
						var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
						var bzchange = document.getElementById(bzid);
						bzchange.value = celled.value;
						changesum2(bzcell, a, b);
					} else if (chart.job.two[i].tkind == skilljs[tableid][Number(cellname) - 1].kind && chart.job.two[i].tnum == skilljs[tableid][Number(cellname) - 1].num) {
						var a = 'bz-t-t';
						var b = 2 * i + 2;
						var bztab = document.getElementById(a);
						var bzcell = bztab.rows[b].cells;
						var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
						var bzchange = document.getElementById(bzid);
						bzchange.value = celled.value;
						changesum2(bzcell, a, b);
					}
				}
			}
			var tablefo = document.getElementById('bz-t-f-o');
			var forow = tablefo.rows;
			for (var i = 1; i < forow.length; i++) {
				var c1 = forow[i].cells[0];
				if (c1.innerHTML == cell[0].innerHTML) {
					var a = 'bz-t-f-o';
					var b = i;
					var bztab = document.getElementById(a);
					var bzcell = bztab.rows[b].cells;
					var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
					var bzchange = document.getElementById(bzid);
					bzchange.value = celled.value;
					changesum2(bzcell, a, b);
				}
			}
			var tableft = document.getElementById('bz-t-f-t');
			var ftrow = tableft.rows;
			for (var i = 1; i < ftrow.length; i++) {
				var c1 = ftrow[i].cells[0];
				if (c1.innerHTML == cell[0].innerHTML) {
					var a = 'bz-t-f-t';
					var b = i;
					var bztab = document.getElementById(a);
					var bzcell = bztab.rows[b].cells;
					var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
					var bzchange = document.getElementById(bzid);
					bzchange.value = celled.value;
					changesum2(bzcell, a, b);
				}
			}
			var tablea = document.getElementById('bz-t-a');
			var arow = tablea.rows;
			for (var i = 1; i < arow.length; i++) {
				var c1 = arow[i].cells[0];
				if (c1.innerHTML == cell[0].innerHTML) {
					var a = 'bz-t-a';
					var b = i;
					var bztab = document.getElementById(a);
					var bzcell = bztab.rows[b].cells;
					var bzid = a + '-' + b + '-' + cellid.charAt(cellid.length - 1);
					var bzchange = document.getElementById(bzid);
					bzchange.value = celled.value;
					changesum(bzcell, a, b);
					changesk(a, bzid, b);
				}
			}
		}
	} else if (tableid == 'bz-t') {
		var sameskid = chart.job.skills[cellname - 1].kind + '-' + chart.job.skills[cellname - 1].num + '-' + cellid.charAt(cellid.length - 1);
		var sameskcell = document.getElementById(sameskid);
		sameskcell.value = celled.value;
		var samesktab = document.getElementById(chart.job.skills[cellname - 1].kind);
		var sameskrow = samesktab.rows[Number(chart.job.skills[cellname - 1].num)];
		var sameskcell = sameskrow.cells;
		changesum(sameskcell, chart.job.skills[cellname - 1].kind, chart.job.skills[cellname - 1].num);
		changesum(cell, tableid, cellname);
	} else if (tableid == 'bz-t-t') {
		var g = Math.ceil(cellname / 2);
		if (cellid.charAt(cellid.length - 1) == 2) {
			var bzc = document.getElementsByName('bzc');
			var group = String.fromCharCode(64 + g);
			var nam = tableid + '-' + group;
			var rad = document.getElementsByName(nam);
			if (cellname % 2 != 0) {
				var line = Number(cellname) + 1;
				var otherskid = tableid + '-' + line + '-' + 2;
				var othersk = document.getElementById(otherskid);
				othersk.value = 0;
				changesum2(cell, tableid, cellname);
				var row2 = changes.rows[line];
				var cell2 = row2.cells;
				changesum2(cell2, tableid, line);
				var sameskido = chart.job.two[g - 1].okind + '-' + chart.job.two[g - 1].onum + '-' + cellid.charAt(cellid.length - 1);
				var sameskcello = document.getElementById(sameskido);
				sameskcello.value = celled.value;
				var samesktabo = document.getElementById(chart.job.two[g - 1].okind);
				var sameskrowo = samesktabo.rows[Number(chart.job.two[g - 1].onum)];
				var sameskcello = sameskrowo.cells;
				changesum(sameskcello, chart.job.two[g - 1].okind, chart.job.two[g - 1].onum);
				var sameskbzco = checknum(chart.job.two[g - 1].okind, chart.job.two[g - 1].onum);
				var sameskidt = chart.job.two[g - 1].tkind + '-' + chart.job.two[g - 1].tnum + '-' + cellid.charAt(cellid.length - 1);
				var sameskcellt = document.getElementById(sameskidt);
				sameskcellt.value = othersk.value;
				var samesktabt = document.getElementById(chart.job.two[g - 1].tkind);
				var sameskrowt = samesktabt.rows[Number(chart.job.two[g - 1].tnum)];
				var sameskcellt = sameskrowt.cells;
				changesum(sameskcellt, chart.job.two[g - 1].tkind, chart.job.two[g - 1].tnum);
				var sameskbzct = checknum(chart.job.two[g - 1].tkind, chart.job.two[g - 1].tnum);
				if (celled.value != 0) {
					rad[0].checked = true;
					rad[1].checked = false;
					bzc[sameskbzco].checked = true;
					bzc[sameskbzct].checked = false;
				} else {
					rad[0].checked = false;
					bzc[sameskbzco].checked = false;
				}
			} else {
				var line = Number(cellname) - 1;
				var otherskid = tableid + '-' + line + '-' + 2;
				var othersk = document.getElementById(otherskid);
				othersk.value = 0;
				changesum2(cell, tableid, cellname);
				var row2 = changes.rows[line];
				var cell2 = row2.cells;
				changesum2(cell2, tableid, line);
				var sameskido = chart.job.two[g - 1].okind + '-' + chart.job.two[g - 1].onum + '-' + cellid.charAt(cellid.length - 1);
				var sameskcello = document.getElementById(sameskido);
				sameskcello.value = othersk.value;
				var samesktabo = document.getElementById(chart.job.two[g - 1].okind);
				var sameskrowo = samesktabo.rows[Number(chart.job.two[g - 1].onum)];
				var sameskcello = sameskrowo.cells;
				changesum(sameskcello, chart.job.two[g - 1].okind, chart.job.two[g - 1].onum);
				var sameskbzco = checknum(chart.job.two[g - 1].okind, chart.job.two[g - 1].onum);
				var sameskidt = chart.job.two[g - 1].tkind + '-' + chart.job.two[g - 1].tnum + '-' + cellid.charAt(cellid.length - 1);
				var sameskcellt = document.getElementById(sameskidt);
				sameskcellt.value = celled.value;
				var samesktabt = document.getElementById(chart.job.two[g - 1].tkind);
				var sameskrowt = samesktabt.rows[Number(chart.job.two[g - 1].tnum)];
				var sameskcellt = sameskrowt.cells;
				changesum(sameskcellt, chart.job.two[g - 1].tkind, chart.job.two[g - 1].tnum);
				var sameskbzct = checknum(chart.job.two[g - 1].tkind, chart.job.two[g - 1].tnum);
				if (celled.value != 0) {
					rad[0].checked = false;
					rad[1].checked = true;
					bzc[sameskbzco].checked = false;
					bzc[sameskbzct].checked = true;
				} else {
					rad[1].checked = false;
					bzc[sameskbzct].checked = false;
				}
			}
		} else {
			changesum2(cell, tableid, cellname);
			if (cellname % 2 != 0) {
				var sameskido = chart.job.two[g - 1].okind + '-' + chart.job.two[g - 1].onum + '-' + cellid.charAt(cellid.length - 1);
				var sameskcello = document.getElementById(sameskido);
				sameskcello.value = celled.value;
				var samesktabo = document.getElementById(chart.job.two[g - 1].okind);
				var sameskrowo = samesktabo.rows[Number(chart.job.two[g - 1].onum)];
				var sameskcello = sameskrowo.cells;
				changesum(sameskcello, chart.job.two[g - 1].okind, chart.job.two[g - 1].onum);
			} else {
				var sameskidt = chart.job.two[g - 1].tkind + '-' + chart.job.two[g - 1].tnum + '-' + cellid.charAt(cellid.length - 1);
				var sameskcellt = document.getElementById(sameskidt);
				sameskcellt.value = celled.value;
				var samesktabt = document.getElementById(chart.job.two[g - 1].tkind);
				var sameskrowt = samesktabt.rows[Number(chart.job.two[g - 1].tnum)];
				var sameskcellt = sameskrowt.cells;
				changesum(sameskcellt, chart.job.two[g - 1].tkind, chart.job.two[g - 1].tnum);
			}
		}

	} else if (tableid == 'bz-t-f-o') {
		var g = Math.ceil(cellname / 5);
		if (cellid.charAt(cellid.length - 1) == 2) {
			var bzc = document.getElementsByName('bzc');
			var group = String.fromCharCode(64 + g);
			var nam = tableid + '-' + group;
			var rad = document.getElementsByName(nam);
			if (celled.value != 0) {
				for (var i = 1; i < 5; i++) {
					if (i != cellname) {
						var otherskid = tableid + '-' + i + '-' + 2;
						var othersk = document.getElementById(otherskid);
						othersk.value = 0;
						var row2 = changes.rows[i];
						var cell2 = row2.cells;
						changesum2(cell2, tableid, i);
						rad[i - 1].checked = false;
					} else {
						rad[i - 1].checked = true;
					}
				}
			} else {
				rad[Number(cellname) - 1].checked = false;
			}

			var sameskido = chart.job.fouro[g - 1].okind + '-' + chart.job.fouro[g - 1].onum + '-' + cellid.charAt(cellid.length - 1);
			var sameskcello = document.getElementById(sameskido);
			var otherskid1 = tableid + '-' + 1 + '-' + 2;
			var othersk1 = document.getElementById(otherskid1);
			sameskcello.value = othersk1.value;
			var samesktabo = document.getElementById(chart.job.fouro[g - 1].okind);
			var sameskrowo = samesktabo.rows[Number(chart.job.fouro[g - 1].onum)];
			var sameskcello = sameskrowo.cells;
			changesum(sameskcello, chart.job.fouro[g - 1].okind, chart.job.fouro[g - 1].onum);
			var sameskbzco = checknum(chart.job.fouro[g - 1].okind, chart.job.fouro[g - 1].onum);
			var sameskidt = chart.job.fouro[g - 1].tkind + '-' + chart.job.fouro[g - 1].tnum + '-' + cellid.charAt(cellid.length - 1);
			var sameskcellt = document.getElementById(sameskidt);
			var otherskid2 = tableid + '-' + 2 + '-' + 2;
			var othersk2 = document.getElementById(otherskid2);
			sameskcellt.value = othersk2.value;
			var samesktabt = document.getElementById(chart.job.fouro[g - 1].tkind);
			var sameskrowt = samesktabt.rows[Number(chart.job.fouro[g - 1].tnum)];
			var sameskcellt = sameskrowt.cells;
			changesum(sameskcellt, chart.job.fouro[g - 1].tkind, chart.job.fouro[g - 1].tnum);
			var sameskbzct = checknum(chart.job.fouro[g - 1].tkind, chart.job.fouro[g - 1].tnum);
			var sameskidh = chart.job.fouro[g - 1].hkind + '-' + chart.job.fouro[g - 1].hnum + '-' + cellid.charAt(cellid.length - 1);
			var sameskcellh = document.getElementById(sameskidh);
			var otherskid3 = tableid + '-' + 3 + '-' + 2;
			var othersk3 = document.getElementById(otherskid3);
			sameskcellh.value = othersk3.value;
			var samesktabh = document.getElementById(chart.job.fouro[g - 1].hkind);
			var sameskrowh = samesktabh.rows[Number(chart.job.fouro[g - 1].hnum)];
			var sameskcellh = sameskrowh.cells;
			changesum(sameskcellh, chart.job.fouro[g - 1].hkind, chart.job.fouro[g - 1].hnum);
			var sameskbzch = checknum(chart.job.fouro[g - 1].hkind, chart.job.fouro[g - 1].hnum);
			var sameskidf = chart.job.fouro[g - 1].fkind + '-' + chart.job.fouro[g - 1].fnum + '-' + cellid.charAt(cellid.length - 1);
			var sameskcellf = document.getElementById(sameskidf);
			var otherskid4 = tableid + '-' + 4 + '-' + 2;
			var othersk4 = document.getElementById(otherskid4);
			sameskcellf.value = othersk4.value;
			var samesktabf = document.getElementById(chart.job.fouro[g - 1].fkind);
			var sameskrowf = samesktabt.rows[Number(chart.job.fouro[g - 1].fnum)];
			var sameskcellf = sameskrowf.cells;
			changesum(sameskcellf, chart.job.fouro[g - 1].fkind, chart.job.fouro[g - 1].fnum);
			var sameskbzcf = checknum(chart.job.fouro[g - 1].fkind, chart.job.fouro[g - 1].fnum);
			changesum2(cell, tableid, cellname);
			if (celled.value != 0) {
				switch (Number(cellname)) {
					case 1:
						bzc[sameskbzco].checked = true;
						bzc[sameskbzct].checked = false;
						bzc[sameskbzch].checked = false;
						bzc[sameskbzcf].checked = false;
						console.log(1);
						break;
					case 2:
						bzc[sameskbzct].checked = true;
						bzc[sameskbzco].checked = false;
						bzc[sameskbzch].checked = false;
						bzc[sameskbzcf].checked = false;
						console.log(2);
						break;
					case 3:
						bzc[sameskbzch].checked = true;
						bzc[sameskbzco].checked = false;
						bzc[sameskbzct].checked = false;
						bzc[sameskbzcf].checked = false;
						console.log(3);
						break;
					case 5:
						bzc[sameskbzcf].checked = true;
						bzc[sameskbzco].checked = false;
						bzc[sameskbzct].checked = false;
						bzc[sameskbzch].checked = false;
						console.log(4);
						break;
				}
			} else {
				switch (Number(cellname)) {
					case 1:
						bzc[sameskbzco].checked = false;
						console.log(1);
						break;
					case 2:
						bzc[sameskbzct].checked = false;
						console.log(2);
						break;
					case 3:
						bzc[sameskbzch].checked = false;
						console.log(3);
						break;
					case 5:
						bzc[sameskbzcf].checked = false;
						console.log(4);
						break;
				}
			}
		} else {
			switch (Number(cellname)) {
				case 1:
					var sameskido = chart.job.fouro[g - 1].okind + '-' + chart.job.fouro[g - 1].onum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcello = document.getElementById(sameskido);
					var otherskid1 = tableid + '-' + 1 + '-' + cellid.charAt(cellid.length - 1);
					var othersk1 = document.getElementById(otherskid1);
					sameskcello.value = othersk1.value;
					var samesktabo = document.getElementById(chart.job.fouro[g - 1].okind);
					var sameskrowo = samesktabo.rows[Number(chart.job.fouro[g - 1].onum)];
					var sameskcello = sameskrowo.cells;
					changesum(sameskcello, chart.job.fouro[g - 1].okind, chart.job.fouro[g - 1].onum);
					break;
				case 2:
					var sameskidt = chart.job.fouro[g - 1].tkind + '-' + chart.job.fouro[g - 1].tnum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcellt = document.getElementById(sameskidt);
					var otherskid2 = tableid + '-' + 2 + '-' + cellid.charAt(cellid.length - 1);
					var othersk2 = document.getElementById(otherskid2);
					sameskcellt.value = othersk2.value;
					var samesktabt = document.getElementById(chart.job.fouro[g - 1].tkind);
					var sameskrowt = samesktabt.rows[Number(chart.job.fouro[g - 1].tnum)];
					var sameskcellt = sameskrowt.cells;
					changesum(sameskcellt, chart.job.fouro[g - 1].tkind, chart.job.fouro[g - 1].tnum);
					break;
				case 3:
					var sameskidh = chart.job.fouro[g - 1].hkind + '-' + chart.job.fouro[g - 1].hnum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcellh = document.getElementById(sameskidh);
					var otherskid3 = tableid + '-' + 3 + '-' + cellid.charAt(cellid.length - 1);
					var othersk3 = document.getElementById(otherskid3);
					sameskcellh.value = othersk3.value;
					var samesktabh = document.getElementById(chart.job.fouro[g - 1].hkind);
					var sameskrowh = samesktabh.rows[Number(chart.job.fouro[g - 1].hnum)];
					var sameskcellh = sameskrowh.cells;
					changesum(sameskcellh, chart.job.fouro[g - 1].hkind, chart.job.fouro[g - 1].hnum);
					break;
				case 4:
					var sameskidf = chart.job.fouro[g - 1].fkind + '-' + chart.job.fouro[g - 1].fnum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcellf = document.getElementById(sameskidf);
					var otherskid4 = tableid + '-' + 4 + '-' + cellid.charAt(cellid.length - 1);
					var othersk4 = document.getElementById(otherskid4);
					sameskcellf.value = othersk4.value;
					var samesktabf = document.getElementById(chart.job.fouro[g - 1].fkind);
					var sameskrowf = samesktabf.rows[Number(chart.job.fouro[g - 1].fnum)];
					var sameskcellf = sameskrowf.cells;
					changesum(sameskcellf, chart.job.fouro[g - 1].fkind, chart.job.fouro[g - 1].fnum);
					break;
			}
			changesum2(cell, tableid, cellname);
		}
	} else if (tableid == 'bz-t-f-t') {
		var g = Math.ceil(cellname / 5);
		if (cellid.charAt(cellid.length - 1) == 2) {
			var bzc = document.getElementsByName('bzc');
			var group = String.fromCharCode(64 + g);
			var nam = tableid + '-' + group;
			var cheft = document.getElementsByName(nam);
			var ched = 0;
			for (var i = 0; i < 4; i++) {
				if (cheft[i].checked == true) {
					ched++;
				}
			}
			if (celled.value != 0 && ched < 2) {
				var a = true;
			} else if (celled.value == 0) {
				var a = false;
				celled.value = 0;
			} else {
				var a = false;
				celled.value = 0;
				alert("已选满两种");
			}
			switch (Number(cellname)) {
				case 1:
					var sameskido = chart.job.fourt[g - 1].okind + '-' + chart.job.fourt[g - 1].onum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcello = document.getElementById(sameskido);
					var otherskid1 = tableid + '-' + 1 + '-' + cellid.charAt(cellid.length - 1);
					var othersk1 = document.getElementById(otherskid1);
					sameskcello.value = othersk1.value;
					var samesktabo = document.getElementById(chart.job.fourt[g - 1].okind);
					var sameskrowo = samesktabo.rows[Number(chart.job.fourt[g - 1].onum)];
					var sameskcello = sameskrowo.cells;
					changesum(sameskcello, chart.job.fourt[g - 1].okind, chart.job.fourt[g - 1].onum);
					cheft[cellname - 1].checked = a;
					var sameskbzco = checknum(chart.job.fourt[g - 1].okind, chart.job.fourt[g - 1].onum);
					bzc[sameskbzco].checked = a;
					break;
				case 2:
					var sameskidt = chart.job.fourt[g - 1].tkind + '-' + chart.job.fourt[g - 1].tnum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcellt = document.getElementById(sameskidt);
					var otherskid2 = tableid + '-' + 2 + '-' + cellid.charAt(cellid.length - 1);
					var othersk2 = document.getElementById(otherskid2);
					sameskcellt.value = othersk2.value;
					var samesktabt = document.getElementById(chart.job.fourt[g - 1].tkind);
					var sameskrowt = samesktabt.rows[Number(chart.job.fourt[g - 1].tnum)];
					var sameskcellt = sameskrowt.cells;
					changesum(sameskcellt, chart.job.fourt[g - 1].tkind, chart.job.fourt[g - 1].tnum);
					cheft[cellname - 1].checked = a;
					var sameskbzct = checknum(chart.job.fourt[g - 1].tkind, chart.job.fourt[g - 1].tnum);
					bzc[sameskbzct].checked = a;
					break;
				case 3:
					var sameskidh = chart.job.fourt[g - 1].hkind + '-' + chart.job.fourt[g - 1].hnum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcellh = document.getElementById(sameskidh);
					var otherskid3 = tableid + '-' + 3 + '-' + cellid.charAt(cellid.length - 1);
					var othersk3 = document.getElementById(otherskid3);
					sameskcellh.value = othersk3.value;
					var samesktabh = document.getElementById(chart.job.fourt[g - 1].hkind);
					var sameskrowh = samesktabh.rows[Number(chart.job.fourt[g - 1].hnum)];
					var sameskcellh = sameskrowh.cells;
					changesum(sameskcellh, chart.job.fourt[g - 1].hkind, chart.job.fourt[g - 1].hnum);
					cheft[cellname - 1].checked = a;
					var sameskbzch = checknum(chart.job.fourt[g - 1].hkind, chart.job.fourt[g - 1].hnum);
					bzc[sameskbzch].checked = a;
					break;
				case 4:
					var sameskidf = chart.job.fourt[g - 1].fkind + '-' + chart.job.fourt[g - 1].fnum + '-' + cellid.charAt(cellid.length - 1);
					console.log(sameskidf);
					var sameskcellf = document.getElementById(sameskidf);
					var otherskid4 = tableid + '-' + 4 + '-' + cellid.charAt(cellid.length - 1);
					var othersk4 = document.getElementById(otherskid4);
					sameskcellf.value = othersk4.value;
					var samesktabf = document.getElementById(chart.job.fourt[g - 1].fkind);
					var sameskrowf = samesktabf.rows[Number(chart.job.fourt[g - 1].fnum)];
					var sameskcellf = sameskrowf.cells;
					changesum(sameskcellf, chart.job.fourt[g - 1].fkind, chart.job.fourt[g - 1].fnum);
					cheft[cellname - 1].checked = a;
					var sameskbzcf = checknum(chart.job.fourt[g - 1].fkind, chart.job.fourt[g - 1].fnum);
					bzc[sameskbzcf].checked = a;
					break;
			}
			changesum2(cell, tableid, cellname);

		} else {
			switch (Number(cellname)) {
				case 1:
					var sameskido = chart.job.fourt[g - 1].okind + '-' + chart.job.fourt[g - 1].onum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcello = document.getElementById(sameskido);
					var otherskid1 = tableid + '-' + 1 + '-' + cellid.charAt(cellid.length - 1);
					var othersk1 = document.getElementById(otherskid1);
					sameskcello.value = othersk1.value;
					var samesktabo = document.getElementById(chart.job.fourt[g - 1].okind);
					var sameskrowo = samesktabo.rows[Number(chart.job.fourt[g - 1].onum)];
					var sameskcello = sameskrowo.cells;
					changesum(sameskcello, chart.job.fourt[g - 1].okind, chart.job.fourt[g - 1].onum);
					break;
				case 2:
					var sameskidt = chart.job.fourt[g - 1].tkind + '-' + chart.job.fourt[g - 1].tnum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcellt = document.getElementById(sameskidt);
					var otherskid2 = tableid + '-' + 2 + '-' + cellid.charAt(cellid.length - 1);
					var othersk2 = document.getElementById(otherskid2);
					sameskcellt.value = othersk2.value;
					var samesktabt = document.getElementById(chart.job.fourt[g - 1].tkind);
					var sameskrowt = samesktabt.rows[Number(chart.job.fourt[g - 1].tnum)];
					var sameskcellt = sameskrowt.cells;
					changesum(sameskcellt, chart.job.fourt[g - 1].tkind, chart.job.fourt[g - 1].tnum);
					break;
				case 3:
					var sameskidh = chart.job.fourt[g - 1].hkind + '-' + chart.job.fourt[g - 1].hnum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcellh = document.getElementById(sameskidh);
					var otherskid3 = tableid + '-' + 3 + '-' + cellid.charAt(cellid.length - 1);
					var othersk3 = document.getElementById(otherskid3);
					sameskcellh.value = othersk3.value;
					var samesktabh = document.getElementById(chart.job.fourt[g - 1].hkind);
					var sameskrowh = samesktabh.rows[Number(chart.job.fourt[g - 1].hnum)];
					var sameskcellh = sameskrowh.cells;
					changesum(sameskcellh, chart.job.fourt[g - 1].hkind, chart.job.fourt[g - 1].hnum);
					break;
				case 4:
					var sameskidf = chart.job.fourt[g - 1].fkind + '-' + chart.job.fourt[g - 1].fnum + '-' + cellid.charAt(cellid.length - 1);
					var sameskcellf = document.getElementById(sameskidf);
					var otherskid4 = tableid + '-' + 4 + '-' + cellid.charAt(cellid.length - 1);
					var othersk4 = document.getElementById(otherskid4);
					sameskcellf.value = othersk4.value;
					var samesktabf = document.getElementById(chart.job.fourt[g - 1].fkind);
					var sameskrowf = samesktabf.rows[Number(chart.job.fourt[g - 1].fnum)];
					var sameskcellf = sameskrowf.cells;
					changesum(sameskcellf, chart.job.fourt[g - 1].fkind, chart.job.fourt[g - 1].fnum);
					break;
			}
			changesum2(cell, tableid, cellname);
		}
	} else if (tableid == 'bz-t-a') {
		var k = chart.job.all[Number(cellname) - 1].kind;
		var n = Number(chart.job.all[Number(cellname) - 1].num);
		var samesktaba = document.getElementById(k);
		var sameskrowa = samesktaba.rows[n];
		var sameskcella = sameskrowa.cells;
		var sameskida = k + '-' + n + '-' + cellid.charAt(cellid.length - 1);
		var sameska = document.getElementById(sameskida);
		sameska.value = celled.value;
		changesum(sameskcella, k, n);
		changesum(cell, tableid, cellname);
	}
	loadinchart();
	if (tableid == 'zs-t' && cellname == 11) {
		setelse();
	}
	if (tableid == 'bz-t' && cellname == changes.rows.length - 1) {
		setmoney(Number(cell[cell.length - 3].innerHTML), $('#epoch option:selected').text());
	} else if (tableid == 'jl-t' && cellname == 1) {
		setmoney(Number(cell[cell.length - 4].innerHTML), $('#epoch option:selected').text());
	}
	var selsknam = ["kexue0", "kexue1", "kexue2", "shengcun", "shengcun1", "shengcun2", "jiyi", "jiyi1", "jiyi2", "jiashi", "jiashi1", "jiashi2", "muyu", "waiyu", "gedou", "gedou1", "gedou2", "gedou2", "sheji", "sheji1", "sheji2"];
	for (var i = 0; i < selsknam.length; i++) {
		var s = document.getElementsByName(selsknam[i]);
		if (s.length != 1) {
			s[0].value = s[1].value;
		}
	}
	console.log(chart.job.all);
};

function changeskzdy(num) {
	console.log(num);
	var table = document.getElementById("zdy-t");
	var row = table.rows[num];
	var cell = row.cells;
	var a = "zdy-t-" + num + '-1';
	var b = "zdy-t-" + num + '-2';
	var c = "zdy-t-" + num + '-3';
	var d = "zdy-t-" + num + '-4';
	var e = "zdy-t-" + num + '-5';
	var v1 = document.getElementById(a).value;
	var v2 = document.getElementById(b).value;
	var v3 = document.getElementById(c).value;
	var v4 = document.getElementById(d).value;
	var v5 = document.getElementById(e).value;
	row.cells[5].innerHTML = Number(v2) + Number(v3) + Number(v4) + Number(v5);
	row.cells[6].innerHTML = hardsucc(row.cells[5].innerHTML);
	row.cells[7].innerHTML = sohardsucc(row.cells[5].innerHTML);
	chart.zdy[num - 1] = {
		name: v1,
		ini: v2,
		grow: v3,
		pro: v4,
		interest: v5,
		total: row.cells[5].innerHTML
	}
	loadinchart();
}

function firstbz() {
	var bzc = document.getElementsByName('bzc');
	for (var i = 0; i < bzc.length; i++) {
		bzc[i].checked = false;
		$(".bzc").eq(i).attr("disabled", false);
	}
	if (chart.job.skills != undefined) {
		for (var i = 0; i < chart.job.skills.length; i++) {
			var kind = chart.job.skills[i].kind;
			var bzc_checkbox = checknum(kind, chart.job.skills[i].num);
			bzc[bzc_checkbox].checked = true;
			$(".bzc").eq(bzc_checkbox).attr("disabled", true);
		}
	}
	if (chart.job.two != undefined) {
		for (var i = 0; i < chart.job.two.length; i++) {
			var kind1 = chart.job.two[i].okind;
			var bzc_checkbox1 = checknum(kind1, chart.job.two[i].onum);
			var kind2 = chart.job.two[i].tkind;
			var bzc_checkbox2 = checknum(kind2, chart.job.two[i].tnum);
			$(".bzc").eq(bzc_checkbox1).attr("disabled", true);
			$(".bzc").eq(bzc_checkbox2).attr("disabled", true);
		}
	}
	if (chart.job.fouro != undefined) {
		for (var i = 0; i < chart.job.fouro.length; i++) {
			var kind1 = chart.job.fouro[i].okind;
			var bzc_checkbox1 = checknum(kind1, chart.job.fouro[i].onum);
			var kind2 = chart.job.fouro[i].tkind;
			var bzc_checkbox2 = checknum(kind2, chart.job.fouro[i].tnum);
			var kind3 = chart.job.fouro[i].hkind;
			var bzc_checkbox3 = checknum(kind2, chart.job.fouro[i].hnum);
			var kind4 = chart.job.fouro[i].fkind;
			var bzc_checkbox4 = checknum(kind2, chart.job.fouro[i].fnum);
			$(".bzc").eq(bzc_checkbox1).attr("disabled", true);
			$(".bzc").eq(bzc_checkbox2).attr("disabled", true);
			$(".bzc").eq(bzc_checkbox3).attr("disabled", true);
			$(".bzc").eq(bzc_checkbox4).attr("disabled", true);
		}
	}
	if (chart.job.fourt != undefined) {
		for (var i = 0; i < chart.job.fourt.length; i++) {
			var kind1 = chart.job.fourt[i].okind;
			var bzc_checkbox1 = checknum(kind1, chart.job.fourt[i].onum);
			var kind2 = chart.job.fourt[i].tkind;
			var bzc_checkbox2 = checknum(kind2, chart.job.fourt[i].tnum);
			var kind3 = chart.job.fourt[i].hkind;
			var bzc_checkbox3 = checknum(kind2, chart.job.fourt[i].hnum);
			var kind4 = chart.job.fourt[i].fkind;
			var bzc_checkbox4 = checknum(kind2, chart.job.fourt[i].fnum);
			$(".bzc").eq(bzc_checkbox1).attr("disabled", true);
			$(".bzc").eq(bzc_checkbox2).attr("disabled", true);
			$(".bzc").eq(bzc_checkbox3).attr("disabled", true);
			$(".bzc").eq(bzc_checkbox4).attr("disabled", true);
		}
	}

};

function cleanbz(tableid, chenam, num) {
	var table = document.getElementById(tableid);
	var check = document.getElementsByName(chenam);
	if (tableid == 'bz-t-f-t') {
		if (check[num - 1].checked == false) {
			var cellid = tableid + '-' + num + '-2';
			var celled = document.getElementById(cellid);
			celled.value = 0;
			changesk(tableid, cellid, num);
		}
	} else if (tableid == 'bz-t-t') {
		if (num % 2 == 0) {
			num = Number(num) - 1;
			var cellid = tableid + '-' + num + '-2';
			var celled = document.getElementById(cellid);
			celled.value = 0;
			changesk(tableid, cellid, num);
		} else {
			num = Number(num) + 1;
			var cellid = tableid + '-' + num + '-2';
			var celled = document.getElementById(cellid);
			celled.value = 0;
			changesk(tableid, cellid, num);
		}
	} else if (tableid == 'bz-t-f-o') {
		for (var i = 0; i < check.length; i++) {
			if (i != Number(num) - 1) {
				var j = i + 1;
				var cellid = tableid + '-' + j + '-2';
				var celled = document.getElementById(cellid);
				celled.value = 0;
				changesk(tableid, cellid, num);
			}
		}
		check[Number(num) - 1].checked = true;
	}
};

function setmoneytime() {
	var table = document.getElementById("jl-t");
	var row = table.rows[1];
	var cell = Number(row.cells[5].innerHTML);
	setmoney(cell, $('#epoch option:selected').text());
};

function setmoney(num, time) {
	document.getElementById('creditdating').value = num + "%";
	if (num == 0) {
		document.getElementById('living').value = '身无分文';
		document.getElementById('cash').value = moneyjs[time][0].cash;
		document.getElementById('consumption').value = moneyjs[time][0].consumption;
	} else if (num < 10) {
		document.getElementById('living').value = '贫穷';
		document.getElementById('cash').value = moneyjs[time][1].cash;
		document.getElementById('consumption').value = moneyjs[time][1].consumption;
	} else if (num < 50) {
		document.getElementById('living').value = '标准';
		document.getElementById('cash').value = moneyjs[time][2].cash;
		document.getElementById('consumption').value = moneyjs[time][2].consumption;
	} else if (num < 90) {
		document.getElementById('living').value = '小康';
		document.getElementById('cash').value = moneyjs[time][3].cash;
		document.getElementById('consumption').value = moneyjs[time][3].consumption;
	} else if (num < 99) {
		document.getElementById('living').value = '富裕';
		document.getElementById('cash').value = moneyjs[time][4].cash;
		document.getElementById('consumption').value = moneyjs[time][4].consumption;
	} else {
		document.getElementById('living').value = '富豪';
		document.getElementById('cash').value = moneyjs[time][5].cash;
		document.getElementById('consumption').value = moneyjs[time][5].consumption;
	}
};

function changecheck(tableid, cellid) {
	var bzc_checkbox = checknum(tableid, cellid);
	var bzc = document.getElementsByName('bzc');
	var checkta = document.getElementById(tableid);
	var bzt = document.getElementById('bz-t-a');
	var bz_can_select = bzt.rows.length - 1;
	var canset = 0;
	if (bz_can_select > 0 && bzc[bzc_checkbox].checked) {
		for (var i = 1; i <= bz_can_select; i++) {
			var row1 = bzt.rows[i];
			var c11 = row1.cells[0];
			if (c11.innerHTML == "") {
				canset = i;
				break;
			}
		}
		if (canset != 0) {
			var row1 = bzt.rows[canset];
			var row2 = checkta.rows[cellid];
			var cell = row2.cells;
			changesum(cell, tableid, cellid);
			var c11 = row1.cells[0];
			var c21 = row2.cells[0];
			c11.innerHTML = c21.innerHTML;
			var c12 = row1.cells[1];
			var c22 = row2.cells[1];
			c12.innerHTML = c22.innerHTML;
			for (var i = 1; i < 4; i++) {
				var nam1 = tableid + '-' + cellid + '-' + i;
				var nam2 = 'bz-t-a-' + canset + '-' + i;
				var ce = document.getElementById(nam1).value;
				var cela = document.getElementById(nam2);
				cela.value = ce;
			}
			var c16 = row1.cells[5];
			var c26 = row2.cells[5];
			c16.innerHTML = c26.innerHTML;
			var c17 = row1.cells[6];
			var c27 = row2.cells[6];
			c17.innerHTML = c27.innerHTML;
			var c18 = row1.cells[7];
			var c28 = row2.cells[7];
			c18.innerHTML = c28.innerHTML;
			for (var j = 0; j < chart.job.all.length; j++) {
				if (chart.job.all[j].name == "") {
					chart.job.all[j] = skilljs[tableid][Number(cellid) - 1];
					break;
				}
			}
		} else {
			bzc[bzc_checkbox].checked = false;
			var nam1 = tableid + '-' + cellid + '-' + 2;
			var ce = document.getElementById(nam1);
			ce.value = "";
			var row2 = checkta.rows[cellid];
			var cell = row2.cells;
			changesum(cell, tableid, cellid);
			alert("已选满本职技能");
		}
	}
	if (bzc[bzc_checkbox].checked == false) {
		for (var i = 1; i < bzt.rows.length; i++) {
			var row1 = bzt.rows[i];
			var row2 = checkta.rows[cellid];
			var c11 = row1.cells[0];
			var c21 = row2.cells[0];
			if (c11.innerHTML == c21.innerHTML) {
				var c11 = row1.cells[0];
				c11.innerHTML = "";
				c11.style.width = "160px";
				var c12 = row1.cells[1];
				c12.innerHTML = "";
				c12.style.width = "60px";
				document.getElementById("bz-t-a-" + i + "-1").value = "";
				document.getElementById("bz-t-a-" + i + "-2").value = "";
				document.getElementById("bz-t-a-" + i + "-3").value = "";
				var c16 = row1.cells[5];
				c16.innerHTML = "";
				c16.style.width = "30px";
				var c17 = row1.cells[6];
				c17.innerHTML = "";
				c17.style.width = "30px";
				var c18 = row1.cells[7];
				c18.innerHTML = "";
				c18.style.width = "30px";
				var row2 = checkta.rows[cellid];
				var cell = row2.cells;
				var nam1 = tableid + '-' + cellid + '-' + 2;
				var ce = document.getElementById(nam1);
				ce.value = "";
				changesum(cell, tableid, cellid);
				console.log(i);
				chart.job.all[i - 1] = {
					"name": "",
					"ini": "",
					"grow": "",
					"pro": "",
					"interest": "",
					"total": "",
					"num": "",
					"kind": ""
				}
				break;
			}
		}

	}
	loadinchart();
};

function selectall() {
	console.log(jobname);
	for (var j = 0; j < skselectid.length; j++) {
		var str = skselectid[j];
		var a = '#' + str + 1;
		var b = '#' + str + 2;
		for (var i = 0; i < skselectjs[str][0].all.length; i++) {
			var result = "<option value='" + i + "'>" + skselectjs[str][0].all[i].name + "</option>";
			$(a).append(result);
			$(b).append(result);
		}
		if (jobname == "设计师") {
			var c = '#' + str + 3;
			for (var i = 0; i < skselectjs[str][0].all.length; i++) {
				var result = "<option value='" + i + "'>" + skselectjs[str][0].all[i].name + "</option>";
				$(c).append(result);
			}
		}
		if (jobname == "工匠") {
			var c = '#' + str;
			for (var i = 0; i < skselectjs[str][0].all.length; i++) {
				var result = "<option value='" + i + "'>" + skselectjs[str][0].all[i].name + "</option>";
				$(c).append(result);
			}
		}
	}
	for (var k = 0; k < skselectid.length; k++) {
		var str = skselectid[k];
		if (skselectjs[str][0][jobname] != undefined) {
			if (str != "kexue") {
				for (var i = 0; i < skselectjs[str][0][jobname].length; i++) {
					var num = Number(skselectjs[str][0][jobname][i].num);
					var result = "<option value='" + num + "'>" + skselectjs[str][0].all[num].name + "</option>";
					var a = '#job' + str;
					var b = '#samejob' + str;
					$(a).append(result);
					$(b).append(result);
				}
			} else {
				if (skselectjs[str][0][jobname].length > 1 && skselectjs[str][0][jobname][0].both == 1) {
					for (var j = 0; j < skselectjs[str][0][jobname].length; j++) {
						for (var i = 0; i < skselectjs[str][0][jobname].length; i++) {
							var num = Number(skselectjs[str][0][jobname][i].num);
							var result = "<option value='" + num + "'>" + skselectjs[str][0].all[num].name + "</option>";
							var a = '#job' + str + j;
							var b = '#samejob' + str + j;
							$(a).append(result);
							$(b).append(result);
						}
					}
					if (j == 3) {
						for (var i = 0; i < skselectjs[str][0].all.length; i++) {
							var result = "<option value='" + i + "'>" + skselectjs[str][0].all[i].name + "</option>";
							var a2 = '#job' + str + 2;
							var b2 = '#samejob' + str + 2;
							$(a2).append(result);
							$(b2).append(result);
						}
					}
				} else {
					for (var i = 0; i < skselectjs[str][0][jobname].length; i++) {
						var num = Number(skselectjs[str][0][jobname][i].num);
						var result = "<option value='" + num + "'>" + skselectjs[str][0].all[num].name + "</option>";
						var a = '#job' + str + 0;
						var b = '#samejob' + str + 0;
						$(a).append(result);
						$(b).append(result);
					}
					for (var i = 0; i < skselectjs[str][0].all.length; i++) {
						var result = "<option value='" + i + "'>" + skselectjs[str][0].all[i].name + "</option>";
						var a1 = '#job' + str + 1;
						var b1 = '#samejob' + str + 1;
						var a2 = '#job' + str + 2;
						var b2 = '#samejob' + str + 2;
						$(a1).append(result);
						$(b1).append(result);
						$(a2).append(result);
						$(b2).append(result);
					}
				}
			}

		} else {
			if (str != "kexue") {
				for (var i = 0; i < skselectjs[str][0].all.length; i++) {
					var result = "<option value='" + i + "'>" + skselectjs[str][0].all[i].name + "</option>";
					var a = '#job' + str;
					var b = '#samejob' + str;
					$(a).append(result);
					$(b).append(result);
				}
			} else {
				for (var i = 0; i < skselectjs[str][0].all.length; i++) {
					var result = "<option value='" + i + "'>" + skselectjs[str][0].all[i].name + "</option>";
					var a0 = '#job' + str + 0;
					var b0 = '#samejob' + str + 0;
					var a1 = '#job' + str + 1;
					var b1 = '#samejob' + str + 1;
					var a2 = '#job' + str + 2;
					var b2 = '#samejob' + str + 2;
					$(a0).append(result);
					$(b0).append(result)
					$(a1).append(result);
					$(b1).append(result);
					$(a2).append(result);
					$(b2).append(result);
				}
			}
		}
	}
};

function selectclear() {
	var selsknam = ["kexue0", "kexue1", "kexue2", "shengcun", "shengcun1", "shengcun2", "jiyi", "jiyi1", "jiyi2", "jiashi", "jiashi1", "jiashi2", "muyu", "waiyu", "gedou", "gedou1", "gedou2", "gedou2", "sheji", "sheji1", "sheji2"];
	for (var i = 0; i < selsknam.length; i++) {
		var s = document.getElementsByName(selsknam[i]);
		for (var j = 0; j < s.length; j++) {
			s[j].options.length = 1;
		}
	}
};

function changeselect(skid, skname) {
	if (skname.indexOf("gedou") != -1 || skname.indexOf("sheji") != -1) {
		var sk1 = document.getElementById(skid);
		var sk2 = document.getElementsByName(skname);
		if (sk2.length != 1) {
			if (showingtab != 0) {
				sk2[0].value = sk2[1].value;
			} else {
				sk2[1].value = sk2[0].value;
			}
		}
		var table1 = document.getElementById('zd-t');
		if (sk2.length < 2) {
			switch (skname) {
				case "gedou":
					var row = table1.rows[1];
					var cell = row.cells;
					cell[1].innerHTML = skselectjs.gedou[0].all[sk1.value].ini;
					cell[5].innerHTML = skselectjs.gedou[0].all[sk1.value].total;
					cell[6].innerHTML = hardsucc(skselectjs.gedou[0].all[sk1.value].total);
					cell[7].innerHTML = sohardsucc(skselectjs.gedou[0].all[sk1.value].total);
					break;
				case "gedou1":
					var row = table1.rows[2];
					var cell = row.cells;
					cell[1].innerHTML = skselectjs.gedou[0].all[sk1.value].ini;
					cell[5].innerHTML = skselectjs.gedou[0].all[sk1.value].total;
					cell[6].innerHTML = hardsucc(skselectjs.gedou[0].all[sk1.value].total);
					cell[7].innerHTML = sohardsucc(skselectjs.gedou[0].all[sk1.value].total);
					break;
				case "gedou2":
					var row = table1.rows[3];
					var cell = row.cells;
					cell[1].innerHTML = skselectjs.gedou[0].all[sk1.value].ini;
					cell[5].innerHTML = skselectjs.gedou[0].all[sk1.value].total;
					cell[6].innerHTML = hardsucc(skselectjs.gedou[0].all[sk1.value].total);
					cell[7].innerHTML = sohardsucc(skselectjs.gedou[0].all[sk1.value].total);
					break;
				case "sheji":
					var row = table1.rows[4];
					var cell = row.cells;
					cell[1].innerHTML = skselectjs.sheji[0].all[sk1.value].ini;
					cell[5].innerHTML = skselectjs.sheji[0].all[sk1.value].total;
					cell[6].innerHTML = hardsucc(skselectjs.sheji[0].all[sk1.value].total);
					cell[7].innerHTML = sohardsucc(skselectjs.sheji[0].all[sk1.value].total);
					break;
				case "sheji1":
					var row = table1.rows[5];
					var cell = row.cells;
					cell[1].innerHTML = skselectjs.sheji[0].all[sk1.value].ini;
					cell[5].innerHTML = skselectjs.sheji[0].all[sk1.value].total;
					cell[6].innerHTML = hardsucc(skselectjs.sheji[0].all[sk1.value].total);
					cell[7].innerHTML = sohardsucc(skselectjs.sheji[0].all[sk1.value].total);
					break;
				case "sheji2":
					var row = table1.rows[6];
					var cell = row.cells;
					cell[1].innerHTML = skselectjs.sheji[0].all[sk1.value].ini;
					cell[5].innerHTML = skselectjs.sheji[0].all[sk1.value].total;
					cell[6].innerHTML = hardsucc(skselectjs.sheji[0].all[sk1.value].total);
					cell[7].innerHTML = sohardsucc(skselectjs.sheji[0].all[sk1.value].total);
					break;
			}
		} else {
			var arr = ['bz-t', 'bz-t-t', 'bz-t-f-t', 'bz-t-f-o', 'bz-t-a'];
			switch (skname) {
				case "gedou":
					var a = "格斗1";
					var b = 1;
					break;
				case "gedou1":
					var a = "格斗2";
					var b = 2;
					break;
				case "gedou2":
					var a = "格斗3";
					var b = 3;
					break;
				case "sheji":
					var a = "射击1";
					var b = 4;
					break;
				case "sheji1":
					var a = "射击2";
					var b = 5;
					break;
				case "sheji2":
					var a = "射击3";
					var b = 6;
					break;
			}
			for (var i = 0; i < arr.length; i++) {
				var table2 = document.getElementById(arr[i]);
				var row2 = table2.rows;
				if (row2.length > 1) {
					for (var j = 1; j < row2.length; j++) {
						var cell2 = row2[j].cells;
						if (cell2[0].innerHTML.indexOf(a) != -1) {
							if (b < 4) {
								if (i == 0 || i == 4) {
									console.log(sk1.value);
									cell2[5].innerHTML = Number(cell2[5].innerHTML) - Number(cell2[1].innerHTML) + Number(skselectjs.gedou[0].all[sk1.value].total);
									cell2[1].innerHTML = skselectjs.gedou[0].all[sk1.value].ini;
									cell2[6].innerHTML = hardsucc(Number(cell2[5].innerHTML));
									cell2[7].innerHTML = sohardsucc(Number(cell2[5].innerHTML));
									var row = table1.rows[b];
									var cell = row.cells;
									cell[5].innerHTML = Number(cell[5].innerHTML) - Number(cell[1].innerHTML) + Number(skselectjs.gedou[0].all[sk1.value].total);
									cell[1].innerHTML = skselectjs.gedou[0].all[sk1.value].ini;
									cell[6].innerHTML = hardsucc(Number(cell[5].innerHTML));
									cell[7].innerHTML = sohardsucc(Number(cell[5].innerHTML));
								} else {
									cell2[6].innerHTML = Number(cell2[6].innerHTML) - Number(cell2[2].innerHTML) + Number(skselectjs.gedou[0].all[sk1.value].total);
									cell2[2].innerHTML = skselectjs.gedou[0].all[sk1.value].ini;
									cell2[7].innerHTML = hardsucc(Number(cell2[6].innerHTML));
									cell2[8].innerHTML = sohardsucc(Number(cell2[6].innerHTML));
									var row = table1.rows[b];
									var cell = row.cells;
									cell[5].innerHTML = Number(cell[5].innerHTML) - Number(cell[1].innerHTML) + Number(skselectjs.gedou[0].all[sk1.value].total);
									cell[1].innerHTML = skselectjs.gedou[0].all[sk1.value].ini;
									cell[6].innerHTML = hardsucc(Number(cell[5].innerHTML));
									cell[7].innerHTML = sohardsucc(Number(cell[5].innerHTML));
								}
							} else {
								if (i == 0 || i == 4) {
									cell2[5].innerHTML = Number(cell2[5].innerHTML) - Number(cell2[1].innerHTML) + Number(skselectjs.sheji[0].all[sk1.value].total);
									cell2[1].innerHTML = skselectjs.sheji[0].all[sk1.value].ini;
									cell2[6].innerHTML = hardsucc(Number(cell2[5].innerHTML));
									cell2[7].innerHTML = sohardsucc(Number(cell2[5].innerHTML));
									var row = table1.rows[b];
									var cell = row.cells;
									cell[5].innerHTML = Number(cell[5].innerHTML) - Number(cell[1].innerHTML) + Number(skselectjs.sheji[0].all[sk1.value].total);
									cell[1].innerHTML = skselectjs.sheji[0].all[sk1.value].ini;
									cell[6].innerHTML = hardsucc(Number(cell[5].innerHTML));
									cell[7].innerHTML = sohardsucc(Number(cell[5].innerHTML));
								} else {
									cell2[6].innerHTML = Number(cell2[6].innerHTML) - Number(cell2[2].innerHTML) + Number(skselectjs.sheji[0].all[sk1.value].total);
									cell2[2].innerHTML = skselectjs.sheji[0].all[sk1.value].ini;
									cell2[7].innerHTML = hardsucc(Number(cell2[6].innerHTML));
									cell2[8].innerHTML = sohardsucc(Number(cell2[6].innerHTML));
									var row = table1.rows[b];
									var cell = row.cells;
									cell[5].innerHTML = Number(cell[5].innerHTML) - Number(cell[1].innerHTML) + Number(skselectjs.sheji[0].all[sk1.value].total);
									cell[1].innerHTML = skselectjs.sheji[0].all[sk1.value].ini;
									cell[6].innerHTML = hardsucc(Number(cell[5].innerHTML));
									cell[7].innerHTML = sohardsucc(Number(cell[5].innerHTML));
								}
							}
						}
					}
				}
			}
		}
		if (sk2.length != 1) {
			if (showingtab != 0) {
				sk2[0].value = sk2[1].value;
			} else {
				sk2[1].value = sk2[0].value;
			}
		}
	} else {
		var sk1 = document.getElementById(skid);
		var sk2 = document.getElementsByName(skname);
		if (sk2.length != 1) {
			if (showingtab != 0) {
				sk2[0].value = sk2[1].value;
			} else {
				sk2[1].value = sk2[0].value;
			}
		}
	}

};

function loadinchart() {
	var sumpro = 0;
	var sumint = 0;
	var sumkind = [0, 0, 0, 0, 0, 0, 0];
	for (var i = 0; i < table_id.length; i++) {
		var table = document.getElementById(table_id[i]);
		var row = table.rows;
		var sumtab = 0;
		for (var j = 0, k = 1; j < chart.skills[table_id[i]].length; j++, k++) {
			chart.skills[table_id[i]][j].name = row[k].cells[0].innerHTML;
			chart.skills[table_id[i]][j].ini = row[k].cells[1].innerHTML;
			var nam1 = table_id[i] + '-' + k + '-1';
			var nam2 = table_id[i] + '-' + k + '-2';
			var nam3 = table_id[i] + '-' + k + '-3';
			var v1 = document.getElementById(nam1).value;
			var v2 = document.getElementById(nam2).value;
			var v3 = document.getElementById(nam3).value;
			sumpro += Number(v2);
			sumint += Number(v3);
			sumtab += Number(v2) + Number(v3);
			chart.skills[table_id[i]][j].grow = v1;
			chart.skills[table_id[i]][j].pro = v2;
			chart.skills[table_id[i]][j].interest = v3;
			chart.skills[table_id[i]][j].total = row[k].cells[5].innerHTML;
		}
		sumkind[i] = sumtab;
	}
	var tabzdy = document.getElementById("zdy-t");
	var rowzdy = tabzdy.rows;
	for (var i = 0, k = 1; k < rowzdy.length; i++, k++) {
		var a = "zdy-t-" + k + '-1';
		var b = "zdy-t-" + k + '-2';
		var c = "zdy-t-" + k + '-3';
		var d = "zdy-t-" + k + '-4';
		var e = "zdy-t-" + k + '-5';
		var v1 = document.getElementById(a).value;
		var v2 = document.getElementById(b).value;
		var v3 = document.getElementById(c).value;
		var v4 = document.getElementById(d).value;
		var v5 = document.getElementById(e).value;
		sumpro += Number(v4);
		sumint += Number(v5);
	}
	var prohave = Number($('#pro_have').text());
	var prolast = prohave - sumpro;
	$('#pro_last').text(prolast);
	var inshave = Number($('#ins_have').text());
	var inslast = inshave - sumint;
	$('#ins_last').text(inslast);
	if (prolast < 0 || inslast < 0) {
		alert("技能点不足");
	}
	for (var p = 0; p < 5; p++) {
		rb(0, 0, 0, 0, 0, 0, 0);
	}
	jobwt = sumkind;
	rb(sumkind[0], sumkind[1], sumkind[2], sumkind[3], sumkind[4], sumkind[5], sumkind[6]);
};

function setelse() {
	var a = document.getElementById("str").value;
	var b = document.getElementById("con").value;
	var c = document.getElementById("siz").value;
	var d = document.getElementById("dex").value;
	var e = document.getElementById("app").value;
	var f = document.getElementById("int").value;
	var g = document.getElementById("pow").value;
	var h = document.getElementById("edu").value;
	var sumdb = Number(a) + Number(c);
	var db = 0;
	var build = 0;
	if (sumdb < 65) {
		db = -2;
		build = -2;
	} else if (sumdb < 85) {
		db = -1;
		build = -1;
	} else if (sumdb < 125) {
		db = 0;
		build = 0;
	} else if (sumdb < 165) {
		db = '+1D4';
		build = 1;
	} else if (sumdb < 205) {
		db = '+1D6';
		build = 2;
	} else if (sumdb < 285) {
		db = '+2D6';
		build = 3;
	}
	var sumhp = Number(b) + Number(c);
	var hp = parseInt(sumhp / 10);
	var mp = parseInt(g / 5);
	var mov = 0;
	if (a > c && d > c) {
		mov = 9;
	} else if (a > c || d > c || a == d == c) {
		mov = 8;
	} else {
		mov = 7;
	}
	var age = document.getElementById("ages").value;
	age = Number(age);
	if (age > 39 && age < 50) {
		mov = mov - 1;
	} else if (age > 49 && age < 60) {
		mov = mov - 2;
	} else if (age > 59 && age < 70) {
		mov = mov - 3;
	} else if (age > 69 && age < 80) {
		mov = mov - 4;
	} else if (age > 79) {
		mov = mov - 5;
	}
	var san = Number(g);
	var zstab = document.getElementById('zs-t');
	var row = zstab.rows[11];
	var ksl = Number(row.cells[5].innerHTML);
	var sanmax = 99 - ksl;
	document.getElementById('hp').value = hp + '/' + hp;
	document.getElementById('mp').value = mp + '/' + mp;
	document.getElementById('san').value = san + '/' + sanmax;
	document.getElementById('mov').value = mov;
	document.getElementById('build').value = build;
	document.getElementById('db').value = db;
};

function ra(A, B, C, D, E, F, G, H) {
	var width = 350,
		height = 300;
	var main = d3.select('.right svg').append('g')
		.classed('main', true)
		.attr('transform', "translate(" + width / 2 + ',' + height / 2 + ')');
	var data = {
		fieldNames: ['力量', '体质', '体型', '敏捷', '外貌', '智力', '意志', '教育'],
		values: [
			[A, B, C, D, E, F, G, H]
		]
	};
	var radius = 100,
		total = 8,
		level = 4,
		rangeMin = 0,
		rangeMax = 100,
		arc = 2 * Math.PI;
	var onePiece = arc / total;
	var polygons = {
		webs: [],
		webPoints: []
	};
	for (var k = level; k > 0; k--) {
		var webs = '',
			webPoints = [];
		var r = radius / level * k;
		for (var i = 0; i < total; i++) {
			var x = r * Math.sin(i * onePiece),
				y = r * Math.cos(i * onePiece);
			webs += x + ',' + y + ' ';
			webPoints.push({
				x: x,
				y: y
			});
		}
		polygons.webs.push(webs);
		polygons.webPoints.push(webPoints);
	}
	var webs = main.append('g')
		.classed('webs', true);
	webs.selectAll('polygon')
		.data(polygons.webs)
		.enter()
		.append('polygon')
		.attr('points', function (d) {
			return d;
		});
	var lines = main.append('g')
		.classed('lines', true);
	lines.selectAll('line')
		.data(polygons.webPoints[0])
		.enter()
		.append('line')
		.attr('x1', 0)
		.attr('y1', 0)
		.attr('x2', function (d) {
			return d.x;
		})
		.attr('y2', function (d) {
			return d.y;
		});
	var areasData = [];
	var values = data.values;
	for (var i = 0; i < values.length; i++) {
		var value = values[i],
			area = '',
			points = [];
		for (var k = 0; k < total; k++) {
			var r = radius * (value[k] - rangeMin) / (rangeMax - rangeMin);
			var x = r * Math.sin(k * onePiece),
				y = r * Math.cos(k * onePiece);
			area += x + ',' + y + ' ';
			points.push({
				x: x,
				y: y
			})
		}
		areasData.push({
			polygon: area,
			points: points
		});
	}
	var areas = main.append('g')
		.classed('areas', true);
	areas.selectAll('g')
		.data(areasData)
		.enter()
		.append('g')
		.attr('class', function (d, i) {
			return 'area' + (i + 1);
		});
	for (var i = 0; i < areasData.length; i++) {
		var area = areas.select('.area' + (i + 1)),
			areaData = areasData[i];
		area.append('polygon')
			.attr('points', areaData.polygon)
			.attr('stroke', function (d, index) {
				return getColor(i);
			})
			.attr('fill', function (d, index) {
				return getColor(i);
			});
		var circles = area.append('g')
			.classed('circles', true);
		circles.selectAll('circle')
			.data(areaData.points)
			.enter()
			.append('circle')
			.attr('cx', function (d) {
				return d.x;
			})
			.attr('cy', function (d) {
				return d.y;
			})
			.attr('r', 3)
			.attr('stroke', function (d, index) {
				return getColor(i);
			});
	}
	var textPoints = [];
	var textRadius = radius + 20;
	for (var i = 0; i < total; i++) {
		var x = textRadius * Math.sin(i * onePiece),
			y = textRadius * Math.cos(i * onePiece);
		textPoints.push({
			x: x,
			y: y
		});
	}
	var texts = main.append('g')
		.classed('texts', true);
	texts.selectAll('text')
		.data(textPoints)
		.enter()
		.append('text')
		.attr('x', function (d) {
			return d.x;
		})
		.attr('y', function (d) {
			return d.y;
		})
		.text(function (d, i) {
			return data.fieldNames[i];
		});
};

function getColor(idx) {
	var palette = [
		'#2ec7c9'
	]
	return palette[0];
};

function rb(A, B, C, D, E, F, G) {

	var arr = [A, B, C, D, E, F, G];

	var max = 0;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] > max) {
			max = Number(arr[i]);
		}
	}

	var width = 200,
		height = 250;
	var main = d3.select('.sixra svg').append('g')
		.classed('main', true)
		.attr('transform', "translate(" + width / 2 + ',' + height / 2 + ')');
	var data = {
		fieldNames: ['交流', '探索', '运动', '技能', '战斗', '医疗', '知识'],
		values: [
			[A, B, C, D, E, F, G]
		]
	};
	var radius = 65,
		total = 7,
		level = 4,
		rangeMin = 0,
		rangeMax = max + 10,
		arc = 2 * Math.PI;
	var onePiece = arc / total;
	var polygons = {
		webs: [],
		webPoints: []
	};
	for (var k = level; k > 0; k--) {
		var webs = '',
			webPoints = [];
		var r = radius / level * k;
		for (var i = 0; i < total; i++) {
			var x = r * Math.sin(i * onePiece),
				y = r * Math.cos(i * onePiece);
			webs += x + ',' + y + ' ';
			webPoints.push({
				x: x,
				y: y
			});
		}
		polygons.webs.push(webs);
		polygons.webPoints.push(webPoints);
	}
	var webs = main.append('g')
		.classed('webs', true);
	webs.selectAll('polygon')
		.data(polygons.webs)
		.enter()
		.append('polygon')
		.attr('points', function (d) {
			return d;
		});
	var lines = main.append('g')
		.classed('lines', true);
	lines.selectAll('line')
		.data(polygons.webPoints[0])
		.enter()
		.append('line')
		.attr('x1', 0)
		.attr('y1', 0)
		.attr('x2', function (d) {
			return d.x;
		})
		.attr('y2', function (d) {
			return d.y;
		});
	var areasData = [];
	var values = data.values;
	for (var i = 0; i < values.length; i++) {
		var value = values[i],
			area = '',
			points = [];
		for (var k = 0; k < total; k++) {
			var r = radius * (value[k] - rangeMin) / (rangeMax - rangeMin);
			var x = r * Math.sin(k * onePiece),
				y = r * Math.cos(k * onePiece);
			area += x + ',' + y + ' ';
			points.push({
				x: x,
				y: y
			})
		}
		areasData.push({
			polygon: area,
			points: points
		});
	}
	var areas = main.append('g')
		.classed('areas', true);
	areas.selectAll('g')
		.data(areasData)
		.enter()
		.append('g')
		.attr('class', function (d, i) {
			return 'area' + (i + 1);
		});
	for (var i = 0; i < areasData.length; i++) {
		var area = areas.select('.area' + (i + 1)),
			areaData = areasData[i];
		area.append('polygon')
			.attr('points', areaData.polygon)
			.attr('stroke', function (d, index) {
				return getColor(i);
			})
			.attr('fill', function (d, index) {
				return getColor(i);
			});
		var circles = area.append('g')
			.classed('circles', true);
		circles.selectAll('circle')
			.data(areaData.points)
			.enter()
			.append('circle')
			.attr('cx', function (d) {
				return d.x;
			})
			.attr('cy', function (d) {
				return d.y;
			})
			.attr('r', 3)
			.attr('stroke', function (d, index) {
				return getColor(i);
			});
	}
	var textPoints = [];
	var textRadius = radius + 20;
	for (var i = 0; i < total; i++) {
		var x = textRadius * Math.sin(i * onePiece),
			y = textRadius * Math.cos(i * onePiece);
		textPoints.push({
			x: x,
			y: y
		});
	}
	var texts = main.append('g')
		.classed('texts', true);
	texts.selectAll('text')
		.data(textPoints)
		.enter()
		.append('text')
		.attr('x', function (d) {
			return d.x;
		})
		.attr('y', function (d) {
			return d.y;
		})
		.text(function (d, i) {
			return data.fieldNames[i];
		});
};

function setskills_bz(data) {
	var table1 = document.getElementById('bz-t');
	var table2 = document.getElementById('bz-t-t');
	var table3 = document.getElementById('bz-t-f-o');
	var table4 = document.getElementById('bz-t-f-t');
	var table5 = document.getElementById('bz-t-a');
	table1.rows.length = 1;
	table2.rows.length = 1;
	table3.rows.length = 1;
	table4.rows.length = 1;
	table5.rows.length = 1;
	if (table1.rows.length != 1) {
		for (var i = table1.rows.length - 1; i > 0; i--) {
			table1.deleteRow(i)
		}
		for (var i = table2.rows.length - 1; i > 0; i--) {
			table2.deleteRow(i)
		}
		for (var i = table3.rows.length - 1; i > 0; i--) {
			table3.deleteRow(i)
		}
		for (var i = table4.rows.length - 1; i > 0; i--) {
			table4.deleteRow(i)
		}
		for (var i = table5.rows.length - 1; i > 0; i--) {
			table5.deleteRow(i)
		}
	}
	if (data.job.skills != undefined) {
		table1.style.display = "";
		table1.style.width = "550px";
		for (var i = 0, j = 1; i < data.job.skills.length; i++, j++) {
			var row1 = table1.insertRow(j);
			var duiying = skilljs[data.job.skills[i].kind][Number(data.job.skills[i].num) - 1];
			if (data.job.skills[i].name != undefined) {
				var c11 = row1.insertCell(0);
				c11.innerHTML = "<td>" + data.job.skills[i].name + "</td>";
				c11.title = data.job.skills[i].introduce
				c11.style.width = "160px";
				var c12 = row1.insertCell(1);
				c12.innerHTML = data.job.skills[i].ini;
				c12.style.width = "60px";
				var c13 = row1.insertCell(2);
				c13.innerHTML = "<input value='" + data.job.skills[i].grow + "' id='bz-t-" + j + "-1' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t',this.id,this.name) />";
				c13.style.width = "60px";
				var c14 = row1.insertCell(3);
				c14.innerHTML = "<input value='" + data.job.skills[i].pro + "' id='bz-t-" + j + "-2' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t',this.id,this.name) />";
				c14.style.width = "60px";
				var c15 = row1.insertCell(4);
				c15.innerHTML = "<input value='" + data.job.skills[i].interest + "' id='bz-t-" + j + "-3' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t',this.id,this.name) />";
				c15.style.width = "60px";
				var c16 = row1.insertCell(5);
				c16.innerHTML = data.job.skills[i].total;
				c16.style.width = "30px";
				var c17 = row1.insertCell(6);
				c17.innerHTML = hardsucc(data.job.skills[i].total);
				c17.style.width = "30px";
				var c18 = row1.insertCell(7);
				c18.innerHTML = sohardsucc(data.job.skills[i].total);
				c18.style.width = "30px";
			} else {
				var c11 = row1.insertCell(0);
				c11.innerHTML = "<td>" + duiying.name + "</td>";
				c11.title = duiying.introduce
				c11.style.width = "160px";
				var c12 = row1.insertCell(1);
				c12.innerHTML = duiying.ini;
				c12.style.width = "60px";
				var c13 = row1.insertCell(2);
				c13.innerHTML = "<input value='" + duiying.grow + "' id='bz-t-" + j + "-1' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t',this.id,this.name) />";
				c13.style.width = "60px";
				var c14 = row1.insertCell(3);
				c14.innerHTML = "<input value='" + duiying.pro + "' id='bz-t-" + j + "-2' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t',this.id,this.name) />";
				c14.style.width = "60px";
				var c15 = row1.insertCell(4);
				c15.innerHTML = "<input value='" + duiying.interest + "' id='bz-t-" + j + "-3' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t',this.id,this.name) />";
				c15.style.width = "60px";
				var c16 = row1.insertCell(5);
				c16.innerHTML = duiying.total;
				c16.style.width = "30px";
				var c17 = row1.insertCell(6);
				c17.innerHTML = hardsucc(duiying.total);
				c17.style.width = "30px";
				var c18 = row1.insertCell(7);
				c18.innerHTML = sohardsucc(duiying.total);
				c18.style.width = "30px";
			}
		}
	} else {
		table1.style.display = "none";
	}
	if (data.job.two != undefined) {
		table2.style.display = "";
		table2.style.width = "550px";
		for (var i = 0, j = 1; i < data.job.two.length; i++, j += 2) {
			var group = String.fromCharCode(65 + i);
			for (var k = 0; k < 2; k++) {
				var row2 = table2.insertRow(j + k);
				var c21 = row2.insertCell(0);
				var c22 = row2.insertCell(1);
				var c23 = row2.insertCell(2);
				var c24 = row2.insertCell(3);
				var c25 = row2.insertCell(4);
				var c26 = row2.insertCell(5);
				var c27 = row2.insertCell(6);
				var c28 = row2.insertCell(7);
				var c29 = row2.insertCell(8);
				c21.style.width = "140px";
				c22.style.width = "20px";
				c23.style.width = "60px";
				c24.style.width = "60px";
				c25.style.width = "60px";
				c26.style.width = "60px";
				c27.style.width = "30px";
				c28.style.width = "30px";
				c29.style.width = "30px";
				if (k == 0) {
					c21.innerHTML = data.job.two[i].o;
					c22.innerHTML = "<input type='radio' value='1' name='" + 'bz-t-t-' + group + "' id='" + j + "' onchange=cleanbz('bz-t-t',this.name,this.id) />";
					c23.innerHTML = data.job.two[i].oini;
					c24.innerHTML = "<input value='" + data.job.two[i].ogrow + "' id='bz-t-t-" + j + "-1' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-t',this.id,this.name) />";
					c25.innerHTML = "<input value='" + data.job.two[i].opro + "' id='bz-t-t-" + j + "-2' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-t',this.id,this.name) />";
					c26.innerHTML = "<input value='" + data.job.two[i].ointerest + "'  id='bz-t-t-" + j + "-3' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-t',this.id,this.name) />";
					c27.innerHTML = data.job.two[i].ototal;
					console.log(data.job.two[i].ototal);
					console.log(c27.innerHTML);
					c28.innerHTML = hardsucc(data.job.two[i].ototal);
					c29.innerHTML = sohardsucc(data.job.two[i].ototal);
				} else {
					var z = j + 1;
					c21.innerHTML = data.job.two[i].t;
					c22.innerHTML = "<input type='radio' value='2' name='" + 'bz-t-t-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-t',this.name,this.id) />";
					c23.innerHTML = data.job.two[i].tini;
					c24.innerHTML = "<input value='" + data.job.two[i].tgrow + "' id='bz-t-t-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-t',this.id,this.name) />";
					c25.innerHTML = "<input value='" + data.job.two[i].tpro + "' id='bz-t-t-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-t',this.id,this.name) />";
					c26.innerHTML = "<input value='" + data.job.two[i].tinterest + "'  id='bz-t-t-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-t',this.id,this.name) />";
					c27.innerHTML = data.job.two[i].ttotal;
					c28.innerHTML = hardsucc(data.job.two[i].ttotal);
					c29.innerHTML = sohardsucc(data.job.two[i].ttotal);
				}
			}
		}
	} else {
		table2.style.display = "none";
	}
	if (data.job.fouro != undefined) {
		table3.style.display = "";
		table3.style.width = "550px";
		if (data.job.fouro[0].o != undefined) {
			for (var i = 0, j = 1; i < data.job.fouro.length; i++, j += 4) {
				var group = String.fromCharCode(65 + i);
				for (var k = 0; k < 4; k++) {
					var row3 = table3.insertRow(j + k);
					var c31 = row3.insertCell(0);
					var c32 = row3.insertCell(1);
					var c33 = row3.insertCell(2);
					var c34 = row3.insertCell(3);
					var c35 = row3.insertCell(4);
					var c36 = row3.insertCell(5);
					var c37 = row3.insertCell(6);
					var c38 = row3.insertCell(7);
					var c39 = row3.insertCell(8);
					c31.style.width = "140px";
					c32.style.width = "20px";
					c33.style.width = "60px";
					c34.style.width = "60px";
					c35.style.width = "60px";
					c36.style.width = "60px";
					c37.style.width = "30px";
					c38.style.width = "30px";
					c39.style.width = "30px";
					var z = j + k;
					switch (k) {
						case 0:
							c31.innerHTML = data.job.fouro[i].o;
							c32.innerHTML = "<input type='radio' value='1' name='" + 'bz-t-f-o-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-o',this.name,this.id) />";
							c33.innerHTML = data.job.fouro[i].oini;
							c34.innerHTML = "<input value='" + data.job.fouro[i].ogrow + "' id='bz-t-f-o-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c35.innerHTML = "<input value='" + data.job.fouro[i].opro + "' id='bz-t-f-o-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c36.innerHTML = "<input value='" + data.job.fouro[i].ointerest + "' id='bz-t-f-o-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c37.innerHTML = data.job.fouro[i].ototal;
							c38.innerHTML = hardsucc(data.job.fouro[i].ototal);
							c39.innerHTML = sohardsucc(data.job.fouro[i].ototal);
							break;
						case 1:
							c31.innerHTML = data.job.fouro[i].t;
							c32.innerHTML = "<input type='radio' value='2' name='" + 'bz-t-f-o-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-o',this.name,this.id) />";
							c33.innerHTML = data.job.fouro[i].tini;
							c34.innerHTML = "<input value='" + data.job.fouro[i].tgrow + "' id='bz-t-f-o-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c35.innerHTML = "<input value='" + data.job.fouro[i].tpro + "' id='bz-t-f-o-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c36.innerHTML = "<input value='" + data.job.fouro[i].tinterest + "' id='bz-t-f-o-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c37.innerHTML = data.job.fouro[i].ttotal;
							c38.innerHTML = hardsucc(data.job.fouro[i].ttotal);
							c39.innerHTML = sohardsucc(data.job.fouro[i].ttotal);
							break;
						case 2:
							c31.innerHTML = data.job.fouro[i].h;
							c32.innerHTML = "<input type='radio' value='3' name='" + 'bz-t-f-o-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-o',this.name,this.id) />";
							c33.innerHTML = data.job.fouro[i].hini;
							c34.innerHTML = "<input value='" + data.job.fouro[i].hgrow + "' id='bz-t-f-o-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c35.innerHTML = "<input value='" + data.job.fouro[i].hpro + "' id='bz-t-f-o-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c36.innerHTML = "<input value='" + data.job.fouro[i].hinterest + "' id='bz-t-f-o-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c37.innerHTML = data.job.fouro[i].htotal;
							c38.innerHTML = hardsucc(data.job.fouro[i].htotal);
							c39.innerHTML = sohardsucc(data.job.fouro[i].htotal);
							break;
						case 3:
							c31.innerHTML = data.job.fouro[i].f;
							c32.innerHTML = "<input type='radio' value='4' name='" + 'bz-t-f-o-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-o',this.name,this.id) />";
							c33.innerHTML = data.job.fouro[i].fini;
							c34.innerHTML = "<input value='" + data.job.fouro[i].fgrow + "' id='bz-t-f-o-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c35.innerHTML = "<input value='" + data.job.fouro[i].fpro + "' id='bz-t-f-o-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c36.innerHTML = "<input value='" + data.job.fouro[i].finterest + "' id='bz-t-f-o-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c37.innerHTML = data.job.fouro[i].ftotal;
							c38.innerHTML = hardsucc(data.job.fouro[i].ftotal);
							c39.innerHTML = sohardsucc(data.job.fouro[i].ftotal);
							break;
					}
				}
			}
		} else {
			for (var i = 0, j = 1; i < data.job.fouro.length; i++, j += 4) {
				var group = String.fromCharCode(65 + i);
				for (var k = 0; k < 4; k++) {
					var row3 = table3.insertRow(j + k);
					var c31 = row3.insertCell(0);
					var c32 = row3.insertCell(1);
					var c33 = row3.insertCell(2);
					var c34 = row3.insertCell(3);
					var c35 = row3.insertCell(4);
					var c36 = row3.insertCell(5);
					var c37 = row3.insertCell(6);
					var c38 = row3.insertCell(7);
					var c39 = row3.insertCell(8);
					c31.style.width = "140px";
					c32.style.width = "20px";
					c33.style.width = "60px";
					c34.style.width = "60px";
					c35.style.width = "60px";
					c36.style.width = "60px";
					c37.style.width = "30px";
					c38.style.width = "30px";
					c39.style.width = "30px";
					var z = j + k;
					switch (k) {
						case 0:
							c31.innerHTML = skilljs[data.job.fouro[i].okind][Number(data.job.fouro[i].onum) - 1].name;
							c32.innerHTML = "<input type='radio' value='1' name='" + 'bz-t-f-o-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-o',this.name,this.id) />";
							c33.innerHTML = skilljs[data.job.fouro[i].okind][Number(data.job.fouro[i].onum) - 1].ini;
							c34.innerHTML = "<input value='" + skilljs[data.job.fouro[i].okind][Number(data.job.fouro[i].onum) - 1].grow + "' id='bz-t-f-o-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c35.innerHTML = "<input value='" + skilljs[data.job.fouro[i].okind][Number(data.job.fouro[i].onum) - 1].pro + "' id='bz-t-f-o-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c36.innerHTML = "<input value='" + skilljs[data.job.fouro[i].okind][Number(data.job.fouro[i].onum) - 1].interest + "' id='bz-t-f-o-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c37.innerHTML = skilljs[data.job.fouro[i].okind][Number(data.job.fouro[i].onum) - 1].total;
							c38.innerHTML = hardsucc(skilljs[data.job.fouro[i].okind][Number(data.job.fouro[i].onum) - 1].total);
							c39.innerHTML = sohardsucc(skilljs[data.job.fouro[i].okind][Number(data.job.fouro[i].onum) - 1].total);
							break;
						case 1:
							c31.innerHTML = skilljs[data.job.fouro[i].tkind][Number(data.job.fouro[i].tnum) - 1].name;
							c32.innerHTML = "<input type='radio' value='2' name='" + 'bz-t-f-o-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-o',this.name,this.id) />";
							c33.innerHTML = skilljs[data.job.fouro[i].tkind][Number(data.job.fouro[i].tnum) - 1].ini;
							c34.innerHTML = "<input value='" + skilljs[data.job.fouro[i].tkind][Number(data.job.fouro[i].tnum) - 1].grow + "' id='bz-t-f-o-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c35.innerHTML = "<input value='" + skilljs[data.job.fouro[i].tkind][Number(data.job.fouro[i].tnum) - 1].pro + "' id='bz-t-f-o-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c36.innerHTML = "<input value='" + skilljs[data.job.fouro[i].tkind][Number(data.job.fouro[i].tnum) - 1].interest + "' id='bz-t-f-o-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c37.innerHTML = skilljs[data.job.fouro[i].tkind][Number(data.job.fouro[i].tnum) - 1].total;
							c38.innerHTML = hardsucc(skilljs[data.job.fouro[i].tkind][Number(data.job.fouro[i].tnum) - 1].total);
							c39.innerHTML = sohardsucc(skilljs[data.job.fouro[i].tkind][Number(data.job.fouro[i].tnum) - 1].total);
							break;
						case 2:
							c31.innerHTML = skilljs[data.job.fouro[i].hkind][Number(data.job.fouro[i].hnum) - 1].name;
							c32.innerHTML = "<input type='radio' value='3' name='" + 'bz-t-f-o-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-o',this.name,this.id) />";
							c33.innerHTML = skilljs[data.job.fouro[i].hkind][Number(data.job.fouro[i].hnum) - 1].ini;
							c34.innerHTML = "<input value='" + skilljs[data.job.fouro[i].hkind][Number(data.job.fouro[i].hnum) - 1].grow + "' id='bz-t-f-o-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c35.innerHTML = "<input value='" + skilljs[data.job.fouro[i].hkind][Number(data.job.fouro[i].hnum) - 1].pro + "' id='bz-t-f-o-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c36.innerHTML = "<input value='" + skilljs[data.job.fouro[i].hkind][Number(data.job.fouro[i].hnum) - 1].interest + "' id='bz-t-f-o-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c37.innerHTML = skilljs[data.job.fouro[i].hkind][Number(data.job.fouro[i].hnum) - 1].total;
							c38.innerHTML = hardsucc(skilljs[data.job.fouro[i].hkind][Number(data.job.fouro[i].hnum) - 1].total);
							c39.innerHTML = sohardsucc(skilljs[data.job.fouro[i].hkind][Number(data.job.fouro[i].hnum) - 1].total);
							break;
						case 3:
							c31.innerHTML = skilljs[data.job.fouro[i].fkind][Number(data.job.fouro[i].fnum) - 1].name;
							c32.innerHTML = "<input type='radio' value='4' name='" + 'bz-t-f-o-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-o',this.name,this.id) />";
							c33.innerHTML = skilljs[data.job.fouro[i].fkind][Number(data.job.fouro[i].fnum) - 1].ini;
							c34.innerHTML = "<input value='" + skilljs[data.job.fouro[i].fkind][Number(data.job.fouro[i].fnum) - 1].grow + "' id='bz-t-f-o-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c35.innerHTML = "<input value='" + skilljs[data.job.fouro[i].fkind][Number(data.job.fouro[i].fnum) - 1].pro + "' id='bz-t-f-o-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c36.innerHTML = "<input value='" + skilljs[data.job.fouro[i].fkind][Number(data.job.fouro[i].fnum) - 1].interest + "' id='bz-t-f-o-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-o',this.id,this.name) />";
							c37.innerHTML = skilljs[data.job.fouro[i].fkind][Number(data.job.fouro[i].fnum) - 1].total;
							c38.innerHTML = hardsucc(skilljs[data.job.fouro[i].fkind][Number(data.job.fouro[i].fnum) - 1].total);
							c39.innerHTML = sohardsucc(skilljs[data.job.fouro[i].fkind][Number(data.job.fouro[i].fnum) - 1].total);
							break;
					}
				}
			}
		}
	} else {
		table3.style.display = "none";
	}
	if (data.job.fourt != undefined) {
		table4.style.display = "";
		table4.style.width = "550px";
		if (data.job.fourt[0].o != undefined) {
			for (var i = 0, j = 1; i < data.job.fourt.length; i++, j += 4) {
				var group = String.fromCharCode(65 + i);
				for (var k = 0; k < 4; k++) {
					var row4 = table4.insertRow(j + k);
					var c41 = row4.insertCell(0);
					var c42 = row4.insertCell(1);
					var c43 = row4.insertCell(2);
					var c44 = row4.insertCell(3);
					var c45 = row4.insertCell(4);
					var c46 = row4.insertCell(5);
					var c47 = row4.insertCell(6);
					var c48 = row4.insertCell(7);
					var c49 = row4.insertCell(8);
					c41.style.width = "140px";
					c42.style.width = "20px";
					c43.style.width = "60px";
					c44.style.width = "60px";
					c45.style.width = "60px";
					c46.style.width = "60px";
					c47.style.width = "30px";
					c48.style.width = "30px";
					c49.style.width = "30px";
					var z = j + k;
					switch (k) {
						case 0:
							c41.innerHTML = data.job.fourt[i].o;
							c42.innerHTML = "<input type='checkbox' value='1' name='" + 'bz-t-f-t-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-t',this.name,this.id) />";
							c43.innerHTML = data.job.fourt[i].oini;
							c44.innerHTML = "<input value='" + data.job.fourt[i].ogrow + "' id='bz-t-f-t-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c45.innerHTML = "<input value='" + data.job.fourt[i].opro + "' id='bz-t-f-t-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c46.innerHTML = "<input value='" + data.job.fourt[i].ointerest + "' id='bz-t-f-t-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c47.innerHTML = data.job.fourt[i].ototal;
							c48.innerHTML = hardsucc(data.job.fourt[i].ototal);
							c49.innerHTML = sohardsucc(data.job.fourt[i].ototal);
							break;
						case 1:
							c41.innerHTML = data.job.fourt[i].t;
							c42.innerHTML = "<input type='checkbox' value='2' name='" + 'bz-t-f-t-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-t',this.name,this.id) />";
							c43.innerHTML = data.job.fourt[i].tini;
							c44.innerHTML = "<input value='" + data.job.fourt[i].tgrow + "' id='bz-t-f-t-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c45.innerHTML = "<input value='" + data.job.fourt[i].tpro + "' id='bz-t-f-t-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c46.innerHTML = "<input value='" + data.job.fourt[i].tinterest + "' id='bz-t-f-t-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c47.innerHTML = data.job.fourt[i].ttotal;
							c48.innerHTML = hardsucc(data.job.fourt[i].ttotal);
							c49.innerHTML = sohardsucc(data.job.fourt[i].ttotal);
							break;
						case 2:
							c41.innerHTML = data.job.fourt[i].h;
							c42.innerHTML = "<input type='checkbox' value='3' name='" + 'bz-t-f-t-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-t',this.name,this.id) />";
							c43.innerHTML = data.job.fourt[i].hini;
							c44.innerHTML = "<input value='" + data.job.fourt[i].hgrow + "' id='bz-t-f-t-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c45.innerHTML = "<input value='" + data.job.fourt[i].hpro + "' id='bz-t-f-t-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c46.innerHTML = "<input value='" + data.job.fourt[i].hinterest + "' id='bz-t-f-t-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c47.innerHTML = data.job.fourt[i].htotal;
							c48.innerHTML = hardsucc(data.job.fourt[i].htotal);
							c49.innerHTML = sohardsucc(data.job.fourt[i].htotal);
							break;
						case 3:
							c41.innerHTML = data.job.fourt[i].f;
							c42.innerHTML = "<input type='checkbox' value='4' name='" + 'bz-t-f-t-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-t',this.name,this.id) />";
							c43.innerHTML = data.job.fourt[i].fini;
							c44.innerHTML = "<input value='" + data.job.fourt[i].fgrow + "' id='bz-t-f-t-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c45.innerHTML = "<input value='" + data.job.fourt[i].fpro + "' id='bz-t-f-t-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c46.innerHTML = "<input value='" + data.job.fourt[i].finterest + "' id='bz-t-f-t-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c47.innerHTML = data.job.fourt[i].ftotal;
							c48.innerHTML = hardsucc(data.job.fourt[i].ftotal);
							c49.innerHTML = sohardsucc(data.job.fourt[i].ftotal);
							break;
					}
				}
			}
		} else {
			for (var i = 0, j = 1; i < data.job.fourt.length; i++, j += 4) {
				var group = String.fromCharCode(65 + i);
				for (var k = 0; k < 4; k++) {
					var row4 = table4.insertRow(j + k);
					var c41 = row4.insertCell(0);
					var c42 = row4.insertCell(1);
					var c43 = row4.insertCell(2);
					var c44 = row4.insertCell(3);
					var c45 = row4.insertCell(4);
					var c46 = row4.insertCell(5);
					var c47 = row4.insertCell(6);
					var c48 = row4.insertCell(7);
					var c49 = row4.insertCell(8);
					c41.style.width = "140px";
					c42.style.width = "20px";
					c43.style.width = "60px";
					c44.style.width = "60px";
					c45.style.width = "60px";
					c46.style.width = "60px";
					c47.style.width = "30px";
					c48.style.width = "30px";
					c49.style.width = "30px";
					var z = j + k;
					switch (k) {
						case 0:
							c41.innerHTML = skilljs[data.job.fourt[i].okind][Number(data.job.fourt[i].onum) - 1].name;
							c42.innerHTML = "<input type='checkbox' value='1' name='" + 'bz-t-f-t-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-t',this.name,this.id) />";
							c43.innerHTML = skilljs[data.job.fourt[i].okind][Number(data.job.fourt[i].onum) - 1].ini;
							c44.innerHTML = "<input value='" + skilljs[data.job.fourt[i].okind][Number(data.job.fourt[i].onum) - 1].grow + "' id='bz-t-f-t-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c45.innerHTML = "<input value='" + skilljs[data.job.fourt[i].okind][Number(data.job.fourt[i].onum) - 1].pro + "' id='bz-t-f-t-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c46.innerHTML = "<input value='" + skilljs[data.job.fourt[i].okind][Number(data.job.fourt[i].onum) - 1].interest + "' id='bz-t-f-t-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c47.innerHTML = skilljs[data.job.fourt[i].okind][Number(data.job.fourt[i].onum) - 1].total;
							c48.innerHTML = hardsucc(skilljs[data.job.fourt[i].okind][Number(data.job.fourt[i].onum) - 1].total);
							c49.innerHTML = sohardsucc(skilljs[data.job.fourt[i].okind][Number(data.job.fourt[i].onum) - 1].total);
							break;
						case 1:
							c41.innerHTML = skilljs[data.job.fourt[i].tkind][Number(data.job.fourt[i].tnum) - 1].name;
							c42.innerHTML = "<input type='checkbox' value='2' name='" + 'bz-t-f-t-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-t',this.name,this.id) />";
							c43.innerHTML = skilljs[data.job.fourt[i].tkind][Number(data.job.fourt[i].tnum) - 1].ini;
							c44.innerHTML = "<input value='" + skilljs[data.job.fourt[i].tkind][Number(data.job.fourt[i].tnum) - 1].grow + "' id='bz-t-f-t-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c45.innerHTML = "<input value='" + skilljs[data.job.fourt[i].tkind][Number(data.job.fourt[i].tnum) - 1].pro + "' id='bz-t-f-t-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c46.innerHTML = "<input value='" + skilljs[data.job.fourt[i].tkind][Number(data.job.fourt[i].tnum) - 1].interest + "' id='bz-t-f-t-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c47.innerHTML = skilljs[data.job.fourt[i].tkind][Number(data.job.fourt[i].tnum) - 1].total;
							c48.innerHTML = hardsucc(skilljs[data.job.fourt[i].tkind][Number(data.job.fourt[i].tnum) - 1].total);
							c49.innerHTML = sohardsucc(skilljs[data.job.fourt[i].tkind][Number(data.job.fourt[i].tnum) - 1].total);
							break;
						case 2:
							c41.innerHTML = skilljs[data.job.fourt[i].hkind][Number(data.job.fourt[i].hnum) - 1].name;
							c42.innerHTML = "<input type='checkbox' value='3' name='" + 'bz-t-f-t-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-t',this.name,this.id) />";
							c43.innerHTML = skilljs[data.job.fourt[i].hkind][Number(data.job.fourt[i].hnum) - 1].ini;
							c44.innerHTML = "<input value='" + skilljs[data.job.fourt[i].hkind][Number(data.job.fourt[i].hnum) - 1].grow + "' id='bz-t-f-t-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c45.innerHTML = "<input value='" + skilljs[data.job.fourt[i].hkind][Number(data.job.fourt[i].hnum) - 1].pro + "' id='bz-t-f-t-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c46.innerHTML = "<input value='" + skilljs[data.job.fourt[i].hkind][Number(data.job.fourt[i].hnum) - 1].interest + "' id='bz-t-f-t-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c47.innerHTML = skilljs[data.job.fourt[i].hkind][Number(data.job.fourt[i].hnum) - 1].total;
							c48.innerHTML = hardsucc(skilljs[data.job.fourt[i].hkind][Number(data.job.fourt[i].hnum) - 1].total);
							c49.innerHTML = sohardsucc(skilljs[data.job.fourt[i].hkind][Number(data.job.fourt[i].hnum) - 1].total);
							break;
						case 3:
							c41.innerHTML = skilljs[data.job.fourt[i].fkind][Number(data.job.fourt[i].fnum) - 1].name;
							c42.innerHTML = "<input type='checkbox' value='4' name='" + 'bz-t-f-t-' + group + "' id='" + z + "' onchange=cleanbz('bz-t-f-t',this.name,this.id) />";
							c43.innerHTML = skilljs[data.job.fourt[i].fkind][Number(data.job.fourt[i].fnum) - 1].ini;
							c44.innerHTML = "<input value='" + skilljs[data.job.fourt[i].fkind][Number(data.job.fourt[i].fnum) - 1].grow + "' id='bz-t-f-t-" + z + "-1' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c45.innerHTML = "<input value='" + skilljs[data.job.fourt[i].fkind][Number(data.job.fourt[i].fnum) - 1].pro + "' id='bz-t-f-t-" + z + "-2' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c46.innerHTML = "<input value='" + skilljs[data.job.fourt[i].fkind][Number(data.job.fourt[i].fnum) - 1].interest + "' id='bz-t-f-t-" + z + "-3' name='" + z + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-f-t',this.id,this.name) />";
							c47.innerHTML = skilljs[data.job.fourt[i].fkind][Number(data.job.fourt[i].fnum) - 1].total;
							c48.innerHTML = hardsucc(skilljs[data.job.fourt[i].fkind][Number(data.job.fourt[i].fnum) - 1].total);
							c49.innerHTML = sohardsucc(skilljs[data.job.fourt[i].fkind][Number(data.job.fourt[i].fnum) - 1].total);
							break;
					}
				}
			}
		}

	} else {
		table4.style.display = "none";
	}
	if (data.job.all != undefined) {
		table5.style.display = "";
		table5.style.width = "550px";
		for (var i = 0, j = 1; i < data.job.all.length; i++, j++) {
			var row5 = table5.insertRow(j);
			var c51 = row5.insertCell(0);
			c51.innerHTML = "<td>" + data.job.all[i].name + "</td>";
			c51.style.width = "160px";
			var c52 = row5.insertCell(1);
			c52.innerHTML = data.job.all[i].ini;
			c52.style.width = "60px";
			var c53 = row5.insertCell(2);
			c53.innerHTML = "<input value='" + data.job.all[i].grow + "' id='bz-t-a-" + j + "-1' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-a',this.id,this.name) />";
			c53.style.width = "60px";
			var c54 = row5.insertCell(3);
			c54.innerHTML = "<input value='" + data.job.all[i].pro + "' id='bz-t-a-" + j + "-2' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-a',this.id,this.name) />";
			c54.style.width = "60px";
			var c55 = row5.insertCell(4);
			c55.innerHTML = "<input value='" + data.job.all[i].interest + "' id='bz-t-a-" + j + "-3' name='" + j + "' style='width:60px;border:0px;font-size:17px;' onchange=changesk('bz-t-a',this.id,this.name) />";
			c55.style.width = "60px";
			var c56 = row5.insertCell(5);
			c56.innerHTML = data.job.all[i].total;
			c56.style.width = "30px";
			var c57 = row5.insertCell(6);
			c57.innerHTML = data.job.all[i].total;
			c57.style.width = "30px";
			var c58 = row5.insertCell(7);
			c58.innerHTML = data.job.all[i].total;
			c58.style.width = "30px";
		}
	} else {
		table5.style.display = "none";
	}
	settablecol_bz();
};

function setskills(tableid, skillkind) {
	var tablelse = document.getElementById(tableid);
	for (var i = tablelse.rows.length - 1; i > 0; i--) {
		tablelse.deleteRow(i)
	}
	for (var z = 0, y = 1; z < skilljs[skillkind].length; z++, y++) {
		skilljs[skillkind][z].grow = "";
		skilljs[skillkind][z].pro = "";
		skilljs[skillkind][z].interest = "";
		skilljs[skillkind][z].total = skilljs[skillkind][z].ini;
		var rowelse = tablelse.insertRow(y);
		var c1 = rowelse.insertCell(0);
		c1.innerHTML = "<td>" + skilljs[skillkind][z].name + "</td>";
		c1.title = skilljs[skillkind][z].introduce;
		c1.style.width = "130px";
		var c2 = rowelse.insertCell(1);
		c2.innerHTML = skilljs[skillkind][z].ini;
		c2.style.width = "45px";
		var c3 = rowelse.insertCell(2);
		c3.innerHTML = "<input value='" + skilljs[skillkind][z].grow + "' id='" + tableid + '-' + y + "-1' name='" + y + "' style='width:50px;border:0px;font-size:17px;' onchange=changesk('" + tableid + "',this.id,this.name) />";
		c3.style.width = "50px";
		var c4 = rowelse.insertCell(3);
		c4.innerHTML = "<input value='" + skilljs[skillkind][z].pro + "' id='" + tableid + '-' + y + "-2' name='" + y + "' style='width:50px;border:0px;font-size:17px;' onchange=changesk('" + tableid + "',this.id,this.name) />";
		c4.style.width = "50px";
		var c5 = rowelse.insertCell(4);
		c5.innerHTML = "<input value='" + skilljs[skillkind][z].interest + "' id='" + tableid + '-' + y + "-3' name='" + y + "' style='width:50px;border:0px;font-size:17px;' onchange=changesk('" + tableid + "',this.id,this.name) />";
		c5.style.width = "50px";
		var c6 = rowelse.insertCell(5);
		c6.innerHTML = skilljs[skillkind][z].total;
		c6.style.width = "20px";
		var c7 = rowelse.insertCell(6);
		c7.innerHTML = hardsucc(skilljs[skillkind][z].total);
		c7.style.width = "20px";
		var c8 = rowelse.insertCell(7);
		c8.innerHTML = sohardsucc(skilljs[skillkind][z].total);
		c8.style.width = "20px";
		var c9 = rowelse.insertCell(8);
		c9.innerHTML = "<input type='checkbox' name='bzc' class='bzc' id='" + y + "' onchange=changecheck('" + tableid + "',this.id) />";
		c9.style.width = "50px";
		c9.style.textAlign = "center";
	}
	settablecol();
};

function setskillszdy() {
	var tableid = "zdy-t";
	var tablelse = document.getElementById(tableid);
	var i = tablelse.rows.length;
	var rowelse = tablelse.insertRow(i);
	var c1 = rowelse.insertCell(0);
	c1.innerHTML = "<input value='' id='" + tableid + '-' + i + "-1' name='" + i + "' style='width:150px;border:0px;font-size:17px;' />";
	c1.style.width = "130px";
	var c2 = rowelse.insertCell(1);
	c2.innerHTML = "<input value='' id='" + tableid + '-' + i + "-2' name='" + i + "' style='width:40px;border:0px;font-size:17px;' onchange=changeskzdy(this.name) />";
	c2.style.width = "40px";
	var c3 = rowelse.insertCell(2);
	c3.innerHTML = "<input value='' id='" + tableid + '-' + i + "-3' name='" + i + "' style='width:40px;border:0px;font-size:17px;' onchange=changeskzdy(this.name) />";
	c3.style.width = "40px";
	var c4 = rowelse.insertCell(3);
	c4.innerHTML = "<input value='' id='" + tableid + '-' + i + "-4' name='" + i + "' style='width:60px;border:0px;font-size:17px;' onchange=changeskzdy(this.name) />";
	c4.style.width = "50px";
	var c5 = rowelse.insertCell(4);
	c5.innerHTML = "<input value='' id='" + tableid + '-' + i + "-5' name='" + i + "' style='width:60px;border:0px;font-size:17px;' onchange=changeskzdy(this.name) />";
	c5.style.width = "50px";
	var c6 = rowelse.insertCell(5);
	c6.innerHTML = "";
	c6.style.width = "20px";
	var c7 = rowelse.insertCell(6);
	c7.innerHTML = "";
	c7.style.width = "20px";
	var c8 = rowelse.insertCell(7);
	c8.innerHTML = "";
	c8.style.width = "20px";
	settablecolzdy();
};

function settablecolzdy() {
	var table = document.getElementById("zdy-t");
	var row = table.rows;
	for (var j = 0; j < row.length; j++) {
		if (j % 2 == 0) {
			row[j].bgColor = "d6e1ff";
			if (j != 0) {
				var a = 'zdy-t-' + j + '-1';
				var b = 'zdy-t-' + j + '-2';
				var c = 'zdy-t-' + j + '-3';
				var d = 'zdy-t-' + j + '-4';
				var e = 'zdy-t-' + j + '-5';
				$("input[id=" + a + "]").css("background-color", "#d6e1ff");
				$("input[id=" + b + "]").css("background-color", "#d6e1ff");
				$("input[id=" + c + "]").css("background-color", "#d6e1ff");
				$("input[id=" + d + "]").css("background-color", "#d6e1ff");
				$("input[id=" + e + "]").css("background-color", "#d6e1ff");
			}
		}
	}
};

function settablecol() {
	for (var i = 0; i < table_id.length; i++) {
		var table = document.getElementById(table_id[i]);
		var row = table.rows;
		for (var j = 0; j < row.length; j++) {
			if (j % 2 == 0) {
				row[j].bgColor = "d6e1ff";
				if (j != 0) {
					var a = table_id[i] + '-' + j + '-1';
					var b = table_id[i] + '-' + j + '-2';
					var c = table_id[i] + '-' + j + '-3';
					$("input[id=" + a + "]").css("background-color", "#d6e1ff");
					$("input[id=" + b + "]").css("background-color", "#d6e1ff");
					$("input[id=" + c + "]").css("background-color", "#d6e1ff");
				}
			}
		}
	}
};

function settablecol_bz() {
	var bztabid = ['bz-t', 'bz-t-t', 'bz-t-f-o', 'bz-t-f-t', 'bz-t-a'];
	for (var i = 0; i < bztabid.length; i++) {
		var table = document.getElementById(bztabid[i]);
		var row = table.rows;
		for (var j = 0; j < row.length; j++) {
			if (j % 2 == 0) {
				row[j].bgColor = "d6e1ff";
				if (j != 0) {
					var a = bztabid[i] + '-' + j + '-1';
					var b = bztabid[i] + '-' + j + '-2';
					var c = bztabid[i] + '-' + j + '-3';
					$("input[id=" + a + "]").css("background-color", "#d6e1ff");
					$("input[id=" + b + "]").css("background-color", "#d6e1ff");
					$("input[id=" + c + "]").css("background-color", "#d6e1ff");
				}
			}
		}
	}
};

$().ready(function () {
	$(".tit li").mouseover(function () {
		var _index = $(this).index();
		$(".con>div").eq(_index).show().siblings().hide();
		$(this).addClass("change").siblings().removeClass("change");
	});
});

function loadweapons() {
	var arr = ["cg", "sq", "bbq", "tsq", "xdq", "cfq", "jjbq", "jq", "qt"];
	for (var i = 0; i < arr.length; i++) {
		var len = weaponsjs[arr[i]].length;
		for (var j = 0; j < len; j++) {
			var a = "#wq-s1" + arr[i];
			var b = "#wq-s2" + arr[i];
			var c = "#wq-s3" + arr[i];
			var d = "#wq-s4" + arr[i];
			var e = "#wq-s5" + arr[i];
			var result = "<option value='" + j + "'>" + weaponsjs[arr[i]][j].name + "</option>";
			$(a).append(result);
			$(b).append(result);
			$(c).append(result);
			$(d).append(result);
			$(e).append(result);
		}
	}
};

function setweapons(tabid, tabval) {
	console.log(tabid);
	console.log(tabval);
	var arr = ["cg", "sq", "bbq", "tsq", "xdq", "cfq", "jjbq", "jq", "qt"];
	var table = document.getElementById("wq-t");
	var tab = document.getElementById(tabid);
	var op = $("option:selected", tab).parent().index();
	var opid = arr[op - 1];
	var num = Number(tabid.charAt(tabid.length - 1));
	var row = table.rows[num];
	var cell = row.cells;
	if (tabval == "请选择") {
		cell[1].innerHTML = "";
		cell[2].innerHTML = "";
		cell[3].innerHTML = "";
		cell[4].innerHTML = "";
		cell[5].innerHTML = "";
		cell[6].innerHTML = "";
		cell[7].innerHTML = "";
		cell[8].innerHTML = "";
	} else if (opid == "qt" && tabval == "16") {
		var a = prompt("请输入武器名");
		var a_op = "<option selected>" + a + "</option>";
		$('#' + tabid).append(a_op);
		var b = prompt("使用技能");
		var c = prompt("伤害");
		var d = prompt("是否贯穿");
		var e = prompt("射程");
		var f = prompt("装弹数");
		var g = prompt("价格($)");
		var h = prompt("故障值");
		var i = prompt("时代");
		cell[1].innerHTML = b;
		cell[2].innerHTML = c;
		cell[3].innerHTML = d;
		cell[4].innerHTML = e;
		cell[5].innerHTML = f;
		cell[6].innerHTML = g;
		cell[7].innerHTML = h;
		cell[8].innerHTML = i;
	} else {
		cell[1].innerHTML = weaponsjs[opid][tabval].skill;
		cell[2].innerHTML = weaponsjs[opid][tabval].dam;
		if (weaponsjs[opid][tabval].tho == 1) {
			cell[3].innerHTML = "√";
		} else {
			cell[3].innerHTML = "×";
		}
		cell[4].innerHTML = weaponsjs[opid][tabval].range;
		cell[5].innerHTML = weaponsjs[opid][tabval].num;
		cell[6].innerHTML = weaponsjs[opid][tabval].price;
		cell[7].innerHTML = weaponsjs[opid][tabval].err;
		cell[8].innerHTML = weaponsjs[opid][tabval].time;
	}
};

function savechart() {
	loadinchart();
	var bz = [];
	var elsesk = [];
	save.job = $.extend(true, {}, chart.job);
	if (save.job.all) {
		for (var i = 0; i < save.job.all.length; i++) {
			save.job.all[i].name = save.job.all[i].name.replace(/same/g, "");
		}
	}
	console.log(save.job);
	if (save.job.value == "113") {
		save.job.job = $("#career1").find("option:selected").text();
		save.job.propointval = document.getElementById("propointzd").value;
		$.ajax({
			type: "post",
			url: "https://maoyetrpg.com/api/rolecard/info?userid=" + uid + "&token=" + token + "&name=job",
			data: JSON.stringify(save.job),
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				console.log(data);
			}
		});
	}
	for (var i = 0; i < table_id.length; i++) {
		var len = chart.skills[table_id[i]].length;
		for (var j = 0; j < len; j++) {
			if (chart.skills[table_id[i]][j].ini != chart.skills[table_id[i]][j].total) {
				if (chart.skills[table_id[i]][j].pro != 0 || chart.skills[table_id[i]][j].pro != "0") {
					bz.push(chart.skills[table_id[i]][j]);
				} else {
					elsesk.push(chart.skills[table_id[i]][j]);
				}
			}
		}
	}
	save.zdy = chart.zdy;
	save.bz = bz;
	save.elsesk = elsesk;
	console.log(chart.zdy);
	if (chart.zdy.length > 0) {
		for (var zdycount = 0; zdycount < chart.zdy.length; zdycount++) {
			save.zdy[zdycount].userid = uid;
			$.ajax({
				type: "post",
				url: "https://maoyetrpg.com/api/rolecard/info?userid=" + uid + "&token=" + token + "&name=skill",
				data: JSON.stringify(save.zdy[zdycount]),
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					console.log(data);
				}
			});
		}

	}
	save.jobwt = jobwt;
	var selsk = ["kexue0", "kexue1", "kexue2", "shengcun", "shengcun1", "shengcun2", "jiyi", "jiyi1", "jiyi2", "jiashi", "jiashi1", "jiashi2", "muyu", "waiyu", "gedou", "gedou1", "gedou2", "gedou2", "sheji", "sheji1", "sheji2"];
	var selskval = [];
	for (var i = 0; i < selsk.length; i++) {
		if (document.getElementsByName(selsk[i]).length == 1) {
			selskval[i] = document.getElementsByName(selsk[i])[0].value;
		} else {
			selskval[i] = document.getElementsByName(selsk[i])[1].value;
		}
	}
	save.selskval = selskval;
	var name = {};
	var tx = document.getElementById('imgtouxiang').src;
	console.log(tx);
	console.log(tx.length);
	var touxiang = "";
	if (tx.length == 0) {
		touxiang = "https://maoyetrpg.com/coc7/php/photo/head.jpg";
	} else {
		touxiang = tx;
	}
	name.touxiang = touxiang;
	name.job = save.job.job;
	name.jobval = document.getElementById("career1").value;
	name.player = document.getElementById('player').value;
	name.chartname = document.getElementById('chartname').value;
	name.time = $('#epoch option:selected').text();
	name.ages = document.getElementById('ages').value;
	name.sex = document.getElementById('sex').value;
	name.address = document.getElementById('address').value;
	name.hometown = document.getElementById('hometown').value;
	save.name = name;
	var str = document.getElementById("str").value;
	var con = document.getElementById("con").value;
	var siz = document.getElementById("siz").value;
	var dex = document.getElementById("dex").value;
	var app = document.getElementById("app").value;
	var int1 = document.getElementById("int").value;
	var pow = document.getElementById("pow").value;
	var edu = document.getElementById("edu").value;
	var luck = document.getElementById("luck").value;
	var mov = document.getElementById('mov').value;
	var build = document.getElementById('build').value;
	var db = document.getElementById('db').value;
	var attribute = {
		str: str,
		con: con,
		siz: siz,
		dex: dex,
		app: app,
		int1: int1,
		pow: pow,
		edu: edu,
		luck: luck,
		mov: mov,
		build: build,
		db: db
	};
	save.attribute = attribute;
	var hp = document.getElementById('hp').value;
	var hphave = "";
	var hptotal = "";
	for (var i = 0; i < hp.indexOf('/'); i++) {
		hphave += hp[i];
	}
	for (i = i + 1; i < hp.length; i++) {
		hptotal += hp[i]
	}
	hphave = Number(hphave);
	hptotal = Number(hptotal);
	save.hp = {
		"have": hphave,
		"total": hptotal
	}
	var mp = document.getElementById('mp').value;
	var mphave = "";
	var mptotal = "";
	for (var i = 0; i < mp.indexOf('/'); i++) {
		mphave += mp[i];
	}
	for (i = i + 1; i < mp.length; i++) {
		mptotal += mp[i]
	}
	mphave = Number(mphave);
	mptotal = Number(mptotal);
	save.mp = {
		"have": mphave,
		"total": mptotal
	}
	var san = document.getElementById('san').value;
	var sanhave = "";
	var santotal = "";
	for (var i = 0; i < san.indexOf('/'); i++) {
		sanhave += san[i];
	}
	for (i = i + 1; i < san.length; i++) {
		santotal += san[i]
	}
	sanhave = Number(sanhave);
	santotal = Number(santotal);
	save.san = {
		"have": sanhave,
		"total": santotal
	}
	var weajs = [];
	var weaponsse = document.getElementsByName('wq-t');
	for (var i = 0; i < weaponsse.length; i++) {
		var weaselted = weaponsse[i].selectedIndex;
		if (weaselted != 0) {
			if (weaselted > 106) {
				var j = i + 1;
				var id = "wq-s" + j;
				var table = document.getElementById("wq-t");
				var row = table.rows[j];
				var cell = row.cells;
				var we = {
					"a": cell[1].innerHTML,
					"b": cell[2].innerHTML,
					"c": cell[3].innerHTML,
					"d": cell[4].innerHTML,
					"e": cell[5].innerHTML,
					"f": cell[6].innerHTML,
					"g": cell[7].innerHTML,
					"h": cell[8].innerHTML,
					"name": $("#" + id).find("option:selected").text()
				}
				var weloadinmysql = {
					"skill": cell[1].innerHTML,
					"dam": cell[2].innerHTML,
					"tho": cell[3].innerHTML,
					"range": cell[4].innerHTML,
					"round": 1,
					"num": cell[5].innerHTML,
					"price": cell[6].innerHTML,
					"err": cell[7].innerHTML,
					"time": cell[8].innerHTML,
					"name": $("#" + id).find("option:selected").text()
				}
				$.ajax({
					type: "post",
					url: "https://maoyetrpg.com/api/rolecard/info?userid=" + uid + "&token=" + token + "&name=weapon",
					data: JSON.stringify(weloadinmysql),
					contentType: "application/json;charset=utf-8",
					success: function (data) {
						console.log(data);
					}
				});
				weajs.push(we);
			} else {
				weajs.push(weaselted);
			}
		}
	}
	save.weapons = weajs;
	var things = [];
	var thing = document.getElementsByName('prop');
	for (var i = 0; i < thing.length; i++) {
		if (thing[i].value != "") {
			things.push(thing[i].value);
		}
	}
	save.things = things;
	var money = [];
	var creditdating = document.getElementById('creditdating').value;
	var living = document.getElementById('living').value;
	var cash = document.getElementById("cash").value;
	var consumption = document.getElementById('consumption').value;
	//	var country = $('#country option:selected').text();
	var pr = document.getElementById("pr").value;
	money[0] = creditdating;
	money[1] = living;
	money[2] = cash;
	money[3] = consumption;
	//	money[4] = country;
	money[4] = pr;
	save.money = money;
	var story = {};
	var st = document.getElementsByName('story');
	story.miaoshu = st[0].value;
	story.xinnian = st[1].value;
	story.zyzr = st[2].value;
	story.feifanzd = st[3].value;
	story.bgzw = st[4].value;
	story.tedian = st[5].value;
	story.bahen = st[6].value;
	story.kongju = st[7].value;
	story.story = st[8].value;
	save.story = story;
	var more = {};
	var mo = document.getElementsByName('more');
	more.jingli = mo[0].value;
	more.huoban = mo[1].value;
	more.kesulu = mo[2].value;
	save.more = more;
	var drawpic = {};
	var attrpic = [];
	attrpic[0] = {
		one: "力量STR",
		two: attribute.str,
		three: "敏捷DEX",
		four: attribute.dex,
		five: "意志POW",
		six: attribute.pow
	};
	attrpic[1] = {
		one: "体质CON",
		two: attribute.con,
		three: "外貌APP",
		four: attribute.app,
		five: "教育EDU",
		six: attribute.edu
	};
	attrpic[2] = {
		one: "体型SIZ",
		two: attribute.siz,
		three: "智力INT",
		four: attribute.int1,
		five: "移动力MOV",
		six: attribute.mov
	};
	attrpic[3] = {
		one: "体力HP",
		two: save.hp.have + '/' + save.hp.total,
		three: "理智SAN",
		four: save.san.have + '/' + save.san.total,
		five: "伤害加值DB",
		six: attribute.db
	};
	attrpic[4] = {
		one: "魔法MP",
		two: save.mp.have + '/' + save.mp.total,
		three: "幸运LUCK",
		four: attribute.luck,
		five: "体格BUILD",
		six: attribute.build
	};
	drawpic.attrpic = attrpic;
	var namepic = [];
	namepic[0] = {
		one: "姓名",
		two: name.chartname,
		three: "年龄",
		four: name.ages
	}
	namepic[1] = {
		one: "玩家",
		two: name.player,
		three: "时代",
		four: name.time
	}
	namepic[2] = {
		one: "职业",
		two: name.job,
		three: "性别",
		four: name.sex
	}
	namepic[3] = {
		one: "住地",
		two: name.address
	}
	namepic[4] = {
		one: "故乡",
		two: name.hometown
	}
	drawpic.namepic = namepic;

	var skillspic = [];
	var skall = [];
	for (var i = 0; i < bz.length; i++) {
		skall.push(bz[i]);
	}
	for (var i = 0; i < elsesk.length; i++) {
		skall.push(elsesk[i]);
	}
	var skallcp = skall.concat();
	for (var i = 0; i < skallcp.length; i++) {
		if (skallcp[i].name.length > 20) {
			//console.log(skallcp[i].name);
			var skselnam = "";
			var n1 = skallcp[i].name.indexOf(":");
			for (var g = 0; g <= n1; g++) {
				skselnam = skselnam + skallcp[i].name.charAt(g)
			}
			switch (skselnam) {
				case "母语:":
					var sk = document.getElementById('samejobmuyu');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.muyu[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "外语:":
					var sk = document.getElementById('samejobwaiyu');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.waiyu[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "生存1:":
					var sk = document.getElementById('samejobshengcun');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.shengcun[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "生存2:":
					var sk = document.getElementById('shengcun1');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.shengcun[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "生存3:":
					var sk = document.getElementById('shengcun2');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.shengcun[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "技艺1:":
					var sk = document.getElementById('samejobjiyi');
					console.log(sk.value);
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.jiyi[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "技艺2:":
					var sk = document.getElementById('jiyi1');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.jiyi[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "技艺3:":
					var sk = document.getElementById('jiyi2');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.jiyi[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "驾驶1:":
					var sk = document.getElementById('samejobjiashi');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.jiashi[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "驾驶2:":
					var sk = document.getElementById('jiashi1');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.jiashi[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "驾驶3:":
					var sk = document.getElementById('jiashi2');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.jiashi[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "格斗1:":
					var sk = document.getElementById('samejobgedou');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.gedou[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "格斗2:":
					var sk = document.getElementById('gedou1');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.gedou[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "格斗3:":
					var sk = document.getElementById('gedou2');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.gedou[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "射击1:":
					var sk = document.getElementById('samejobsheji');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.sheji[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "射击2:":
					var sk = document.getElementById('sheji1');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.sheji[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "射击3:":
					var sk = document.getElementById('sheji1');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.sheji[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "科学1:":
					var sk = document.getElementById('samejobkexue0');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.kexue[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "科学2:":
					var sk = document.getElementById('samejobkexue1');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.kexue[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
				case "科学3:":
					var sk = document.getElementById('samejobkexue2');
					if (sk.value != "请选择") {
						var skname = skselnam + skselectjs.kexue[0].all[sk.value].name;
						console.log(skname);
						skallcp[i].name = skname;
					} else {
						skallcp[i].name = skselnam;
					}
					break;
			}
		}
	}
	for (var i = 0; i < save.zdy.length; i++) {
		skallcp.push(save.zdy[i])
	}
	if (skallcp.length % 2 == 0) {
		for (var i = 0, k = 0; i < skallcp.length; i = i + 2, k++) {
			var j = i + 1;
			skillspic[k] = {
				one: skallcp[i].name,
				two: skallcp[i].total,
				three: skallcp[j].name,
				four: skallcp[j].total
			}
		}
	} else {
		for (var i = 0, k = 0; i < skallcp.length - 1; i = i + 2, k++) {
			var j = i + 1;
			skillspic[k] = {
				one: skallcp[i].name,
				two: skallcp[i].total,
				three: skallcp[j].name,
				four: skallcp[j].total
			}
		}
		skillspic[skillspic.length] = {
			one: skallcp[i].name,
			two: skallcp[i].total,
			three: "",
			four: ""
		}
	}
	drawpic.skillspic = skillspic;
	var thingspic = [];
	for (var i = 0, j = 0; i < things.length; i++, j = j + 2) {
		thingspic[i] = {
			one: things[j],
			two: things[j + 1]
		}
	}
	drawpic.thingspic = thingspic;
	var storypic = [];
	storypic[0] = {
		one: "形象描述",
		two: story.miaoshu
	}
	storypic[1] = {
		one: "思想与信念",
		two: story.xinnian
	}
	storypic[2] = {
		one: "重要之人",
		two: story.zyzr
	}
	storypic[3] = {
		one: "意义非凡之地",
		two: story.feifanzd
	}
	storypic[4] = {
		one: "宝贵之物",
		two: story.bgzw
	}
	storypic[5] = {
		one: "特点",
		two: story.tedian
	}
	storypic[6] = {
		one: "伤口与疤痕",
		two: story.bahen
	}
	storypic[7] = {
		one: "恐惧症与躁狂症",
		two: story.kongju
	}
	drawpic.storypic = storypic;
	drawpic.story = story.story;
	drawpic.touxiang = name.touxiang;
	save.drawpic = drawpic;
	save.mind = document.getElementById("mind").value;
	save.health = document.getElementById("health").value;
	var tnt = ["母语:", "外语:", "生存1:", "生存2:", "生存3:", "技艺1:", "技艺2:", "技艺3:", "驾驶1:", "驾驶2:", "驾驶3:", "格斗1:", "格斗2:", "格斗3:", "射击1:", "射击2:", "射击3:", "科学1:", "科学2:", "科学3:"];
	var touniang1 = ".st " + "力量" + save.attribute.str + "体质" + save.attribute.con + "体型" + save.attribute.siz + "敏捷" + save.attribute.dex + "外貌" + save.attribute.app + "智力" + save.attribute.int1 + "意志" + save.attribute.pow + "教育" + save.attribute.edu + "幸运" + save.attribute.luck;
	var touniang2 = "";
	for (var i = 0; i < skallcp.length; i++) {
		touniang2 += skallcp[i].name + skallcp[i].total;
	}
	for (var i = 0; i < tnt.length; i++) {
		touniang2 = touniang2.replace(new RegExp(tnt[i], 'g'), "");
	}
	document.getElementById("touniang").innerHTML = touniang1 + touniang2;
	save.touniang = touniang1 + touniang2;
	save.userid = Number(uid);
	console.log(save);
	var chartnum = 0;
	$.ajax({
		type: "post",
		url: "https://maoyetrpg.com/api/rolecard/info?userid=" + uid + "&token=" + token + "&name=rolecard&rg=coc7",
		data: JSON.stringify(save),
		async: false,
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data);
			save = data.data;
			chartnum = data.data.chartid;
			document.getElementById('share').value = "https://maoyetrpg.com/shareCard?chartid=" + chartnum;
			document.getElementById("save").disabled = true;

			var svg = d3.select(".right svg");
			var serializer = new XMLSerializer();
			var source = serializer.serializeToString(svg.node());
			source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
			var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
			var canvas = document.createElement("canvas");
			canvas.width = 350;
			canvas.height = 300;
			var context = canvas.getContext("2d");
			var image1 = document.getElementById('svg1img');
			image1.src = url;

			image1.onload = function () {
				context.drawImage(image1, 0, 0);
				var base64 = canvas.toDataURL('image/png');
				$.ajax({
					type: "post",
					"url": "./coc7/php/upload.php",
					async: false,
					data: {
						data: base64,
						save: save,
						num: chartnum
					},
					success: function (data) {
						console.log(data);
						cardnum = data;
						$('#svg1img').css("display", "none");
					}
				});
			};

			setTimeout(function () {
				console.log(data);
				$.ajax({
					type: "post",
					url: "./coc7/php/drawtable.php",
					async: false,
					data: {
						num: chartnum
					},
					success: function (data2) {
						console.log(data2);
						var a = document.createElement("a");
						document.body.appendChild(a);
						a.style.display = 'none';
						a.href = data2;
						a.download = "角色卡" + data;
						a.click();
					}
				});
			}, 200)

		}
	});

};

function maketxt() {
	if (cardnum != 0) {
		$.ajax({
			type: "post",
			"url": "./coc7/php/maketxt.php",
			async: true,
			data: {
				num: cardnum
			},
			success: function (data) {
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style.display = 'none';
				a.href = data;
				a.download = document.getElementById('chartname').value + cardnum;
				a.click();
			}
		});
	} else {
		alert("请先保存角色卡");
	}
}