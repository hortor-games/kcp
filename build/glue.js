
// Bindings utilities

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare: function() {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc: function(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = (len + 7) & -8; // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy: function(array, view, offset) {
    offset >>>= 0;
    var bytes = view.BYTES_PER_ELEMENT;
    switch (bytes) {
      case 2: offset >>>= 1; break;
      case 4: offset >>>= 2; break;
      case 8: offset >>>= 3; break;
    }
    for (var i = 0; i < array.length; i++) {
      view[offset + i] = array[i];
    }
  },
};

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}


// KcpOutputCallback
/** @suppress {undefinedVars, duplicate} @this{Object} */function KcpOutputCallback() { throw "cannot construct a KcpOutputCallback, no constructor in IDL" }
KcpOutputCallback.prototype = Object.create(WrapperObject.prototype);
KcpOutputCallback.prototype.constructor = KcpOutputCallback;
KcpOutputCallback.prototype.__class__ = KcpOutputCallback;
KcpOutputCallback.__cache__ = {};
Module['KcpOutputCallback'] = KcpOutputCallback;

  KcpOutputCallback.prototype['__destroy__'] = KcpOutputCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_KcpOutputCallback___destroy___0(self);
};
// KcpLogCallback
/** @suppress {undefinedVars, duplicate} @this{Object} */function KcpLogCallback() { throw "cannot construct a KcpLogCallback, no constructor in IDL" }
KcpLogCallback.prototype = Object.create(WrapperObject.prototype);
KcpLogCallback.prototype.constructor = KcpLogCallback;
KcpLogCallback.prototype.__class__ = KcpLogCallback;
KcpLogCallback.__cache__ = {};
Module['KcpLogCallback'] = KcpLogCallback;

  KcpLogCallback.prototype['__destroy__'] = KcpLogCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_KcpLogCallback___destroy___0(self);
};
// VoidPtr
/** @suppress {undefinedVars, duplicate} @this{Object} */function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

  VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};
// KcpOutputCallbackImpl
/** @suppress {undefinedVars, duplicate} @this{Object} */function KcpOutputCallbackImpl() {
  this.ptr = _emscripten_bind_KcpOutputCallbackImpl_KcpOutputCallbackImpl_0();
  getCache(KcpOutputCallbackImpl)[this.ptr] = this;
};;
KcpOutputCallbackImpl.prototype = Object.create(KcpOutputCallback.prototype);
KcpOutputCallbackImpl.prototype.constructor = KcpOutputCallbackImpl;
KcpOutputCallbackImpl.prototype.__class__ = KcpOutputCallbackImpl;
KcpOutputCallbackImpl.__cache__ = {};
Module['KcpOutputCallbackImpl'] = KcpOutputCallbackImpl;

KcpOutputCallbackImpl.prototype['output'] = KcpOutputCallbackImpl.prototype.output = /** @suppress {undefinedVars, duplicate} @this{Object} */function(buf, len, kcp, user) {
  var self = this.ptr;
  if (buf && typeof buf === 'object') buf = buf.ptr;
  if (len && typeof len === 'object') len = len.ptr;
  if (kcp && typeof kcp === 'object') kcp = kcp.ptr;
  if (user && typeof user === 'object') user = user.ptr;
  return _emscripten_bind_KcpOutputCallbackImpl_output_4(self, buf, len, kcp, user);
};;

  KcpOutputCallbackImpl.prototype['__destroy__'] = KcpOutputCallbackImpl.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_KcpOutputCallbackImpl___destroy___0(self);
};
// KcpLogCallbackImpl
/** @suppress {undefinedVars, duplicate} @this{Object} */function KcpLogCallbackImpl() {
  this.ptr = _emscripten_bind_KcpLogCallbackImpl_KcpLogCallbackImpl_0();
  getCache(KcpLogCallbackImpl)[this.ptr] = this;
};;
KcpLogCallbackImpl.prototype = Object.create(KcpLogCallback.prototype);
KcpLogCallbackImpl.prototype.constructor = KcpLogCallbackImpl;
KcpLogCallbackImpl.prototype.__class__ = KcpLogCallbackImpl;
KcpLogCallbackImpl.__cache__ = {};
Module['KcpLogCallbackImpl'] = KcpLogCallbackImpl;

KcpLogCallbackImpl.prototype['writelog'] = KcpLogCallbackImpl.prototype.writelog = /** @suppress {undefinedVars, duplicate} @this{Object} */function(buf, kcp, user) {
  var self = this.ptr;
  ensureCache.prepare();
  if (buf && typeof buf === 'object') buf = buf.ptr;
  else buf = ensureString(buf);
  if (kcp && typeof kcp === 'object') kcp = kcp.ptr;
  if (user && typeof user === 'object') user = user.ptr;
  return _emscripten_bind_KcpLogCallbackImpl_writelog_3(self, buf, kcp, user);
};;

  KcpLogCallbackImpl.prototype['__destroy__'] = KcpLogCallbackImpl.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_KcpLogCallbackImpl___destroy___0(self);
};
// Kcp
/** @suppress {undefinedVars, duplicate} @this{Object} */function Kcp(conv, user) {
  if (conv && typeof conv === 'object') conv = conv.ptr;
  if (user && typeof user === 'object') user = user.ptr;
  this.ptr = _emscripten_bind_Kcp_Kcp_2(conv, user);
  getCache(Kcp)[this.ptr] = this;
};;
Kcp.prototype = Object.create(WrapperObject.prototype);
Kcp.prototype.constructor = Kcp;
Kcp.prototype.__class__ = Kcp;
Kcp.__cache__ = {};
Module['Kcp'] = Kcp;

Kcp.prototype['setStream'] = Kcp.prototype.setStream = /** @suppress {undefinedVars, duplicate} @this{Object} */function(stream) {
  var self = this.ptr;
  if (stream && typeof stream === 'object') stream = stream.ptr;
  _emscripten_bind_Kcp_setStream_1(self, stream);
};;

Kcp.prototype['getStream'] = Kcp.prototype.getStream = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Kcp_getStream_0(self);
};;

Kcp.prototype['setOutput'] = Kcp.prototype.setOutput = /** @suppress {undefinedVars, duplicate} @this{Object} */function(output) {
  var self = this.ptr;
  if (output && typeof output === 'object') output = output.ptr;
  _emscripten_bind_Kcp_setOutput_1(self, output);
};;

Kcp.prototype['setWritelog'] = Kcp.prototype.setWritelog = /** @suppress {undefinedVars, duplicate} @this{Object} */function(writelog) {
  var self = this.ptr;
  if (writelog && typeof writelog === 'object') writelog = writelog.ptr;
  _emscripten_bind_Kcp_setWritelog_1(self, writelog);
};;

Kcp.prototype['recv'] = Kcp.prototype.recv = /** @suppress {undefinedVars, duplicate} @this{Object} */function(buffer, len) {
  var self = this.ptr;
  if (buffer && typeof buffer === 'object') buffer = buffer.ptr;
  if (len && typeof len === 'object') len = len.ptr;
  return _emscripten_bind_Kcp_recv_2(self, buffer, len);
};;

Kcp.prototype['send'] = Kcp.prototype.send = /** @suppress {undefinedVars, duplicate} @this{Object} */function(buffer, len) {
  var self = this.ptr;
  if (buffer && typeof buffer === 'object') buffer = buffer.ptr;
  if (len && typeof len === 'object') len = len.ptr;
  return _emscripten_bind_Kcp_send_2(self, buffer, len);
};;

Kcp.prototype['update'] = Kcp.prototype.update = /** @suppress {undefinedVars, duplicate} @this{Object} */function(current) {
  var self = this.ptr;
  if (current && typeof current === 'object') current = current.ptr;
  _emscripten_bind_Kcp_update_1(self, current);
};;

Kcp.prototype['check'] = Kcp.prototype.check = /** @suppress {undefinedVars, duplicate} @this{Object} */function(current) {
  var self = this.ptr;
  if (current && typeof current === 'object') current = current.ptr;
  return _emscripten_bind_Kcp_check_1(self, current);
};;

Kcp.prototype['input'] = Kcp.prototype.input = /** @suppress {undefinedVars, duplicate} @this{Object} */function(data, size) {
  var self = this.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  return _emscripten_bind_Kcp_input_2(self, data, size);
};;

Kcp.prototype['flush'] = Kcp.prototype.flush = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Kcp_flush_0(self);
};;

Kcp.prototype['peeksize'] = Kcp.prototype.peeksize = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Kcp_peeksize_0(self);
};;

Kcp.prototype['setmtu'] = Kcp.prototype.setmtu = /** @suppress {undefinedVars, duplicate} @this{Object} */function(mtu) {
  var self = this.ptr;
  if (mtu && typeof mtu === 'object') mtu = mtu.ptr;
  return _emscripten_bind_Kcp_setmtu_1(self, mtu);
};;

Kcp.prototype['wndsize'] = Kcp.prototype.wndsize = /** @suppress {undefinedVars, duplicate} @this{Object} */function(sndwnd, rcvwnd) {
  var self = this.ptr;
  if (sndwnd && typeof sndwnd === 'object') sndwnd = sndwnd.ptr;
  if (rcvwnd && typeof rcvwnd === 'object') rcvwnd = rcvwnd.ptr;
  return _emscripten_bind_Kcp_wndsize_2(self, sndwnd, rcvwnd);
};;

Kcp.prototype['waitsnd'] = Kcp.prototype.waitsnd = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Kcp_waitsnd_0(self);
};;

Kcp.prototype['nodelay'] = Kcp.prototype.nodelay = /** @suppress {undefinedVars, duplicate} @this{Object} */function(nodelay, interval, resend, nc) {
  var self = this.ptr;
  if (nodelay && typeof nodelay === 'object') nodelay = nodelay.ptr;
  if (interval && typeof interval === 'object') interval = interval.ptr;
  if (resend && typeof resend === 'object') resend = resend.ptr;
  if (nc && typeof nc === 'object') nc = nc.ptr;
  return _emscripten_bind_Kcp_nodelay_4(self, nodelay, interval, resend, nc);
};;

  Kcp.prototype['__destroy__'] = Kcp.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Kcp___destroy___0(self);
};