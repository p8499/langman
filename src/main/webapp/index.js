require([
	"dojo/Deferred",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/on",
	"dojo/parser",
	"dojo/query",
	"dojo/ready",
	"dojo/request/xhr",
	"dijit/registry",
	"dojo/NodeList-dom",
	"dojo/domReady"],function(Deferred,dom,domConstruct,domGeometry,domStyle,on,parser,query,ready,xhr,registry)
{	this.f_checkSignin=function()
	{	return xhr("../language/api/base/status",{handleAs: "json"});
	};
	this.f_signout=function()
	{	return xhr("../language/api/base/signout",{handleAs:"json"});
	};
	this.f_gotoSignin=function()
	{	window.location="signin.html";
	};
	this.f_load=function(content)
	{	dom.byId("contentFrame").src=content+".html";
	};
	this.f_setTitle=function()
	{	window.document.title=dom.byId("contentFrame").contentDocument.title;
	};
	ready(function()
	{	f_checkSignin().then(function(data)
		{	this.user=data.usid;
			dom.byId("userSpan").innerHTML=data.usname;
			f_load("_part_welcome");
		},f_gotoSignin);
		query(".auth").forEach(function(node)
		{	var widget=registry.byNode(node);
			this[widget.auth+"_ra"]=false,this[widget.auth+"_ri"]=false;
			var fra=function(){var dra=new Deferred();xhr("../language/api/base/security",{query:{auth:widget.auth+"_ra"},handleAs:"json"}).then(function(){this[widget.auth+"_ra"]=true;dra.resolve();},function(){dra.resolve();});return dra.promise;};
			var fri=function(){var dri=new Deferred();xhr("../language/api/base/security",{query:{auth:widget.auth+"_ri"},handleAs:"json"}).then(function(){this[widget.auth+"_ri"]=true;dri.resolve();},function(){dri.resolve();});return dri.promise;};
			fra().then(function(){if(!this[widget.auth+"_ra"])return fri();}).then(function(){widget.set("disabled",!(this[widget.auth+"_ra"]||this[widget.auth+"_ri"]))});
		});
		dom.byId('loading').style.display='none';
	});
});