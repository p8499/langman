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
	grid_store=new JsonRest({target:"../language/api/languageparameter",idProperty:"lplsid",sortParam:"orderBy"});
	grid_structure=[
		{id:"lplsid",field:"lplsid",name:"語言編碼",width:"128px"},
		{id:"lpsgng",field:"lpsgng",name:"MaxNGram",width:"64px"},
		{id:"lpsgch",field:"lpsgch",name:"NumChars",width:"64px"},
		{id:"lpsglf",field:"lpsglf",name:"Lambda",width:"48px"},
		{id:"lpsgcw",field:"lpsgcw",name:"ContiWeight",width:"48px"},
		{id:"lpsgbw",field:"lpsgbw",name:"BreakWeight",width:"48px"},
		{id:"lpsgnb",field:"lpsgnb",name:"MaxNBest",width:"64px"},
		{id:"lpsgft",field:"lpsgft",name:"分詞訓練",width:"224px"},
		{id:"lpsgfc",field:"lpsgfc",name:"分詞編譯",width:"224px"},
		{id:"lppong",field:"lppong",name:"NGram",width:"64px"},
		{id:"lppoch",field:"lppoch",name:"NumChars",width:"64px"},
		{id:"lppolf",field:"lppolf",name:"Lambda",width:"48px"},
		{id:"lppoft",field:"lppoft",name:"POS訓練",width:"224px"},
		{id:"lppofc",field:"lppofc",name:"POS編譯",width:"224px"}];
	grid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_language_languageparameterGrid_store=new JsonRest({target:"../language/api/language",idProperty:"lsid",sortParam:"orderBy"});
	rel_language_languageparameterGrid_structure=[
		{id:"lsid",field:"lsid",name:"語言編碼",width:"128px"},
		{id:"lsname",field:"lsname",name:"語言名稱",width:"128px"},
		{id:"lsloc",field:"lsloc",name:"學術名",width:"672px"},
		{id:"lssort",field:"lssort",name:"排序號",width:"64px"}];
	rel_language_languageparameterGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	this.f_prepareAdd=function()
	{	msgAreaAdd_messages.removeAll({group:"add"});
		msgAreaAdd.refresh();
		add_lplsid.set("value","");
		add_lpsgng.set("value","");
		add_lpsgch.set("value","");
		add_lpsglf.set("value","");
		add_lpsgcw.set("value","");
		add_lpsgbw.set("value","");
		add_lpsgnb.set("value","");
		add_lpsgft.set("value","");
		add_lpsgfc.set("value","");
		add_lppong.set("value","");
		add_lppoch.set("value","");
		add_lppolf.set("value","");
		add_lppoft.set("value","");
		add_lppofc.set("value","");
		addDialog.show();
	};
	this.f_checkAdd=function()
	{	var deferred=new Deferred();
		xhr.post("../language/api/languageparameter_check"+"/"+add_lplsid.get("value"),{data:domForm.toJson("addForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		all([grid.store.get(id),xhr("../language/api/base/lock",{query:{obj:"lang",id:id},handleAs:"json"})]).then(function(data)
		{	update_lplsid.set("value",data[0].lplsid);
			update_lpsgng.set("value",data[0].lpsgng);
			update_lpsgch.set("value",data[0].lpsgch);
			update_lpsglf.set("value",data[0].lpsglf);
			update_lpsgcw.set("value",data[0].lpsgcw);
			update_lpsgbw.set("value",data[0].lpsgbw);
			update_lpsgnb.set("value",data[0].lpsgnb);
			update_lpsgft.set("value",data[0].lpsgft);
			update_lpsgfc.set("value",data[0].lpsgfc);
			update_lppong.set("value",data[0].lppong);
			update_lppoch.set("value",data[0].lppoch);
			update_lppolf.set("value",data[0].lppolf);
			update_lppoft.set("value",data[0].lppoft);
			update_lppofc.set("value",data[0].lppofc);
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
		xhr("../language/api/base/unlock",{query:{obj:"lang",id:update_lplsid.get("value")},handleAs:"json"}).then(function(data)
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
		xhr.put("../language/api/languageparameter_check"+"/"+update_lplsid.get("value"),{data:domForm.toJson("updateForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		all([grid.store.put(obj),xhr("../language/api/base/unlock",{query:{obj:"lang",id:update_lplsid.get("value")},handleAs:"json"})]).then(function(data)
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
		rel_language_languageparameterGrid.connect(rel_language_languageparameterGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_language_languageparameterDialog,rel_language_languageparameterGrid,row);
		});
		f_auth().then(function()
		{	f_setControls(0x1111);
			if(ra)
				;
			else
				msgArea_messages.put({group:"global",level:"information",msgId:"rn"},{msg:"無權讀"});
			if(wa)
				;
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
			if(wa)
				addButton.setAttribute('disabled',false);
			else
				addButton.setAttribute('disabled',true);
		if(code&0x0010==0x0010)
		{	if(wa&&select==1)
				updateButton.setAttribute('disabled',false);
			else
				updateButton.setAttribute('disabled',true);
			if((ralanguage||rilanguage)&&select==1)
				languageLink.setAttribute('disabled',false);
			else
				languageLink.setAttribute('disabled',true);
		}
		if(code&0x0100==0x0100)
			if(wa&&select>0)
				deleteButton.setAttribute('disabled',false);
			else
				deleteButton.setAttribute('disabled',true);
		if(code&0x1000==0x1000)
			if(ra)
				queryButton.setAttribute('disabled',false);
			else
				queryButton.setAttribute('disabled',true);
	};
	this.f_auth=function()
	{	this.ra=this.wa=false;
		this.ralanguage=this.rilanguage=false;
		var dra=new Deferred(),dwa=new Deferred(),d=new Deferred(),d0=new Deferred();
		var dralanguage=new Deferred(),drilanguage=new Deferred();
		var fra=function(){xhr("../language/api/base/security",{query:{auth:"lang_ra"},handleAs:"json"}).then(function(){this.ra=true;dra.resolve();},function(){dra.resolve();});return dra.promise;};
		var fwa=function(){xhr("../language/api/base/security",{query:{auth:"lang_wa"},handleAs:"json"}).then(function(){this.wa=true;dwa.resolve();},function(){dwa.resolve();});return dwa.promise;};
		var fralanguage=function(){xhr("../language/api/base/security",{query:{auth:"lang_ra"},handleAs:"json"}).then(function(){this.ralanguage=true;dralanguage.resolve();},function(){dralanguage.resolve();});return dralanguage.promise;};
		var frilanguage=function(){xhr("../language/api/base/security",{query:{auth:"lang_ri"},handleAs:"json"}).then(function(){this.rilanguage=true;drilanguage.resolve();},function(){drilanguage.resolve();});return drilanguage.promise;};
		d0.promise.then(fralanguage).then(function(){if(!ralanguage)return frilanguage();}).then(fra).then(fwa).then(function(){d.resolve();});
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
		{	xhr.del("../language/api/languageparameter_check"+"/"+items[i],{handleAs:"json"}).then(function(data)
			{	_f_recCheckDelete(deferred,items,i+1);
			},function(data)
			{	var d=data.response.data,status=data.response.status;
				msgAreaDelete_messages.put({group:"delete",level:"error",msgId:items[i]},{msg:Message[status]+"："+grid.row(items[i]).data().lplsid,targetNode:null});
				_f_recCheckDelete(deferred,items,i+1);
			});
		}
		else
		{	deferred.resolve(null);
		}
	};
});