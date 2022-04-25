function _applyDecoratedDescriptor(target,property,decorators,descriptor,context){var desc={};Object.keys(descriptor).forEach(function(key){desc[key]=descriptor[key]});desc.enumerable=!!desc.enumerable;desc.configurable=!!desc.configurable;if("value"in desc||desc.initializer){desc.writable=true}desc=decorators.slice().reverse().reduce(function(desc,decorator){return decorator?decorator(target,property,desc)||desc:desc},desc);var hasAccessor=Object.prototype.hasOwnProperty.call(desc,"get")||Object.prototype.hasOwnProperty.call(desc,"set");if(context&&desc.initializer!==void 0&&!hasAccessor){desc.value=desc.initializer?desc.initializer.call(context):void 0;desc.initializer=undefined}if(hasAccessor){delete desc.writable;delete desc.initializer;delete desc.value}if(desc.initializer===void 0){Object.defineProperty(target,property,desc);desc=null}return desc}import{Body,Controller,Get,Param,Post}from"@nestjs/common";import{JobService}from"./job.service.js";var _class,_dec,_dec1,_dec2,_dec3,_dec4,_dec5,_dec6,_dec7;var _dec8=typeof Reflect!=="undefined"&& typeof Reflect.metadata==="function"&&Reflect.metadata("design:paramtypes",[typeof JobService==="undefined"?Object:JobService]),_dec9=typeof Reflect!=="undefined"&& typeof Reflect.metadata==="function"&&Reflect.metadata("design:type",Function),_dec10=Controller("job");export let JobController=_class=_dec10(_class=_dec9(_class=_dec8(((_class=class JobController{getJobLog(id){return this.jobService.getJobLog(id)}startJob(data){return this.jobService.startJob(data.projectId,data.options)}constructor(jobService){this.jobService=jobService}})||_class,_dec=Get("/:id/log"),_dec1=function(target,key){return Param("id")(target,key,0)},_dec2=typeof Reflect!=="undefined"&& typeof Reflect.metadata==="function"&&Reflect.metadata("design:type",Function),_dec3=typeof Reflect!=="undefined"&& typeof Reflect.metadata==="function"&&Reflect.metadata("design:paramtypes",[Number]),_applyDecoratedDescriptor(_class.prototype,"getJobLog",[_dec,_dec1,_dec2,_dec3],Object.getOwnPropertyDescriptor(_class.prototype,"getJobLog"),_class.prototype),_dec4=Post("/start"),_dec5=function(target,key){return Body("data")(target,key,0)},_dec6=typeof Reflect!=="undefined"&& typeof Reflect.metadata==="function"&&Reflect.metadata("design:type",Function),_dec7=typeof Reflect!=="undefined"&& typeof Reflect.metadata==="function"&&Reflect.metadata("design:paramtypes",[Object]),_applyDecoratedDescriptor(_class.prototype,"startJob",[_dec4,_dec5,_dec6,_dec7],Object.getOwnPropertyDescriptor(_class.prototype,"startJob"),_class.prototype),_class))||_class)||_class)||_class