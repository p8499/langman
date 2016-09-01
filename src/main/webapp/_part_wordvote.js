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
	grid_store=new JsonRest({target:"../language/api/wordvote",idProperty:"wvid",sortParam:"orderBy"});
	grid_structure=[
		{id:"wvid",field:"wvid",name:"投票編碼",width:"64px"},
		{id:"wvwaid",field:"wvwaid",name:"線程編碼",width:"64px"},
		{id:"wvsi",field:"wvsi",name:"子項號",width:"64px"},
		{id:"wvusid",field:"wvusid",name:"擁有者",width:"224px"},
		{id:"wvpo",field:"wvpo",name:"能量",width:"48px"},
		{id:"wvupdd",field:"wvupdd",name:"更新日腳",width:"80px"},
		{id:"wvupdt",field:"wvupdt",name:"更新辰光",width:"64px"}];
	grid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_wordflow_wordvoteGrid_store=new JsonRest({target:"../language/api/wordflow",idProperty:"waid",sortParam:"orderBy"});
	rel_wordflow_wordvoteGrid_structure=[
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
	rel_wordflow_wordvoteGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_user_wordvoteGrid_store=new JsonRest({target:"../language/api/user",idProperty:"usid",sortParam:"orderBy"});
	rel_user_wordvoteGrid_structure=[
		{id:"usid",field:"usid",name:"用戶名",width:"224px"},
		{id:"uspswd",field:"uspswd",name:"密碼",width:"224px"},
		{id:"usname",field:"usname",name:"昵稱",width:"224px"},
		{id:"usst",field:"usst",name:"狀態",width:"48px"},
		{id:"uslsid",field:"uslsid",name:"語言編碼",width:"128px"}];
	rel_user_wordvoteGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	this.f_prepareAdd=function()
	{	msgAreaAdd_messages.removeAll({group:"add"});
		msgAreaAdd.refresh();
		add_wvwaid.set("value","");
		add_wvsi.set("value","");
		if(!wa)
		{	add_wvusid.set("value",parent.user);
			add_wvusid.set("readonly","readonly");
			dom.byId("add_wvusidAssist").style.display="none";
		}
		else
			add_wvusid.set("value","");
		add_wvpo.set("value","");
		if(this.interval_add_wvupdd!=null)
			clearInterval(interval_add_wvupdd);
		this.interval_add_wvupdd=setInterval(function(){add_wvupdd.set("value",new Date());},1000);
		if(this.interval_add_wvupdt!=null)
			clearInterval(interval_add_wvupdt);
		this.interval_add_wvupdt=setInterval(function(){add_wvupdt.set("value",new Date());},1000);
		addDialog.show();
	};
	this.f_checkAdd=function()
	{	var deferred=new Deferred();
		xhr.post("../language/api/wordvote_check",{data:domForm.toJson("addForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		obj.wvupdt=obj.wvupdt.substr(1);
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
		all([grid.store.get(id),xhr("../language/api/base/lock",{query:{obj:"wdvt",id:id},handleAs:"json"})]).then(function(data)
		{	update_wvid.set("value",data[0].wvid);
			update_wvwaid.set("value",data[0].wvwaid);
			update_wvsi.set("value",data[0].wvsi);
			update_wvusid.set("value",data[0].wvusid);
			if(!wa)
			{	update_wvusid.set("readonly","readonly");
				dom.byId("update_wvusidAssist").style.display="none";
			}
			update_wvpo.set("value",data[0].wvpo);
			update_wvupdd.set("value",data[0].wvupdd);
			if(this.interval_update_wvupdd!=null)
				clearInterval(interval_update_wvupdd);
			this.interval_update_wvupdd=setInterval(function(){update_wvupdd.set("value",new Date());},1000);
			update_wvupdt.set("value","T"+data[0].wvupdt);
			if(this.interval_update_wvupdt!=null)
				clearInterval(interval_update_wvupdt);
			this.interval_update_wvupdt=setInterval(function(){update_wvupdt.set("value",new Date());},1000);
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
		xhr("../language/api/base/unlock",{query:{obj:"wdvt",id:update_wvid.get("value")},handleAs:"json"}).then(function(data)
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
		xhr.put("../language/api/wordvote_check"+"/"+update_wvid.get("value"),{data:domForm.toJson("updateForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		obj.wvupdt=obj.wvupdt.substr(1);
		all([grid.store.put(obj),xhr("../language/api/base/unlock",{query:{obj:"wdvt",id:update_wvid.get("value")},handleAs:"json"})]).then(function(data)
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
		rel_wordflow_wordvoteGrid.connect(rel_wordflow_wordvoteGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_wordflow_wordvoteDialog,rel_wordflow_wordvoteGrid,row);
		});
		rel_user_wordvoteGrid.connect(rel_user_wordvoteGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_user_wordvoteDialog,rel_user_wordvoteGrid,row);
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
			if((rawordflow||riwordflow)&&select==1)
				wordflowLink.setAttribute('disabled',false);
			else
				wordflowLink.setAttribute('disabled',true);
			if((rauser||riuser)&&select==1)
				userLink.setAttribute('disabled',false);
			else
				userLink.setAttribute('disabled',true);
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
		this.rawordflow=this.riwordflow=false;
		this.rauser=this.riuser=false;
		var dra=new Deferred(),dwa=new Deferred(),d=new Deferred(),d0=new Deferred();
		var dri=new Deferred(),dwi=new Deferred();
		var drawordflow=new Deferred(),driwordflow=new Deferred();
		var drauser=new Deferred(),driuser=new Deferred();
		var fra=function(){xhr("../language/api/base/security",{query:{auth:"wdvt_ra"},handleAs:"json"}).then(function(){this.ra=true;dra.resolve();},function(){dra.resolve();});return dra.promise;};
		var fwa=function(){xhr("../language/api/base/security",{query:{auth:"wdvt_wa"},handleAs:"json"}).then(function(){this.wa=true;dwa.resolve();},function(){dwa.resolve();});return dwa.promise;};
		var fri=function(){xhr("../language/api/base/security",{query:{auth:"wdvt_ri"},handleAs:"json"}).then(function(){this.ri=true;dri.resolve();},function(){dri.resolve();});return dri.promise;};
		var fwi=function(){xhr("../language/api/base/security",{query:{auth:"wdvt_wi"},handleAs:"json"}).then(function(){this.wi=true;dwi.resolve();},function(){dwi.resolve();});return dwi.promise;};
		var frawordflow=function(){xhr("../language/api/base/security",{query:{auth:"wdfl_ra"},handleAs:"json"}).then(function(){this.rawordflow=true;drawordflow.resolve();},function(){drawordflow.resolve();});return drawordflow.promise;};
		var friwordflow=function(){xhr("../language/api/base/security",{query:{auth:"wdfl_ri"},handleAs:"json"}).then(function(){this.riwordflow=true;driwordflow.resolve();},function(){driwordflow.resolve();});return driwordflow.promise;};
		var frauser=function(){xhr("../language/api/base/security",{query:{auth:"user_ra"},handleAs:"json"}).then(function(){this.rauser=true;drauser.resolve();},function(){drauser.resolve();});return drauser.promise;};
		var friuser=function(){xhr("../language/api/base/security",{query:{auth:"user_ri"},handleAs:"json"}).then(function(){this.riuser=true;driuser.resolve();},function(){driuser.resolve();});return driuser.promise;};
		d0.promise.then(frawordflow).then(function(){if(!rawordflow)return friwordflow();}).then(frauser).then(function(){if(!rauser)return friuser();}).then(fra).then(function(){if(!ra)return fri();}).then(fwa).then(function(){if(!wa)return fwi();}).then(function(){d.resolve();});
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
		{	xhr.del("../language/api/wordvote_check"+"/"+items[i],{handleAs:"json"}).then(function(data)
			{	_f_recCheckDelete(deferred,items,i+1);
			},function(data)
			{	var d=data.response.data,status=data.response.status;
				msgAreaDelete_messages.put({group:"delete",level:"error",msgId:items[i]},{msg:Message[status]+"："+grid.row(items[i]).data().wvwaid+" "+grid.row(items[i]).data().wvusid,targetNode:null});
				_f_recCheckDelete(deferred,items,i+1);
			});
		}
		else
		{	deferred.resolve(null);
		}
	};
});