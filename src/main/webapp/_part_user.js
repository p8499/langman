require([
	"dojo/_base/array",
	"dojo/Deferred",
	"dojo/dom",
	"dojo/dom-form",
	"dojo/i18n!nls/Message.js",
	"dojo/io-query",
	"dojo/json",
	"dojo/parser",
	"dojo/promise/all",
	"dojo/ready",
	"dojo/request/xhr",
	"dojo/store/JsonRest",
	"dijit/registry",
	"lang/MultiKeyMap",
	"gridx/core/model/cache/Async",
	"gridx/modules/HScroller",
	"gridx/modules/VScroller",
	"gridx/modules/ColumnResizer",
	"gridx/modules/RowHeader",
	"gridx/modules/select/Row",
	"gridx/modules/IndirectSelect",
	"gridx/modules/Filter",
	"gridx/modules/filter/FilterBar",
	"gridx/modules/filter/QuickFilter",
	"gridx/modules/NestedSort",
	"gridx/modules/Pagination",
	"gridx/modules/pagination/PaginationBar",
	"dojo/domReady!"],function(array,Deferred,dom,domForm,Message,ioQuery,json,parser,all,ready,xhr,JsonRest,registry,MultiKeyMap)
{	parent.f_setTitle();
	msgArea_messages=new MultiKeyMap();
	msgAreaAdd_messages=new MultiKeyMap();
	msgAreaUpdate_messages=new MultiKeyMap();
	msgAreaDelete_messages=new MultiKeyMap();
	msgAreaPrepare_messages=new MultiKeyMap();
	grid_store=new JsonRest({target:"../language/api/user",idProperty:"usid",sortParam:"orderBy"});
	grid_structure=[
		{id:"usid",field:"usid",name:"用戶名",width:"224px"},
		{id:"uspswd",field:"uspswd",name:"密碼",width:"224px"},
		{id:"usname",field:"usname",name:"昵稱",width:"224px"},
		{id:"usst",field:"usst",name:"狀態",width:"48px"},
		{id:"uslsid",field:"uslsid",name:"語言編碼",width:"128px"},
		{id:"uspn",field:"uspn",name:"單位能量",width:"48px"}];
	grid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_language_userGrid_store=new JsonRest({target:"../language/api/language",idProperty:"lsid",sortParam:"orderBy"});
	rel_language_userGrid_structure=[
		{id:"lsid",field:"lsid",name:"語言編碼",width:"128px"},
		{id:"lsname",field:"lsname",name:"語言名稱",width:"128px"},
		{id:"lsloc",field:"lsloc",name:"學術名",width:"672px"},
		{id:"lssort",field:"lssort",name:"排序號",width:"64px"}];
	rel_language_userGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	this.f_prepareAdd=function()
	{	msgAreaAdd_messages.removeAll({group:"add"});
		msgAreaAdd.refresh();
		if(!wa)
		{	add_usid.set("value",parent.user);
			add_usid.set("readonly","readonly");
			dom.byId("add_usidAssist").style.display="none";
		}
		else
			add_usid.set("value","");
		add_uspswd.set("value","");
		add_usname.set("value","");
		add_usst.set("value","0");
		add_uslsid.set("value","");
		add_uspn.set("value","");
		addDialog.show();
	};
	this.f_checkAdd=function()
	{	var deferred=new Deferred();
		xhr.post("../language/api/user_check"+"/"+add_usid.get("value"),{data:domForm.toJson("addForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
		{	deferred.resolve(data);
		},function(data)
		{	msgAreaAdd_messages.removeAll({group:"add"});
			var d=data.response.data,status=data.response.status;
			msgAreaAdd_messages.put({group:"add",level:"error"},{msg:Message[status],targetNode:d==null?null:dom.byId("add_"+d[0])});
			msgAreaAdd.refresh();
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.f_processAdd=function()
	{	var obj=domForm.toObject("addForm");
		grid.store.add(obj,{incremental:true}).then(function()
		{	addDialog.hide();
		},function(data)
		{	msgAreaAdd_messages.removeAll({group:"add"});
			var d=data.response.data,status=data.response.status;
			msgAreaAdd_messages.put({group:"add",level:"error"},{msg:Message[status],targetNode:d==null?null:dom.byId("add_"+d[0])});
			msgAreaAdd.refresh();
		});
	};
	this.f_prepareUpdate=function(id)
	{	var deferred=new Deferred();
		msgAreaUpdate_messages.removeAll({});
		msgAreaUpdate.refresh();
		all([grid.store.get(id),xhr("../language/api/base/lock",{query:{obj:"user",id:id},handleAs:"json"})]).then(function(data)
		{	update_usid.set("value",data[0].usid);
			update_uspswd.set("value",data[0].uspswd);
			update_usname.set("value",data[0].usname);
			update_usst.set("value",data[0].usst);
			update_uslsid.set("value",data[0].uslsid);
			update_uspn.set("value",data[0].uspn);
			updateDialog.show();
			deferred.resolve(data);
		},function(data)
		{	msgAreaPrepare_messages.removeAll({group:"update"});
			var d=data.response.data,status=data.response.status;
			msgAreaPrepare_messages.put({group:"update",level:"error"},{msg:Message[status],targetNode:null});
			msgAreaPrepare.refresh();
			prepareDialog.show();
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.f_cancelUpdate=function()
	{	var deferred=new Deferred();
		xhr("../language/api/base/unlock",{query:{obj:"user",id:update_usid.get("value")},handleAs:"json"}).then(function(data)
		{	updateDialog.hide();
			deferred.resolve(data);
		},function(data)
		{	updateDialog.hide();
			deferred.reject(data);
		});
		return deferred.promise;
	}
	this.f_checkUpdate=function()
	{	var deferred=new Deferred();
		xhr.put("../language/api/user_check"+"/"+update_usid.get("value"),{data:domForm.toJson("updateForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
		{	deferred.resolve(data);
		},function(data)
		{	msgAreaUpdate_messages.removeAll({group:"update"});
			var d=data.response.data,status=data.response.status;
			msgAreaUpdate_messages.put({group:"update",level:"error"},{msg:Message[status],targetNode:d==null?null:dom.byId("update_"+d[0])});
			msgAreaUpdate.refresh();
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.f_processUpdate=function()
	{	var deferred=new Deferred();
		var obj=domForm.toObject("updateForm");
		all([grid.store.put(obj),xhr("../language/api/base/unlock",{query:{obj:"user",id:update_usid.get("value")},handleAs:"json"})]).then(function(data)
		{	updateDialog.hide();
			deferred.resolve(data);
		},function(data)
		{	msgAreaUpdate_messages.removeAll({group:"update"});
			var d=data.response.data,status=data.response.status;
			msgAreaUpdate_messages.put({group:"update",level:"error"},{msg:Message[status],targetNode:d==null?null:dom.byId("update_"+d[0])});
			msgAreaUpdate.refresh();
			deferred.reject(data);
		});
	};
	this.f_checkDelete=function(ids)
	{	var deferredRec=new Deferred();
		var deferred=new Deferred();
		msgAreaDelete_messages.removeAll({group:"delete"});
		_f_recCheckDelete(deferredRec,ids,0);
		deferredRec.promise.then(function()
		{	msgAreaDelete.refresh();
			deleteTip.innerHTML=grid.select.row.getSelected().length;
			if(msgAreaDelete_messages.countAll({group:"delete",level:"error"})>0)
			{	excludeButton.setAttribute('disabled',false);
				deleteSubmitButton.setAttribute('disabled',true);
			}
			else
			{	excludeButton.setAttribute('disabled',true);
				deleteSubmitButton.setAttribute('disabled',false);
			}
			deleteDialog.show();
			deferred.resolve(null);
		});
		return deferred.promise;
	}
	this.f_processDelete=function()
	{	var deferreds=new Array();
		array.forEach(grid.select.row.getSelected(),function(item,i)
		{	deferreds.push(grid.store.remove(item));
		});
		all(deferreds).then(function()
		{	deleteDialog.hide();
		});
		f_setControls(0x0001);
	}
	ready(function()
	{	grid.connect(grid.select.row,"onSelected",function(row)
		{	window.f_setControls(0x0011);
		});
		grid.connect(grid.select.row,"onDeselected",function(row)
		{	window.f_setControls(0x0011);
		});
		rel_language_userGrid.connect(rel_language_userGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_language_userDialog,rel_language_userGrid,row);
		});
		f_auth().then(function()
		{	f_setControls(0x1111);
			if(ra)
				;
			else if(!ra&&ri)
				msgArea_messages.put({group:"global",level:"information",msgId:"ri"},{msg:"讀個人記錄"});
			else
				msgArea_messages.put({group:"global",level:"information",msgId:"rn"},{msg:"無權讀"});
			if(wa)
				;
			else if(!wa&&wi)
				msgArea_messages.put({group:"global",level:"information",msgId:"wi"},{msg:"寫個人記錄"});
			else
				msgArea_messages.put({group:"global",level:"information",msgId:"wn"},{msg:"無權寫"});
			msgArea.refresh();
		});
		f_filterSearch();
		dom.byId("loading").style.display="none";
	});
	this.f_assistBegin=function(inputs,foreigns,assistDialog,assistGrid)
	{	var deferred=new Deferred();
		assistGrid.forInputs=inputs;
		assistGrid.foreigns=foreigns;
		assistGrid.select.row.clear();
		var filter={op:"and",data:[]};
		array.forEach(inputs,function(item,i)
		{	var val=inputs[i].get("value");
			filter.data.push({op:"equal",data:[{op:"string",data:foreigns[i],isCol:true},{op:"string",data:typeof(val)=="string"?val:isNaN(val)?0:val}]});
		});
		assistGrid.store.query({filter:json.stringify(filter)},{headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then(function(data)
		{	if(data.length>0)
			{	var row=assistGrid.row(data[0][assistGrid.store.idProperty].toString());
				var pagination=assistGrid.pagination;
				pagination.gotoPage(pagination.pageOfIndex(row.index()));
				row.select();
			}
			assistDialog.show();
			deferred.resolve(data);
		},function(data)
		{	deferred.reject(data);
		});
		return deferred.promise;
	};
	this.f_assistEnd=function(assistDialog,assistGrid,row)
	{	array.forEach(assistGrid.forInputs,function(item,i)
		{	item.set("value",assistGrid.row(row.id).data()[assistGrid.foreigns[i]]);
		});
		assistDialog.hide();
	};
	this.f_encrypt=function(password)
	{	xhr("../language/api/base/encrypt",{query:{plain:password.get("value")},handleAs:"json"}).then(function(data)
		{	password.set("value",data);
		});
	};
	this.f_deselect=function(messages)
	{	var idsExclude=array.map(messages.keySet(),function(key){return key.msgId;});
		array.forEach(idsExclude,function(item,i){grid.row(item).deselect()});
	};
	this.f_setControls=function(code)
	{	select=grid.select.row.getSelected().length;
		if(code&0x0001==0x0001)
			if(wa||wi)
				addButton.setAttribute('disabled',false);
			else
				addButton.setAttribute('disabled',true);
		if(code&0x0010==0x0010)
		{	if((wa||wi)&&select==1)
				updateButton.setAttribute('disabled',false);
			else
				updateButton.setAttribute('disabled',true);
			if((ralanguage||rilanguage)&&select==1)
				languageLink.setAttribute('disabled',false);
			else
				languageLink.setAttribute('disabled',true);
			if((rauserrole||riuserrole)&&select==1)
				userroleLink.setAttribute('disabled',false);
			else
				userroleLink.setAttribute('disabled',true);
			if((raarticle||riarticle)&&select==1)
				articleLink.setAttribute('disabled',false);
			else
				articleLink.setAttribute('disabled',true);
			if((rasentence||risentence)&&select==1)
				sentenceLink.setAttribute('disabled',false);
			else
				sentenceLink.setAttribute('disabled',true);
			if((rasegment||risegment)&&select==1)
				segmentLink.setAttribute('disabled',false);
			else
				segmentLink.setAttribute('disabled',true);
			if((rasegmentflow||risegmentflow)&&select==1)
				segmentflowLink.setAttribute('disabled',false);
			else
				segmentflowLink.setAttribute('disabled',true);
			if((ratagging||ritagging)&&select==1)
				taggingLink.setAttribute('disabled',false);
			else
				taggingLink.setAttribute('disabled',true);
			if((rasegmentvote||risegmentvote)&&select==1)
				segmentvoteLink.setAttribute('disabled',false);
			else
				segmentvoteLink.setAttribute('disabled',true);
			if((rawordvote||riwordvote)&&select==1)
				wordvoteLink.setAttribute('disabled',false);
			else
				wordvoteLink.setAttribute('disabled',true);
			if((rawordflow||riwordflow)&&select==1)
				wordflowLink.setAttribute('disabled',false);
			else
				wordflowLink.setAttribute('disabled',true);
		}
		if(code&0x0100==0x0100)
			if((wa||wi)&&select>0)
				deleteButton.setAttribute('disabled',false);
			else
				deleteButton.setAttribute('disabled',true);
		if(code&0x1000==0x1000)
			if(ra||ri)
				queryButton.setAttribute('disabled',false);
			else
				queryButton.setAttribute('disabled',true);
	};
	this.f_auth=function()
	{	this.ra=this.wa=false;
		this.ri=this.wi=false;
		this.ralanguage=this.rilanguage=false;
		this.rauserrole=this.riuserrole=false;
		this.raarticle=this.riarticle=false;
		this.rasentence=this.risentence=false;
		this.rasegment=this.risegment=false;
		this.rasegmentflow=this.risegmentflow=false;
		this.ratagging=this.ritagging=false;
		this.rasegmentvote=this.risegmentvote=false;
		this.rawordvote=this.riwordvote=false;
		this.rawordflow=this.riwordflow=false;
		var dra=new Deferred(),dwa=new Deferred(),d=new Deferred(),d0=new Deferred();
		var dri=new Deferred(),dwi=new Deferred();
		var dralanguage=new Deferred(),drilanguage=new Deferred();
		var drauserrole=new Deferred(),driuserrole=new Deferred();
		var draarticle=new Deferred(),driarticle=new Deferred();
		var drasentence=new Deferred(),drisentence=new Deferred();
		var drasegment=new Deferred(),drisegment=new Deferred();
		var drasegmentflow=new Deferred(),drisegmentflow=new Deferred();
		var dratagging=new Deferred(),dritagging=new Deferred();
		var drasegmentvote=new Deferred(),drisegmentvote=new Deferred();
		var drawordvote=new Deferred(),driwordvote=new Deferred();
		var drawordflow=new Deferred(),driwordflow=new Deferred();
		var fra=function(){xhr("../language/api/base/security",{query:{auth:"user_ra"},handleAs:"json"}).then(function(){this.ra=true;dra.resolve();},function(){dra.resolve();});return dra.promise;};
		var fwa=function(){xhr("../language/api/base/security",{query:{auth:"user_wa"},handleAs:"json"}).then(function(){this.wa=true;dwa.resolve();},function(){dwa.resolve();});return dwa.promise;};
		var fri=function(){xhr("../language/api/base/security",{query:{auth:"user_ri"},handleAs:"json"}).then(function(){this.ri=true;dri.resolve();},function(){dri.resolve();});return dri.promise;};
		var fwi=function(){xhr("../language/api/base/security",{query:{auth:"user_wi"},handleAs:"json"}).then(function(){this.wi=true;dwi.resolve();},function(){dwi.resolve();});return dwi.promise;};
		var fralanguage=function(){xhr("../language/api/base/security",{query:{auth:"lang_ra"},handleAs:"json"}).then(function(){this.ralanguage=true;dralanguage.resolve();},function(){dralanguage.resolve();});return dralanguage.promise;};
		var frilanguage=function(){xhr("../language/api/base/security",{query:{auth:"lang_ri"},handleAs:"json"}).then(function(){this.rilanguage=true;drilanguage.resolve();},function(){drilanguage.resolve();});return drilanguage.promise;};
		var frauserrole=function(){xhr("../language/api/base/security",{query:{auth:"usrl_ra"},handleAs:"json"}).then(function(){this.rauserrole=true;drauserrole.resolve();},function(){drauserrole.resolve();});return drauserrole.promise;};
		var friuserrole=function(){xhr("../language/api/base/security",{query:{auth:"usrl_ri"},handleAs:"json"}).then(function(){this.riuserrole=true;driuserrole.resolve();},function(){driuserrole.resolve();});return driuserrole.promise;};
		var fraarticle=function(){xhr("../language/api/base/security",{query:{auth:"artc_ra"},handleAs:"json"}).then(function(){this.raarticle=true;draarticle.resolve();},function(){draarticle.resolve();});return draarticle.promise;};
		var friarticle=function(){xhr("../language/api/base/security",{query:{auth:"artc_ri"},handleAs:"json"}).then(function(){this.riarticle=true;driarticle.resolve();},function(){driarticle.resolve();});return driarticle.promise;};
		var frasentence=function(){xhr("../language/api/base/security",{query:{auth:"sent_ra"},handleAs:"json"}).then(function(){this.rasentence=true;drasentence.resolve();},function(){drasentence.resolve();});return drasentence.promise;};
		var frisentence=function(){xhr("../language/api/base/security",{query:{auth:"sent_ri"},handleAs:"json"}).then(function(){this.risentence=true;drisentence.resolve();},function(){drisentence.resolve();});return drisentence.promise;};
		var frasegment=function(){xhr("../language/api/base/security",{query:{auth:"sgmt_ra"},handleAs:"json"}).then(function(){this.rasegment=true;drasegment.resolve();},function(){drasegment.resolve();});return drasegment.promise;};
		var frisegment=function(){xhr("../language/api/base/security",{query:{auth:"sgmt_ri"},handleAs:"json"}).then(function(){this.risegment=true;drisegment.resolve();},function(){drisegment.resolve();});return drisegment.promise;};
		var frasegmentflow=function(){xhr("../language/api/base/security",{query:{auth:"sgfl_ra"},handleAs:"json"}).then(function(){this.rasegmentflow=true;drasegmentflow.resolve();},function(){drasegmentflow.resolve();});return drasegmentflow.promise;};
		var frisegmentflow=function(){xhr("../language/api/base/security",{query:{auth:"sgfl_ri"},handleAs:"json"}).then(function(){this.risegmentflow=true;drisegmentflow.resolve();},function(){drisegmentflow.resolve();});return drisegmentflow.promise;};
		var fratagging=function(){xhr("../language/api/base/security",{query:{auth:"post_ra"},handleAs:"json"}).then(function(){this.ratagging=true;dratagging.resolve();},function(){dratagging.resolve();});return dratagging.promise;};
		var fritagging=function(){xhr("../language/api/base/security",{query:{auth:"post_ri"},handleAs:"json"}).then(function(){this.ritagging=true;dritagging.resolve();},function(){dritagging.resolve();});return dritagging.promise;};
		var frasegmentvote=function(){xhr("../language/api/base/security",{query:{auth:"sgvt_ra"},handleAs:"json"}).then(function(){this.rasegmentvote=true;drasegmentvote.resolve();},function(){drasegmentvote.resolve();});return drasegmentvote.promise;};
		var frisegmentvote=function(){xhr("../language/api/base/security",{query:{auth:"sgvt_ri"},handleAs:"json"}).then(function(){this.risegmentvote=true;drisegmentvote.resolve();},function(){drisegmentvote.resolve();});return drisegmentvote.promise;};
		var frawordvote=function(){xhr("../language/api/base/security",{query:{auth:"wdvt_ra"},handleAs:"json"}).then(function(){this.rawordvote=true;drawordvote.resolve();},function(){drawordvote.resolve();});return drawordvote.promise;};
		var friwordvote=function(){xhr("../language/api/base/security",{query:{auth:"wdvt_ri"},handleAs:"json"}).then(function(){this.riwordvote=true;driwordvote.resolve();},function(){driwordvote.resolve();});return driwordvote.promise;};
		var frawordflow=function(){xhr("../language/api/base/security",{query:{auth:"wdfl_ra"},handleAs:"json"}).then(function(){this.rawordflow=true;drawordflow.resolve();},function(){drawordflow.resolve();});return drawordflow.promise;};
		var friwordflow=function(){xhr("../language/api/base/security",{query:{auth:"wdfl_ri"},handleAs:"json"}).then(function(){this.riwordflow=true;driwordflow.resolve();},function(){driwordflow.resolve();});return driwordflow.promise;};
		d0.promise.then(fralanguage).then(function(){if(!ralanguage)return frilanguage();}).then(frauserrole).then(function(){if(!rauserrole)return friuserrole();}).then(fraarticle).then(function(){if(!raarticle)return friarticle();}).then(frasentence).then(function(){if(!rasentence)return frisentence();}).then(frasegment).then(function(){if(!rasegment)return frisegment();}).then(frasegmentflow).then(function(){if(!rasegmentflow)return frisegmentflow();}).then(fratagging).then(function(){if(!ratagging)return fritagging();}).then(frasegmentvote).then(function(){if(!rasegmentvote)return frisegmentvote();}).then(frawordvote).then(function(){if(!rawordvote)return friwordvote();}).then(frawordflow).then(function(){if(!rawordflow)return friwordflow();}).then(fra).then(function(){if(!ra)return fri();}).then(fwa).then(function(){if(!wa)return fwi();}).then(function(){d.resolve();});
		d0.resolve();
		return d;
	}
	this.f_filterSearch=function()
	{	var search=window.location.search;
		if(search!="")
		{	var searchObj=ioQuery.queryToObject(search.substring(search.indexOf("?")+1,search.length));
			var filterObj={type:"all",conditions:[]};
			for(var prop in searchObj)
			{	filterObj.conditions.push({colId:prop,condition:"equal",value:searchObj[prop],type:"Text"});
			}
			grid.filterBar.applyFilter(filterObj);
		}
	};
	this._f_recCheckDelete=function(deferred,items,i)
	{	if(items.length>i)
		{	xhr.del("../language/api/user_check"+"/"+items[i],{handleAs:"json"}).then(function(data)
			{	_f_recCheckDelete(deferred,items,i+1);
			},function(data)
			{	var d=data.response.data,status=data.response.status;
				msgAreaDelete_messages.put({group:"delete",level:"error",msgId:items[i]},{msg:Message[status]+"："+grid.row(items[i]).data().usid,targetNode:null});
				_f_recCheckDelete(deferred,items,i+1);
			});
		}
		else
		{	deferred.resolve(null);
		}
	};
});