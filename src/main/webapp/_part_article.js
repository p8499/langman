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
	grid_store=new JsonRest({target:"../language/api/article",idProperty:"atid",sortParam:"orderBy"});
	grid_structure=[
		{id:"atid",field:"atid",name:"文章編碼",width:"64px"},
		{id:"atcgid",field:"atcgid",name:"分類編碼",width:"64px"},
		{id:"atsi",field:"atsi",name:"子項號",width:"64px"},
		{id:"atname",field:"atname",name:"文章名稱",width:"224px"},
		{id:"atusid",field:"atusid",name:"擁有者",width:"224px"},
		{id:"atupdd",field:"atupdd",name:"更新日腳",width:"80px"},
		{id:"atupdt",field:"atupdt",name:"更新辰光",width:"64px"},
		{id:"atcgname",field:"atcgname",name:":分類名稱",width:"224px"},
		{id:"atcsa",field:"atcsa",name:":A類",width:"48px"},
		{id:"atcsb",field:"atcsb",name:":B類",width:"48px"},
		{id:"atcsc",field:"atcsc",name:":C類",width:"48px"},
		{id:"atcsd",field:"atcsd",name:":D類",width:"48px"},
		{id:"atcse",field:"atcse",name:":E類",width:"48px"},
		{id:"atcsf",field:"atcsf",name:":F類",width:"48px"}];
	grid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_user_articleGrid_store=new JsonRest({target:"../language/api/user",idProperty:"usid",sortParam:"orderBy"});
	rel_user_articleGrid_structure=[
		{id:"usid",field:"usid",name:"用戶名",width:"224px"},
		{id:"uspswd",field:"uspswd",name:"密碼",width:"224px"},
		{id:"usname",field:"usname",name:"昵稱",width:"224px"},
		{id:"usst",field:"usst",name:"狀態",width:"48px"},
		{id:"uslsid",field:"uslsid",name:"語言編碼",width:"128px"}];
	rel_user_articleGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_category_articleGrid_store=new JsonRest({target:"../language/api/category",idProperty:"cgid",sortParam:"orderBy"});
	rel_category_articleGrid_structure=[
		{id:"cgid",field:"cgid",name:"分類編碼",width:"64px"},
		{id:"cglsid",field:"cglsid",name:"語言編碼",width:"128px"},
		{id:"cgsi",field:"cgsi",name:"子項號",width:"64px"},
		{id:"cgpsi",field:"cgpsi",name:"父項號",width:"64px"},
		{id:"cgname",field:"cgname",name:"分類名稱",width:"224px"}];
	rel_category_articleGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	this.f_prepareAdd=function()
	{	msgAreaAdd_messages.removeAll({group:"add"});
		msgAreaAdd.refresh();
		add_atcgid.set("value","");
		add_atsi.set("value","");
		add_atname.set("value","");
		if(!wa)
		{	add_atusid.set("value",parent.user);
			add_atusid.set("readonly","readonly");
			dom.byId("add_atusidAssist").style.display="none";
		}
		else
			add_atusid.set("value","");
		if(this.interval_add_atupdd!=null)
			clearInterval(interval_add_atupdd);
		this.interval_add_atupdd=setInterval(function(){add_atupdd.set("value",new Date());},1000);
		if(this.interval_add_atupdt!=null)
			clearInterval(interval_add_atupdt);
		this.interval_add_atupdt=setInterval(function(){add_atupdt.set("value",new Date());},1000);
		add_atcgname.set("value","");
		add_atcsa.set("value","");
		add_atcsb.set("value","");
		add_atcsc.set("value","");
		add_atcsd.set("value","");
		add_atcse.set("value","");
		add_atcsf.set("value","");
		addDialog.show();
	};
	this.f_checkAdd=function()
	{	var deferred=new Deferred();
		xhr.post("../language/api/article_check",{data:domForm.toJson("addForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		obj.atupdt=obj.atupdt.substr(1);
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
		all([grid.store.get(id),xhr("../language/api/base/lock",{query:{obj:"artc",id:id},handleAs:"json"})]).then(function(data)
		{	update_atid.set("value",data[0].atid);
			update_atcgid.set("value",data[0].atcgid);
			update_atsi.set("value",data[0].atsi);
			update_atname.set("value",data[0].atname);
			update_atusid.set("value",data[0].atusid);
			if(!wa)
			{	update_atusid.set("readonly","readonly");
				dom.byId("update_atusidAssist").style.display="none";
			}
			update_atupdd.set("value",data[0].atupdd);
			if(this.interval_update_atupdd!=null)
				clearInterval(interval_update_atupdd);
			this.interval_update_atupdd=setInterval(function(){update_atupdd.set("value",new Date());},1000);
			update_atupdt.set("value","T"+data[0].atupdt);
			if(this.interval_update_atupdt!=null)
				clearInterval(interval_update_atupdt);
			this.interval_update_atupdt=setInterval(function(){update_atupdt.set("value",new Date());},1000);
			update_atcgname.set("value",data[0].atcgname);
			update_atcsa.set("value",data[0].atcsa);
			update_atcsb.set("value",data[0].atcsb);
			update_atcsc.set("value",data[0].atcsc);
			update_atcsd.set("value",data[0].atcsd);
			update_atcse.set("value",data[0].atcse);
			update_atcsf.set("value",data[0].atcsf);
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
		xhr("../language/api/base/unlock",{query:{obj:"artc",id:update_atid.get("value")},handleAs:"json"}).then(function(data)
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
		xhr.put("../language/api/article_check"+"/"+update_atid.get("value"),{data:domForm.toJson("updateForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		obj.atupdt=obj.atupdt.substr(1);
		all([grid.store.put(obj),xhr("../language/api/base/unlock",{query:{obj:"artc",id:update_atid.get("value")},handleAs:"json"})]).then(function(data)
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
		rel_user_articleGrid.connect(rel_user_articleGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_user_articleDialog,rel_user_articleGrid,row);
		});
		rel_category_articleGrid.connect(rel_category_articleGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_category_articleDialog,rel_category_articleGrid,row);
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
			if((rauser||riuser)&&select==1)
				userLink.setAttribute('disabled',false);
			else
				userLink.setAttribute('disabled',true);
			if((racategory||ricategory)&&select==1)
				categoryLink.setAttribute('disabled',false);
			else
				categoryLink.setAttribute('disabled',true);
			if((rasentence||risentence)&&select==1)
				sentenceLink.setAttribute('disabled',false);
			else
				sentenceLink.setAttribute('disabled',true);
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
		this.rauser=this.riuser=false;
		this.racategory=this.ricategory=false;
		this.rasentence=this.risentence=false;
		var dra=new Deferred(),dwa=new Deferred(),d=new Deferred(),d0=new Deferred();
		var dri=new Deferred(),dwi=new Deferred();
		var drauser=new Deferred(),driuser=new Deferred();
		var dracategory=new Deferred(),dricategory=new Deferred();
		var drasentence=new Deferred(),drisentence=new Deferred();
		var fra=function(){xhr("../language/api/base/security",{query:{auth:"artc_ra"},handleAs:"json"}).then(function(){this.ra=true;dra.resolve();},function(){dra.resolve();});return dra.promise;};
		var fwa=function(){xhr("../language/api/base/security",{query:{auth:"artc_wa"},handleAs:"json"}).then(function(){this.wa=true;dwa.resolve();},function(){dwa.resolve();});return dwa.promise;};
		var fri=function(){xhr("../language/api/base/security",{query:{auth:"artc_ri"},handleAs:"json"}).then(function(){this.ri=true;dri.resolve();},function(){dri.resolve();});return dri.promise;};
		var fwi=function(){xhr("../language/api/base/security",{query:{auth:"artc_wi"},handleAs:"json"}).then(function(){this.wi=true;dwi.resolve();},function(){dwi.resolve();});return dwi.promise;};
		var frauser=function(){xhr("../language/api/base/security",{query:{auth:"user_ra"},handleAs:"json"}).then(function(){this.rauser=true;drauser.resolve();},function(){drauser.resolve();});return drauser.promise;};
		var friuser=function(){xhr("../language/api/base/security",{query:{auth:"user_ri"},handleAs:"json"}).then(function(){this.riuser=true;driuser.resolve();},function(){driuser.resolve();});return driuser.promise;};
		var fracategory=function(){xhr("../language/api/base/security",{query:{auth:"cate_ra"},handleAs:"json"}).then(function(){this.racategory=true;dracategory.resolve();},function(){dracategory.resolve();});return dracategory.promise;};
		var fricategory=function(){xhr("../language/api/base/security",{query:{auth:"cate_ri"},handleAs:"json"}).then(function(){this.ricategory=true;dricategory.resolve();},function(){dricategory.resolve();});return dricategory.promise;};
		var frasentence=function(){xhr("../language/api/base/security",{query:{auth:"sent_ra"},handleAs:"json"}).then(function(){this.rasentence=true;drasentence.resolve();},function(){drasentence.resolve();});return drasentence.promise;};
		var frisentence=function(){xhr("../language/api/base/security",{query:{auth:"sent_ri"},handleAs:"json"}).then(function(){this.risentence=true;drisentence.resolve();},function(){drisentence.resolve();});return drisentence.promise;};
		d0.promise.then(frauser).then(function(){if(!rauser)return friuser();}).then(fracategory).then(function(){if(!racategory)return fricategory();}).then(frasentence).then(function(){if(!rasentence)return frisentence();}).then(fra).then(function(){if(!ra)return fri();}).then(fwa).then(function(){if(!wa)return fwi();}).then(function(){d.resolve();});
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
		{	xhr.del("../language/api/article_check"+"/"+items[i],{handleAs:"json"}).then(function(data)
			{	_f_recCheckDelete(deferred,items,i+1);
			},function(data)
			{	var d=data.response.data,status=data.response.status;
				msgAreaDelete_messages.put({group:"delete",level:"error",msgId:items[i]},{msg:Message[status]+"："+grid.row(items[i]).data().atname,targetNode:null});
				_f_recCheckDelete(deferred,items,i+1);
			});
		}
		else
		{	deferred.resolve(null);
		}
	};
});