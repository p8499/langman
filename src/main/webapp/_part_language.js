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
	grid_store=new JsonRest({target:"../language/api/language_mask",idProperty:"lsid",sortParam:"orderBy"});
	grid_structure=[
		{id:"lsid",field:"lsid",name:"語言編碼",width:"128px"},
		{id:"lsname",field:"lsname",name:"語言名稱",width:"128px"},
		{id:"lsloc",field:"lsloc",name:"學術名",width:"672px"},
		{id:"lssort",field:"lssort",name:"排序號",width:"64px"}];
	grid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	this.f_prepareAdd=function()
	{	msgAreaAdd_messages.removeAll({group:"add"});
		msgAreaAdd.refresh();
		add_lsid.set("value","");
		add_lsname.set("value","");
		add_lsloc.set("value","");
		add_lssort.set("value","");
		addDialog.show();
	};
	this.f_checkAdd=function()
	{	var deferred=new Deferred();
		xhr.post("../language/api/language_check"+"/"+add_lsid.get("value"),{data:domForm.toJson("addForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		{	update_lsid.set("value",data[0].lsid);
			update_lsname.set("value",data[0].lsname);
			update_lsloc.set("value",data[0].lsloc);
			update_lssort.set("value",data[0].lssort);
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
		xhr("../language/api/base/unlock",{query:{obj:"lang",id:update_lsid.get("value")},handleAs:"json"}).then(function(data)
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
		xhr.put("../language/api/language_check"+"/"+update_lsid.get("value"),{data:domForm.toJson("updateForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		all([grid.store.put(obj),xhr("../language/api/base/unlock",{query:{obj:"lang",id:update_lsid.get("value")},handleAs:"json"})]).then(function(data)
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
			if((rauser||riuser)&&select==1)
				userLink.setAttribute('disabled',false);
			else
				userLink.setAttribute('disabled',true);
			if((ralanguageparameter||rilanguageparameter)&&select==1)
				languageparameterLink.setAttribute('disabled',false);
			else
				languageparameterLink.setAttribute('disabled',true);
			if((racategory||ricategory)&&select==1)
				categoryLink.setAttribute('disabled',false);
			else
				categoryLink.setAttribute('disabled',true);
			if((rachunk||richunk)&&select==1)
				chunkLink.setAttribute('disabled',false);
			else
				chunkLink.setAttribute('disabled',true);
			if((raword||riword)&&select==1)
				wordLink.setAttribute('disabled',false);
			else
				wordLink.setAttribute('disabled',true);
			if((rapronounce||ripronounce)&&select==1)
				pronounceLink.setAttribute('disabled',false);
			else
				pronounceLink.setAttribute('disabled',true);
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
		this.rauser=this.riuser=false;
		this.ralanguageparameter=this.rilanguageparameter=false;
		this.racategory=this.ricategory=false;
		this.rachunk=this.richunk=false;
		this.raword=this.riword=false;
		this.rapronounce=this.ripronounce=false;
		var dra=new Deferred(),dwa=new Deferred(),d=new Deferred(),d0=new Deferred();
		var drauser=new Deferred(),driuser=new Deferred();
		var dralanguageparameter=new Deferred(),drilanguageparameter=new Deferred();
		var dracategory=new Deferred(),dricategory=new Deferred();
		var drachunk=new Deferred(),drichunk=new Deferred();
		var draword=new Deferred(),driword=new Deferred();
		var drapronounce=new Deferred(),dripronounce=new Deferred();
		var fra=function(){xhr("../language/api/base/security",{query:{auth:"lang_ra"},handleAs:"json"}).then(function(){this.ra=true;dra.resolve();},function(){dra.resolve();});return dra.promise;};
		var fwa=function(){xhr("../language/api/base/security",{query:{auth:"lang_wa"},handleAs:"json"}).then(function(){this.wa=true;dwa.resolve();},function(){dwa.resolve();});return dwa.promise;};
		var frauser=function(){xhr("../language/api/base/security",{query:{auth:"user_ra"},handleAs:"json"}).then(function(){this.rauser=true;drauser.resolve();},function(){drauser.resolve();});return drauser.promise;};
		var friuser=function(){xhr("../language/api/base/security",{query:{auth:"user_ri"},handleAs:"json"}).then(function(){this.riuser=true;driuser.resolve();},function(){driuser.resolve();});return driuser.promise;};
		var fralanguageparameter=function(){xhr("../language/api/base/security",{query:{auth:"lang_ra"},handleAs:"json"}).then(function(){this.ralanguageparameter=true;dralanguageparameter.resolve();},function(){dralanguageparameter.resolve();});return dralanguageparameter.promise;};
		var frilanguageparameter=function(){xhr("../language/api/base/security",{query:{auth:"lang_ri"},handleAs:"json"}).then(function(){this.rilanguageparameter=true;drilanguageparameter.resolve();},function(){drilanguageparameter.resolve();});return drilanguageparameter.promise;};
		var fracategory=function(){xhr("../language/api/base/security",{query:{auth:"cate_ra"},handleAs:"json"}).then(function(){this.racategory=true;dracategory.resolve();},function(){dracategory.resolve();});return dracategory.promise;};
		var fricategory=function(){xhr("../language/api/base/security",{query:{auth:"cate_ri"},handleAs:"json"}).then(function(){this.ricategory=true;dricategory.resolve();},function(){dricategory.resolve();});return dricategory.promise;};
		var frachunk=function(){xhr("../language/api/base/security",{query:{auth:"chnk_ra"},handleAs:"json"}).then(function(){this.rachunk=true;drachunk.resolve();},function(){drachunk.resolve();});return drachunk.promise;};
		var frichunk=function(){xhr("../language/api/base/security",{query:{auth:"chnk_ri"},handleAs:"json"}).then(function(){this.richunk=true;drichunk.resolve();},function(){drichunk.resolve();});return drichunk.promise;};
		var fraword=function(){xhr("../language/api/base/security",{query:{auth:"word_ra"},handleAs:"json"}).then(function(){this.raword=true;draword.resolve();},function(){draword.resolve();});return draword.promise;};
		var friword=function(){xhr("../language/api/base/security",{query:{auth:"word_ri"},handleAs:"json"}).then(function(){this.riword=true;driword.resolve();},function(){driword.resolve();});return driword.promise;};
		var frapronounce=function(){xhr("../language/api/base/security",{query:{auth:"pron_ra"},handleAs:"json"}).then(function(){this.rapronounce=true;drapronounce.resolve();},function(){drapronounce.resolve();});return drapronounce.promise;};
		var fripronounce=function(){xhr("../language/api/base/security",{query:{auth:"pron_ri"},handleAs:"json"}).then(function(){this.ripronounce=true;dripronounce.resolve();},function(){dripronounce.resolve();});return dripronounce.promise;};
		d0.promise.then(frauser).then(function(){if(!rauser)return friuser();}).then(fralanguageparameter).then(function(){if(!ralanguageparameter)return frilanguageparameter();}).then(fracategory).then(function(){if(!racategory)return fricategory();}).then(frachunk).then(function(){if(!rachunk)return frichunk();}).then(fraword).then(function(){if(!raword)return friword();}).then(frapronounce).then(function(){if(!rapronounce)return fripronounce();}).then(fra).then(fwa).then(function(){d.resolve();});
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
		{	xhr.del("../language/api/language_check"+"/"+items[i],{handleAs:"json"}).then(function(data)
			{	_f_recCheckDelete(deferred,items,i+1);
			},function(data)
			{	var d=data.response.data,status=data.response.status;
				msgAreaDelete_messages.put({group:"delete",level:"error",msgId:items[i]},{msg:Message[status]+"："+grid.row(items[i]).data().lsname,targetNode:null});
				_f_recCheckDelete(deferred,items,i+1);
			});
		}
		else
		{	deferred.resolve(null);
		}
	};
});