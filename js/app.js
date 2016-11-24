$(document).ready(function(){
var article;
var mainPannel = $("#main-pannel");
var editPannel = $("#edit-pannel");
var showPannel = $("#module-article");
var menuPannel = $("#menu-pannel");
var queryRes = menuPannel.find("#queryRes");
init();
eventInit();
function init(){
    // 连接数据库
    Bmob.initialize("c6aa4d948ae4ae00deab3e9b688ab448", "017a8389c7c2cdd3487620b52f9d708a");
    var Article = dbInit();
    article = new Article();

    function dbInit(){
        return Bmob.Object.extend("Article", {
            add : function(opt,cbf,fail){
                var Article = Bmob.Object.extend("Article");
                var tis = new Article();
                var defaultOpt = {"articleTitle":"undefined","articleCon":"undefined"};
                opt = $.extend(defaultOpt,opt);
                for(var key in opt){
                    tis.set(key, opt[key]);
                }
                tis.save(null, {
                    success: function(object) {
                        console.log(object.attributes);
                        //alert("create object success, object id:"+object.id);
                        cbf && cbf();
                    },
                    error: function(model, error) {
                        console.log("create object fail: "+error.description);
                        fail && fail();
                    }
                });
            },
            drop : function(id){
                var myObject = dbInit().query({"id":id});
                myObject.destroy({
                    success: function(myObject) {
                        // 删除成功
                        alert('删除成功');
                    },
                    error: function(myObject, error) {
                        // 删除失败
                        alert('删除失败:'+error.description);
                    }
                });
            },
            update : function(){
                alert('update');
            },
            query : function(opt){
                var Article = Bmob.Object.extend("Article");
                var query = new Bmob.Query(Article);
                var queryExp = opt.queryExp || "";
                query.find({
                    success: function(obj) {
                        var res = [];
                        if(obj.length==0){
                            alert('没找到额...');
                            return false;
                        }
                        for(var i=0;i<obj.length;i++){
                            var artTit = obj[i].attributes.articleTitle===undefined ? "" : obj[i].attributes.articleTitle;
                            var artAut = obj[i].attributes.articleAuthor===undefined ? "" : obj[i].attributes.articleAuthor;
                            var artCon = obj[i].attributes.articleCon===undefined ? "" : obj[i].attributes.articleCon;
                            var artLab = obj[i].attributes.articleLabels===undefined ? "" : obj[i].attributes.articleLabels;
                            var artCat = obj[i].attributes.articleCategory===undefined ? "" : obj[i].attributes.articleCategory;
                            if(artTit.indexOf(queryExp)!=-1 || artCon.indexOf(queryExp)!=-1 || artLab.indexOf(queryExp)!=-1 || artCat.indexOf(queryExp)!=-1){
                                res.push(obj[i]);
                            }
                        }
                        opt.successCallback && opt.successCallback(res);
                        return true;
                    },
                    error: function(obj, error) {
                        alert("query object fail");
                    }
                });
            },
            size : function(){
                var Article = Bmob.Object.extend("Article");
                var query = new Bmob.Query(Article);
                var res = 0;
                query.count({
                    success: function(count) {
                        // 查询成功，返回记录数量
                        //alert(count);
                        res = count;
                    },
                    error: function(error) {
                        // 查询失败
                        console.log("查询失败:"+error);
                        res = 0;
                    }
                });
                return res;
            },
            latest : function(opt){
                var Article = Bmob.Object.extend("Article");
                var query = new Bmob.Query(Article);
                var res = 0;
                query.descending("articleId").find({
                    success : function(obj){
                        opt.successCallback && opt.successCallback(obj[0]);
                    },
                    error : function(obj,error){}
                });
            }
        });
    }
   // $("#mask-and-pop").show();
    $("#login-btn").click(function(){
        var msg = "";
        var loginMsg = $("#login-msg");
        var account = $("#account").val();
        var passcode = $("#passcode").val();
        if (account==="lihexin" && +passcode===123456)
        {
            $("#mask-and-pop").hide();
        } 
        else
        {
            msg = "账号或密码不正确";
            loginMsg.html(msg);
            return false;
        }
    });
    initAfter();
}
function eventInit(){
    $("#m-nav-btn").click(function(){
        var marginLeft = +menuPannel.outerWidth(true);
        menuPannel.show();
        mainPannel.css({
            "margin-left":marginLeft,
            "transition":"all 0.3s ease-out"
        });
        $(this).hide();
        $("#m-close-btn").show();
    });

    $("#m-close-btn").click(function(){
        mainPannel.css({
            "margin-left":"0",
            "transition":"all 0.3s ease-out"
        });
        $("#m-nav-btn").show();
        $("#m-close-btn").hide();
        menuPannel.fadeOut(300);
    });
    $("#m-edit-btn").click(function(){
        var marginRight = +editPannel.outerWidth(true)*-1;
        editPannel.show();
        mainPannel.css({
            "margin-left":marginRight,
            "transition":"all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        });
        $(this).hide();
        $("#m-e-close-btn").show();
    });

    $("#m-e-close-btn").click(function(){
        mainPannel.css({
            "margin-left":"0",
            "transition":"all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        });
        $("#m-edit-btn").show();
        $("#m-e-close-btn").hide();
        editPannel.fadeOut(600);
    });
    mainPannel.scroll(function(){
        var mTop = mainPannel.scrollTop();
        if(mTop>300){
            $("#go-top").fadeIn();
        } 
        else{
            $("#go-top").hide();
        }
    });
    $("#go-top").click(function(){
        mainPannel.scrollTop(0);
    });

}
function initAfter(){
    article.latest({
        successCallback : function(data){
            
            if(data == undefined){
                showPannel.find("[id=m-art-con-con]").html("<pre>暂无文章，点击画面右上角的按钮<i class='icon-edit'></i>，开始写第一篇文章吧~</pre>");
                return false;
            }
            showPannel.find("[id=m-art-tit] h2").html(data.attributes.articleTitle);
            showPannel.find("[id=m-art-des-aut] span").html(data.attributes.articleAuthor);
            showPannel.find("[id=m-art-con-con]").html(data.attributes.articleCon);
            showPannel.find("[id=m-art-des-lab] span").html(data.attributes.articleLabels);
            showPannel.find("[id=m-art-des-time] span").html(data.updatedAt);
            showPannel.find("[id=m-art-des-cat] span").html(data.attributes.articleCategory);
            artAbstract(250);
            showArtNav();
        }
    });
    
    editPannel.find("[id=save-btn]").click(function(){
        var articleTitle = editPannel.find("[id=articleTitle]").val();
        var articleAuthor = editPannel.find("[id=articleAuthor]").val();
        var articleCon = editPannel.find("[id=articleCon]").val();
        var articleLabels = editPannel.find("[id=articleLabels]").val();
        var articleCategory = editPannel.find("[id=articleCategory]").val();
        if(articleTitle==="") {
            alert("文章标题不能为空");
            return false;
        }
        if(articleCon==="") {
            alert("文章内容不能为空");
            return false;
        }
        articleCategory = articleCategory==="" ? "未定义" : articleCategory;
        article.add({
            "articleTitle" : articleTitle,
            "articleCon" : articleCon,
            "articleLabels" : articleLabels,
            "articleAuthor" : articleAuthor,
            "articleCategory" : articleCategory
        },function(){
            showPannel.find("[id=m-art-tit] h2").html(articleTitle);
            showPannel.find("[id=m-art-des-aut] span").html(articleAuthor);
            showPannel.find("[id=m-art-con-con]").html(articleCon);
            showPannel.find("[id=m-art-des-lab] span").html(articleLabels);
            showPannel.find("[id=m-art-des-time] span").html(CurentTime());
            showPannel.find("[id=m-art-des-cat] span").html(articleCategory);
            editPannel.find("[id=articleTitle]").val("");
            editPannel.find("[id=articleAuthor]").val("");
            editPannel.find("[id=articleCon]").val("");
            editPannel.find("[id=articleLabels]").val("");
            editPannel.find("[id=articleCategory]").val("");
            mainPannel.find("[id=m-e-close-btn]").click();
            artAbstract(250);
            showArtNav();
        });
    });

    menuPannel.find("[id=queryInp]").keyup(function(e){
        if(e.keyCode!=13){
            return false;
        }
        var queryTxt = $("#queryInp").val();
        if(queryTxt===""){
            alert('啥也没有哦');
            return false;
        }
        article.query({
            queryExp : queryTxt,
            successCallback : function(data){
                //console.log(data);
                var buf = [];
                queryRes.html("");
                queryRes.append('<p>找到'+data.length+'条结果:</p>');
                for(var i=0;i<data.length;i++){
                    buf.push('<div class="queryRes-line"><span>'+(i+1)+'. </span><label class="queryRes-line-tit" data-res="res'+i+'">'+data[i].attributes.articleTitle+'</label></div>');
                    queryRes.append(buf.join(""));
                    buf = [];
                    console.log(data[i]);
                    queryRes.find("[data-res=res"+i+"]").data(data[i]);
                }
                queryRes.find("[class=queryRes-line-tit]").each(function(i){
                    $(this).click(function(){
                        var tisData = $(this).data();
                        showPannel.find("[id=m-art-tit] h2").html(tisData.attributes.articleTitle);
                        showPannel.find("[id=m-art-des-aut] span").html(tisData.attributes.articleAuthor);
                        showPannel.find("[id=m-art-con-con]").html(tisData.attributes.articleCon);
                        showPannel.find("[id=m-art-des-lab] span").html(tisData.attributes.articleLabels);
                        showPannel.find("[id=m-art-des-cat] span").html(tisData.attributes.articleCategory);
                        showPannel.find("[id=m-art-des-time] span").html(tisData.updatedAt);
                        artAbstract(250);
                        showArtNav();
                    });
                });
                menuPannel.find("[id=query-clear-btn]").show();
            }
        });
    });

    menuPannel.find("[id=query-clear-btn]").click(function(){
        $(this).fadeOut();
        queryRes.html("");
        menuPannel.find("[id=queryInp]").val("");
    });

    $("#edit-btn").click(function(){

    });

    function artAbstract(len){
        showPannel.find("[id=m-art-con-abs]").html(String(showPannel.find("[id=m-art-con-con]").html().replace(/<[^>]+>/g,'')).substr(0,len)+" ...");
    }
    function CurentTime()
    { 
        var now = new Date();
       
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
       
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
       
        var clock = year + "-";
       
        if(month < 10)
            clock += "0";
       
        clock += month + "-";
       
        if(day < 10)
            clock += "0";
           
        clock += day + " ";
       
        if(hh < 10)
            clock += "0";
           
        clock += hh + ":";
        if (mm < 10) clock += '0'; 
        clock += mm; 
        return(clock); 
    } 
    function showArtNav(){
        var hGroup = showPannel.find("[id=m-art-con-con]").find("[data-nav^='h']");
        var buf = [];
        showPannel.find("[id=m-art-con-nav]").hide();
        if(hGroup.length == 0){return false;}
        for(var i=0;i<hGroup.length;i++){
            buf.push('<li title="'+hGroup[i].innerHTML+'">'+hGroup[i].innerHTML+'</li>');
        }
        showPannel.find("[id=m-art-con-nav]").find("ul").append(buf.join(""));
        showPannel.find("[id=m-art-con-nav]").show();
    }
}
});
