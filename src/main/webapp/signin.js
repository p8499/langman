require([
	"dojo/dom",
	"dojo/parser",
	"dojo/ready",
	"dojo/request/xhr",
	"lang/MultiKeyMap",
	"dojo/domReady!"],function(dom,parser,ready,xhr,MultiKeyMap)
{	msgArea_messages=new MultiKeyMap();
	this.f_gotoMain=function()
	{	window.location="index.html";
	};
	this.f_signin=function()
	{	return xhr("../language/api/base/signin",{query:{usid:usid.get("value"),uspswd:uspswd.get("value")},handleAs:"json"});
	};
	this.f_setErrorSignin=function(resp)
	{	msgArea_messages.remove({group:"signin"});
		msgArea_messages.put({group:"signin",level:"error"},{msg:"登錄失敗，重新輸入",targetNode:usid});
		msgArea.refresh();
	};
	ready(function()
	{	signinDialog.show();
		dom.byId('loading').style.display='none';
	});
});