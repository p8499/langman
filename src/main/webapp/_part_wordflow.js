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
	grid_store=new JsonRest({target:"../language/api/wordflow",idProperty:"waid",sortParam:"orderBy"});
	grid_structure=[
		{id:"waid",field:"waid",name:"線程編碼",width:"64px"},
		{id:"wawoid",field:"wawoid",name:"詞音編碼",width:"64px"},
		{id:"wasi",field:"wasi",name:"子項號",width:"64px"},
		{id:"wapt",field:"wapt",name:"拼音聲調",width:"416px"},
		{id:"wast",field:"wast",name:"狀態",width:"48px"},
		{id:"wausid",field:"wausid",name:"擁有者",width:"224px"},
		{id:"wacrdd",field:"wacrdd",name:"創建日腳",width:"80px"},
		{id:"wacrdt",field:"wacrdt",name:"創建辰光",width:"64px"},
		{id:"waupdd",field:"waupdd",name:"更新日腳",width:"80px"},
		{id:"waupdt",field:"waupdt",name:"更新辰光",width:"64px"}];
	grid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_word_wordflowGrid_store=new JsonRest({target:"../language/api/word",idProperty:"woid",sortParam:"orderBy"});
	rel_word_wordflowGrid_structure=[
		{id:"woid",field:"woid",name:"詞音編碼",width:"64px"},
		{id:"wolsid",field:"wolsid",name:"語言編碼",width:"128px"},
		{id:"woct",field:"woct",name:"字",width:"64px"},
		{id:"wopt",field:"wopt",name:"拼音聲調",width:"416px"},
		{id:"wocl",field:"wocl",name:"類別",width:"48px"},
		{id:"wosort",field:"wosort",name:"排序號",width:"48px"},
		{id:"wost",field:"wost",name:"狀態",width:"48px"}];
	rel_word_wordflowGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_user_wordflowGrid_store=new JsonRest({target:"../language/api/user",idProperty:"usid",sortParam:"orderBy"});
	rel_user_wordflowGrid_structure=[
		{id:"usid",field:"usid",name:"用戶名",width:"224px"},
		{id:"uspswd",field:"uspswd",name:"密碼",width:"224px"},
		{id:"usname",field:"usname",name:"昵稱",width:"224px"},
		{id:"usst",field:"usst",name:"狀態",width:"48px"},
		{id:"uslsid",field:"uslsid",name:"語言編碼",width:"128px"},
		{id:"uspn",field:"uspn",name:"單位能量",width:"48px"}];
	rel_user_wordflowGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	this.f_prepareAdd=function()
	{	msgAreaAdd_messages.removeAll({group:"add"});
		msgAreaAdd.refresh();
		add_wawoid.set("value","");
		add_wasi.set("value","");
		add_wapt.set("value","");
		add_wast.set("value","1");
		if(!wa)
		{	add_wausid.set("value",parent.user);
			add_wausid.set("readonly","readonly");
			dom.byId("add_wausidAssist").style.display="none";
		}
		else
			add_wausid.set("value","");
		if(this.interval_add_wacrdd!=null)
			clearInterval(interval_add_wacrdd);
		this.interval_add_wacrdd=setInterval(function(){add_wacrdd.set("value",new Date());},1000);
		if(this.interval_add_wacrdt!=null)
			clearInterval(interval_add_wacrdt);
		this.interval_add_wacrdt=setInterval(function(){add_wacrdt.set("value",new Date());},1000);
		if(this.interval_add_waupdd!=null)
			clearInterval(interval_add_waupdd);
		this.interval_add_waupdd=setInterval(function(){add_waupdd.set("value",new Date());},1000);
		if(this.interval_add_waupdt!=null)
			clearInterval(interval_add_waupdt);
		this.interval_add_waupdt=setInterval(function(){add_waupdt.set("value",new Date());},1000);
		addDialog.show();
	};
	this.f_checkAdd=function()
	{	var deferred=new Deferred();
		xhr.post("../language/api/wordflow_check",{data:domForm.toJson("addForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		obj.wacrdt=obj.wacrdt.substr(1);
		obj.waupdt=obj.waupdt.substr(1);
		grid.store.add(obj,{incremental:false}).then(function()
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
		all([grid.store.get(id),xhr("../language/api/base/lock",{query:{obj:"wdfl",id:id},handleAs:"json"})]).then(function(data)
		{	update_waid.set("value",data[0].waid);
			update_wawoid.set("value",data[0].wawoid);
			update_wasi.set("value",data[0].wasi);
			update_wapt.set("value",data[0].wapt);
			update_wast.set("value",data[0].wast);
			update_wausid.set("value",data[0].wausid);
			if(!wa)
			{	update_wausid.set("readonly","readonly");
				dom.byId("update_wausidAssist").style.display="none";
			}
			update_wacrdd.set("value",data[0].wacrdd);
			update_wacrdt.set("value","T"+data[0].wacrdt);
			update_waupdd.set("value",data[0].waupdd);
			if(this.interval_update_waupdd!=null)
				clearInterval(interval_update_waupdd);
			this.interval_update_waupdd=setInterval(function(){update_waupdd.set("value",new Date());},1000);
			update_waupdt.set("value","T"+data[0].waupdt);
			if(this.interval_update_waupdt!=null)
				clearInterval(interval_update_waupdt);
			this.interval_update_waupdt=setInterval(function(){update_waupdt.set("value",new Date());},1000);
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
		xhr("../language/api/base/unlock",{query:{obj:"wdfl",id:update_waid.get("value")},handleAs:"json"}).then(function(data)
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
		xhr.put("../language/api/wordflow_check"+"/"+update_waid.get("value"),{data:domForm.toJson("updateForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		obj.wacrdt=obj.wacrdt.substr(1);
		obj.waupdt=obj.waupdt.substr(1);
		all([grid.store.put(obj),xhr("../language/api/base/unlock",{query:{obj:"wdfl",id:update_waid.get("value")},handleAs:"json"})]).then(function(data)
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
		rel_word_wordflowGrid.connect(rel_word_wordflowGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_word_wordflowDialog,rel_word_wordflowGrid,row);
		});
		rel_user_wordflowGrid.connect(rel_user_wordflowGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_user_wordflowDialog,rel_user_wordflowGrid,row);
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
			if((raword||riword)&&select==1)
				wordLink.setAttribute('disabled',false);
			else
				wordLink.setAttribute('disabled',true);
			if((rauser||riuser)&&select==1)
				userLink.setAttribute('disabled',false);
			else
				userLink.setAttribute('disabled',true);
			if((rawordvote||riwordvote)&&select==1)
				wordvoteLink.setAttribute('disabled',false);
			else
				wordvoteLink.setAttribute('disabled',true);
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
		this.raword=this.riword=false;
		this.rauser=this.riuser=false;
		this.rawordvote=this.riwordvote=false;
		var dra=new Deferred(),dwa=new Deferred(),d=new Deferred(),d0=new Deferred();
		var dri=new Deferred(),dwi=new Deferred();
		var draword=new Deferred(),driword=new Deferred();
		var drauser=new Deferred(),driuser=new Deferred();
		var drawordvote=new Deferred(),driwordvote=new Deferred();
		var fra=function(){xhr("../language/api/base/security",{query:{auth:"wdfl_ra"},handleAs:"json"}).then(function(){this.ra=true;dra.resolve();},function(){dra.resolve();});return dra.promise;};
		var fwa=function(){xhr("../language/api/base/security",{query:{auth:"wdfl_wa"},handleAs:"json"}).then(function(){this.wa=true;dwa.resolve();},function(){dwa.resolve();});return dwa.promise;};
		var fri=function(){xhr("../language/api/base/security",{query:{auth:"wdfl_ri"},handleAs:"json"}).then(function(){this.ri=true;dri.resolve();},function(){dri.resolve();});return dri.promise;};
		var fwi=function(){xhr("../language/api/base/security",{query:{auth:"wdfl_wi"},handleAs:"json"}).then(function(){this.wi=true;dwi.resolve();},function(){dwi.resolve();});return dwi.promise;};
		var fraword=function(){xhr("../language/api/base/security",{query:{auth:"word_ra"},handleAs:"json"}).then(function(){this.raword=true;draword.resolve();},function(){draword.resolve();});return draword.promise;};
		var friword=function(){xhr("../language/api/base/security",{query:{auth:"word_ri"},handleAs:"json"}).then(function(){this.riword=true;driword.resolve();},function(){driword.resolve();});return driword.promise;};
		var frauser=function(){xhr("../language/api/base/security",{query:{auth:"user_ra"},handleAs:"json"}).then(function(){this.rauser=true;drauser.resolve();},function(){drauser.resolve();});return drauser.promise;};
		var friuser=function(){xhr("../language/api/base/security",{query:{auth:"user_ri"},handleAs:"json"}).then(function(){this.riuser=true;driuser.resolve();},function(){driuser.resolve();});return driuser.promise;};
		var frawordvote=function(){xhr("../language/api/base/security",{query:{auth:"wdvt_ra"},handleAs:"json"}).then(function(){this.rawordvote=true;drawordvote.resolve();},function(){drawordvote.resolve();});return drawordvote.promise;};
		var friwordvote=function(){xhr("../language/api/base/security",{query:{auth:"wdvt_ri"},handleAs:"json"}).then(function(){this.riwordvote=true;driwordvote.resolve();},function(){driwordvote.resolve();});return driwordvote.promise;};
		d0.promise.then(fraword).then(function(){if(!raword)return friword();}).then(frauser).then(function(){if(!rauser)return friuser();}).then(frawordvote).then(function(){if(!rawordvote)return friwordvote();}).then(fra).then(function(){if(!ra)return fri();}).then(fwa).then(function(){if(!wa)return fwi();}).then(function(){d.resolve();});
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
		{	xhr.del("../language/api/wordflow_check"+"/"+items[i],{handleAs:"json"}).then(function(data)
			{	_f_recCheckDelete(deferred,items,i+1);
			},function(data)
			{	var d=data.response.data,status=data.response.status;
				msgAreaDelete_messages.put({group:"delete",level:"error",msgId:items[i]},{msg:Message[status]+"："+grid.row(items[i]).data().wawoid+" "+grid.row(items[i]).data().wasi,targetNode:null});
				_f_recCheckDelete(deferred,items,i+1);
			});
		}
		else
		{	deferred.resolve(null);
		}
	};
});