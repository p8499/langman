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
	grid_store=new JsonRest({target:"../language/api/segmentflow",idProperty:"taid",sortParam:"orderBy"});
	grid_structure=[
		{id:"taid",field:"taid",name:"線程編碼",width:"64px"},
		{id:"taasid",field:"taasid",name:"文句編碼",width:"64px"},
		{id:"tasi",field:"tasi",name:"子項號",width:"64px"},
		{id:"tapi",field:"tapi",name:"拼音聲調",width:"2720px"},
		{id:"tahz",field:"tahz",name:"漢字",width:"672px"},
		{id:"tast",field:"tast",name:"狀態",width:"48px"},
		{id:"tausid",field:"tausid",name:"擁有者",width:"224px"},
		{id:"tacrdd",field:"tacrdd",name:"創建日腳",width:"80px"},
		{id:"tacrdt",field:"tacrdt",name:"創建辰光",width:"64px"},
		{id:"taupdd",field:"taupdd",name:"更新日腳",width:"80px"},
		{id:"taupdt",field:"taupdt",name:"更新辰光",width:"64px"}];
	grid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_sentence_segmentflowGrid_store=new JsonRest({target:"../language/api/sentence",idProperty:"asid",sortParam:"orderBy"});
	rel_sentence_segmentflowGrid_structure=[
		{id:"asid",field:"asid",name:"文句編碼",width:"64px"},
		{id:"asatid",field:"asatid",name:"文章編碼",width:"64px"},
		{id:"assi",field:"assi",name:"子項號",width:"64px"},
		{id:"ascont",field:"ascont",name:"內容",width:"672px"},
		{id:"asst",field:"asst",name:"狀態",width:"48px"},
		{id:"asusid",field:"asusid",name:"擁有者",width:"224px"},
		{id:"asupdd",field:"asupdd",name:"更新日腳",width:"80px"},
		{id:"asupdt",field:"asupdt",name:"更新辰光",width:"64px"}];
	rel_sentence_segmentflowGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_user_segmentflowGrid_store=new JsonRest({target:"../language/api/user",idProperty:"usid",sortParam:"orderBy"});
	rel_user_segmentflowGrid_structure=[
		{id:"usid",field:"usid",name:"用戶名",width:"224px"},
		{id:"uspswd",field:"uspswd",name:"密碼",width:"224px"},
		{id:"usname",field:"usname",name:"昵稱",width:"224px"},
		{id:"usst",field:"usst",name:"狀態",width:"48px"},
		{id:"uslsid",field:"uslsid",name:"語言編碼",width:"128px"}];
	rel_user_segmentflowGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	this.f_prepareAdd=function()
	{	msgAreaAdd_messages.removeAll({group:"add"});
		msgAreaAdd.refresh();
		add_taasid.set("value","");
		add_tasi.set("value","");
		add_tapi.set("value","");
		add_tahz.set("value","");
		add_tast.set("value","1");
		if(!wa)
		{	add_tausid.set("value",parent.user);
			add_tausid.set("readonly","readonly");
			dom.byId("add_tausidAssist").style.display="none";
		}
		else
			add_tausid.set("value","");
		if(this.interval_add_tacrdd!=null)
			clearInterval(interval_add_tacrdd);
		this.interval_add_tacrdd=setInterval(function(){add_tacrdd.set("value",new Date());},1000);
		if(this.interval_add_tacrdt!=null)
			clearInterval(interval_add_tacrdt);
		this.interval_add_tacrdt=setInterval(function(){add_tacrdt.set("value",new Date());},1000);
		if(this.interval_add_taupdd!=null)
			clearInterval(interval_add_taupdd);
		this.interval_add_taupdd=setInterval(function(){add_taupdd.set("value",new Date());},1000);
		if(this.interval_add_taupdt!=null)
			clearInterval(interval_add_taupdt);
		this.interval_add_taupdt=setInterval(function(){add_taupdt.set("value",new Date());},1000);
		addDialog.show();
	};
	this.f_checkAdd=function()
	{	var deferred=new Deferred();
		xhr.post("../language/api/segmentflow_check",{data:domForm.toJson("addForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		obj.tacrdt=obj.tacrdt.substr(1);
		obj.taupdt=obj.taupdt.substr(1);
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
		all([grid.store.get(id),xhr("../language/api/base/lock",{query:{obj:"sgfl",id:id},handleAs:"json"})]).then(function(data)
		{	update_taid.set("value",data[0].taid);
			update_taasid.set("value",data[0].taasid);
			update_tasi.set("value",data[0].tasi);
			update_tapi.set("value",data[0].tapi);
			update_tahz.set("value",data[0].tahz);
			update_tast.set("value",data[0].tast);
			update_tausid.set("value",data[0].tausid);
			if(!wa)
			{	update_tausid.set("readonly","readonly");
				dom.byId("update_tausidAssist").style.display="none";
			}
			update_tacrdd.set("value",data[0].tacrdd);
			update_tacrdt.set("value","T"+data[0].tacrdt);
			update_taupdd.set("value",data[0].taupdd);
			if(this.interval_update_taupdd!=null)
				clearInterval(interval_update_taupdd);
			this.interval_update_taupdd=setInterval(function(){update_taupdd.set("value",new Date());},1000);
			update_taupdt.set("value","T"+data[0].taupdt);
			if(this.interval_update_taupdt!=null)
				clearInterval(interval_update_taupdt);
			this.interval_update_taupdt=setInterval(function(){update_taupdt.set("value",new Date());},1000);
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
		xhr("../language/api/base/unlock",{query:{obj:"sgfl",id:update_taid.get("value")},handleAs:"json"}).then(function(data)
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
		xhr.put("../language/api/segmentflow_check"+"/"+update_taid.get("value"),{data:domForm.toJson("updateForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		obj.tacrdt=obj.tacrdt.substr(1);
		obj.taupdt=obj.taupdt.substr(1);
		all([grid.store.put(obj),xhr("../language/api/base/unlock",{query:{obj:"sgfl",id:update_taid.get("value")},handleAs:"json"})]).then(function(data)
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
		rel_sentence_segmentflowGrid.connect(rel_sentence_segmentflowGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_sentence_segmentflowDialog,rel_sentence_segmentflowGrid,row);
		});
		rel_user_segmentflowGrid.connect(rel_user_segmentflowGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_user_segmentflowDialog,rel_user_segmentflowGrid,row);
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
			if((rasentence||risentence)&&select==1)
				sentenceLink.setAttribute('disabled',false);
			else
				sentenceLink.setAttribute('disabled',true);
			if((rauser||riuser)&&select==1)
				userLink.setAttribute('disabled',false);
			else
				userLink.setAttribute('disabled',true);
			if((rasegmentvote||risegmentvote)&&select==1)
				segmentvoteLink.setAttribute('disabled',false);
			else
				segmentvoteLink.setAttribute('disabled',true);
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
		this.rasentence=this.risentence=false;
		this.rauser=this.riuser=false;
		this.rasegmentvote=this.risegmentvote=false;
		var dra=new Deferred(),dwa=new Deferred(),d=new Deferred(),d0=new Deferred();
		var dri=new Deferred(),dwi=new Deferred();
		var drasentence=new Deferred(),drisentence=new Deferred();
		var drauser=new Deferred(),driuser=new Deferred();
		var drasegmentvote=new Deferred(),drisegmentvote=new Deferred();
		var fra=function(){xhr("../language/api/base/security",{query:{auth:"sgfl_ra"},handleAs:"json"}).then(function(){this.ra=true;dra.resolve();},function(){dra.resolve();});return dra.promise;};
		var fwa=function(){xhr("../language/api/base/security",{query:{auth:"sgfl_wa"},handleAs:"json"}).then(function(){this.wa=true;dwa.resolve();},function(){dwa.resolve();});return dwa.promise;};
		var fri=function(){xhr("../language/api/base/security",{query:{auth:"sgfl_ri"},handleAs:"json"}).then(function(){this.ri=true;dri.resolve();},function(){dri.resolve();});return dri.promise;};
		var fwi=function(){xhr("../language/api/base/security",{query:{auth:"sgfl_wi"},handleAs:"json"}).then(function(){this.wi=true;dwi.resolve();},function(){dwi.resolve();});return dwi.promise;};
		var frasentence=function(){xhr("../language/api/base/security",{query:{auth:"sent_ra"},handleAs:"json"}).then(function(){this.rasentence=true;drasentence.resolve();},function(){drasentence.resolve();});return drasentence.promise;};
		var frisentence=function(){xhr("../language/api/base/security",{query:{auth:"sent_ri"},handleAs:"json"}).then(function(){this.risentence=true;drisentence.resolve();},function(){drisentence.resolve();});return drisentence.promise;};
		var frauser=function(){xhr("../language/api/base/security",{query:{auth:"user_ra"},handleAs:"json"}).then(function(){this.rauser=true;drauser.resolve();},function(){drauser.resolve();});return drauser.promise;};
		var friuser=function(){xhr("../language/api/base/security",{query:{auth:"user_ri"},handleAs:"json"}).then(function(){this.riuser=true;driuser.resolve();},function(){driuser.resolve();});return driuser.promise;};
		var frasegmentvote=function(){xhr("../language/api/base/security",{query:{auth:"sgvt_ra"},handleAs:"json"}).then(function(){this.rasegmentvote=true;drasegmentvote.resolve();},function(){drasegmentvote.resolve();});return drasegmentvote.promise;};
		var frisegmentvote=function(){xhr("../language/api/base/security",{query:{auth:"sgvt_ri"},handleAs:"json"}).then(function(){this.risegmentvote=true;drisegmentvote.resolve();},function(){drisegmentvote.resolve();});return drisegmentvote.promise;};
		d0.promise.then(frasentence).then(function(){if(!rasentence)return frisentence();}).then(frauser).then(function(){if(!rauser)return friuser();}).then(frasegmentvote).then(function(){if(!rasegmentvote)return frisegmentvote();}).then(fra).then(function(){if(!ra)return fri();}).then(fwa).then(function(){if(!wa)return fwi();}).then(function(){d.resolve();});
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
		{	xhr.del("../language/api/segmentflow_check"+"/"+items[i],{handleAs:"json"}).then(function(data)
			{	_f_recCheckDelete(deferred,items,i+1);
			},function(data)
			{	var d=data.response.data,status=data.response.status;
				msgAreaDelete_messages.put({group:"delete",level:"error",msgId:items[i]},{msg:Message[status]+"："+grid.row(items[i]).data().taasid+" "+grid.row(items[i]).data().tasi,targetNode:null});
				_f_recCheckDelete(deferred,items,i+1);
			});
		}
		else
		{	deferred.resolve(null);
		}
	};
});