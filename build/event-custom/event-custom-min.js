YUI.add("event-custom",function(E){(function(){E.Env.eventAdaptors={};})();(function(){var F=0,G=1;E.Do={objs:{},before:function(I,K,L,M){var J=I,H;if(M){H=[I,M].concat(E.Array(arguments,4,true));J=E.rbind.apply(E,H);}return this._inject(F,J,K,L);},after:function(I,K,L,M){var J=I,H;if(M){H=[I,M].concat(E.Array(arguments,4,true));J=E.rbind.apply(E,H);}return this._inject(G,J,K,L);},_inject:function(H,J,K,M){var N=E.stamp(K),L,I;if(!this.objs[N]){this.objs[N]={};}L=this.objs[N];if(!L[M]){L[M]=new E.Do.Method(K,M);K[M]=function(){return L[M].exec.apply(L[M],arguments);};}I=N+E.stamp(J)+M;L[M].register(I,J,H);return new E.EventHandle(L[M],I);},detach:function(H){if(H.detach){H.detach();}},_unload:function(I,H){}};E.Do.Method=function(H,I){this.obj=H;this.methodName=I;this.method=H[I];this.before={};this.after={};};E.Do.Method.prototype.register=function(I,J,H){if(H){this.after[I]=J;}else{this.before[I]=J;}};E.Do.Method.prototype._delete=function(H){delete this.before[H];delete this.after[H];};E.Do.Method.prototype.exec=function(){var J=E.Array(arguments,0,true),K,I,N,L=this.before,H=this.after,M=false;for(K in L){if(L.hasOwnProperty(K)){I=L[K].apply(this.obj,J);if(I){switch(I.constructor){case E.Do.Halt:return I.retVal;case E.Do.AlterArgs:J=I.newArgs;break;case E.Do.Prevent:M=true;break;default:}}}}if(!M){I=this.method.apply(this.obj,J);}for(K in H){if(H.hasOwnProperty(K)){N=H[K].apply(this.obj,J);if(N&&N.constructor==E.Do.Halt){return N.retVal;}else{if(N&&N.constructor==E.Do.AlterReturn){I=N.newRetVal;}}}}return I;};E.Do.AlterArgs=function(I,H){this.msg=I;this.newArgs=H;};E.Do.AlterReturn=function(I,H){this.msg=I;this.newRetVal=H;};E.Do.Halt=function(I,H){this.msg=I;this.retVal=H;};E.Do.Prevent=function(H){this.msg=H;};E.Do.Error=E.Do.Halt;})();var B="_event:onsub",D="after",A=["broadcast","bubbles","context","configured","currentTarget","defaultFn","details","emitFacade","fireOnce","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],C=9;E.EventHandle=function(F,G){this.evt=F;this.sub=G;};E.EventHandle.prototype={detach:function(){if(this.evt){this.evt._delete(this.sub);}}};E.CustomEvent=function(F,G){G=G||{};this.id=E.stamp(this);this.type=F;this.context=E;this.logSystem=(F=="yui:log");this.broadcast=0;this.silent=this.logSystem;this.queuable=false;this.subscribers={};this.afters={};this.fired=false;this.fireOnce=false;this.stopped=0;this.prevented=0;this.host=null;this.defaultFn=null;this.stoppedFn=null;this.preventedFn=null;this.preventable=true;this.bubbles=true;this.signature=C;this.emitFacade=false;this.applyConfig(G,true);this.log("Creating "+this.type);if(F!==B){this.subscribeEvent=new E.CustomEvent(B,{context:this,silent:true});}};E.CustomEvent.prototype={_YUI_EVENT:true,applyConfig:function(G,F){if(G){E.mix(this,G,F,A);}},_subscribe:function(J,H,G,F){if(!J){E.error("Invalid callback for CE: "+this.type);}var K=this.subscribeEvent,I;if(K){K.fire.apply(K,G);}I=new E.Subscriber(J,H,G,F);if(this.fireOnce&&this.fired){E.later(0,this,this._notify,I);}if(F==D){this.afters[I.id]=I;}else{this.subscribers[I.id]=I;}return new E.EventHandle(this,I);},subscribe:function(G,F){return this._subscribe(G,F,arguments,true);},on:function(G,F){return this._subscribe(G,F,arguments,true);},after:function(G,F){return this._subscribe(G,F,arguments,D);},detach:function(J,H){if(J&&J.detach){return J.detach();}if(!J){return this.unsubscribeAll();}var K=false,G=this.subscribers,F,I;for(F in G){if(G.hasOwnProperty(F)){I=G[F];if(I&&I.contains(J,H)){this._delete(I);K=true;}}}return K;},unsubscribe:function(){return this.detach.apply(this,arguments);},_getFacade:function(G){var F=this._facade,H;if(!F){F=new E.EventFacade(this,this.currentTarget);}H=G&&G[0];if(E.Lang.isObject(H,true)&&!H._yuifacade){E.mix(F,H,true);}F.details=this.details;F.target=this.target;F.currentTarget=this.currentTarget;F.stopped=0;F.prevented=0;this._facade=F;return this._facade;},_notify:function(J,H,F){this.log(this.type+"->"+": "+J);var G,I;if(this.emitFacade){if(!F){F=this._getFacade(H);H[0]=F;}}I=(H&&E.Lang.isObject(H[0])&&H[0].currentTarget);G=J.notify(I||this.context,H,this);if(false===G||this.stopped>1){this.log(this.type+" cancelled by subscriber");return false;}return true;},log:function(G,F){if(!this.silent){}},fire:function(){var O=E.Env._eventstack,H,P,N,I,J,F,K,G,L,M=true;if(O){if(this.queuable&&this.type!=O.next.type){this.log("queue "+this.type);O.queue.push([this,arguments]);return true;}}else{E.Env._eventstack={id:this.id,next:this,silent:this.silent,logging:(this.type==="yui:log"),stopped:0,prevented:0,queue:[]};O=E.Env._eventstack;}if(this.fireOnce&&this.fired){this.log("fireOnce event: "+this.type+" already fired");}else{H=E.merge(this.subscribers);N=E.Array(arguments,0,true);this.stopped=0;this.prevented=0;this.target=this.target||this.host;this.currentTarget=this.host||this.currentTarget;this.fired=true;this.details=N.slice();this.log("Firing "+this.type);L=false;O.lastLogState=O.logging;J=null;if(this.emitFacade){this._facade=null;J=this._getFacade(N);N[0]=J;}for(I in H){if(H.hasOwnProperty(I)){if(!L){O.logging=(O.logging||(this.type==="yui:log"));L=true;}if(this.stopped==2){break;}P=H[I];if(P&&P.fn){M=this._notify(P,N,J);if(false===M){this.stopped=2;}}}}O.logging=(O.lastLogState);if(this.bubbles&&this.host&&!this.stopped){O.stopped=0;O.prevented=0;M=this.host.bubble(this);this.stopped=Math.max(this.stopped,O.stopped);this.prevented=Math.max(this.prevented,O.prevented);}if(this.defaultFn&&!this.prevented){this.defaultFn.apply(this.host||this,N);}if(!this.prevented&&this.stopped<2){H=E.merge(this.afters);for(I in H){if(H.hasOwnProperty(I)){if(!L){O.logging=(O.logging||(this.type==="yui:log"));L=true;}if(this.stopped==2){break;}P=H[I];if(P&&P.fn){M=this._notify(P,N,J);if(false===M){this.stopped=2;}}}}}}if(O.id===this.id){K=O.queue;while(K.length){F=K.pop();G=F[0];O.stopped=0;O.prevented=0;O.next=G;M=G.fire.apply(G,F[1]);}E.Env._eventstack=null;}return(M!==false);},unsubscribeAll:function(){var H=this.subscribers,G,F=0;
for(G in H){if(H.hasOwnProperty(G)){this._delete(H[G]);F++;}}this.subscribers={};return F;},_delete:function(F){if(F){delete F.fn;delete F.context;delete this.subscribers[F.id];delete this.afters[F.id];}},toString:function(){return this.type;},stopPropagation:function(){this.stopped=1;E.Env._eventstack.stopped=1;if(this.stoppedFn){this.stoppedFn.call(this.host||this,this);}},stopImmediatePropagation:function(){this.stopped=2;E.Env._eventstack.stopped=2;if(this.stoppedFn){this.stoppedFn.call(this.host||this,this);}},preventDefault:function(){if(this.preventable){this.prevented=1;E.Env._eventstack.prevented=1;}if(this.preventedFn){this.preventedFn.call(this.host||this,this);}}};E.Subscriber=function(H,G,F){this.fn=H;this.context=G;this.id=E.stamp(this);this.wrappedFn=H;if(G){this.wrappedFn=E.rbind.apply(E,F);}};E.Subscriber.prototype={notify:function(F,H,K){var L=this.context||F,G=true,I=function(){switch(K.signature){case 0:G=this.fn.call(L,K.type,H,this.context);break;case 1:G=this.fn.call(L,H[0]||null,this.context);break;default:G=this.wrappedFn.apply(L,H||[]);}};if(E.config.throwFail){I.call(this);}else{try{I.call(this);}catch(J){E.error(this+" failed: "+J.message,J);}}return G;},contains:function(G,F){if(F){return((this.fn==G)&&this.context==F);}else{return(this.fn==G);}},toString:function(){return"Subscriber "+this.id;}};(function(){var G=E.Lang,J=E.after,F=":",I=function(K){var L=(G.isObject(K))?K:{};this._yuievt={events:{},targets:{},config:L,defaults:{context:this,host:this,emitFacade:L.emitFacade||false,bubbles:("bubbles" in L)?L.bubbles:true}};},H=function(K,M){if(!G.isString(M)){return M;}var L=M,N=K._yuievt.config.prefix;if(L.indexOf(F)==-1&&N){L=N+F+L;}return L;};I.prototype={on:function(O,N,M){O=H(this,O);var P,R,L,K,Q;if(G.isObject(O)){P=N;R=M;L=E.Array(arguments,0,true);K={};E.each(O,function(T,S){if(T){P=T.fn||P;R=T.context||R;}L[0]=S;L[1]=P;L[2]=R;K[S]=this.on.apply(this,L);},this);return K;}Q=this._yuievt.events[O]||this.publish(O);L=E.Array(arguments,1,true);return Q.on.apply(Q,L);},subscribe:function(){return this.on.apply(this,arguments);},detach:function(P,O,N){P=H(this,P);if(G.isObject(P)&&P.detach){return P.detach();}var K=this._yuievt.events,Q,M,L=true;if(P){Q=K[P];if(Q){return Q.detach(O,N);}}else{for(M in K){if(K.hasOwnProperty(M)){L=L&&K[M].detach(O,N);}}return L;}return false;},unsubscribe:function(){return this.detach.apply(this,arguments);},detachAll:function(K){K=H(this,K);return this.unsubscribe(K);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},publish:function(M,N){M=H(this,M);var L,O,K,P;if(G.isObject(M)){K={};E.each(M,function(R,Q){K[Q]=this.publish(Q,R||N);},this);return K;}L=this._yuievt.events;O=L[M];if(O){O.applyConfig(N,true);}else{P=N||{};E.mix(P,this._yuievt.defaults);O=new E.CustomEvent(M,P);L[M]=O;if(P.onSubscribeCallback){O.subscribeEvent.subscribe(P.onSubscribeCallback);}}return L[M];},addTarget:function(K){this._yuievt.targets[E.stamp(K)]=K;this._yuievt.hasTargets=true;},removeTarget:function(K){delete this._yuievt.targets[E.stamp(K)];},fire:function(N){var P=G.isString(N),M=(P)?N:(N&&N.type),O,K,L;M=H(this,M);O=this.getEvent(M);if(!O){if(this._yuievt.hasTargets){O=this.publish(M);O.details=E.Array(arguments,(P)?1:0,true);return this.bubble(O);}return true;}K=E.Array(arguments,(P)?1:0,true);L=O.fire.apply(O,K);O.target=null;return L;},getEvent:function(K){K=H(this,K);var L=this._yuievt.events;return(L&&K in L)?L[K]:null;},bubble:function(L){var Q=this._yuievt.targets,M=true,O,P,R,K,N;if(!L.stopped&&Q){for(N in Q){if(Q.hasOwnProperty(N)){O=Q[N];P=L.type;R=O.getEvent(P);K=L.target||this;if(!R){R=O.publish(P,L);R.context=(L.host===L.context)?O:L.context;R.host=O;R.defaultFn=null;R.preventedFn=null;R.stoppedFn=null;}R.target=K;R.currentTarget=O;M=M&&R.fire.apply(R,L.details);if(R.stopped){break;}}}}return M;},after:function(M,L){if(G.isFunction(M)){return E.Do.after.apply(E.Do,arguments);}else{var N=this._yuievt.events[M]||this.publish(M),K=E.Array(arguments,1,true);return N.after.apply(N,K);}}};E.EventTarget=I;E.mix(E,I.prototype,false,false,{bubbles:false});I.call(E);E._on=E.on;E._detach=E.detach;E.on=function(M,N,O){if(G.isFunction(M)){return E.Do.before.apply(E.Do,arguments);}var L=E.Env.eventAdaptors[M],K;if(O&&O._yuievt&&O.subscribe){K=E.Array(arguments,0,true);K.splice(2,1);return O.on.apply(O,K);}else{if(L&&L.on){return L.on.apply(E,arguments);}else{if(L||M.indexOf(":")>-1){return E._on.apply(E,arguments);}else{return E.Event.attach.apply(E.Event,arguments);}}}};E.detach=function(M,N,O){var L=E.Env.eventAdaptors[M],K;if(O&&O._yuievt&&O.unsubscribe){K=E.Array(arguments,0,true);K.splice(2,1);return O.unsubscribe.apply(O,K);}else{if(G.isObject(M)&&M.detach){return M.detach();}else{if(L&&L.detach){return L.detach.apply(E,arguments);}else{if(L||M.indexOf(":")>-1){return E._detach.apply(E,arguments);}else{return E.Event.detach.apply(E.Event,arguments);}}}}};E.before=function(){return E.on.apply(E,arguments);};E.after=function(K,L,M){if(G.isFunction(K)){return E.Do.after.apply(E.Do,arguments);}else{return J.apply(E,arguments);}};})();(function(){var H={"altKey":1,"cancelBubble":1,"ctrlKey":1,"clientX":1,"clientY":1,"detail":1,"keyCode":1,"metaKey":1,"shiftKey":1,"type":1,"x":1,"y":1},G=E.UA,F={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9},I=function(K){if(!K){return null;}try{if(G.webkit&&3==K.nodeType){K=K.parentNode;}}catch(J){}return E.Node.get(K);};E.EventFacade=function(T,L,K,J){var P=T,N=L,Q=E.config.doc,U=Q.body,V=P.pageX,S=P.pageY,M=(T._YUI_EVENT),O,R,W;for(O in H){if(H.hasOwnProperty(O)){this[O]=P[O];}}if(!V&&0!==V){V=P.clientX||0;S=P.clientY||0;if(G.ie){V+=Math.max(Q.documentElement.scrollLeft,U.scrollLeft);S+=Math.max(Q.documentElement.scrollTop,U.scrollTop);}}this._yuifacade=true;this.pageX=V;this.pageY=S;R=P.keyCode||P.charCode||0;if(G.webkit&&(R in F)){R=F[R];}this.keyCode=R;this.charCode=R;this.button=P.which||P.button;this.which=this.button;this.details=J;this.time=P.time||new Date().getTime();
this.target=(M)?P.target:I(P.target||P.srcElement);this.currentTarget=(M)?N:I(N);W=P.relatedTarget;if(!W){if(P.type=="mouseout"){W=P.toElement;}else{if(P.type=="mouseover"){W=P.fromElement;}}}this.relatedTarget=(M)?W:I(W);this.stopPropagation=function(){if(P.stopPropagation){P.stopPropagation();}else{P.cancelBubble=true;}if(K){K.stopPropagation();}};this.stopImmediatePropagation=function(){if(P.stopImmediatePropagation){P.stopImmediatePropagation();}else{this.stopPropagation();}if(K){K.stopImmediatePropagation();}};this.preventDefault=function(){if(P.preventDefault){P.preventDefault();}else{P.returnValue=false;}if(K){K.preventDefault();}};this.halt=function(X){if(X){this.stopImmediatePropagation();}else{this.stopPropagation();}this.preventDefault();};};})();},"@VERSION@");