var wxi = {};
var yam = 0;
var rmy = 0;
var aeng = 0;

wxi.home = (function() {
    var isIphone = (/iphone/gi).test(navigator.appVersion),
        isIpad = (/ipad/gi).test(navigator.appVersion),
        isAndroid = (/android/gi).test(navigator.appVersion),
        isTouch = isIphone || isIpad || isAndroid;

    var width = $(window).width();
    var height = $(window).height();
    var count = 0;

    //浏览器兼容
    var dummyStyle = document.createElement('div').style,
        vendor = (function() {
            var vendors = ['webkitT', 'MozT', 'msT', 'OT', 't'],
                t,
                i = 0,
                l = vendors.length;

            for (; i < l; i++) {
                t = vendors[i] + 'ransform';
                if (t in dummyStyle) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }
            return false;
        })(),
        transition_end_names = {
            "Moz": "transitionend",
            "webkit": "webkitTransitionEnd",
            "ms": "MSTransitionEnd",
            "O": "oTransitionEnd"
        };
    var START_EVENT = isTouch ? 'touchstart' : 'mousedown', //点击
        MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove', //移动
        END_EVENT = isTouch ? 'touchend' : 'mouseup',
        CANCEL_EVENT = transition_end_names[vendor];

    function animate(elem, obj, fun) {
        for (i in obj) {
            if (/[A-Z]/.test(i.substring(0, 1))) {
                elem[0].style[vendor + i] = obj[i];
            } else {
                elem[0].style[i] = obj[i];
            }

        }
        var CANCEL_EVENT = transition_end_names[vendor];
        elem.bind(CANCEL_EVENT, function() {
            window.setTimeout(function() {
                if (typeof fun == "function" && fun.constructor === Function) {
                    fun();
                }
            }, 0);
            elem.unbind(CANCEL_EVENT);
        })
    }

    function gotoStage(num) {
        if (num < count - 1) {
            var elem = $('.gray1').find('.setImg').eq(num).addClass('fadeInLeft');
            window.setTimeout(function() {
                gotoStage(num + 1);
            }, 200);
        }
        if (num == count - 1) {
            var elem = $('.gray1').find('.setImg').addClass('fadeInLeft');
        }
    }

    //翻转
    var mySwiper = new Swiper('.swiper-container', {
        progress: true,
        mode: 'vertical',
        loop: true,
        onProgressChange: function(swiper) {
            for (var i = 0; i < swiper.slides.length; i++) {
                var slide = swiper.slides[i];
                var progress = slide.progress;
                var scale, translate, opacity;

                if (progress <= 0) {
                    opacity = 1 - Math.min(Math.abs(progress), 1);
                    scale = 1 - Math.min(Math.abs(progress / 2), 1);
                    translate = progress * swiper.width;
                } else {
                    opacity = 1 - Math.min(Math.abs(progress / 2), 1);
                    scale = 1;
                    translate = 0;
                }
                slide.style.opacity = opacity;
                swiper.setTransform(slide, 'translate3d(0,' + (translate) + 'px,0) scale(' + scale + ')');
            }
        },
        onTouchStart: function(swiper) {
            for (var i = 0; i < swiper.slides.length; i++) {
                swiper.setTransition(swiper.slides[i], 0);
            }
        },
        onSetWrapperTransition: function(swiper, speed) {
            for (var i = 0; i < swiper.slides.length; i++) {
                swiper.setTransition(swiper.slides[i], speed);
            }
        }
    })

    // Set Z-Indexes
    for (var i = 0; i < mySwiper.slides.length; i++) {
        mySwiper.slides[i].style.zIndex = mySwiper.slides.length - i;
    }

    function clearStyle(i) {
        var element = $("#swiper-container").find(".swiper-slide").eq(i).find(".setImg");
        var obj = $("#swiper-container");
        obj.find(".setImg").each(function() {
            var reLeng = $(this)[0].classList.length;
            var reClass = $(this)[0].classList[reLeng - 1];
            if (reClass != 'setImg' && reClass != 'layer') {
                $(this).removeClass(reClass);
            }
        });

        var gary = obj.find(".gray").eq(i);
        var garyClass = gary[0].classList[1];

        if (garyClass == "gray1") {
            gotoStage(0);
        }

        if (garyClass == "gray2") {
            $(element).eq(0).addClass("fadeIn");
            $(element).eq(1).addClass("inRot");
            $(element).eq(2).addClass("fadeInUp");
            $(element).eq(3).addClass("fadeInDown");

        }

        if (garyClass == "gray3") {
            $(element).eq(0).addClass("fadeIn");
            $(element).eq(1).addClass("fadeIn");
        }

        if (garyClass == "gray4") {
            $(element).eq(0).addClass("fadeIn");
            $(element).eq(1).addClass("inRot");

        }

        if (garyClass == "gray5") {
            $(element).eq(0).addClass("fadeInUp");
            $(element).eq(1).addClass("fadeIn");
            $(element).eq(2).addClass("fadeIn");
            $(element).eq(3).addClass("fadeIn");
            window.setTimeout(function() {
                $(element).eq(4).addClass("inScale");
            }, 1000);
        }
    }

    mySwiper.addCallback('SlideChangeStart', function(swiper) {
        clearStyle(swiper.activeIndex);
    })

    function setImg() {
        count = $('.gray1').find('.setImg').size();
        var imgH = width / 320 * 504;
        $(".setImg").css("margin-top", (height - imgH) / 2 + "px");
        $(".movies1").css({ 'width': width * 0.9 + 'px', 'height': (154 / 504) * height + 'px', 'left': width * 0.05 + 'px', 'top': (110 / 504) * height + 'px' });
    }
    // $.ajax({
    // 		url:"http://doc.wolfstreet.tv/index.php?s=/1&page_id=176",
    // 		type:'post',
    // 		traditional: true,
    // 		datatype:'json',
    // 		success: function(data){

    // 		}
    // 	})
    // var data={"Id":40,"MemberCode":"36177093","Nickname":"爱笑の羊","HeadImage":"http://testapi.wolfstreet.tv/UploadFile/HeadImage/36177093.jpg","RankValue":10000,"Defeat":100,"DealCnt":10,"DefeatTitle":"崭露头角的散户","AmountTitle":"超神","DealTitle":"咱追求以静制动，以不变应万变","LikeCnt":1,"CommentCnt":0,"ConcernCnt":1,"CreateTime":"2017-07-05 10:19:08","Period":1,"MaxSecuritiesNo":null,"MaxSecuritiesName":null,"MaxYield":null,"MinSecuritiesNo":null,"MinSecuritiesName":null,"MinYield":null,"TeamId":1,"Member":[{"Id":3,"TeamId":1,"MemberCode":"36177093","Type":2,"CreateTime":"2017-06-29 18:18:15","Level":2,"Status":0,"NickName":"爱笑の羊","WeekYield":0,"HeadImage":"http://testapi.wolfstreet.tv/UploadFile/HeadImage/36177093.jpg"},{"Id":2,"TeamId":1,"MemberCode":"33975405","Type":2,"CreateTime":"2017-06-29 18:01:26","Level":2,"Status":0,"NickName":"人美路子野","WeekYield":0,"HeadImage":"http://testapi.wolfstreet.tv/UploadFile/HeadImage/33975405.jpg"},{"Id":1,"TeamId":1,"MemberCode":"34780385","Type":1,"CreateTime":"2017-06-29 18:00:53","Level":1,"Status":0,"NickName":"戴伦Darr7821","WeekYield":0,"HeadImage":"http://testapi.wolfstreet.tv/UploadFile/HeadImage/34780385.jpg"}],"TeamProfitDaily":[{"profit":0,"date":"20170629"},{"profit":0,"date":"20170630"}]}
    // $(".name").text(data.Nickname);
    // $(".tx img").attr('src',data.HeadImage);
    // $(".main2_1").text(data.DefeatTitle);
    // $("#Defeat").text(data.Defeat);
    // $("#myTargetElement").text(data.RankValue);
    // $("#myTargetElement1").text(data.DealCnt);
    // $(".main2_4").text(data.AmountTitle);
    // $(".main2_6").text(data.DealTitle);

    // $(".main4_1 span").text(data.MaxYield);
    // $(".main4_3 span").text(data.MinYield);
    // $("#MaxSecuritiesName").text(data.MaxSecuritiesName);
    // $("#MaxSecuritiesNo").text(data.MaxSecuritiesNo);
    // $("#MinSecuritiesName").text(data.MinSecuritiesName);
    // $("#MinSecuritiesNo").text(data.MinSecuritiesNo);
    // $("#myTargetElement2").text(data.CommentCnt);

    return {
        init: function() {
            setImg();
            $("#westarsloading").remove();
            gotoStage(0);
            var options = {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                prefix: '',
                suffix: ''
            };
            var a = $("#myTargetElement").text();
            var a1 = $("#myTargetElement1").text();
            var a2 = $("#myTargetElement2").text();
            var a3 = $("#myTargetElement3").text();
            var a4 = $("#myTargetElement4").text();
            var demo = new CountUp("myTargetElement", 0, a, 0, 2.5, options);
            var demo1 = new CountUp("myTargetElement1", 0, a1, 0, 2.5, options);
            var demo2 = new CountUp("myTargetElement2", 0, a2, 0, 2.5, options);
            var demo3 = new CountUp("myTargetElement3", 0, a3, 0, 2.5, options);
            var demo4 = new CountUp("myTargetElement4", 0, a4, 0, 2.5, options);

            mySwiper.addCallback('SlideChangeStart', function(swiper) {
                if (mySwiper.activeIndex == 2) {
                    demo.start();
                    demo1.start();
                }
                if (mySwiper.activeIndex == 5) {
                    demo2.start();
                    demo3.start();
                    demo4.start();
                }
            })
        }
    }
})()

window.onload = function() {
    wxi.home.init();


};