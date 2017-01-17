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
	grid_store=new JsonRest({target:"../language/api/sentence",idProperty:"asid",sortParam:"orderBy"});
	grid_structure=[
		{id:"asid",field:"asid",name:"文句編碼",width:"64px"},
		{id:"asatid",field:"asatid",name:"文章編碼",width:"64px"},
		{id:"assi",field:"assi",name:"子項號",width:"64px"},
		{id:"ascont",field:"ascont",name:"內容",width:"672px"},
		{id:"asst",field:"asst",name:"狀態",width:"48px"},
		{id:"asusid",field:"asusid",name:"擁有者",width:"224px"},
		{id:"asupdd",field:"asupdd",name:"更新日腳",width:"80px"},
		{id:"asupdt",field:"asupdt",name:"更新辰光",width:"64px"},
		{id:"ascs",field:"ascs",name:":類",width:"48px"}];
	grid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_article_sentenceGrid_store=new JsonRest({target:"../language/api/article",idProperty:"atid",sortParam:"orderBy"});
	rel_article_sentenceGrid_structure=[
		{id:"atid",field:"atid",name:"文章編碼",width:"64px"},
		{id:"atcgid",field:"atcgid",name:"分類編碼",width:"64px"},
		{id:"atsi",field:"atsi",name:"子項號",width:"64px"},
		{id:"atname",field:"atname",name:"文章名稱",width:"224px"},
		{id:"atusid",field:"atusid",name:"擁有者",width:"224px"},
		{id:"atupdd",field:"atupdd",name:"更新日腳",width:"80px"},
		{id:"atupdt",field:"atupdt",name:"更新辰光",width:"64px"},
		{id:"atbrf",field:"atbrf",name:":摘要",width:"544px"},
		{id:"atcgname",field:"atcgname",name:":分類名稱",width:"224px"},
		{id:"atusname",field:"atusname",name:":擁有者名",width:"224px"},
		{id:"atcsa",field:"atcsa",name:":A類",width:"48px"},
		{id:"atcsb",field:"atcsb",name:":B類",width:"48px"},
		{id:"atcsc",field:"atcsc",name:":C類",width:"48px"},
		{id:"atcsd",field:"atcsd",name:":D類",width:"48px"},
		{id:"atcse",field:"atcse",name:":E類",width:"48px"},
		{id:"atcsf",field:"atcsf",name:":F類",width:"48px"}];
	rel_article_sentenceGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	rel_user_sentenceGrid_store=new JsonRest({target:"../language/api/user",idProperty:"usid",sortParam:"orderBy"});
	rel_user_sentenceGrid_structure=[
		{id:"usid",field:"usid",name:"用戶名",width:"224px"},
		{id:"uspswd",field:"uspswd",name:"密碼",width:"224px"},
		{id:"usname",field:"usname",name:"昵稱",width:"224px"},
		{id:"usst",field:"usst",name:"狀態",width:"48px"},
		{id:"uslsid",field:"uslsid",name:"語言編碼",width:"128px"},
		{id:"uspn",field:"uspn",name:"單位能量",width:"48px"}];
	rel_user_sentenceGrid_filterSetupQuery=function(expr)
	{	return {"filter":expr==null?null:json.stringify(expr)};
	};
	this.f_prepareAdd=function()
	{	msgAreaAdd_messages.removeAll({group:"add"});
		msgAreaAdd.refresh();
		add_asatid.set("value","");
		add_assi.set("value","");
		add_ascont.set("value","");
		add_asst.set("value","0");
		if(!wa)
		{	add_asusid.set("value",parent.user);
			add_asusid.set("readonly","readonly");
			dom.byId("add_asusidAssist").style.display="none";
		}
		else
			add_asusid.set("value","");
		if(this.interval_add_asupdd!=null)
			clearInterval(interval_add_asupdd);
		this.interval_add_asupdd=setInterval(function(){add_asupdd.set("value",new Date());},1000);
		if(this.interval_add_asupdt!=null)
			clearInterval(interval_add_asupdt);
		this.interval_add_asupdt=setInterval(function(){add_asupdt.set("value",new Date());},1000);
		addDialog.show();
	};
	this.f_checkAdd=function()
	{	var deferred=new Deferred();
		xhr.post("../language/api/sentence_check",{data:domForm.toJson("addForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		obj.asupdt=obj.asupdt.substr(1);
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
		all([grid.store.get(id),xhr("../language/api/base/lock",{query:{obj:"sent",id:id},handleAs:"json"})]).then(function(data)
		{	update_asid.set("value",data[0].asid);
			update_asatid.set("value",data[0].asatid);
			update_assi.set("value",data[0].assi);
			update_ascont.set("value",data[0].ascont);
			update_asst.set("value",data[0].asst);
			update_asusid.set("value",data[0].asusid);
			if(!wa)
			{	update_asusid.set("readonly","readonly");
				dom.byId("update_asusidAssist").style.display="none";
			}
			update_asupdd.set("value",data[0].asupdd);
			if(this.interval_update_asupdd!=null)
				clearInterval(interval_update_asupdd);
			this.interval_update_asupdd=setInterval(function(){update_asupdd.set("value",new Date());},1000);
			update_asupdt.set("value","T"+data[0].asupdt);
			if(this.interval_update_asupdt!=null)
				clearInterval(interval_update_asupdt);
			this.interval_update_asupdt=setInterval(function(){update_asupdt.set("value",new Date());},1000);
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
		xhr("../language/api/base/unlock",{query:{obj:"sent",id:update_asid.get("value")},handleAs:"json"}).then(function(data)
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
		xhr.put("../language/api/sentence_check"+"/"+update_asid.get("value"),{data:domForm.toJson("updateForm"),handleAs:"json",headers:{'Content-Type': 'application/json'}}).then(function(data)
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
		obj.asupdt=obj.asupdt.substr(1);
		all([grid.store.put(obj),xhr("../language/api/base/unlock",{query:{obj:"sent",id:update_asid.get("value")},handleAs:"json"})]).then(function(data)
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
		rel_article_sentenceGrid.connect(rel_article_sentenceGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_article_sentenceDialog,rel_article_sentenceGrid,row);
		});
		rel_user_sentenceGrid.connect(rel_user_sentenceGrid.select.row,"onSelected",function(row)
		{	f_assistEnd(rel_user_sentenceDialog,rel_user_sentenceGrid,row);
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
			if((raarticle||riarticle)&&select==1)
				articleLink.setAttribute('disabled',false);
			else
				articleLink.setAttribute('disabled',true);
			if((rauser||riuser)&&select==1)
				userLink.setAttribute('disabled',false);
			else
				userLink.setAttribute('disabled',true);
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
		this.raarticle=this.riarticle=false;
		this.rauser=this.riuser=false;
		this.rasegment=this.risegment=false;
		this.rasegmentflow=this.risegmentflow=false;
		this.ratagging=this.ritagging=false;
		var dra=new Deferred(),dwa=new Deferred(),d=new Deferred(),d0=new Deferred();
		var dri=new Deferred(),dwi=new Deferred();
		var draarticle=new Deferred(),driarticle=new Deferred();
		var drauser=new Deferred(),driuser=new Deferred();
		var drasegment=new Deferred(),drisegment=new Deferred();
		var drasegmentflow=new Deferred(),drisegmentflow=new Deferred();
		var dratagging=new Deferred(),dritagging=new Deferred();
		var fra=function(){xhr("../language/api/base/security",{query:{auth:"sent_ra"},handleAs:"json"}).then(function(){this.ra=true;dra.resolve();},function(){dra.resolve();});return dra.promise;};
		var fwa=function(){xhr("../language/api/base/security",{query:{auth:"sent_wa"},handleAs:"json"}).then(function(){this.wa=true;dwa.resolve();},function(){dwa.resolve();});return dwa.promise;};
		var fri=function(){xhr("../language/api/base/security",{query:{auth:"sent_ri"},handleAs:"json"}).then(function(){this.ri=true;dri.resolve();},function(){dri.resolve();});return dri.promise;};
		var fwi=function(){xhr("../language/api/base/security",{query:{auth:"sent_wi"},handleAs:"json"}).then(function(){this.wi=true;dwi.resolve();},function(){dwi.resolve();});return dwi.promise;};
		var fraarticle=function(){xhr("../language/api/base/security",{query:{auth:"artc_ra"},handleAs:"json"}).then(function(){this.raarticle=true;draarticle.resolve();},function(){draarticle.resolve();});return draarticle.promise;};
		var friarticle=function(){xhr("../language/api/base/security",{query:{auth:"artc_ri"},handleAs:"json"}).then(function(){this.riarticle=true;driarticle.resolve();},function(){driarticle.resolve();});return driarticle.promise;};
		var frauser=function(){xhr("../language/api/base/security",{query:{auth:"user_ra"},handleAs:"json"}).then(function(){this.rauser=true;drauser.resolve();},function(){drauser.resolve();});return drauser.promise;};
		var friuser=function(){xhr("../language/api/base/security",{query:{auth:"user_ri"},handleAs:"json"}).then(function(){this.riuser=true;driuser.resolve();},function(){driuser.resolve();});return driuser.promise;};
		var frasegment=function(){xhr("../language/api/base/security",{query:{auth:"sgmt_ra"},handleAs:"json"}).then(function(){this.rasegment=true;drasegment.resolve();},function(){drasegment.resolve();});return drasegment.promise;};
		var frisegment=function(){xhr("../language/api/base/security",{query:{auth:"sgmt_ri"},handleAs:"json"}).then(function(){this.risegment=true;drisegment.resolve();},function(){drisegment.resolve();});return drisegment.promise;};
		var frasegmentflow=function(){xhr("../language/api/base/security",{query:{auth:"sgfl_ra"},handleAs:"json"}).then(function(){this.rasegmentflow=true;drasegmentflow.resolve();},function(){drasegmentflow.resolve();});return drasegmentflow.promise;};
		var frisegmentflow=function(){xhr("../language/api/base/security",{query:{auth:"sgfl_ri"},handleAs:"json"}).then(function(){this.risegmentflow=true;drisegmentflow.resolve();},function(){drisegmentflow.resolve();});return drisegmentflow.promise;};
		var fratagging=function(){xhr("../language/api/base/security",{query:{auth:"post_ra"},handleAs:"json"}).then(function(){this.ratagging=true;dratagging.resolve();},function(){dratagging.resolve();});return dratagging.promise;};
		var fritagging=function(){xhr("../language/api/base/security",{query:{auth:"post_ri"},handleAs:"json"}).then(function(){this.ritagging=true;dritagging.resolve();},function(){dritagging.resolve();});return dritagging.promise;};
		d0.promise.then(fraarticle).then(function(){if(!raarticle)return friarticle();}).then(frauser).then(function(){if(!rauser)return friuser();}).then(frasegment).then(function(){if(!rasegment)return frisegment();}).then(frasegmentflow).then(function(){if(!rasegmentflow)return frisegmentflow();}).then(fratagging).then(function(){if(!ratagging)return fritagging();}).then(fra).then(function(){if(!ra)return fri();}).then(fwa).then(function(){if(!wa)return fwi();}).then(function(){d.resolve();});
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
		{	xhr.del("../language/api/sentence_check"+"/"+items[i],{handleAs:"json"}).then(function(data)
			{	_f_recCheckDelete(deferred,items,i+1);
			},function(data)
			{	var d=data.response.data,status=data.response.status;
				msgAreaDelete_messages.put({group:"delete",level:"error",msgId:items[i]},{msg:Message[status]+"："+grid.row(items[i]).data().ascont,targetNode:null});
				_f_recCheckDelete(deferred,items,i+1);
			});
		}
		else
		{	deferred.resolve(null);
		}
	};
});