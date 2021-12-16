
#include <emscripten.h>

class KcpOutputCallbackImpl : public KcpOutputCallback {
public:
  int output(const void* buf, int len, Kcp* kcp, void* user)  {
    return EM_ASM_INT({
      var self = Module['getCache'](Module['KcpOutputCallbackImpl'])[$0];
      if (!self.hasOwnProperty('output')) throw 'a JSImplementation must implement all functions, you forgot KcpOutputCallbackImpl::output.';
      return self['output']($1,$2,$3,$4);
    }, (ptrdiff_t)this, buf, len, (ptrdiff_t)kcp, user);
  }
  void __destroy__()  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['KcpOutputCallbackImpl'])[$0];
      if (!self.hasOwnProperty('__destroy__')) throw 'a JSImplementation must implement all functions, you forgot KcpOutputCallbackImpl::__destroy__.';
      self['__destroy__']();
    }, (ptrdiff_t)this);
  }
};

class KcpLogCallbackImpl : public KcpLogCallback {
public:
  int writelog(const char* buf, Kcp* kcp, void* user)  {
    return EM_ASM_INT({
      var self = Module['getCache'](Module['KcpLogCallbackImpl'])[$0];
      if (!self.hasOwnProperty('writelog')) throw 'a JSImplementation must implement all functions, you forgot KcpLogCallbackImpl::writelog.';
      return self['writelog']($1,$2,$3);
    }, (ptrdiff_t)this, buf, (ptrdiff_t)kcp, user);
  }
  void __destroy__()  {
    EM_ASM_INT({
      var self = Module['getCache'](Module['KcpLogCallbackImpl'])[$0];
      if (!self.hasOwnProperty('__destroy__')) throw 'a JSImplementation must implement all functions, you forgot KcpLogCallbackImpl::__destroy__.';
      self['__destroy__']();
    }, (ptrdiff_t)this);
  }
};

extern "C" {

// Not using size_t for array indices as the values used by the javascript code are signed.

EM_JS(void, array_bounds_check_error, (size_t idx, size_t size), {
  throw 'Array index ' + idx + ' out of bounds: [0,' + size + ')';
});

void array_bounds_check(const int array_size, const int array_idx) {
  if (array_idx < 0 || array_idx >= array_size) {
    array_bounds_check_error(array_idx, array_size);
  }
}

// KcpOutputCallback

void EMSCRIPTEN_KEEPALIVE emscripten_bind_KcpOutputCallback___destroy___0(KcpOutputCallback* self) {
  delete self;
}

// KcpLogCallback

void EMSCRIPTEN_KEEPALIVE emscripten_bind_KcpLogCallback___destroy___0(KcpLogCallback* self) {
  delete self;
}

// VoidPtr

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VoidPtr___destroy___0(void** self) {
  delete self;
}

// KcpOutputCallbackImpl

KcpOutputCallbackImpl* EMSCRIPTEN_KEEPALIVE emscripten_bind_KcpOutputCallbackImpl_KcpOutputCallbackImpl_0() {
  return new KcpOutputCallbackImpl();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_KcpOutputCallbackImpl_output_4(KcpOutputCallbackImpl* self, const void* buf, int len, Kcp* kcp, void* user) {
  return self->output(buf, len, kcp, user);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_KcpOutputCallbackImpl___destroy___0(KcpOutputCallbackImpl* self) {
  delete self;
}

// KcpLogCallbackImpl

KcpLogCallbackImpl* EMSCRIPTEN_KEEPALIVE emscripten_bind_KcpLogCallbackImpl_KcpLogCallbackImpl_0() {
  return new KcpLogCallbackImpl();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_KcpLogCallbackImpl_writelog_3(KcpLogCallbackImpl* self, const char* buf, Kcp* kcp, void* user) {
  return self->writelog(buf, kcp, user);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_KcpLogCallbackImpl___destroy___0(KcpLogCallbackImpl* self) {
  delete self;
}

// Kcp

Kcp* EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_Kcp_2(unsigned int conv, void* user) {
  return new Kcp(conv, user);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_setStream_1(Kcp* self, int stream) {
  self->setStream(stream);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_getStream_0(Kcp* self) {
  return self->getStream();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_setOutput_1(Kcp* self, KcpOutputCallback* output) {
  self->setOutput(output);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_setWritelog_1(Kcp* self, KcpLogCallback* writelog) {
  self->setWritelog(writelog);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_recv_2(Kcp* self, void* buffer, int len) {
  return self->recv(buffer, len);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_send_2(Kcp* self, const void* buffer, int len) {
  return self->send(buffer, len);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_update_1(Kcp* self, unsigned int current) {
  self->update(current);
}

unsigned int EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_check_1(Kcp* self, unsigned int current) {
  return self->check(current);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_input_2(Kcp* self, const void* data, int size) {
  return self->input(data, size);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_flush_0(Kcp* self) {
  self->flush();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_peeksize_0(Kcp* self) {
  return self->peeksize();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_setmtu_1(Kcp* self, int mtu) {
  return self->setmtu(mtu);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_wndsize_2(Kcp* self, int sndwnd, int rcvwnd) {
  return self->wndsize(sndwnd, rcvwnd);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_waitsnd_0(Kcp* self) {
  return self->waitsnd();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp_nodelay_4(Kcp* self, int nodelay, int interval, int resend, int nc) {
  return self->nodelay(nodelay, interval, resend, nc);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Kcp___destroy___0(Kcp* self) {
  delete self;
}

}

